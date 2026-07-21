package com.bharani.vms.repository;

import com.bharani.vms.entity.VisitorPass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VisitorPassRepository extends JpaRepository<VisitorPass, UUID> {
    Optional<VisitorPass> findByPassCode(String passCode);
    Optional<VisitorPass> findByVisitorId(UUID visitorId);
}
