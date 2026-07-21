package com.bharani.vms.controller;

import com.bharani.vms.dto.ApiResponse;
import com.bharani.vms.entity.Visitor;
import com.bharani.vms.service.VisitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/visitors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VisitorController {

    private final VisitorService visitorService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Visitor>>> getAllVisitors() {
        return ResponseEntity.ok(ApiResponse.ok(visitorService.getAllVisitors()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Visitor>> getVisitorById(@PathVariable UUID id) {
        return visitorService.getVisitorById(id)
                .map(v -> ResponseEntity.ok(ApiResponse.ok(v)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<Visitor>> getVisitorByCode(@PathVariable String code) {
        return visitorService.getVisitorByCode(code)
                .map(v -> ResponseEntity.ok(ApiResponse.ok(v)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<Visitor>>> getVisitorsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(ApiResponse.ok(visitorService.getVisitorsByStatus(status)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Visitor>> createVisitor(@RequestBody Visitor visitor) {
        return ResponseEntity.ok(ApiResponse.ok("Visitor created successfully", visitorService.saveVisitor(visitor)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Visitor>> updateVisitor(@PathVariable UUID id, @RequestBody Visitor visitorDetails) {
        return visitorService.getVisitorById(id)
                .map(v -> {
                    visitorDetails.setId(v.getId());
                    return ResponseEntity.ok(ApiResponse.ok("Visitor updated", visitorService.saveVisitor(visitorDetails)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/check-in")
    public ResponseEntity<ApiResponse<Visitor>> checkIn(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok("Checked in successfully", visitorService.checkIn(id)));
    }

    @PostMapping("/{id}/check-out")
    public ResponseEntity<ApiResponse<Visitor>> checkOut(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok("Checked out successfully", visitorService.checkOut(id)));
    }

    @GetMapping("/public/approve")
    public ResponseEntity<ApiResponse<Visitor>> approveVisitor(@RequestParam String token, @RequestParam(defaultValue = "Host Approver") String approver) {
        return ResponseEntity.ok(ApiResponse.ok("Visitor approved", visitorService.approveVisitor(token, approver)));
    }

    @GetMapping("/public/reject")
    public ResponseEntity<ApiResponse<Visitor>> rejectVisitor(@RequestParam String token) {
        return ResponseEntity.ok(ApiResponse.ok("Visitor rejected", visitorService.rejectVisitor(token)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVisitor(@PathVariable UUID id) {
        visitorService.deleteVisitor(id);
        return ResponseEntity.ok(ApiResponse.ok("Visitor deleted successfully", null));
    }
}
