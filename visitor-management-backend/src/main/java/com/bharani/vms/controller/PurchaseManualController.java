package com.bharani.vms.controller;

import com.bharani.vms.dto.ApiResponse;
import com.bharani.vms.entity.PurchaseManual;
import com.bharani.vms.service.PurchaseManualService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/purchase-manuals")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PurchaseManualController {

    private final PurchaseManualService purchaseManualService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PurchaseManual>>> getAllPurchaseManuals() {
        return ResponseEntity.ok(ApiResponse.ok(purchaseManualService.getAllPurchaseManuals()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PurchaseManual>> getPurchaseManualById(@PathVariable UUID id) {
        return purchaseManualService.getPurchaseManualById(id)
                .map(m -> ResponseEntity.ok(ApiResponse.ok(m)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PurchaseManual>> createPurchaseManual(@RequestBody PurchaseManual manual) {
        return ResponseEntity.ok(ApiResponse.ok("Purchase Manual saved", purchaseManualService.savePurchaseManual(manual)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PurchaseManual>> updatePurchaseManual(@PathVariable UUID id, @RequestBody PurchaseManual manual) {
        manual.setId(id);
        return ResponseEntity.ok(ApiResponse.ok("Purchase Manual updated", purchaseManualService.savePurchaseManual(manual)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePurchaseManual(@PathVariable UUID id) {
        purchaseManualService.deletePurchaseManual(id);
        return ResponseEntity.ok(ApiResponse.ok("Purchase Manual deleted", null));
    }
}
