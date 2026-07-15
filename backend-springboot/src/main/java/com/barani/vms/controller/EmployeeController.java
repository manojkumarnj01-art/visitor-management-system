package com.barani.vms.controller;

import com.barani.vms.model.Employee;
import com.barani.vms.repository.EmployeeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;

    public EmployeeController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @GetMapping
    public List<Employee> getEmployees(@RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return employeeRepository.findByNameContainingIgnoreCaseOrIdContainingIgnoreCaseOrDeptContainingIgnoreCase(search, search, search);
        }
        return employeeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable String id) {
        return employeeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        if (employee.getId() == null || employee.getId().isEmpty()) {
            employee.setId("EMP" + System.currentTimeMillis() % 100000);
        }
        Employee saved = employeeRepository.save(employee);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{id}/entry")
    public ResponseEntity<Employee> markEntry(@PathVariable String id) {
        Optional<Employee> optionalEmployee = employeeRepository.findById(id);
        if (optionalEmployee.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Employee employee = optionalEmployee.get();
        employee.setCampusStatus("Inside");
        employee.setStatus("In Office");
        Employee updated = employeeRepository.save(employee);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/exit")
    public ResponseEntity<Employee> markExit(@PathVariable String id) {
        Optional<Employee> optionalEmployee = employeeRepository.findById(id);
        if (optionalEmployee.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Employee employee = optionalEmployee.get();
        employee.setCampusStatus("Outside");
        employee.setStatus("Out of Office");
        Employee updated = employeeRepository.save(employee);
        return ResponseEntity.ok(updated);
    }
}
