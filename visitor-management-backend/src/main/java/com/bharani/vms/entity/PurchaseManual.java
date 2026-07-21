package com.bharani.vms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "purchase_manuals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseManual {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "manual_code", nullable = false, unique = true, length = 50)
    private String manualCode;

    @Column(length = 100)
    private String dept;

    @Column(name = "agent_name", nullable = false, length = 255)
    private String agentName;

    @Column(name = "agent_auth_detail", length = 255)
    private String agentAuthDetail;

    @Column(name = "company_name", nullable = false, length = 255)
    private String companyName;

    @Lob
    @Column(name = "company_address", columnDefinition = "NVARCHAR(MAX)")
    private String companyAddress;

    @Column(name = "contact_number", length = 50)
    private String contactNumber;

    @Column(name = "contract_type", length = 100)
    private String contractType;

    @Column(name = "contract_no", length = 100)
    private String contractNo;

    @Column(name = "contract_date")
    private LocalDate contractDate;

    @Builder.Default
    @Column(name = "no_contract", length = 10)
    private String noContract = "No";

    @Lob
    @Column(name = "nature_work", columnDefinition = "NVARCHAR(MAX)")
    private String natureWork;

    @Lob
    @Column(name = "required_output", columnDefinition = "NVARCHAR(MAX)")
    private String requiredOutput;

    private Integer experience;

    @Lob
    @Column(name = "competency_assess", columnDefinition = "NVARCHAR(MAX)")
    private String competencyAssess;

    @Builder.Default
    @Column(length = 10)
    private String eligibility = "Yes";

    @Lob
    @Column(name = "risks_involved", columnDefinition = "NVARCHAR(MAX)")
    private String risksInvolved;

    @Lob
    @Column(name = "quality_req", columnDefinition = "NVARCHAR(MAX)")
    private String qualityReq;

    @Column(length = 100)
    private String duration;

    @Builder.Default
    @Column(name = "special_tool_needed", length = 10)
    private String specialToolNeeded = "No";

    @Lob
    @Column(name = "special_equip", columnDefinition = "NVARCHAR(MAX)")
    private String specialEquip;

    @Lob
    @Column(name = "equip_available", columnDefinition = "NVARCHAR(MAX)")
    private String equipAvailable;

    @Builder.Default
    @Column(name = "skill_training_req", length = 10)
    private String skillTrainingReq = "No";

    @Lob
    @Column(name = "special_skills", columnDefinition = "NVARCHAR(MAX)")
    private String specialSkills;

    @Column(name = "spares_provider", length = 100)
    private String sparesProvider;

    @Builder.Default
    @Column(name = "inspect_req", length = 10)
    private String inspectReq = "No";

    @Builder.Default
    @Column(name = "procedure_avail", length = 10)
    private String procedureAvail = "No";

    @Builder.Default
    @Column(name = "inspect_rep_req", length = 10)
    private String inspectRepReq = "No";

    @Builder.Default
    @Column(name = "est_defective_prob", length = 10)
    private String estDefectiveProb = "No";

    @Builder.Default
    @Column(name = "correction_plan_prepared", length = 10)
    private String correctionPlanPrepared = "No";

    @Builder.Default
    @Column(name = "spare_parts_req", length = 10)
    private String sparePartsReq = "No";

    @Builder.Default
    @Column(name = "env_haz", length = 10)
    private String envHaz = "No";

    @Builder.Default
    @Column(name = "env_waste", length = 10)
    private String envWaste = "No";

    @Builder.Default
    @Column(name = "env_emissions", length = 10)
    private String envEmissions = "No";

    @Builder.Default
    @Column(name = "env_legal", length = 10)
    private String envLegal = "No";

    @Builder.Default
    @Column(name = "env_ocps_followed", length = 10)
    private String envOcpsFollowed = "No";

    @Lob
    @Column(name = "env_controls", columnDefinition = "NVARCHAR(MAX)")
    private String envControls;

    @Builder.Default
    @Column(name = "num_workers")
    private Integer numWorkers = 1;

    @Builder.Default
    @Column(name = "saf_insurance", length = 10)
    private String safInsurance = "No";

    @Builder.Default
    @Column(name = "saf_drawing", length = 10)
    private String safDrawing = "No";

    @Builder.Default
    @Column(name = "saf_briefing", length = 10)
    private String safBriefing = "No";

    @Builder.Default
    @Column(name = "saf_emergency", length = 10)
    private String safEmergency = "No";

    @Builder.Default
    @Column(name = "saf_height", length = 10)
    private String safHeight = "No";

    @Builder.Default
    @Column(name = "saf_hot", length = 10)
    private String safHot = "No";

    @Builder.Default
    @Column(name = "saf_electrical", length = 10)
    private String safElectrical = "No";

    @Builder.Default
    @Column(name = "saf_confined", length = 10)
    private String safConfined = "No";

    @Builder.Default
    @Column(name = "saf_isolated", length = 10)
    private String safIsolated = "No";

    @Builder.Default
    @Column(name = "saf_risk", length = 10)
    private String safRisk = "No";

    @Builder.Default
    @Column(name = "saf_permit_provided", length = 10)
    private String safPermitProvided = "No";

    @Builder.Default
    @Column(name = "saf_conduct_briefed", length = 10)
    private String safConductBriefed = "No";

    @Builder.Default
    @Column(name = "saf_ppe", length = 10)
    private String safPpe = "No";

    @Builder.Default
    @Column(nullable = false, length = 50)
    private String status = "Submitted";

    @Builder.Default
    @Column(name = "date_created")
    private LocalDate dateCreated = LocalDate.now();

    @Column(name = "date_submitted")
    private LocalDate dateSubmitted;

    @Column(name = "date_approved")
    private LocalDate dateApproved;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
