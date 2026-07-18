-- ==========================================================================
-- BHARANI HYDRAULICS VMS - SUPABASE DATABASE SCHEMA (schema.sql)
-- Production-ready PostgreSQL structure optimized for Supabase.
-- ==========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Shared trigger function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. BRANCHES MODULE
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER update_branches_modtime
    BEFORE UPDATE ON branches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 2. DEPARTMENTS MODULE
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER update_departments_modtime
    BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. EMPLOYEES MODULE
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    dept VARCHAR(100) REFERENCES departments(name) ON UPDATE CASCADE,
    designation VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    cabin VARCHAR(100),
    status VARCHAR(50) DEFAULT 'In Office' NOT NULL,
    campus_status VARCHAR(50) DEFAULT 'Outside' NOT NULL,
    photo TEXT, -- Stores base64 or public URLs
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_employees_code ON employees(employee_code);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);

CREATE TRIGGER update_employees_modtime
    BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. BLACKLIST MODULE
CREATE TABLE IF NOT EXISTS blacklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    id_type VARCHAR(50),
    id_number VARCHAR(100),
    reason TEXT,
    date_added DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_blacklist_phone ON blacklist(phone);
CREATE INDEX IF NOT EXISTS idx_blacklist_id_number ON blacklist(id_number);

CREATE TRIGGER update_blacklist_modtime
    BEFORE UPDATE ON blacklist
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. VISITORS MODULE (Includes Check-In & Check-Out columns)
CREATE TABLE IF NOT EXISTS visitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    company VARCHAR(255),
    purpose VARCHAR(255),
    vehicle VARCHAR(50),
    num_visitors INTEGER DEFAULT 1 NOT NULL,
    id_type VARCHAR(50),
    id_number VARCHAR(100),
    host_id VARCHAR(50) REFERENCES employees(employee_code) ON UPDATE CASCADE,
    host_name VARCHAR(255),
    host_dept VARCHAR(100) REFERENCES departments(name) ON UPDATE CASCADE,
    visit_date DATE DEFAULT CURRENT_DATE NOT NULL,
    check_in TIMESTAMPTZ,
    check_out TIMESTAMPTZ,
    expected_exit TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'Pending' NOT NULL,
    photo TEXT,
    photo_id_doc TEXT,
    approve_token VARCHAR(255),
    reject_token VARCHAR(255),
    branch VARCHAR(100) REFERENCES branches(name) ON UPDATE CASCADE,
    start_date DATE,
    end_date DATE,
    approved_by VARCHAR(255),
    approved_at TIMESTAMPTZ,
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    qr_code TEXT,
    visitor_pass_image TEXT,
    visitor_pass_pdf TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_visitors_code ON visitors(visitor_code);
CREATE INDEX IF NOT EXISTS idx_visitors_phone ON visitors(phone);
CREATE INDEX IF NOT EXISTS idx_visitors_status ON visitors(status);
CREATE INDEX IF NOT EXISTS idx_visitors_visit_date ON visitors(visit_date);
CREATE INDEX IF NOT EXISTS idx_visitors_tokens ON visitors(approve_token, reject_token);

CREATE TRIGGER update_visitors_modtime
    BEFORE UPDATE ON visitors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. VISITOR PASSES MODULE
CREATE TABLE IF NOT EXISTS visitor_passes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE NOT NULL,
    pass_code VARCHAR(100) UNIQUE NOT NULL,
    qr_code_url TEXT,
    status VARCHAR(50) DEFAULT 'Active' NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_passes_code ON visitor_passes(pass_code);

CREATE TRIGGER update_visitor_passes_modtime
    BEFORE UPDATE ON visitor_passes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. NOTIFICATIONS MODULE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_code VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' NOT NULL,
    time VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_code ON notifications(notification_code);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

CREATE TRIGGER update_notifications_modtime
    BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. ADMIN USERS & USER ROLES (Profiles mapping to Supabase auth.users)
