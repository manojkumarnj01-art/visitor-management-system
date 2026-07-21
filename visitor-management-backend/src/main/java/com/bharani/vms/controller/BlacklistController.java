package com.bharani.vms.controller;

import com.bharani.vms.dto.ApiResponse;
import com.bharani.vms.entity.Blacklist;
import com.bharani.vms.service.BlacklistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/blacklist")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BlacklistController {

    private final BlacklistService blacklistService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Blacklist>>> getAllBlacklist() {
        return ResponseEntity.ok(ApiResponse.ok(blacklistService.getAllBlacklistEntries()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Blacklist>> getBlacklistById(@PathVariable UUID id) {
        return blacklistService.getBlacklistById(id)
                .map(item -> ResponseEntity.ok(ApiResponse.ok(item)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Blacklist>> createBlacklist(@RequestBody Blacklist blacklist) {
        return ResponseEntity.ok(ApiResponse.ok("Blacklist entry added", blacklistService.saveBlacklist(blacklist)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBlacklist(@PathVariable UUID id) {
        blacklistService.deleteBlacklist(id);
        return ResponseEntity.ok(ApiResponse.ok("Blacklist entry deleted", null));
    }
}
