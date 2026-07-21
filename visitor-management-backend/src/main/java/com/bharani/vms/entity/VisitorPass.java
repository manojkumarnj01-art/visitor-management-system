package com.bharani.vms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "visitor_passes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitorPass {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "visitor_id", nullable = false)
    private Visitor visitor;

    @Column(name = "pass_code", nullable = false, unique = true, length = 100)
    private String passCode;

    @Lob
    @Column(name = "qr_code_url", columnDefinition = "NVARCHAR(MAX)")
    private String qrCodeUrl;

    @Builder.Default
    @Column(nullable = false, length = 50)
    private String status = "Active";

    @CreationTimestamp
    @Column(name = "issued_at", nullable = false)
    private LocalDateTime issuedAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
