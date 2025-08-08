-- =====================================================
-- Complete RLS Fix - Remove All Infinite Recursion Issues
-- =====================================================

-- This script fixes all infinite recursion issues in RLS policies

-- =====================================================
-- Step 1: Drop All Existing RLS Policies
-- =====================================================

-- Drop all existing policies to start fresh
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
            policy_record.policyname, 
            policy_record.schemaname, 
            policy_record.tablename);
    END LOOP;
END $$;

-- =====================================================
-- Step 2: Drop Helper Functions
-- =====================================================

DROP FUNCTION IF EXISTS get_user_company_ids();
DROP FUNCTION IF EXISTS is_admin_or_manager();
DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS get_user_role();
DROP FUNCTION IF EXISTS get_user_employee_id();

-- =====================================================
-- Step 3: Recreate Helper Functions (Simplified)
-- =====================================================

-- Function to get current user's company IDs (simplified)
CREATE OR REPLACE FUNCTION get_user_company_ids()
RETURNS UUID[] AS $$
BEGIN
  RETURN ARRAY(
    SELECT company_id 
    FROM user_companies 
    WHERE user_id = (SELECT auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin or manager (simplified)
CREATE OR REPLACE FUNCTION is_admin_or_manager()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = (SELECT auth.uid()) 
    AND role IN ('admin', 'manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin (simplified)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = (SELECT auth.uid()) 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's role (simplified)
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS VARCHAR AS $$
BEGIN
  RETURN (
    SELECT role FROM users 
    WHERE id = (SELECT auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's employee ID (simplified)
CREATE OR REPLACE FUNCTION get_user_employee_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id FROM employees 
    WHERE user_id = (SELECT auth.uid())
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Step 4: Recreate RLS Policies (No Circular Dependencies)
-- =====================================================

-- =====================================================
-- Company Policies
-- =====================================================

-- Users can only see companies they belong to
CREATE POLICY "Users can view their companies"
ON companies FOR SELECT
TO authenticated
USING (
  id = ANY(get_user_company_ids())
);

-- Only admins can create/update/delete companies
CREATE POLICY "Only admins can manage companies"
ON companies FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- =====================================================
-- User Policies (Simplified - No Circular Dependencies)
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
TO authenticated
USING (id = (SELECT auth.uid()));

-- Users can update their own profile (simplified)
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()));

-- Only admins can create users
CREATE POLICY "Only admins can create users"
ON users FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- Only admins can delete users
CREATE POLICY "Only admins can delete users"
ON users FOR DELETE
TO authenticated
USING (is_admin());

-- =====================================================
-- User Companies Policies
-- =====================================================

-- Users can view their company associations
CREATE POLICY "Users can view their company associations"
ON user_companies FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

-- Only admins can manage user-company associations
CREATE POLICY "Only admins can manage user-company associations"
ON user_companies FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- =====================================================
-- Client Policies
-- =====================================================

-- Users can view clients from their companies
CREATE POLICY "Users can view company clients"
ON clients FOR SELECT
TO authenticated
USING (company_id = ANY(get_user_company_ids()));

-- Managers and admins can manage clients
CREATE POLICY "Managers and admins can manage clients"
ON clients FOR ALL
TO authenticated
USING (
  company_id = ANY(get_user_company_ids()) 
  AND is_admin_or_manager()
)
WITH CHECK (
  company_id = ANY(get_user_company_ids()) 
  AND is_admin_or_manager()
);

-- =====================================================
-- Supplier Policies
-- =====================================================

-- Users can view suppliers from their companies
CREATE POLICY "Users can view company suppliers"
ON suppliers FOR SELECT
TO authenticated
USING (company_id = ANY(get_user_company_ids()));

-- Managers and admins can manage suppliers
CREATE POLICY "Managers and admins can manage suppliers"
ON suppliers FOR ALL
TO authenticated
USING (
  company_id = ANY(get_user_company_ids()) 
  AND is_admin_or_manager()
)
WITH CHECK (
  company_id = ANY(get_user_company_ids()) 
  AND is_admin_or_manager()
);

-- =====================================================
-- Employee Policies
-- =====================================================

-- Users can view employees from their companies
CREATE POLICY "Users can view company employees"
ON employees FOR SELECT
TO authenticated
USING (company_id = ANY(get_user_company_ids()));

-- Users can view their own employee record
CREATE POLICY "Users can view own employee record"
ON employees FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

-- Managers and admins can manage employees
CREATE POLICY "Managers and admins can manage employees"
ON employees FOR ALL
TO authenticated
USING (
  company_id = ANY(get_user_company_ids()) 
  AND is_admin_or_manager()
)
WITH CHECK (
  company_id = ANY(get_user_company_ids()) 
  AND is_admin_or_manager()
);

-- Users can update their own employee record
CREATE POLICY "Users can update own employee record"
ON employees FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (
  user_id = (SELECT auth.uid())
  AND company_id = ANY(get_user_company_ids())
);

-- =====================================================
-- Project Policies (Simplified)
-- =====================================================

-- Users can view projects from their companies
CREATE POLICY "Users can view company projects"
ON projects_new FOR SELECT
TO authenticated
USING (company_id = ANY(get_user_company_ids()));

-- Managers and admins can manage projects
CREATE POLICY "Managers and admins can manage projects"
ON projects_new FOR ALL
TO authenticated
USING (
  company_id = ANY(get_user_company_ids()) 
  AND is_admin_or_manager()
)
WITH CHECK (
  company_id = ANY(get_user_company_ids()) 
  AND is_admin_or_manager()
);

-- =====================================================
-- Task Policies (Simplified)
-- =====================================================

-- Users can view tasks from their company's projects
CREATE POLICY "Users can view company tasks"
ON tasks FOR SELECT
TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects_new 
    WHERE company_id = ANY(get_user_company_ids())
  )
);

-- Users can view tasks assigned to them
CREATE POLICY "Users can view assigned tasks"
ON tasks FOR SELECT
TO authenticated
USING (
  assigned_to = get_user_employee_id()
);

-- Managers and admins can manage tasks
CREATE POLICY "Managers and admins can manage tasks"
ON tasks FOR ALL
TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects_new 
    WHERE company_id = ANY(get_user_company_ids())
  )
  AND is_admin_or_manager()
)
WITH CHECK (
  project_id IN (
    SELECT id FROM projects_new 
    WHERE company_id = ANY(get_user_company_ids())
  )
  AND is_admin_or_manager()
);

