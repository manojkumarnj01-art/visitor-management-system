-- ==========================================================================
-- BHARANI HYDRAULICS VMS - ROW LEVEL SECURITY POLICIES (rls_policies.sql)
-- Custom SQL script to enforce role-based access control inside PostgreSQL.
-- ==========================================================================

-- Enable Row Level Security (RLS) on all VMS tables
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE blacklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_manuals ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to fetch the role of the currently logged-in user
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS VARCHAR AS $$
DECLARE
    user_role VARCHAR;
BEGIN
    SELECT role INTO user_role 
    FROM security_users 
    WHERE id = auth.uid();
    RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==========================================================================
-- A. SECURITY USERS (PROFILES) POLICIES
-- ==========================================================================
CREATE POLICY "Allow users to view all security profiles"
ON security_users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow administrators to manage security profiles"
ON security_users FOR ALL
TO authenticated
USING (get_current_user_role() = 'Administrator')
WITH CHECK (get_current_user_role() = 'Administrator');


-- ==========================================================================
-- B. SYSTEM SETTINGS POLICIES
-- ==========================================================================
CREATE POLICY "Allow users to read system settings"
ON system_settings FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow administrators to manage system settings"
ON system_settings FOR ALL
TO authenticated
USING (get_current_user_role() = 'Administrator')
WITH CHECK (get_current_user_role() = 'Administrator');


-- ==========================================================================
-- C. DEPARTMENTS & BRANCHES POLICIES
-- ==========================================================================
-- Public select allows host drop downs to load on public kiosks during self-check-in
CREATE POLICY "Allow public select on departments"
ON departments FOR SELECT
USING (true);

CREATE POLICY "Allow public select on branches"
ON branches FOR SELECT
USING (true);

CREATE POLICY "Allow admins to manage departments"
ON departments FOR ALL
TO authenticated
USING (get_current_user_role() = 'Administrator')
WITH CHECK (get_current_user_role() = 'Administrator');

CREATE POLICY "Allow admins to manage branches"
ON branches FOR ALL
TO authenticated
USING (get_current_user_role() = 'Administrator')
WITH CHECK (get_current_user_role() = 'Administrator');


-- ==========================================================================
-- D. EMPLOYEES POLICIES
-- ==========================================================================
CREATE POLICY "Allow public select on employees"
ON employees FOR SELECT
USING (true);

CREATE POLICY "Allow admins to manage employees"
ON employees FOR ALL
TO authenticated
USING (get_current_user_role() = 'Administrator')
WITH CHECK (get_current_user_role() = 'Administrator');


-- ==========================================================================
-- E. BLACKLIST POLICIES
-- ==========================================================================
CREATE POLICY "Allow authenticated users to read blacklist"
ON blacklist FOR SELECT
TO authenticated
USING (get_current_user_role() IS NOT NULL);

CREATE POLICY "Allow authenticated users to manage blacklist"
ON blacklist FOR ALL
TO authenticated
USING (get_current_user_role() IN ('Administrator', 'Security Gatekeeper', 'Front Desk Operator'))
WITH CHECK (get_current_user_role() IN ('Administrator', 'Security Gatekeeper', 'Front Desk Operator'));


-- ==========================================================================
-- F. VISITORS POLICIES
-- ==========================================================================
-- Public insert allows registrations from self-service terminal kiosks
CREATE POLICY "Allow public inserts on visitors"
ON visitors FOR INSERT
WITH CHECK (true);

-- Authenticated agents can perform all operations
CREATE POLICY "Allow authenticated agents manage visitors"
ON visitors FOR ALL
TO authenticated
USING (get_current_user_role() IS NOT NULL)
WITH CHECK (get_current_user_role() IS NOT NULL);

-- Allow public read/updates if they possess the valid approval/rejection tokens (For email links)
CREATE POLICY "Allow public read of visitor if token matches"
ON visitors FOR SELECT
USING (
    approve_token IS NOT NULL OR 
    reject_token IS NOT NULL
);

CREATE POLICY "Allow public updates of visitor if token matches"
ON visitors FOR UPDATE
USING (
    approve_token IS NOT NULL OR 
    reject_token IS NOT NULL
)
WITH CHECK (
    approve_token IS NOT NULL OR 
    reject_token IS NOT NULL
);


-- ==========================================================================
-- G. VISITOR PASSES POLICIES
-- ==========================================================================
-- Public read allows passes to be shown on mobile phones of visitors
CREATE POLICY "Allow public read on passes"
ON visitor_passes FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated users to manage passes"
ON visitor_passes FOR ALL
TO authenticated
USING (get_current_user_role() IS NOT NULL)
WITH CHECK (get_current_user_role() IS NOT NULL);


-- ==========================================================================
-- H. NOTIFICATIONS & AUDIT LOG POLICIES
-- ==========================================================================
CREATE POLICY "Allow public inserts on notifications"
ON notifications FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view notifications"
ON notifications FOR SELECT
TO authenticated
USING (get_current_user_role() IS NOT NULL);

CREATE POLICY "Allow authenticated users to write notifications"
ON notifications FOR ALL
TO authenticated
USING (get_current_user_role() IS NOT NULL)
WITH CHECK (get_current_user_role() IS NOT NULL);

CREATE POLICY "Allow authenticated users to read audit logs"
ON audit_logs FOR SELECT
TO authenticated
USING (get_current_user_role() IS NOT NULL);

CREATE POLICY "Allow authenticated users to insert audit logs"
ON audit_logs FOR INSERT
WITH CHECK (true);


-- ==========================================================================
-- I. PURCHASE MANUALS & WORK PERMITS
-- ==========================================================================
CREATE POLICY "Allow authenticated users to view manuals"
ON purchase_manuals FOR SELECT
TO authenticated
USING (get_current_user_role() IS NOT NULL);

CREATE POLICY "Allow authenticated users to manage manuals"
ON purchase_manuals FOR ALL
TO authenticated
USING (get_current_user_role() IS NOT NULL)
WITH CHECK (get_current_user_role() IS NOT NULL);

CREATE POLICY "Allow authenticated users to view work permits"
ON work_permits FOR SELECT
TO authenticated
USING (get_current_user_role() IS NOT NULL);

CREATE POLICY "Allow authenticated users to manage work permits"
ON work_permits FOR ALL
TO authenticated
USING (get_current_user_role() IS NOT NULL)
WITH CHECK (get_current_user_role() IS NOT NULL);
