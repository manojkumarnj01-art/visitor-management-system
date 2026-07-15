package com.barani.vms.repository;

import com.barani.vms.model.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitorRepository extends JpaRepository<Visitor, String> {
    List<Visitor> findByVisitDate(String visitDate);
    List<Visitor> findByStatus(String status);
}
