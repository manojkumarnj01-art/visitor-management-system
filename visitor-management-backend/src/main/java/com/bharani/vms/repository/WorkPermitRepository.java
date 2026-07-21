package com.bharani.vms.repository;

import com.bharani.vms.entity.WorkPermit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkPermitRepository extends JpaRepository<WorkPermit, UUID> {
    Optional<WorkPermit> findByPermitCode(String permitCode);
}
