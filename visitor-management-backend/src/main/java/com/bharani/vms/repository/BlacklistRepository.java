package com.bharani.vms.repository;

import com.bharani.vms.entity.Blacklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BlacklistRepository extends JpaRepository<Blacklist, UUID> {
    List<Blacklist> findByPhone(String phone);
    List<Blacklist> findByIdNumber(String idNumber);
}
