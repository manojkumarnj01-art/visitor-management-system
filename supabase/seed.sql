-- ==========================================================================
-- BHARANI HYDRAULICS VMS - DATABASE SEED DATA (seed.sql)
-- Consistent with app.js default seeds for offline/demo workflows.
-- ==========================================================================

-- Seed Branches
INSERT INTO branches (name, location) VALUES
('Chennai HQ', 'Chennai, Tamil Nadu, India'),
('Coimbatore Plant', 'Coimbatore, Tamil Nadu, India'),
('Bangalore R&D', 'Bangalore, Karnataka, India')
ON CONFLICT (name) DO NOTHING;

-- Seed Departments
INSERT INTO departments (name, location) VALUES
('IT', 'Floor 2 Cabin IT-A to IT-M'),
('Engineering', 'Floor 1 Cabin ENG-1 to ENG-15'),
('HR & Recruitment', 'Floor 3 Cabin HR-1 to HR-4'),
('Marketing', 'Floor 3 Cabin MKT-1 to MKT-12'),
('Finance', 'Floor 2 Cabin FIN-1 to FIN-8'),
('Legal', 'Floor 4 Cabin LEG-1 to LEG-3'),
('Sales', 'Floor 4 Cabin SAL-1 to SAL-10'),
('Operations', 'Floor 1 Cabin OP-1 to OP-6')
ON CONFLICT (name) DO NOTHING;

-- Seed Employees
INSERT INTO employees (employee_code, name, dept, designation, email, phone, cabin, status, campus_status, photo) VALUES
('EMP101', 'Manoj Kumar', 'IT', 'Lead IT Architect', 'mkumar@acme.corp', '+91 98765 01101', 'Floor 2 Cabin IT-A', 'In Office', 'Outside', 'data:image/svg+xml;utf8,<svg xmlns=''http://www.w3.org/2000/svg'' viewBox=''0 0 100 100''><circle cx=''50'' cy=''50'' r=''50'' fill=''%233b82f6''/><path d=''M30 75c0-10 10-15 20-15s20 5 20 15'' stroke=''white'' stroke-width=''4'' fill=''none''/><circle cx=''50'' cy=''40'' r=''12'' fill=''white''/></svg>'),
('EMP102', 'Sarah Jenkins', 'Engineering', 'Senior Tech Lead', 'sjenkins@acme.corp', '+91 98765 01102', 'Floor 1 Cabin ENG-4', 'In Office', 'Outside', 'data:image/svg+xml;utf8,<svg xmlns=''http://www.w3.org/2000/svg'' viewBox=''0 0 100 100''><circle cx=''50'' cy=''50'' r=''50'' fill=''%23ec4899''/><path d=''M30 75c0-10 10-15 20-15s20 5 20 15'' stroke=''white'' stroke-width=''4'' fill=''none''/><circle cx=''50'' cy=''40'' r=''12'' fill=''white''/></svg>'),
('EMP103', 'Michael Chang', 'Engineering', 'Principal Architect', 'mchang@acme.corp', '+91 98765 01103', 'Floor 1 Cabin ENG-9', 'In Meeting', 'Inside', 'data:image/svg+xml;utf8,<svg xmlns=''http://www.w3.org/2000/svg'' viewBox=''0 0 100 100''><circle cx=''50'' cy=''50'' r=''50'' fill=''%2310b981''/><path d=''M30 75c0-10 10-15 20-15s20 5 20 15'' stroke=''white'' stroke-width=''4'' fill=''none''/><circle cx=''50'' cy=''40'' r=''12'' fill=''white''/></svg>'),
('EMP104', 'David Miller', 'HR & Recruitment', 'HR Executive Manager', 'dmiller@acme.corp', '+91 98765 01104', 'Floor 3 Cabin HR-2', 'In Office', 'Outside', 'data:image/svg+xml;utf8,<svg xmlns=''http://www.w3.org/2000/svg'' viewBox=''0 0 100 100''><circle cx=''50'' cy=''50'' r=''50'' fill=''%23f59e0b''/><path d=''M30 75c0-10 10-15 20-15s20 5 20 15'' stroke=''white'' stroke-width=''4'' fill=''none''/><circle cx=''50'' cy=''40'' r=''12'' fill=''white''/></svg>'),
('EMP105', 'Amanda Ross', 'Marketing', 'Brand Creative Director', 'aross@acme.corp', '+91 98765 01105', 'Floor 3 Cabin MKT-12', 'Out of Office', 'Outside', 'data:image/svg+xml;utf8,<svg xmlns=''http://www.w3.org/2000/svg'' viewBox=''0 0 100 100''><circle cx=''50'' cy=''50'' r=''50'' fill=''%238b5cf6''/><path d=''M30 75c0-10 10-15 20-15s20 5 20 15'' stroke=''white'' stroke-width=''4'' fill=''none''/><circle cx=''50'' cy=''40'' r=''12'' fill=''white''/></svg>'),
('EMP106', 'Robert Taylor', 'Finance', 'Chief Financial Officer', 'rtaylor@acme.corp', '+91 98765 01106', 'Floor 2 Cabin FIN-5', 'In Office', 'Outside', 'data:image/svg+xml;utf8,<svg xmlns=''http://www.w3.org/2000/svg'' viewBox=''0 0 100 100''><circle cx=''50'' cy=''50'' r=''50'' fill=''%236366f1''/><path d=''M30 75c0-10 10-15 20-15s20 5 20 15'' stroke=''white'' stroke-width=''4'' fill=''none''/><circle cx=''50'' cy=''40'' r=''12'' fill=''white''/></svg>'),
('EMP107', 'Elena Rostova', 'Legal', 'General Counsel', 'erostova@acme.corp', '+91 98765 01107', 'Floor 4 Cabin LEG-2', 'In Meeting', 'Inside', 'data:image/svg+xml;utf8,<svg xmlns=''http://www.w3.org/2000/svg'' viewBox=''0 0 100 100''><circle cx=''50'' cy=''50'' r=''50'' fill=''%23f97316''/><path d=''M30 75c0-10 10-15 20-15s20 5 20 15'' stroke=''white'' stroke-width=''4'' fill=''none''/><circle cx=''50'' cy=''40'' r=''12'' fill=''white''/></svg>'),
('EMP108', 'James Wilson', 'Sales', 'VP Global Sales', 'jwilson@acme.corp', '+91 98765 01108', 'Floor 4 Cabin SAL-8', 'In Office', 'Outside', 'data:image/svg+xml;utf8,<svg xmlns=''http://www.w3.org/2000/svg'' viewBox=''0 0 100 100''><circle cx=''50'' cy=''50'' r=''50'' fill=''%2314b8a6''/><path d=''M30 75c0-10 10-15 20-15s20 5 20 15'' stroke=''white'' stroke-width=''4'' fill=''none''/><circle cx=''50'' cy=''40'' r=''12'' fill=''white''/></svg>')
ON CONFLICT (employee_code) DO UPDATE SET
    name = EXCLUDED.name,
    dept = EXCLUDED.dept,
    designation = EXCLUDED.designation,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    cabin = EXCLUDED.cabin,
    status = EXCLUDED.status,
    campus_status = EXCLUDED.campus_status,
    photo = EXCLUDED.photo;

