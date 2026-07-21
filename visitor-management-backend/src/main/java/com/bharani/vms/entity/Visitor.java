package com.bharani.vms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "visitors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "visitor_code", nullable = false, unique = true, length = 50)
    private String visitorCode;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 50)
    private String phone;

    @Column(length = 255)
    private String email;

    @Lob
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String address;

    @Column(length = 255)
    private String company;

    @Column(length = 255)
    private String purpose;

    @Column(length = 50)
    private String vehicle;

    @Builder.Default
    @Column(name = "num_visitors", nullable = false)
    private Integer numVisitors = 1;

    @Column(name = "id_type", length = 50)
    private String idType;

    @Column(name = "id_number", length = 100)
    private String idNumber;

    @Column(name = "host_id", length = 50)
    private String hostId;

    @Column(name = "host_name", length = 255)
    private String hostName;

    @Column(name = "host_dept", length = 100)
    private String hostDept;

    @Builder.Default
    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate = LocalDate.now();

    @Column(name = "check_in")
    private LocalDateTime checkIn;

    @Column(name = "check_out")
    private LocalDateTime checkOut;

    @Column(name = "expected_exit")
    private LocalDateTime expectedExit;

    @Builder.Default
    @Column(nullable = false, length = 50)
    private String status = "Pending";

    @Lob
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String photo;

    @Lob
    @Column(name = "photo_id_doc", columnDefinition = "NVARCHAR(MAX)")
    private String photoIdDoc;

    @Column(name = "approve_token", length = 255)
    private String approveToken;

    @Column(name = "reject_token", length = 255)
    private String rejectToken;

    @Column(length = 100)
    private String branch;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "approved_by", length = 255)
    private String approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "valid_from")
    private LocalDateTime validFrom;

    @Column(name = "valid_until")
    private LocalDateTime validUntil;

    @Lob
    @Column(name = "qr_code", columnDefinition = "NVARCHAR(MAX)")
    private String qrCode;

    @Lob
    @Column(name = "visitor_pass_image", columnDefinition = "NVARCHAR(MAX)")
    private String visitorPassImage;

    @Lob
    @Column(name = "visitor_pass_pdf", columnDefinition = "NVARCHAR(MAX)")
    private String visitorPassPdf;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
