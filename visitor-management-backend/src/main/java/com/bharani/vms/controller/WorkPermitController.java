package com.bharani.vms.controller;

import com.bharani.vms.dto.ApiResponse;
import com.bharani.vms.entity.WorkPermit;
import com.bharani.vms.service.WorkPermitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/work-permits")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WorkPermitController {

    private final WorkPermitService workPermitService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkPermit>>> getAllWorkPermits() {
        return ResponseEntity.ok(ApiResponse.ok(workPermitService.getAllWorkPermits()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkPermit>> getWorkPermitById(@PathVariable UUID id) {
        return workPermitService.getWorkPermitById(id)
                .map(p -> ResponseEntity.ok(ApiResponse.ok(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WorkPermit>> createWorkPermit(@RequestBody WorkPermit permit) {
        return ResponseEntity.ok(ApiResponse.ok("Work Permit saved", workPermitService.saveWorkPermit(permit)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkPermit>> updateWorkPermit(@PathVariable UUID id, @RequestBody WorkPermit permit) {
        permit.setId(id);
        return ResponseEntity.ok(ApiResponse.ok("Work Permit updated", workPermitService.saveWorkPermit(permit)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWorkPermit(@PathVariable UUID id) {
        workPermitService.deleteWorkPermit(id);
        return ResponseEntity.ok(ApiResponse.ok("Work Permit deleted", null));
    }
}
