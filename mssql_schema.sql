-- ==========================================================================
-- BHARANI HYDRAULICS VMS - MICROSOFT SQL SERVER DATABASE SCHEMA
-- Target Database: VisitorManagement
-- Compatible with SQL Server 2016 / 2019 / 2022 & SSMS
-- ==========================================================================

USE VisitorManagement;
GO

-- ==========================================================================
-- 1. BRANCHES MODULE
-- ==========================================================================
IF OBJECT_ID('dbo.branches', 'U') IS NULL
BEGIN
    CREATE TABLE branches (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        name NVARCHAR(100) UNIQUE NOT NULL,
        location NVARCHAR(255),
        created_at DATETIME2 DEFAULT GETDATE() NOT NULL,
        updated_at DATETIME2 DEFAULT GETDATE() NOT NULL
    );
END
GO

CREATE OR ALTER TRIGGER trg_branches_updated_at
ON branches
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE branches
    SET updated_at = GETDATE()
    FROM branches b
    INNER JOIN inserted i ON b.id = i.id;
END;
GO

-- ==========================================================================
-- 2. DEPARTMENTS MODULE
-- ==========================================================================
IF OBJECT_ID('dbo.departments', 'U') IS NULL
BEGIN
    CREATE TABLE departments (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        name NVARCHAR(100) UNIQUE NOT NULL,
        location NVARCHAR(255),
        created_at DATETIME2 DEFAULT GETDATE() NOT NULL,
        updated_at DATETIME2 DEFAULT GETDATE() NOT NULL
    );
END
GO

CREATE OR ALTER TRIGGER trg_departments_updated_at
ON departments
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE departments
    SET updated_at = GETDATE()
    FROM departments d
    INNER JOIN inserted i ON d.id = i.id;
END;
GO

