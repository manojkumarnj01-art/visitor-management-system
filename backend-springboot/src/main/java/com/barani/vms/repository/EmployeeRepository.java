package com.barani.vms.repository;

import com.barani.vms.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
    List<Employee> findByNameContainingIgnoreCaseOrIdContainingIgnoreCaseOrDeptContainingIgnoreCase(String name, String id, String dept);
}
