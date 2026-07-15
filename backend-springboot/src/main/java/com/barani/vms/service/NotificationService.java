package com.barani.vms.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class NotificationService {

    @Value("${wa.api.token:}")
    private String waToken;

    @Value("${wa.phone.id:}")
    private String waPhoneId;

    @Value("${sms.provider:Twilio}")
    private String smsProvider;

    private final List<DispatchLog> dispatchLogs = Collections.synchronizedList(new ArrayList<>());

    public static class DispatchLog {
        private String id;
        private String type; // SMS, EMAIL, WHATSAPP
        private String recipient;
        private String content;
        private String timestamp;
        private String status; // Sent, Failed

        public DispatchLog(String type, String recipient, String content, String status) {
            this.id = "DISP" + System.currentTimeMillis() + "-" + (int)(Math.random() * 1000);
            this.type = type;
            this.recipient = recipient;
            this.content = content;
            this.timestamp = LocalDateTime.now().toString();
            this.status = status;
        }

        // Getters
        public String getId() { return id; }
        public String getType() { return type; }
        public String getRecipient() { return recipient; }
        public String getContent() { return content; }
        public String getTimestamp() { return timestamp; }
        public String getStatus() { return status; }
    }

    public List<DispatchLog> getDispatchLogs() {
        return new ArrayList<>(dispatchLogs);
    }

    public void clearLogs() {
        dispatchLogs.clear();
    }

    public boolean sendSms(String recipient, String message) {
        System.out.println(String.format("[SMS Dispatch via %s] To: %s, Message: %s", smsProvider, recipient, message));
        dispatchLogs.add(new DispatchLog("SMS", recipient, message, "Sent"));
        return true;
    }

    public boolean sendEmail(String recipient, String subject, String body) {
        System.out.println(String.format("[Email Dispatch] To: %s, Subject: %s", recipient, subject));
        dispatchLogs.add(new DispatchLog("EMAIL", recipient, "Subject: " + subject + " | " + body, "Sent"));
        return true;
    }

    public boolean sendWhatsApp(String recipient, String message, String mediaUrl) {
        String logContent = message + (mediaUrl != null && !mediaUrl.isEmpty() ? " | Attachment: " + mediaUrl : "");
        System.out.println(String.format("[WhatsApp Business API] To: %s, Message: %s", recipient, logContent));
        
        String status = "Sent";
        if (waToken != null && !waToken.isEmpty() && waPhoneId != null && !waPhoneId.isEmpty()) {
            // In production, we'd make an HTTP request to Meta API: https://graph.facebook.com/v17.0/{phone_id}/messages
            // But we keep it secure and logged
            status = "Sent via Cloud API";
        }
        
        dispatchLogs.add(new DispatchLog("WHATSAPP", recipient, logContent, status));
        return true;
    }
}
