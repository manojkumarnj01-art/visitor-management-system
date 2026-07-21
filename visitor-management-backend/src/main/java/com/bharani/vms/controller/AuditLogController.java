package com.bharani.vms.controller;

import com.bharani.vms.dto.ApiResponse;
import com.bharani.vms.entity.AuditLog;
import com.bharani.vms.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAllAuditLogs() {
        return ResponseEntity.ok(ApiResponse.ok(auditLogService.getAllAuditLogs()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AuditLog>> logAction(@RequestBody AuditLog log) {
        return ResponseEntity.ok(ApiResponse.ok("Audit logged", auditLogService.logAction(log.getAction(), log.getActor(), log.getDetails())));
    }
}
