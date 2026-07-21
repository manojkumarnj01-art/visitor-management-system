package com.bharani.vms.service;

import com.bharani.vms.entity.PurchaseManual;
import com.bharani.vms.repository.PurchaseManualRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PurchaseManualService {

    private final PurchaseManualRepository purchaseManualRepository;

    public List<PurchaseManual> getAllPurchaseManuals() {
        return purchaseManualRepository.findAll();
    }

    public Optional<PurchaseManual> getPurchaseManualById(UUID id) {
        return purchaseManualRepository.findById(id);
    }

    public Optional<PurchaseManual> getPurchaseManualByCode(String code) {
        return purchaseManualRepository.findByManualCode(code);
    }

    public PurchaseManual savePurchaseManual(PurchaseManual manual) {
        if (manual.getManualCode() == null || manual.getManualCode().isBlank()) {
            manual.setManualCode("PM-" + System.currentTimeMillis() % 100000);
        }
        return purchaseManualRepository.save(manual);
    }

    public void deletePurchaseManual(UUID id) {
        purchaseManualRepository.deleteById(id);
    }
}
