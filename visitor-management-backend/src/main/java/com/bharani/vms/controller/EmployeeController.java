package com.bharani.vms.controller;

import com.bharani.vms.dto.ApiResponse;
import com.bharani.vms.entity.Employee;
import com.bharani.vms.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Employee>>> getAllEmployees() {
        return ResponseEntity.ok(ApiResponse.ok(employeeService.getAllEmployees()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Employee>> getEmployeeById(@PathVariable UUID id) {
        return employeeService.getEmployeeById(id)
                .map(emp -> ResponseEntity.ok(ApiResponse.ok(emp)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<Employee>> getEmployeeByCode(@PathVariable String code) {
        return employeeService.getEmployeeByCode(code)
                .map(emp -> ResponseEntity.ok(ApiResponse.ok(emp)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Employee>> createEmployee(@RequestBody Employee employee) {
        return ResponseEntity.ok(ApiResponse.ok("Employee created successfully", employeeService.saveEmployee(employee)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Employee>> updateEmployee(@PathVariable UUID id, @RequestBody Employee empDetails) {
        return employeeService.getEmployeeById(id)
                .map(emp -> {
                    emp.setEmployeeCode(empDetails.getEmployeeCode());
                    emp.setName(empDetails.getName());
                    emp.setDept(empDetails.getDept());
                    emp.setDesignation(empDetails.getDesignation());
                    emp.setEmail(empDetails.getEmail());
                    emp.setPhone(empDetails.getPhone());
                    emp.setCabin(empDetails.getCabin());
                    emp.setStatus(empDetails.getStatus());
                    emp.setCampusStatus(empDetails.getCampusStatus());
                    if (empDetails.getPhoto() != null) emp.setPhoto(empDetails.getPhoto());
                    return ResponseEntity.ok(ApiResponse.ok("Employee updated", employeeService.saveEmployee(emp)));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable UUID id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(ApiResponse.ok("Employee deleted successfully", null));
    }
}
