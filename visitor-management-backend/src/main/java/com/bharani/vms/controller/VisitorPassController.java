package com.bharani.vms.controller;

import com.bharani.vms.dto.ApiResponse;
import com.bharani.vms.entity.VisitorPass;
import com.bharani.vms.service.VisitorPassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/passes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VisitorPassController {

    private final VisitorPassService visitorPassService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<VisitorPass>>> getAllPasses() {
        return ResponseEntity.ok(ApiResponse.ok(visitorPassService.getAllPasses()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VisitorPass>> getPassById(@PathVariable UUID id) {
        return visitorPassService.getPassById(id)
                .map(pass -> ResponseEntity.ok(ApiResponse.ok(pass)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/public/code/{code}")
    public ResponseEntity<ApiResponse<VisitorPass>> getPassByCode(@PathVariable String code) {
        return visitorPassService.getPassByCode(code)
                .map(pass -> ResponseEntity.ok(ApiResponse.ok(pass)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<VisitorPass>> createPass(@RequestBody VisitorPass pass) {
        return ResponseEntity.ok(ApiResponse.ok("Pass created successfully", visitorPassService.savePass(pass)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePass(@PathVariable UUID id) {
        visitorPassService.deletePass(id);
        return ResponseEntity.ok(ApiResponse.ok("Pass deleted successfully", null));
    }
}
