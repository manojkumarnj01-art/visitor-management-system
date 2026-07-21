package com.bharani.vms.controller;

import com.bharani.vms.dto.ApiResponse;
import com.bharani.vms.entity.Branch;
import com.bharani.vms.service.BranchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/branches")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BranchController {

    private final BranchService branchService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Branch>>> getAllBranches() {
        return ResponseEntity.ok(ApiResponse.ok(branchService.getAllBranches()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Branch>> getBranchById(@PathVariable UUID id) {
        return branchService.getBranchById(id)
                .map(branch -> ResponseEntity.ok(ApiResponse.ok(branch)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Branch>> createBranch(@RequestBody Branch branch) {
        return ResponseEntity.ok(ApiResponse.ok("Branch created successfully", branchService.saveBranch(branch)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Branch>> updateBranch(@PathVariable UUID id, @RequestBody Branch branchDetails) {
        return branchService.getBranchById(id)
                .map(branch -> {
                    branch.setName(branchDetails.getName());
                    branch.setLocation(branchDetails.getLocation());
                    return ResponseEntity.ok(ApiResponse.ok("Branch updated", branchService.saveBranch(branch)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBranch(@PathVariable UUID id) {
        branchService.deleteBranch(id);
        return ResponseEntity.ok(ApiResponse.ok("Branch deleted successfully", null));
    }
}
