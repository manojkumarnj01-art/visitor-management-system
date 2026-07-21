package com.bharani.vms.repository;

import com.bharani.vms.entity.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VisitorRepository extends JpaRepository<Visitor, UUID> {
    Optional<Visitor> findByVisitorCode(String visitorCode);
    Optional<Visitor> findByApproveToken(String approveToken);
    Optional<Visitor> findByRejectToken(String rejectToken);
    List<Visitor> findByStatus(String status);
    List<Visitor> findByVisitDate(LocalDate visitDate);
}
