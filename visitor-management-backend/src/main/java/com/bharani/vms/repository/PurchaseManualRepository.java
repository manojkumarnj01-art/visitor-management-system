package com.bharani.vms.repository;

import com.bharani.vms.entity.PurchaseManual;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PurchaseManualRepository extends JpaRepository<PurchaseManual, UUID> {
    Optional<PurchaseManual> findByManualCode(String manualCode);
}
