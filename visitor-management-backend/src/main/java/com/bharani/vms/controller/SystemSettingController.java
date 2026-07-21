package com.bharani.vms.controller;

import com.bharani.vms.dto.ApiResponse;
import com.bharani.vms.entity.SystemSetting;
import com.bharani.vms.service.SystemSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/system-settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SystemSettingController {

    private final SystemSettingService systemSettingService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SystemSetting>>> getAllSettings() {
        return ResponseEntity.ok(ApiResponse.ok(systemSettingService.getAllSettings()));
    }

    @GetMapping("/{key}")
    public ResponseEntity<ApiResponse<SystemSetting>> getSettingByKey(@PathVariable String key) {
        return systemSettingService.getSettingByKey(key)
                .map(setting -> ResponseEntity.ok(ApiResponse.ok(setting)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SystemSetting>> saveSetting(@RequestBody SystemSetting setting) {
        return ResponseEntity.ok(ApiResponse.ok("Setting saved", systemSettingService.saveSetting(setting)));
    }
}