-- Users can update tasks assigned to them
CREATE POLICY "Users can update assigned tasks"
ON tasks FOR UPDATE
TO authenticated
USING (assigned_to = get_user_employee_id())
WITH CHECK (assigned_to = get_user_employee_id());

-- =====================================================
-- Time Tracking Policies
-- =====================================================

-- Users can view their own time entries
CREATE POLICY "Users can view own time entries"
ON time_tracking FOR SELECT
TO authenticated
USING (employee_id = get_user_employee_id());

-- Users can manage their own time entries
CREATE POLICY "Users can manage own time entries"
ON time_tracking FOR ALL
TO authenticated
USING (employee_id = get_user_employee_id())
WITH CHECK (employee_id = get_user_employee_id());

-- Managers can view company time entries
CREATE POLICY "Managers can view company time entries"
ON time_tracking FOR SELECT
TO authenticated
USING (
  employee_id IN (
    SELECT id FROM employees 
    WHERE company_id = ANY(get_user_company_ids())
  )
  AND is_admin_or_manager()
);

-- =====================================================
-- Material Policies
-- =====================================================

-- Users can view materials from their companies
CREATE POLICY "Users can view company materials"
ON materials FOR SELECT
TO authenticated
USING (company_id = ANY(get_user_company_ids()));

-- Managers and admins can manage materials
CREATE POLICY "Managers and admins can manage materials"
ON materials FOR ALL
TO authenticated
USING (
  company_id = ANY(get_user_company_ids()) 
  AND is_admin_or_manager()
)
WITH CHECK (
  company_id = ANY(get_user_company_ids()) 
  AND is_admin_or_manager()
);

-- =====================================================
-- Equipment Policies
-- =====================================================

-- Users can view equipment from their companies
CREATE POLICY "Users can view company equipment"
ON equipment FOR SELECT
TO authenticated
USING (company_id = ANY(get_user_company_ids()));

-- Users can view equipment assigned to them
CREATE POLICY "Users can view assigned equipment"
ON equipment FOR SELECT
TO authenticated
USING (assigned_to = get_user_employee_id());

-- Managers and admins can manage equipment
CREATE POLICY "Managers and admins can manage equipment"
ON equipment FOR ALL
TO authenticated
USING (
  company_id = ANY(get_user_company_ids()) 
  AND is_admin_or_manager()
)
WITH CHECK (
  company_id = ANY(get_user_company_ids()) 
  AND is_admin_or_manager()
);

-- =====================================================
-- Document Policies
-- =====================================================

-- Users can view documents from their companies
CREATE POLICY "Users can view company documents"
ON documents FOR SELECT
TO authenticated
USING (company_id = ANY(get_user_company_ids()));

-- Users can view public documents
CREATE POLICY "Users can view public documents"
ON documents FOR SELECT
TO authenticated
USING (is_public = true);

