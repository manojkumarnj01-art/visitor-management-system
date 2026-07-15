package com.barani.vms.controller;

import com.barani.vms.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/dispatch-logs")
    public List<NotificationService.DispatchLog> getDispatchLogs() {
        return notificationService.getDispatchLogs();
    }

    @DeleteMapping("/dispatch-logs")
    public ResponseEntity<?> clearLogs() {
        notificationService.clearLogs();
        return ResponseEntity.ok().build();
    }
}
