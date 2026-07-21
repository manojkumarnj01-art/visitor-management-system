package com.bharani.vms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "work_permits")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkPermit {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "permit_code", nullable = false, unique = true, length = 50)
    private String permitCode;

    @Column(name = "purchase_manual_id", length = 50)
    private String purchaseManualId;

    @Column(name = "company_entity", length = 255)
    private String companyEntity;

    @Column(name = "location_site", length = 255)
    private String locationSite;

    @Column(name = "conducted_on")
    private LocalDate conductedOn;

    @Lob
    @Column(name = "work_activity", columnDefinition = "NVARCHAR(MAX)")
    private String workActivity;

    @Column(name = "high_risk_work", length = 100)
    private String highRiskWork;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "rep_name", length = 255)
    private String repName;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Lob
    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Builder.Default
    @Column(name = "chk_standards", nullable = false)
    private Boolean chkStandards = false;

    @Builder.Default
    @Column(name = "dec_risk_reviewed", length = 10)
    private String decRiskReviewed = "No";

    @Builder.Default
    @Column(name = "dec_controls_adequate", length = 10)
    private String decControlsAdequate = "No";

    @Builder.Default
    @Column(name = "dec_competent_coord", length = 10)
    private String decCompetentCoord = "No";

    @Builder.Default
    @Column(name = "dec_implement_controls", length = 10)
    private String decImplementControls = "No";

    @Builder.Default
    @Column(name = "dec_workers_informed", length = 10)
    private String decWorkersInformed = "No";

    @Builder.Default
    @Column(name = "dec_monitor_hazards", length = 10)
    private String decMonitorHazards = "No";

    @Builder.Default
    @Column(name = "dec_req_approval", length = 10)
    private String decReqApproval = "No";

    @Column(name = "dec_supervisor_sig", length = 255)
    private String decSupervisorSig;

    @Builder.Default
    @Column(name = "eng_reviewed_docs", length = 10)
    private String engReviewedDocs = "No";

    @Builder.Default
    @Column(name = "eng_monitor_methods", length = 10)
    private String engMonitorMethods = "No";

    @Builder.Default
    @Column(name = "eng_informed_persons", length = 10)
    private String engInformedPersons = "No";

    @Column(name = "eng_contractor_sig", length = 255)
    private String engContractorSig;

    @Builder.Default
    @Column(name = "auth_reviewed_docs", length = 10)
    private String authReviewedDocs = "No";

    @Builder.Default
    @Column(name = "auth_registered", length = 10)
    private String authRegistered = "No";

    @Column(name = "auth_person_sig", length = 255)
    private String authPersonSig;

    @Builder.Default
    @Column(nullable = false, length = 50)
    private String status = "Submitted";

    @Builder.Default
    @Column(name = "safety_officer_approved", nullable = false)
    private Boolean safetyOfficerApproved = false;

    @Builder.Default
    @Column(name = "final_authorized", nullable = false)
    private Boolean finalAuthorized = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
