package com.bharani.vms.service;

import com.bharani.vms.entity.AuditLog;
import com.bharani.vms.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc();
    }

    public AuditLog logAction(String action, String actor, String details) {
        AuditLog log = AuditLog.builder()
                .action(action)
                .actor(actor)
                .details(details)
                .build();
        return auditLogRepository.save(log);
    }
}
