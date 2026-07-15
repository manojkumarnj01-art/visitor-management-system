package com.barani.vms.controller;

import com.barani.vms.model.Visitor;
import com.barani.vms.model.ApprovalToken;
import com.barani.vms.repository.VisitorRepository;
import com.barani.vms.repository.ApprovalTokenRepository;
import com.barani.vms.repository.EmployeeRepository;
import com.barani.vms.service.NotificationService;
import com.barani.vms.service.StorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Date;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import org.springframework.beans.factory.annotation.Value;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@RestController
@RequestMapping("/api/visitors")
public class VisitorController {

    private final VisitorRepository visitorRepository;
    private final NotificationService notificationService;
    private final StorageService storageService;
    private final ApprovalTokenRepository approvalTokenRepository;
    private final EmployeeRepository employeeRepository;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${vms.public-base-url}")
    private String publicBaseUrl;

    public VisitorController(VisitorRepository visitorRepository, 
                             NotificationService notificationService,
                             StorageService storageService,
                             ApprovalTokenRepository approvalTokenRepository,
                             EmployeeRepository employeeRepository) {
        this.visitorRepository = visitorRepository;
        this.notificationService = notificationService;
        this.storageService = storageService;
        this.approvalTokenRepository = approvalTokenRepository;
        this.employeeRepository = employeeRepository;
    }