-- Seed Blacklist
INSERT INTO blacklist (name, phone, id_type, id_number, reason, date_added) VALUES
('John Doe', '+91 99999 88888', 'Aadhaar', '1111-2222-3333', 'Hostile behavior and unauthorized photography inside Cabin IT-A.', '2026-06-15'),
('Mary Smith', '+91 88888 77777', 'PAN Card', 'ABCDE1234Z', 'Refused gate identity verification checks.', '2026-06-20');

-- Seed Visitors
INSERT INTO visitors (visitor_code, name, phone, email, address, company, purpose, vehicle, num_visitors, id_type, id_number, host_id, host_name, host_dept, visit_date, check_in, check_out, expected_exit, status, photo) VALUES
('V20260012', 'Rahul Sharma', '+91 99887 76655', 'rahul.sharma@example.com', 'Bangalore, India', 'ABC Industries', 'Meeting', 'MH-12-AB-3456', 1, 'Aadhaar', '1234-5678-9012', 'EMP101', 'Manoj Kumar', 'IT', '2026-07-07', '2026-07-07 10:30:00+05:30', '2026-07-07 18:00:00+05:30', '2026-07-07 18:00:00+05:30', 'Checked Out', ''),
('V20260013', 'Devon Carter', '+91 98989 89898', 'dcarter@sysfix.com', 'Mumbai, India', 'SysFix Solutions', 'Maintenance', 'KA-51-MM-9999', 2, 'Driver License', 'DL-MH1220199923847', 'EMP103', 'Michael Chang', 'Engineering', '2026-07-08', '2026-07-08 09:40:00+05:30', NULL, '2026-07-08 18:00:00+05:30', 'Checked In', ''),
('V20260014', 'Alice Vance', '+91 97766 55443', 'alice@vance.io', 'Chennai, India', 'Vance Tech', 'Interview', '', 1, 'PAN Card', 'ABCDE4321Z', 'EMP104', 'David Miller', 'HR & Recruitment', '2026-07-08', NULL, NULL, '2026-07-08 15:30:00+05:30', 'Pending', '')
ON CONFLICT (visitor_code) DO NOTHING;