CREATE TABLE IF NOT EXISTS security_users (
    id UUID PRIMARY KEY, -- Maps to auth.users.id
    username VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL CHECK (role IN ('Administrator', 'Security Gatekeeper', 'Front Desk Operator')),
    phone VARCHAR(50),
    shift VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_security_users_username ON security_users(username);

CREATE TRIGGER update_security_users_modtime
    BEFORE UPDATE ON security_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. SYSTEM SETTINGS
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER update_system_settings_modtime
    BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(100) NOT NULL,
    actor VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- 11. PURCHASE MANUALS MODULE (Linked with work permits)
CREATE TABLE IF NOT EXISTS purchase_manuals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manual_code VARCHAR(50) UNIQUE NOT NULL,
    dept VARCHAR(100) REFERENCES departments(name) ON UPDATE CASCADE,
    agent_name VARCHAR(255) NOT NULL,
    agent_auth_detail VARCHAR(255),
    company_name VARCHAR(255) NOT NULL,
    company_address TEXT,
    contact_number VARCHAR(50),
    contract_type VARCHAR(100),
    contract_no VARCHAR(100),
    contract_date DATE,
    no_contract VARCHAR(10) DEFAULT 'No',
    nature_work TEXT,
    required_output TEXT,
    experience INTEGER,
    competency_assess TEXT,
    eligibility VARCHAR(10) DEFAULT 'Yes',
    risks_involved TEXT,
    quality_req TEXT,
    duration VARCHAR(100),
    special_tool_needed VARCHAR(10) DEFAULT 'No',
    special_equip TEXT,
    equip_available TEXT,
    skill_training_req VARCHAR(10) DEFAULT 'No',
    special_skills TEXT,
    spares_provider VARCHAR(100),
    inspect_req VARCHAR(10) DEFAULT 'No',
    procedure_avail VARCHAR(10) DEFAULT 'No',
    inspect_rep_req VARCHAR(10) DEFAULT 'No',
    est_defective_prob VARCHAR(10) DEFAULT 'No',
    correction_plan_prepared VARCHAR(10) DEFAULT 'No',
    spare_parts_req VARCHAR(10) DEFAULT 'No',
    env_haz VARCHAR(10) DEFAULT 'No',
    env_waste VARCHAR(10) DEFAULT 'No',
    env_emissions VARCHAR(10) DEFAULT 'No',
    env_legal VARCHAR(10) DEFAULT 'No',
    env_ocps_followed VARCHAR(10) DEFAULT 'No',
    env_controls TEXT,
    num_workers INTEGER DEFAULT 1,
    saf_insurance VARCHAR(10) DEFAULT 'No',
    saf_drawing VARCHAR(10) DEFAULT 'No',
    saf_briefing VARCHAR(10) DEFAULT 'No',
    saf_emergency VARCHAR(10) DEFAULT 'No',
    saf_height VARCHAR(10) DEFAULT 'No',
    saf_hot VARCHAR(10) DEFAULT 'No',
    saf_electrical VARCHAR(10) DEFAULT 'No',
    saf_confined VARCHAR(10) DEFAULT 'No',
    saf_isolated VARCHAR(10) DEFAULT 'No',
    saf_risk VARCHAR(10) DEFAULT 'No',
    saf_permit_provided VARCHAR(10) DEFAULT 'No',
    saf_conduct_briefed VARCHAR(10) DEFAULT 'No',
    saf_ppe VARCHAR(10) DEFAULT 'No',
    status VARCHAR(50) DEFAULT 'Submitted' NOT NULL,
    date_created DATE DEFAULT CURRENT_DATE,
    date_submitted DATE,
    date_approved DATE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_purchase_manuals_code ON purchase_manuals(manual_code);

CREATE TRIGGER update_purchase_manuals_modtime
    BEFORE UPDATE ON purchase_manuals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. WORK PERMITS MODULE
CREATE TABLE IF NOT EXISTS work_permits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permit_code VARCHAR(50) UNIQUE NOT NULL,
    purchase_manual_id VARCHAR(50) REFERENCES purchase_manuals(manual_code) ON UPDATE CASCADE,
    company_entity VARCHAR(255),
    location_site VARCHAR(255),
    conducted_on DATE,
    work_activity TEXT,
    high_risk_work VARCHAR(100),
    start_time TIME,
    end_time TIME,
    rep_name VARCHAR(255),
    start_date DATE,
    end_date DATE,
    description TEXT,
    chk_standards BOOLEAN DEFAULT FALSE NOT NULL,
    dec_risk_reviewed VARCHAR(10) DEFAULT 'No',
    dec_controls_adequate VARCHAR(10) DEFAULT 'No',
    dec_competent_coord VARCHAR(10) DEFAULT 'No',
    dec_implement_controls VARCHAR(10) DEFAULT 'No',
    dec_workers_informed VARCHAR(10) DEFAULT 'No',
    dec_monitor_hazards VARCHAR(10) DEFAULT 'No',
    dec_req_approval VARCHAR(10) DEFAULT 'No',
    dec_supervisor_sig VARCHAR(255),
    eng_reviewed_docs VARCHAR(10) DEFAULT 'No',
    eng_monitor_methods VARCHAR(10) DEFAULT 'No',
    eng_informed_persons VARCHAR(10) DEFAULT 'No',
    eng_contractor_sig VARCHAR(255),
    auth_reviewed_docs VARCHAR(10) DEFAULT 'No',
    auth_registered VARCHAR(10) DEFAULT 'No',
    auth_person_sig VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Submitted' NOT NULL,
    safety_officer_approved BOOLEAN DEFAULT FALSE NOT NULL,
    final_authorized BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_work_permits_code ON work_permits(permit_code);

CREATE TRIGGER update_work_permits_modtime
    BEFORE UPDATE ON work_permits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ==========================================================================
-- 13. REPORTING VIEWS (For Dashboard & Analytics Reports)
-- ==========================================================================

-- Unified analytical view of visitors
CREATE OR REPLACE VIEW visitor_analytics AS
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

-- Daily Visitor counts over the last 30 days
CREATE OR REPLACE VIEW daily_visitor_volume AS
SELECT 
    visit_date,
    COUNT(*) AS visitor_count,
    SUM(num_visitors) AS total_individual_count
FROM visitors
GROUP BY visit_date
ORDER BY visit_date DESC;

-- Department distribution representation
CREATE OR REPLACE VIEW department_visitor_distribution AS
SELECT 
    host_dept,
    COUNT(*) AS visitor_count
FROM visitors
GROUP BY host_dept
ORDER BY visitor_count DESC;

-- Active list view inside campus bounds
CREATE OR REPLACE VIEW active_campus_visitors AS
SELECT * 
FROM visitors
WHERE status = 'Checked In';

-- 13. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    college VARCHAR(255),
    department VARCHAR(255),
    roll_number VARCHAR(100),
    photo TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER update_students_modtime
    BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