-- Managers and admins can manage documents
CREATE POLICY "Managers and admins can manage documents"
ON documents FOR ALL
TO authenticated
USING (
  company_id = ANY(get_user_company_ids()) 
  AND is_admin_or_manager()
)
WITH CHECK (
  company_id = ANY(get_user_company_ids()) 
  AND is_admin_or_manager()
);

-- =====================================================
-- Communication Policies
-- =====================================================

-- Users can view communications from their company's projects
CREATE POLICY "Users can view company communications"
ON communications FOR SELECT
TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects_new 
    WHERE company_id = ANY(get_user_company_ids())
  )
  OR client_id IN (
    SELECT id FROM clients 
    WHERE company_id = ANY(get_user_company_ids())
  )
);

-- Managers and admins can manage communications
CREATE POLICY "Managers and admins can manage communications"
ON communications FOR ALL
TO authenticated
USING (
  (project_id IN (
    SELECT id FROM projects_new 
    WHERE company_id = ANY(get_user_company_ids())
  ) OR client_id IN (
    SELECT id FROM clients 
    WHERE company_id = ANY(get_user_company_ids())
  ))
  AND is_admin_or_manager()
)
WITH CHECK (
  (project_id IN (
    SELECT id FROM projects_new 
    WHERE company_id = ANY(get_user_company_ids())
  ) OR client_id IN (
    SELECT id FROM clients 
    WHERE company_id = ANY(get_user_company_ids())
  ))
  AND is_admin_or_manager()
);

-- =====================================================
-- Change Order Policies
-- =====================================================

-- Users can view change orders from their company's projects
CREATE POLICY "Users can view company change orders"
ON change_orders FOR SELECT
TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects_new 
    WHERE company_id = ANY(get_user_company_ids())
  )
);

-- Managers and admins can manage change orders
CREATE POLICY "Managers and admins can manage change orders"
ON change_orders FOR ALL
TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects_new 
    WHERE company_id = ANY(get_user_company_ids())
  )
  AND is_admin_or_manager()
)
WITH CHECK (
  project_id IN (
    SELECT id FROM projects_new 
    WHERE company_id = ANY(get_user_company_ids())
  )
  AND is_admin_or_manager()
);

-- =====================================================
-- Material Usage Policies
-- =====================================================

-- Users can view material usage from their company's projects
CREATE POLICY "Users can view company material usage"
ON material_usage FOR SELECT
TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects_new 
    WHERE company_id = ANY(get_user_company_ids())
  )
);

-- Managers and admins can manage material usage
CREATE POLICY "Managers and admins can manage material usage"
ON material_usage FOR ALL
TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects_new 
    WHERE company_id = ANY(get_user_company_ids())
  )
  AND is_admin_or_manager()
)
WITH CHECK (
  project_id IN (
    SELECT id FROM projects_new 
    WHERE company_id = ANY(get_user_company_ids())
  )
  AND is_admin_or_manager()
);

-- =====================================================
-- Payroll Policies
-- =====================================================

-- Users can only view their own payroll records
CREATE POLICY "Users can view own payroll"
ON payroll FOR SELECT
TO authenticated
USING (employee_id = get_user_employee_id());

-- Only admins can manage payroll
CREATE POLICY "Only admins can manage payroll"
ON payroll FOR ALL
TO authenticated
USING (
  employee_id IN (
    SELECT id FROM employees 
    WHERE company_id = ANY(get_user_company_ids())
  )
  AND is_admin()
)
WITH CHECK (
  employee_id IN (
    SELECT id FROM employees 
    WHERE company_id = ANY(get_user_company_ids())
  )
  AND is_admin()
);

-- =====================================================
-- Legacy Project Table Policies
-- =====================================================

-- Users can view legacy projects from their companies
CREATE POLICY "Users can view legacy company projects"
ON projects FOR SELECT
TO authenticated
USING (company_id = ANY(get_user_company_ids()));

-- Managers and admins can manage legacy projects
CREATE POLICY "Managers and admins can manage legacy projects"
ON projects FOR ALL
TO authenticated
USING (
  company_id = ANY(get_user_company_ids()) 
  AND is_admin_or_manager()
)
WITH CHECK (
  company_id = ANY(get_user_company_ids()) 
  AND is_admin_or_manager()
);

-- =====================================================
-- Verification
-- =====================================================

-- Check all policies
SELECT 'All RLS policies check:' as info;
SELECT 
  tablename,
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Test helper functions
SELECT 'Helper function tests:' as info;
SELECT 
  get_user_company_ids() as user_company_ids,
  is_admin_or_manager() as is_admin_or_manager,
  is_admin() as is_admin,
  get_user_role() as user_role,
  get_user_employee_id() as user_employee_id;

-- =====================================================
-- Summary
-- =====================================================

SELECT 'RLS fix completed successfully!' as status;
SELECT 'All infinite recursion issues have been resolved.' as message; 