-- ==========================================================================
-- 3. EMPLOYEES MODULE
-- ==========================================================================
IF OBJECT_ID('dbo.employees', 'U') IS NULL
BEGIN
    CREATE TABLE employees (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        employee_code NVARCHAR(50) UNIQUE NOT NULL,
        name NVARCHAR(255) NOT NULL,
        dept NVARCHAR(100) REFERENCES departments(name) ON UPDATE CASCADE,
        designation NVARCHAR(100),
        email NVARCHAR(255) UNIQUE NOT NULL,
        phone NVARCHAR(50),
        cabin NVARCHAR(100),
        status NVARCHAR(50) DEFAULT 'In Office' NOT NULL,
        campus_status NVARCHAR(50) DEFAULT 'Outside' NOT NULL,
        photo NVARCHAR(MAX), -- Stores base64 or public URLs
        created_at DATETIME2 DEFAULT GETDATE() NOT NULL,
        updated_at DATETIME2 DEFAULT GETDATE() NOT NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_employees_code' AND object_id = OBJECT_ID(N'employees'))
    CREATE INDEX idx_employees_code ON employees(employee_code);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_employees_email' AND object_id = OBJECT_ID(N'employees'))
    CREATE INDEX idx_employees_email ON employees(email);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_employees_status' AND object_id = OBJECT_ID(N'employees'))
    CREATE INDEX idx_employees_status ON employees(status);
GO

CREATE OR ALTER TRIGGER trg_employees_updated_at
ON employees
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE employees
    SET updated_at = GETDATE()
    FROM employees e
    INNER JOIN inserted i ON e.id = i.id;
END;
GO

-- ==========================================================================
-- 4. BLACKLIST MODULE
-- ==========================================================================
IF OBJECT_ID('dbo.blacklist', 'U') IS NULL
BEGIN
    CREATE TABLE blacklist (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        name NVARCHAR(255) NOT NULL,
        phone NVARCHAR(50) NOT NULL,
        id_type NVARCHAR(50),
        id_number NVARCHAR(100),
        reason NVARCHAR(MAX),
        date_added DATE DEFAULT CAST(GETDATE() AS DATE) NOT NULL,
        created_at DATETIME2 DEFAULT GETDATE() NOT NULL,
        updated_at DATETIME2 DEFAULT GETDATE() NOT NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_blacklist_phone' AND object_id = OBJECT_ID(N'blacklist'))
    CREATE INDEX idx_blacklist_phone ON blacklist(phone);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_blacklist_id_number' AND object_id = OBJECT_ID(N'blacklist'))
    CREATE INDEX idx_blacklist_id_number ON blacklist(id_number);
GO

CREATE OR ALTER TRIGGER trg_blacklist_updated_at
ON blacklist
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE blacklist
    SET updated_at = GETDATE()
    FROM blacklist b
    INNER JOIN inserted i ON b.id = i.id;
END;
GO

-- ==========================================================================
-- 5. VISITORS MODULE
-- ==========================================================================
IF OBJECT_ID('dbo.visitors', 'U') IS NULL
BEGIN
    CREATE TABLE visitors (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        visitor_code NVARCHAR(50) UNIQUE NOT NULL,
        name NVARCHAR(255) NOT NULL,
        phone NVARCHAR(50) NOT NULL,
        email NVARCHAR(255),
        address NVARCHAR(MAX),
        company NVARCHAR(255),
        purpose NVARCHAR(255),
        vehicle NVARCHAR(50),
        num_visitors INT DEFAULT 1 NOT NULL,
        id_type NVARCHAR(50),
        id_number NVARCHAR(100),
        host_id NVARCHAR(50) REFERENCES employees(employee_code) ON UPDATE CASCADE,
        host_name NVARCHAR(255),
        host_dept NVARCHAR(100) REFERENCES departments(name),
        visit_date DATE DEFAULT CAST(GETDATE() AS DATE) NOT NULL,
        check_in DATETIME2,
        check_out DATETIME2,
        expected_exit DATETIME2,
        status NVARCHAR(50) DEFAULT 'Pending' NOT NULL,
        photo NVARCHAR(MAX),
        photo_id_doc NVARCHAR(MAX),
        approve_token NVARCHAR(255),
        reject_token NVARCHAR(255),
        branch NVARCHAR(100) REFERENCES branches(name),
        start_date DATE,
        end_date DATE,
        approved_by NVARCHAR(255),
        approved_at DATETIME2,
        valid_from DATETIME2,
        valid_until DATETIME2,
        qr_code NVARCHAR(MAX),
        visitor_pass_image NVARCHAR(MAX),
        visitor_pass_pdf NVARCHAR(MAX),
        created_at DATETIME2 DEFAULT GETDATE() NOT NULL,
        updated_at DATETIME2 DEFAULT GETDATE() NOT NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_visitors_code' AND object_id = OBJECT_ID(N'visitors'))
    CREATE INDEX idx_visitors_code ON visitors(visitor_code);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_visitors_phone' AND object_id = OBJECT_ID(N'visitors'))
    CREATE INDEX idx_visitors_phone ON visitors(phone);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_visitors_status' AND object_id = OBJECT_ID(N'visitors'))
    CREATE INDEX idx_visitors_status ON visitors(status);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_visitors_visit_date' AND object_id = OBJECT_ID(N'visitors'))
    CREATE INDEX idx_visitors_visit_date ON visitors(visit_date);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_visitors_tokens' AND object_id = OBJECT_ID(N'visitors'))
    CREATE INDEX idx_visitors_tokens ON visitors(approve_token, reject_token);
GO

CREATE OR ALTER TRIGGER trg_visitors_updated_at
ON visitors
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE visitors
    SET updated_at = GETDATE()
    FROM visitors v
    INNER JOIN inserted i ON v.id = i.id;
END;
GO

-- ==========================================================================
-- 6. VISITOR PASSES MODULE
-- ==========================================================================
IF OBJECT_ID('dbo.visitor_passes', 'U') IS NULL
BEGIN
    CREATE TABLE visitor_passes (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        visitor_id UNIQUEIDENTIFIER REFERENCES visitors(id) ON DELETE CASCADE NOT NULL,
        pass_code NVARCHAR(100) UNIQUE NOT NULL,
        qr_code_url NVARCHAR(MAX),
        status NVARCHAR(50) DEFAULT 'Active' NOT NULL,
        issued_at DATETIME2 DEFAULT GETDATE() NOT NULL,
        expires_at DATETIME2,
        created_at DATETIME2 DEFAULT GETDATE() NOT NULL,
        updated_at DATETIME2 DEFAULT GETDATE() NOT NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_passes_code' AND object_id = OBJECT_ID(N'visitor_passes'))
    CREATE INDEX idx_passes_code ON visitor_passes(pass_code);
GO

CREATE OR ALTER TRIGGER trg_visitor_passes_updated_at
ON visitor_passes
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE visitor_passes
    SET updated_at = GETDATE()
    FROM visitor_passes vp
    INNER JOIN inserted i ON vp.id = i.id;
END;
GO

-- ==========================================================================
-- 7. NOTIFICATIONS MODULE
-- ==========================================================================
IF OBJECT_ID('dbo.notifications', 'U') IS NULL
BEGIN
    CREATE TABLE notifications (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        notification_code NVARCHAR(50),
        title NVARCHAR(255) NOT NULL,
        message NVARCHAR(MAX) NOT NULL,
        type NVARCHAR(50) DEFAULT 'info' NOT NULL,
        time NVARCHAR(50),
        created_at DATETIME2 DEFAULT GETDATE() NOT NULL,
        updated_at DATETIME2 DEFAULT GETDATE() NOT NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_notifications_code' AND object_id = OBJECT_ID(N'notifications'))
    CREATE INDEX idx_notifications_code ON notifications(notification_code);
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_notifications_created_at' AND object_id = OBJECT_ID(N'notifications'))
    CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
GO

CREATE OR ALTER TRIGGER trg_notifications_updated_at
ON notifications
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE notifications
    SET updated_at = GETDATE()
    FROM notifications n
    INNER JOIN inserted i ON n.id = i.id;
END;
GO

-- ==========================================================================
-- 8. SECURITY USERS MODULE
-- ==========================================================================
IF OBJECT_ID('dbo.security_users', 'U') IS NULL
BEGIN
    CREATE TABLE security_users (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        username NVARCHAR(100) UNIQUE NOT NULL,
        name NVARCHAR(255) NOT NULL,
        role NVARCHAR(100) NOT NULL CHECK (role IN ('Administrator', 'Security Gatekeeper', 'Front Desk Operator')),
        phone NVARCHAR(50),
        shift NVARCHAR(100),
        created_at DATETIME2 DEFAULT GETDATE() NOT NULL,
        updated_at DATETIME2 DEFAULT GETDATE() NOT NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_security_users_username' AND object_id = OBJECT_ID(N'security_users'))
    CREATE INDEX idx_security_users_username ON security_users(username);
GO

CREATE OR ALTER TRIGGER trg_security_users_updated_at
ON security_users
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE security_users
    SET updated_at = GETDATE()
    FROM security_users su
    INNER JOIN inserted i ON su.id = i.id;
END;
GO

-- ==========================================================================
-- 9. SYSTEM SETTINGS MODULE
-- ==========================================================================
IF OBJECT_ID('dbo.system_settings', 'U') IS NULL
BEGIN
    CREATE TABLE system_settings (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        [key] NVARCHAR(100) UNIQUE NOT NULL,
        value NVARCHAR(MAX) NOT NULL,
        created_at DATETIME2 DEFAULT GETDATE() NOT NULL,
        updated_at DATETIME2 DEFAULT GETDATE() NOT NULL
    );
END
GO

CREATE OR ALTER TRIGGER trg_system_settings_updated_at
ON system_settings
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE system_settings
    SET updated_at = GETDATE()
    FROM system_settings ss
    INNER JOIN inserted i ON ss.id = i.id;
END;
GO

-- ==========================================================================
-- 10. AUDIT LOGS MODULE
-- ==========================================================================
IF OBJECT_ID('dbo.audit_logs', 'U') IS NULL
BEGIN
    CREATE TABLE audit_logs (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        action NVARCHAR(100) NOT NULL,
        actor NVARCHAR(100) NOT NULL,
        details NVARCHAR(MAX),
        created_at DATETIME2 DEFAULT GETDATE() NOT NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_audit_logs_created_at' AND object_id = OBJECT_ID(N'audit_logs'))
    CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
GO

-- ==========================================================================
-- 11. PURCHASE MANUALS MODULE
-- ==========================================================================
IF OBJECT_ID('dbo.purchase_manuals', 'U') IS NULL
BEGIN
    CREATE TABLE purchase_manuals (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        manual_code NVARCHAR(50) UNIQUE NOT NULL,
        dept NVARCHAR(100) REFERENCES departments(name),
        agent_name NVARCHAR(255) NOT NULL,
        agent_auth_detail NVARCHAR(255),
        company_name NVARCHAR(255) NOT NULL,
        company_address NVARCHAR(MAX),
        contact_number NVARCHAR(50),
        contract_type NVARCHAR(100),
        contract_no NVARCHAR(100),
        contract_date DATE,
        no_contract NVARCHAR(10) DEFAULT 'No',
        nature_work NVARCHAR(MAX),
        required_output NVARCHAR(MAX),
        experience INT,
        competency_assess NVARCHAR(MAX),
        eligibility NVARCHAR(10) DEFAULT 'Yes',
        risks_involved NVARCHAR(MAX),
        quality_req NVARCHAR(MAX),
        duration NVARCHAR(100),
        special_tool_needed NVARCHAR(10) DEFAULT 'No',
        special_equip NVARCHAR(MAX),
        equip_available NVARCHAR(MAX),
        skill_training_req NVARCHAR(10) DEFAULT 'No',
        special_skills NVARCHAR(MAX),
        spares_provider NVARCHAR(100),
        inspect_req NVARCHAR(10) DEFAULT 'No',
        procedure_avail NVARCHAR(10) DEFAULT 'No',
        inspect_rep_req NVARCHAR(10) DEFAULT 'No',
        est_defective_prob NVARCHAR(10) DEFAULT 'No',
        correction_plan_prepared NVARCHAR(10) DEFAULT 'No',
        spare_parts_req NVARCHAR(10) DEFAULT 'No',
        env_haz NVARCHAR(10) DEFAULT 'No',
        env_waste NVARCHAR(10) DEFAULT 'No',
        env_emissions NVARCHAR(10) DEFAULT 'No',
        env_legal NVARCHAR(10) DEFAULT 'No',
        env_ocps_followed NVARCHAR(10) DEFAULT 'No',
        env_controls NVARCHAR(MAX),
        num_workers INT DEFAULT 1,
        saf_insurance NVARCHAR(10) DEFAULT 'No',
        saf_drawing NVARCHAR(10) DEFAULT 'No',
        saf_briefing NVARCHAR(10) DEFAULT 'No',
        saf_emergency NVARCHAR(10) DEFAULT 'No',
        saf_height NVARCHAR(10) DEFAULT 'No',
        saf_hot NVARCHAR(10) DEFAULT 'No',
        saf_electrical NVARCHAR(10) DEFAULT 'No',
        saf_confined NVARCHAR(10) DEFAULT 'No',
        saf_isolated NVARCHAR(10) DEFAULT 'No',
        saf_risk NVARCHAR(10) DEFAULT 'No',
        saf_permit_provided NVARCHAR(10) DEFAULT 'No',
        saf_conduct_briefed NVARCHAR(10) DEFAULT 'No',
        saf_ppe NVARCHAR(10) DEFAULT 'No',
        status NVARCHAR(50) DEFAULT 'Submitted' NOT NULL,
        date_created DATE DEFAULT CAST(GETDATE() AS DATE),
        date_submitted DATE,
        date_approved DATE,
        created_at DATETIME2 DEFAULT GETDATE() NOT NULL,
        updated_at DATETIME2 DEFAULT GETDATE() NOT NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_purchase_manuals_code' AND object_id = OBJECT_ID(N'purchase_manuals'))
    CREATE INDEX idx_purchase_manuals_code ON purchase_manuals(manual_code);
GO

CREATE OR ALTER TRIGGER trg_purchase_manuals_updated_at
ON purchase_manuals
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE purchase_manuals
    SET updated_at = GETDATE()
    FROM purchase_manuals pm
    INNER JOIN inserted i ON pm.id = i.id;
END;
GO

-- ==========================================================================
-- 12. WORK PERMITS MODULE
-- ==========================================================================
IF OBJECT_ID('dbo.work_permits', 'U') IS NULL
BEGIN
    CREATE TABLE work_permits (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        permit_code NVARCHAR(50) UNIQUE NOT NULL,
        purchase_manual_id NVARCHAR(50) REFERENCES purchase_manuals(manual_code) ON UPDATE CASCADE,
        company_entity NVARCHAR(255),
        location_site NVARCHAR(255),
        conducted_on DATE,
        work_activity NVARCHAR(MAX),
        high_risk_work NVARCHAR(100),
        start_time TIME,
        end_time TIME,
        rep_name NVARCHAR(255),
        start_date DATE,
        end_date DATE,
        description NVARCHAR(MAX),
        chk_standards BIT DEFAULT 0 NOT NULL,
        dec_risk_reviewed NVARCHAR(10) DEFAULT 'No',
        dec_controls_adequate NVARCHAR(10) DEFAULT 'No',
        dec_competent_coord NVARCHAR(10) DEFAULT 'No',
        dec_implement_controls NVARCHAR(10) DEFAULT 'No',
        dec_workers_informed NVARCHAR(10) DEFAULT 'No',
        dec_monitor_hazards NVARCHAR(10) DEFAULT 'No',
        dec_req_approval NVARCHAR(10) DEFAULT 'No',
        dec_supervisor_sig NVARCHAR(255),
        eng_reviewed_docs NVARCHAR(10) DEFAULT 'No',
        eng_monitor_methods NVARCHAR(10) DEFAULT 'No',
        eng_informed_persons NVARCHAR(10) DEFAULT 'No',
        eng_contractor_sig NVARCHAR(255),
        auth_reviewed_docs NVARCHAR(10) DEFAULT 'No',
        auth_registered NVARCHAR(10) DEFAULT 'No',
        auth_person_sig NVARCHAR(255),
        status NVARCHAR(50) DEFAULT 'Submitted' NOT NULL,
        safety_officer_approved BIT DEFAULT 0 NOT NULL,
        final_authorized BIT DEFAULT 0 NOT NULL,
        created_at DATETIME2 DEFAULT GETDATE() NOT NULL,
        updated_at DATETIME2 DEFAULT GETDATE() NOT NULL
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'idx_work_permits_code' AND object_id = OBJECT_ID(N'work_permits'))
    CREATE INDEX idx_work_permits_code ON work_permits(permit_code);
GO

CREATE OR ALTER TRIGGER trg_work_permits_updated_at
ON work_permits
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE work_permits
    SET updated_at = GETDATE()
    FROM work_permits wp
    INNER JOIN inserted i ON wp.id = i.id;
END;
GO

-- ==========================================================================
-- 13. STUDENTS MODULE
-- ==========================================================================
IF OBJECT_ID('dbo.students', 'U') IS NULL
BEGIN
    CREATE TABLE students (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        student_id NVARCHAR(50) UNIQUE NOT NULL,
        name NVARCHAR(255) NOT NULL,
        phone NVARCHAR(50) NOT NULL,
        email NVARCHAR(255),
        college NVARCHAR(255),
        department NVARCHAR(255),
        roll_number NVARCHAR(100),
        photo NVARCHAR(MAX),
        start_date DATE,
        end_date DATE,
        created_at DATETIME2 DEFAULT GETDATE() NOT NULL,
        updated_at DATETIME2 DEFAULT GETDATE() NOT NULL
    );
END
GO

CREATE OR ALTER TRIGGER trg_students_updated_at
ON students
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE students
    SET updated_at = GETDATE()
    FROM students s
    INNER JOIN inserted i ON s.id = i.id;
END;
GO

-- ==========================================================================
-- 14. REPORTING VIEWS (For Dashboard & Analytics Reports)
-- ==========================================================================

-- Unified analytical view of visitors
CREATE OR ALTER VIEW visitor_analytics AS
SELECT 
    v.id,
    v.visitor_code,
    v.name AS visitor_name,
    v.phone AS visitor_phone,
    v.email AS visitor_email,
    v.company,
    v.purpose,
    v.vehicle,
    v.num_visitors,
    v.visit_date,
    v.check_in,
    v.check_out,
    v.status,
    v.branch,
    e.employee_code AS host_code,
    e.name AS host_name,
    v.host_dept AS host_department
FROM visitors v
LEFT JOIN employees e ON v.host_id = e.employee_code;
GO

-- Daily Visitor counts
CREATE OR ALTER VIEW daily_visitor_volume AS
SELECT 
    visit_date,
    COUNT(*) AS visitor_count,
    SUM(num_visitors) AS total_individual_count
FROM visitors
GROUP BY visit_date;
GO

-- Department distribution representation
CREATE OR ALTER VIEW department_visitor_distribution AS
SELECT 
    host_dept,
    COUNT(*) AS visitor_count
FROM visitors
GROUP BY host_dept;
GO

-- Active list view inside campus bounds
CREATE OR ALTER VIEW active_campus_visitors AS
SELECT * 
FROM visitors
WHERE status = 'Checked In';
GO