    @GetMapping
    public List<Visitor> getAllVisitors() {
        return visitorRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Visitor> getVisitorById(@PathVariable String id) {
        return visitorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Visitor> registerVisitor(@RequestBody Visitor visitor, HttpServletRequest request) {
        // Generate new visitor ID if not provided
        if (visitor.getId() == null || visitor.getId().isEmpty()) {
            visitor.setId("V" + System.currentTimeMillis() / 1000);
        }
        
        visitor.setStatus("Pending");
        visitor.setVisitDate(visitor.getVisitDate() != null ? visitor.getVisitDate() : LocalDateTime.now().toLocalDate().toString());
        
        // Auto-upload base64 photo to GCS if present
        if (visitor.getPhoto() != null && visitor.getPhoto().contains(",")) {
            try {
                String base64Data = visitor.getPhoto().split(",")[1];
                byte[] decodedBytes = java.util.Base64.getDecoder().decode(base64Data);
                String contentType = visitor.getPhoto().split(";")[0].split(":")[1];
                String ext = contentType.split("/")[1];
                String year = String.valueOf(LocalDateTime.now().getYear());
                String month = String.format("%02d", LocalDateTime.now().getMonthValue());
                String url = storageService.uploadBytes(decodedBytes, contentType, ext, year, month, "photo", visitor.getId());
                visitor.setPhoto(url);
            } catch (Exception e) {
                System.err.println("[VMS Photo Upload] Failed to upload photo: " + e.getMessage());
            }
        }
        
        // Auto-upload base64 photoIdDoc if present
        if (visitor.getPhotoIdDoc() != null && visitor.getPhotoIdDoc().contains(",")) {
            try {
                String base64Data = visitor.getPhotoIdDoc().split(",")[1];
                byte[] decodedBytes = java.util.Base64.getDecoder().decode(base64Data);
                String contentType = visitor.getPhotoIdDoc().split(";")[0].split(":")[1];
                String ext = contentType.split("/")[1];
                String year = String.valueOf(LocalDateTime.now().getYear());
                String month = String.format("%02d", LocalDateTime.now().getMonthValue());
                String url = storageService.uploadBytes(decodedBytes, contentType, ext, year, month, "iddoc", visitor.getId());
                visitor.setPhotoIdDoc(url);
            } catch (Exception e) {
                System.err.println("[VMS ID Doc Upload] Failed to upload doc: " + e.getMessage());
            }
        }

        Visitor saved = visitorRepository.save(savedVisitorDetails(visitor));

        // Generate secure random UUID approval & rejection tokens
        String approveToken = java.util.UUID.randomUUID().toString();
        String rejectToken = java.util.UUID.randomUUID().toString();

        LocalDateTime expiry = LocalDateTime.now().plusHours(24);
        
        // Save tokens in database for secure verification
        ApprovalToken appTokenEntity = new ApprovalToken(approveToken, visitor.getId(), "approve", expiry);
        ApprovalToken rejTokenEntity = new ApprovalToken(rejectToken, visitor.getId(), "reject", expiry);
        approvalTokenRepository.save(appTokenEntity);
        approvalTokenRepository.save(rejTokenEntity);

        // Bind tokens to Visitor record for reference
        visitor.setApproveToken(approveToken);
        visitor.setRejectToken(rejectToken);
        Visitor saved = visitorRepository.save(savedVisitorDetails(visitor));

        String approveLink = publicBaseUrl + "/api/visitors/approve?token=" + approveToken;
        String rejectLink = publicBaseUrl + "/api/visitors/reject?token=" + rejectToken;

        // Lookup host email address dynamically from employee directory
        String hostEmail = null;
        if (visitor.getHostId() != null && !visitor.getHostId().isEmpty()) {
            hostEmail = employeeRepository.findById(visitor.getHostId())
                    .map(com.barani.vms.model.Employee::getEmail)
                    .orElse(null);
        }
        if (hostEmail == null || hostEmail.isEmpty()) {
            hostEmail = (visitor.getHostName() != null ? visitor.getHostName().toLowerCase().replaceAll("\\s+", "") : "host") + "@barani.in";
        }

        // Construct HTML formatted email with clear styled action buttons
        String emailBody = "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <title>Visitor Entry Clearance Request</title>\n" +
                "    <style>\n" +
                "        .button {\n" +
                "            display: inline-block;\n" +
                "            padding: 10px 20px;\n" +
                "            font-family: Arial, sans-serif;\n" +
                "            font-size: 14px;\n" +
                "            font-weight: bold;\n" +
                "            text-align: center;\n" +
                "            text-decoration: none;\n" +
                "            border-radius: 5px;\n" +
                "            margin-right: 10px;\n" +
                "            color: #ffffff !important;\n" +
                "        }\n" +
                "        .approve { background-color: #10b981; }\n" +
                "        .reject { background-color: #ef4444; }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;\">\n" +
                "        <h2 style=\"color: #1e3a8a;\">Visitor Entry Clearance Request</h2>\n" +
                "        <p>Hello <strong>" + visitor.getHostName() + "</strong>,</p>\n" +
                "        <p>Visitor <strong>" + visitor.getName() + "</strong> from <strong>" + (visitor.getCompany() != null ? visitor.getCompany() : "Independent") + "</strong> is waiting at the entrance gate for your entry clearance.</p>\n" +
                "        <p><strong>Purpose of Visit:</strong> " + visitor.getPurpose() + "</p>\n" +
                "        <div style=\"margin: 25px 0;\">\n" +
                "            <a href=\"" + approveLink + "\" class=\"button approve\">Approve Entry</a>\n" +
                "            <a href=\"" + rejectLink + "\" class=\"button reject\">Reject Entry</a>\n" +
                "        </div>\n" +
                "        <hr style=\"border: 0; border-top: 1px solid #e5e7eb;\" />\n" +
                "        <p style=\"font-size: 12px; color: #6b7280;\">This is an automated notification from Bharani Hydraulics Visitor Management System. Link expires in 24 hours.</p>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";

        // Resolve host phone number dynamically from employee database
        String hostPhone = null;
        if (visitor.getHostId() != null && !visitor.getHostId().isEmpty()) {
            hostPhone = employeeRepository.findById(visitor.getHostId())
                    .map(com.barani.vms.model.Employee::getPhone)
                    .orElse(null);
        }
        if (hostPhone == null || hostPhone.isEmpty()) {
            hostPhone = "919876543210"; // Fallback demo phone
        }

        // Trigger SMS notification (using links pointing directly to backend APIs)
        String hostSmsMessage = String.format("VMS Alert: Visitor %s from %s is requesting entry. Approve: %s or Reject: %s", 
                visitor.getName(), visitor.getCompany() != null ? visitor.getCompany() : "Independent", approveLink, rejectLink);
        
        notificationService.sendEmail(hostEmail, "Visitor Entry Approval Request - " + visitor.getName(), emailBody);
        notificationService.sendWhatsApp(hostPhone, hostSmsMessage, null);

        return ResponseEntity.ok(saved);
    }

    @GetMapping(value = "/approve", produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String approveVisitorFromLink(@RequestParam String token) {
        Optional<ApprovalToken> tokenOpt = approvalTokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            return getErrorHtml("Invalid Request", "The security token provided is invalid or has been tampered with.");
        }

        ApprovalToken tokenEntity = tokenOpt.get();
        if (tokenEntity.isUsed()) {
            return getErrorHtml("Link Already Used", "This visitor approval request has already been processed. Links can only be clicked once.");
        }

        if (tokenEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            return getErrorHtml("Link Expired", "This security link has expired. Visitor approval requests must be cleared within 24 hours.");
        }

        Optional<Visitor> optionalVisitor = visitorRepository.findById(tokenEntity.getVisitorId());
        if (optionalVisitor.isEmpty()) {
            return getErrorHtml("Record Not Found", "The visitor registration record could not be located in the database system.");
        }

        Visitor visitor = optionalVisitor.get();

        // Mark token as used to ensure one-time execution and audit logs
        tokenEntity.setUsed(true);
        tokenEntity.setUsedAt(LocalDateTime.now());
        tokenEntity.setApprover(visitor.getHostName());
        approvalTokenRepository.save(tokenEntity);

        if ("Approved".equalsIgnoreCase(visitor.getStatus()) || "Checked In".equalsIgnoreCase(visitor.getStatus())) {
            return getSuccessHtml(visitor);
        }

        visitor.setStatus("Approved");
        visitorRepository.save(visitor);

        // Notify visitor and security (Pass generation and dispatch)
        String visitorMsg = String.format("Dear %s, your entry pass to Bharani Hydraulics is APPROVED. Host: %s. Report to Main Entrance Gate.",
                visitor.getName(), visitor.getHostName());
        
        notificationService.sendSms(visitor.getPhone(), visitorMsg);
        notificationService.sendWhatsApp(visitor.getPhone(), visitorMsg, null);
        notificationService.sendEmail(visitor.getEmail(), "Your Entry Pass - Bharani Hydraulics", visitorMsg);

        return getSuccessHtml(visitor);
    }

    @GetMapping(value = "/reject", produces = "text/html;charset=UTF-8")
    @ResponseBody
    public String rejectVisitorFromLink(@RequestParam String token) {
        Optional<ApprovalToken> tokenOpt = approvalTokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            return getErrorHtml("Invalid Request", "The security token provided is invalid or has been tampered with.");
        }

        ApprovalToken tokenEntity = tokenOpt.get();
        if (tokenEntity.isUsed()) {
            return getErrorHtml("Link Already Used", "This visitor rejection request has already been processed. Links can only be clicked once.");
        }

        if (tokenEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            return getErrorHtml("Link Expired", "This security link has expired. Visitor rejection requests must be cleared within 24 hours.");
        }

        Optional<Visitor> optionalVisitor = visitorRepository.findById(tokenEntity.getVisitorId());
        if (optionalVisitor.isEmpty()) {
            return getErrorHtml("Record Not Found", "The visitor registration record could not be located in the database system.");
        }

        Visitor visitor = optionalVisitor.get();

        // Mark token as used to ensure one-time execution
        tokenEntity.setUsed(true);
        tokenEntity.setUsedAt(LocalDateTime.now());
        tokenEntity.setApprover(visitor.getHostName());
        approvalTokenRepository.save(tokenEntity);

        if ("Rejected".equalsIgnoreCase(visitor.getStatus())) {
            return getRejectionHtml(visitor);
        }

        visitor.setStatus("Rejected");
        visitorRepository.save(visitor);

        // Notify visitor
        String visitorMsg = String.format("Dear %s, your entry request to meet %s at Bharani Hydraulics has been declined.",
                visitor.getName(), visitor.getHostName());
        notificationService.sendSms(visitor.getPhone(), visitorMsg);

        return getRejectionHtml(visitor);
    }

    private String getSuccessHtml(Visitor visitor) {
        String dateTime = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").format(LocalDateTime.now());
        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <title>Visitor Approved | VMS Portal</title>\n" +
                "    <link href=\"https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap\" rel=\"stylesheet\">\n" +
                "    <style>\n" +
                "        body {\n" +
                "            font-family: 'Outfit', sans-serif;\n" +
                "            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);\n" +
                "            display: flex;\n" +
                "            align-items: center;\n" +
                "            justify-content: center;\n" +
                "            height: 100vh;\n" +
                "            margin: 0;\n" +
                "            color: #1f2937;\n" +
                "        }\n" +
                "        .card {\n" +
                "            background: #ffffff;\n" +
                "            padding: 2.5rem;\n" +
                "            border-radius: 20px;\n" +
                "            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\n" +
                "            text-align: center;\n" +
                "            max-width: 450px;\n" +
                "            width: 90%;\n" +
                "            border: 1px solid #bbf7d0;\n" +
                "        }\n" +
                "        .icon {\n" +
                "            width: 80px;\n" +
                "            height: 80px;\n" +
                "            border-radius: 50%;\n" +
                "            background: #dcfce7;\n" +
                "            color: #16a34a;\n" +
                "            display: inline-flex;\n" +
                "            align-items: center;\n" +
                "            justify-content: center;\n" +
                "            font-size: 40px;\n" +
                "            margin: 0 auto 1.5rem auto;\n" +
                "        }\n" +
                "        h1 {\n" +
                "            font-size: 1.8rem;\n" +
                "            font-weight: 700;\n" +
                "            margin: 0 0 0.5rem 0;\n" +
                "            color: #14532d;\n" +
                "        }\n" +
                "        p {\n" +
                "            font-size: 0.95rem;\n" +
                "            color: #4b5563;\n" +
                "            margin: 0 0 1.5rem 0;\n" +
                "            line-height: 1.5;\n" +
                "        }\n" +
                "        .details {\n" +
                "            background: #f9fafb;\n" +
                "            border-radius: 12px;\n" +
                "            padding: 1.25rem;\n" +
                "            margin-bottom: 1.5rem;\n" +
                "            text-align: left;\n" +
                "            border: 1px solid #e5e7eb;\n" +
                "        }\n" +
                "        .details-row {\n" +
                "            display: flex;\n" +
                "            justify-content: space-between;\n" +
                "            font-size: 0.85rem;\n" +
                "            margin-bottom: 0.75rem;\n" +
                "            border-bottom: 1px dashed #f3f4f6;\n" +
                "            padding-bottom: 0.5rem;\n" +
                "        }\n" +
                "        .details-row:last-child {\n" +
                "            margin-bottom: 0;\n" +
                "            border-bottom: none;\n" +
                "            padding-bottom: 0;\n" +
                "        }\n" +
                "        .label {\n" +
                "            color: #6b7280;\n" +
                "        }\n" +
                "        .value {\n" +
                "            font-weight: 600;\n" +
                "            color: #111827;\n" +
                "        }\n" +
                "        .logo {\n" +
                "            font-weight: 800;\n" +
                "            font-size: 1.2rem;\n" +
                "            color: #15803d;\n" +
                "            margin-bottom: 1.5rem;\n" +
                "            letter-spacing: 0.05em;\n" +
                "        }\n" +
                "        .badge-success {\n" +
                "            display: inline-block;\n" +
                "            background: #dcfce7;\n" +
                "            color: #15803d;\n" +
                "            font-size: 0.75rem;\n" +
                "            font-weight: 700;\n" +
                "            padding: 0.25rem 0.75rem;\n" +
                "            border-radius: 9999px;\n" +
                "            margin-top: 0.5rem;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"card\">\n" +
                "        <div class=\"logo\">BHARANI HYDRAULICS</div>\n" +
                "        <div class=\"icon\">✓</div>\n" +
                "        <h1>✅ Visitor Approved</h1>\n" +
                "        <p>You have approved the campus entry request. The visitor pass has been generated and dispatched successfully.</p>\n" +
                "        <div class=\"details\">\n" +
                "            <div class=\"details-row\"><span class=\"label\">Visitor ID</span><span class=\"value\">" + visitor.getId() + "</span></div>\n" +
                "            <div class=\"details-row\"><span class=\"label\">Visitor Name</span><span class=\"value\">" + visitor.getName() + "</span></div>\n" +
                "            <div class=\"details-row\"><span class=\"label\">Host Name</span><span class=\"value\">" + visitor.getHostName() + "</span></div>\n" +
                "            <div class=\"details-row\"><span class=\"label\">Date & Time</span><span class=\"value\">" + dateTime + "</span></div>\n" +
                "        </div>\n" +
                "        <div class=\"badge-success\">Pass Generated Successfully</div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }

    private String getRejectionHtml(Visitor visitor) {
        String dateTime = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").format(LocalDateTime.now());
        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <title>Visitor Request Declined | VMS Portal</title>\n" +
                "    <link href=\"https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap\" rel=\"stylesheet\">\n" +
                "    <style>\n" +
                "        body {\n" +
                "            font-family: 'Outfit', sans-serif;\n" +
                "            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);\n" +
                "            display: flex;\n" +
                "            align-items: center;\n" +
                "            justify-content: center;\n" +
                "            height: 100vh;\n" +
                "            margin: 0;\n" +
                "            color: #1f2937;\n" +
                "        }\n" +
                "        .card {\n" +
                "            background: #ffffff;\n" +
                "            padding: 2.5rem;\n" +
                "            border-radius: 20px;\n" +
                "            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\n" +
                "            text-align: center;\n" +
                "            max-width: 450px;\n" +
                "            width: 90%;\n" +
                "            border: 1px solid #fecaca;\n" +
                "        }\n" +
                "        .icon {\n" +
                "            width: 80px;\n" +
                "            height: 80px;\n" +
                "            border-radius: 50%;\n" +
                "            background: #fee2e2;\n" +
                "            color: #dc2626;\n" +
                "            display: inline-flex;\n" +
                "            align-items: center;\n" +
                "            justify-content: center;\n" +
                "            font-size: 40px;\n" +
                "            margin: 0 auto 1.5rem auto;\n" +
                "        }\n" +
                "        h1 {\n" +
                "            font-size: 1.8rem;\n" +
                "            font-weight: 700;\n" +
                "            margin: 0 0 0.5rem 0;\n" +
                "            color: #7f1d1d;\n" +
                "        }\n" +
                "        p {\n" +
                "            font-size: 0.95rem;\n" +
                "            color: #4b5563;\n" +
                "            margin: 0 0 1.5rem 0;\n" +
                "            line-height: 1.5;\n" +
                "        }\n" +
                "        .details {\n" +
                "            background: #f9fafb;\n" +
                "            border-radius: 12px;\n" +
                "            padding: 1.25rem;\n" +
                "            margin-bottom: 1.5rem;\n" +
                "            text-align: left;\n" +
                "            border: 1px solid #e5e7eb;\n" +
                "        }\n" +
                "        .details-row {\n" +
                "            display: flex;\n" +
                "            justify-content: space-between;\n" +
                "            font-size: 0.85rem;\n" +
                "            margin-bottom: 0.75rem;\n" +
                "            border-bottom: 1px dashed #f3f4f6;\n" +
                "            padding-bottom: 0.5rem;\n" +
                "        }\n" +
                "        .details-row:last-child {\n" +
                "            margin-bottom: 0;\n" +
                "            border-bottom: none;\n" +
                "            padding-bottom: 0;\n" +
                "        }\n" +
                "        .label {\n" +
                "            color: #6b7280;\n" +
                "        }\n" +
                "        .value {\n" +
                "            font-weight: 600;\n" +
                "            color: #111827;\n" +
                "        }\n" +
                "        .logo {\n" +
                "            font-weight: 800;\n" +
                "            font-size: 1.2rem;\n" +
                "            color: #b91c1c;\n" +
                "            margin-bottom: 1.5rem;\n" +
                "            letter-spacing: 0.05em;\n" +
                "        }\n" +
                "        .badge-danger {\n" +
                "            display: inline-block;\n" +
                "            background: #fee2e2;\n" +
                "            color: #b91c1c;\n" +
                "            font-size: 0.75rem;\n" +
                "            font-weight: 700;\n" +
                "            padding: 0.25rem 0.75rem;\n" +
                "            border-radius: 9999px;\n" +
                "            margin-top: 0.5rem;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"card\">\n" +
                "        <div class=\"logo\">BHARANI HYDRAULICS</div>\n" +
                "        <div class=\"icon\">✕</div>\n" +
                "        <h1>❌ Visitor Rejected</h1>\n" +
                "        <p>You have rejected the campus entry request. Access has been denied.</p>\n" +
                "        <div class=\"details\">\n" +
                "            <div class=\"details-row\"><span class=\"label\">Visitor ID</span><span class=\"value\">" + visitor.getId() + "</span></div>\n" +
                "            <div class=\"details-row\"><span class=\"label\">Visitor Name</span><span class=\"value\">" + visitor.getName() + "</span></div>\n" +
                "            <div class=\"details-row\"><span class=\"label\">Rejected by Host</span><span class=\"value\">" + visitor.getHostName() + "</span></div>\n" +
                "            <div class=\"details-row\"><span class=\"label\">Date & Time</span><span class=\"value\">" + dateTime + "</span></div>\n" +
                "        </div>\n" +
                "        <div class=\"badge-danger\">Access Denied</div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }

    private String getErrorHtml(String title, String message) {
        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <title>" + title + " | VMS Portal</title>\n" +
                "    <link href=\"https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap\" rel=\"stylesheet\">\n" +
                "    <style>\n" +
                "        body {\n" +
                "            font-family: 'Outfit', sans-serif;\n" +
                "            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);\n" +
                "            display: flex;\n" +
                "            align-items: center;\n" +
                "            justify-content: center;\n" +
                "            height: 100vh;\n" +
                "            margin: 0;\n" +
                "            color: #1f2937;\n" +
                "        }\n" +
                "        .card {\n" +
                "            background: #ffffff;\n" +
                "            padding: 2.5rem;\n" +
                "            border-radius: 20px;\n" +
                "            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\n" +
                "            text-align: center;\n" +
                "            max-width: 450px;\n" +
                "            width: 90%;\n" +
                "            border: 1px solid #e5e7eb;\n" +
                "        }\n" +
                "        .icon {\n" +
                "            width: 80px;\n" +
                "            height: 80px;\n" +
                "            border-radius: 50%;\n" +
                "            background: #fee2e2;\n" +
                "            color: #dc2626;\n" +
                "            display: inline-flex;\n" +
                "            align-items: center;\n" +
                "            justify-content: center;\n" +
                "            font-size: 40px;\n" +
                "            margin: 0 auto 1.5rem auto;\n" +
                "        }\n" +
                "        h1 {\n" +
                "            font-size: 1.8rem;\n" +
                "            font-weight: 700;\n" +
                "            margin: 0 0 0.5rem 0;\n" +
                "            color: #7f1d1d;\n" +
                "        }\n" +
                "        p {\n" +
                "            font-size: 0.95rem;\n" +
                "            color: #4b5563;\n" +
                "            margin: 0 0 1.5rem 0;\n" +
                "            line-height: 1.5;\n" +
                "        }\n" +
                "        .logo {\n" +
                "            font-weight: 800;\n" +
                "            font-size: 1.2rem;\n" +
                "            color: #4b5563;\n" +
                "            margin-bottom: 1.5rem;\n" +
                "            letter-spacing: 0.05em;\n" +
                "        }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class=\"card\">\n" +
                "        <div class=\"logo\">BHARANI HYDRAULICS</div>\n" +
                "        <div class=\"icon\">!</div>\n" +
                "        <h1>" + title + "</h1>\n" +
                "        <p>" + message + "</p>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }

    @PutMapping("/{id}")
    public ResponseEntity<Visitor> updateVisitor(@PathVariable String id, @RequestBody Visitor visitorDetails) {
        Optional<Visitor> optionalVisitor = visitorRepository.findById(id);
        if (optionalVisitor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Visitor visitor = optionalVisitor.get();
        visitor.setName(visitorDetails.getName());
        visitor.setPhone(visitorDetails.getPhone());
        visitor.setEmail(visitorDetails.getEmail());
        visitor.setAddress(visitorDetails.getAddress());
        visitor.setCompany(visitorDetails.getCompany());
        visitor.setPurpose(visitorDetails.getPurpose());
        visitor.setVehicle(visitorDetails.getVehicle());
        visitor.setNumVisitors(visitorDetails.getNumVisitors());
        visitor.setIdType(visitorDetails.getIdType());
        visitor.setIdNumber(visitorDetails.getIdNumber());
        visitor.setHostId(visitorDetails.getHostId());
        visitor.setHostName(visitorDetails.getHostName());
        visitor.setHostDept(visitorDetails.getHostDept());
        visitor.setCheckIn(visitorDetails.getCheckIn());
        visitor.setCheckOut(visitorDetails.getCheckOut());
        visitor.setExpectedExit(visitorDetails.getExpectedExit());
        visitor.setStatus(visitorDetails.getStatus());
        visitor.setPhoto(visitorDetails.getPhoto());

        Visitor updated = visitorRepository.save(visitor);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveVisitor(@PathVariable String id, @RequestBody Map<String, String> body) {
        Optional<Visitor> optionalVisitor = visitorRepository.findById(id);
        if (optionalVisitor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Visitor visitor = optionalVisitor.get();
        visitor.setStatus("Approved");
        
        String passUrl = body.get("passUrl"); // Check if client passed custom URL (GCS/Local)
        
        Visitor saved = visitorRepository.save(visitor);

        // Notify Host, Security, and Visitor
        String visitorMsg = String.format("Dear %s, your entry pass to Bharani Hydraulics is APPROVED. Host: %s. Pass link: %s",
                visitor.getName(), visitor.getHostName(), passUrl != null ? passUrl : "Click to view pass");
        
        notificationService.sendSms(visitor.getPhone(), visitorMsg);
        notificationService.sendWhatsApp(visitor.getPhone(), visitorMsg, passUrl);
        notificationService.sendEmail(visitor.getEmail(), "Your Entry Pass - Bharani Hydraulics", visitorMsg);

        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectVisitor(@PathVariable String id) {
        Optional<Visitor> optionalVisitor = visitorRepository.findById(id);
        if (optionalVisitor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Visitor visitor = optionalVisitor.get();
        visitor.setStatus("Rejected");
        Visitor saved = visitorRepository.save(visitor);

        // Notify Visitor
        String visitorMsg = String.format("Dear %s, your entry request to meet %s at Bharani Hydraulics has been declined.",
                visitor.getName(), visitor.getHostName());
        notificationService.sendSms(visitor.getPhone(), visitorMsg);

        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{id}/checkin")
    public ResponseEntity<?> checkInVisitor(@PathVariable String id) {
        Optional<Visitor> optionalVisitor = visitorRepository.findById(id);
        if (optionalVisitor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Visitor visitor = optionalVisitor.get();
        visitor.setStatus("Checked In");
        visitor.setCheckIn(LocalDateTime.now().toString());
        Visitor saved = visitorRepository.save(visitor);

        // Notify host
        String hostMsg = String.format("Notification: Your visitor %s from %s has checked in and is heading to your cabin.",
                visitor.getName(), visitor.getCompany());
        notificationService.sendEmail(visitor.getEmail(), "Visitor Checked In", hostMsg);

        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{id}/checkout")
    public ResponseEntity<?> checkOutVisitor(@PathVariable String id) {
        Optional<Visitor> optionalVisitor = visitorRepository.findById(id);
        if (optionalVisitor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Visitor visitor = optionalVisitor.get();
        visitor.setStatus("Checked Out");
        visitor.setCheckOut(LocalDateTime.now().toString());
        Visitor saved = visitorRepository.save(visitor);

        return ResponseEntity.ok(saved);
    }

    private Visitor savedVisitorDetails(Visitor visitor) {
        // Cleaning phone fields and sanitizations if needed
        return visitor;
    }
}
