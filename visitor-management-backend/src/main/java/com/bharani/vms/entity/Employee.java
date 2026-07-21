package com.bharani.vms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "employee_code", nullable = false, unique = true, length = 50)
    private String employeeCode;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 100)
    private String dept;

    @Column(length = 100)
    private String designation;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(length = 50)
    private String phone;

    @Column(length = 100)
    private String cabin;

    @Builder.Default
    @Column(nullable = false, length = 50)
    private String status = "In Office";

    @Builder.Default
    @Column(name = "campus_status", nullable = false, length = 50)
    private String campusStatus = "Outside";

    @Lob
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String photo;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
