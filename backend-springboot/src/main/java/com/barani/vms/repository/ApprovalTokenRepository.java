package com.barani.vms.repository;

import com.barani.vms.model.ApprovalToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApprovalTokenRepository extends JpaRepository<ApprovalToken, Long> {
    Optional<ApprovalToken> findByToken(String token);
}