-- Seed Purchase Manuals
INSERT INTO purchase_manuals (manual_code, dept, agent_name, agent_auth_detail, company_name, company_address, contact_number, contract_type, contract_no, contract_date, no_contract, nature_work, required_output, experience, competency_assess, eligibility, risks_involved, quality_req, duration, special_tool_needed, special_equip, equip_available, skill_training_req, special_skills, spares_provider, inspect_req, procedure_avail, inspect_rep_req, est_defective_prob, correction_plan_prepared, spare_parts_req, env_haz, env_waste, env_emissions, env_legal, env_ocps_followed, env_controls, num_workers, saf_insurance, saf_drawing, saf_briefing, saf_emergency, saf_height, saf_hot, saf_electrical, saf_confined, saf_isolated, saf_risk, saf_permit_provided, saf_conduct_briefed, saf_ppe, status, date_created, date_submitted, date_approved) VALUES
('PM1001', 'IT', 'Rajesh Kumar', 'Aadhaar: 1234-5678-9012', 'Infosys Ltd', 'Chennai, India', '+91 98765 43210', 'One-Time', 'SC-2026-IT01', '2026-07-01', 'No', 'Server maintenance and cabling', 'IT rack clean room setup completed', 5, 'Expert in Fiber Cabling', 'Yes', 'Minor electric shock risk, cable clutter tripping hazard.', 'Cat6 standards compliant cabling setup.', '3 Days', 'Yes', 'Laser cabling splicer', 'Handheld tools', 'Yes', 'Fibre splicing certification', 'Infosys Ltd', 'Yes', 'Yes', 'Yes', 'No', 'Yes', 'No', 'No', 'Yes', 'No', 'Yes', 'Yes', 'Dust extraction during drywall drilling', 2, 'Yes', 'Yes', 'Yes', 'Yes', 'No', 'No', 'Yes', 'No', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Approved', '2026-07-08', '2026-07-08', '2026-07-08'),
('PM1002', 'Operations', 'Sanjay Singh', 'PAN: AB1234CD', 'Thermal Solutions', 'Delhi, India', '+91 99880 11223', 'Annual', 'SC-2026-OP02', '2026-06-15', 'No', 'HVAC boiler pipeline repairs', 'Leak-free boiler connection', 8, 'Grade A pressure pipe welder', 'Yes', 'High temperature burns, confined space asphyxiation risk.', 'Leak testing at 5 bar pressure.', '2 Weeks', 'Yes', 'Argon welding machine, gas detectors', 'Welding torch', 'Yes', 'Welder license class-1', 'Client', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Welding fume extraction setup', 4, 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'No', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Submitted', '2026-07-09', '2026-07-09', NULL)
ON CONFLICT (manual_code) DO NOTHING;

-- Seed Work Permits
INSERT INTO work_permits (permit_code, purchase_manual_id, company_entity, location_site, conducted_on, work_activity, high_risk_work, start_time, end_time, rep_name, start_date, end_date, description, chk_standards, dec_risk_reviewed, dec_controls_adequate, dec_competent_coord, dec_implement_controls, dec_workers_informed, dec_monitor_hazards, dec_req_approval, dec_supervisor_sig, eng_reviewed_docs, eng_monitor_methods, eng_informed_persons, eng_contractor_sig, auth_reviewed_docs, auth_registered, auth_person_sig, status, safety_officer_approved, final_authorized) VALUES
('WP20260001', 'PM1001', 'Infosys Ltd', 'Server Room B, 2nd Floor', '2026-07-09', 'Running Cat6 Ethernet cables and installing racks.', 'General', '09:00:00', '18:00:00', 'Rajesh Kumar', '2026-07-09', '2026-07-11', 'Executing fiber layout for Server Cabin B.', TRUE, 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Karthik Subramanian', 'Yes', 'Yes', 'Yes', 'Rajesh Kumar', 'Yes', 'Yes', 'Arun Moorthy (Safety Head)', 'Approved', TRUE, TRUE)
ON CONFLICT (permit_code) DO NOTHING;
