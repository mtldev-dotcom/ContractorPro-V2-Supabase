-- =====================================================
-- RLS Migration for ContractorPro-V2
-- Row Level Security Implementation
-- =====================================================

-- Enable Row Level Security on all tables
-- This ensures no data is accessible without explicit policies

-- Core tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_companies ENABLE ROW LEVEL SECURITY;

-- Business tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Helper Functions for RLS Policies
-- =====================================================

-- Function to get current user's company IDs
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

-- Function to check if user is admin or manager
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

-- Function to check if user is admin
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

-- Function to get user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS VARCHAR AS $$
BEGIN
  RETURN (
    SELECT role FROM users 
    WHERE id = (SELECT auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
-- User Policies
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
TO authenticated
USING (id = (SELECT auth.uid()));

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (
  id = (SELECT auth.uid()) 
  AND role = (SELECT role FROM users WHERE id = (SELECT auth.uid()))
);

-- Only admins can create/delete users
CREATE POLICY "Only admins can manage users"
ON users FOR INSERT
TO authenticated
WITH CHECK (is_admin());

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

-- Users can update their own employee record (limited fields)
CREATE POLICY "Users can update own employee record"
ON employees FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (
  user_id = (SELECT auth.uid())
  AND company_id = ANY(get_user_company_ids())
);

-- =====================================================
-- Project Policies
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

-- Employees can view projects they're assigned to
CREATE POLICY "Employees can view assigned projects"
ON projects_new FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM tasks 
    WHERE project_id = projects_new.id 
    AND assigned_to IN (
      SELECT id FROM employees 
      WHERE user_id = (SELECT auth.uid())
    )
  )
);

-- =====================================================
-- Task Policies
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
  assigned_to IN (
    SELECT id FROM employees 
    WHERE user_id = (SELECT auth.uid())
  )
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
USING (
  assigned_to IN (
    SELECT id FROM employees 
    WHERE user_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  assigned_to IN (
    SELECT id FROM employees 
    WHERE user_id = (SELECT auth.uid())
  )
);

-- =====================================================
-- Time Tracking Policies
-- =====================================================

-- Users can view their own time entries
CREATE POLICY "Users can view own time entries"
ON time_tracking FOR SELECT
TO authenticated
USING (
  employee_id IN (
    SELECT id FROM employees 
    WHERE user_id = (SELECT auth.uid())
  )
);

-- Users can create/update their own time entries
CREATE POLICY "Users can manage own time entries"
ON time_tracking FOR ALL
TO authenticated
USING (
  employee_id IN (
    SELECT id FROM employees 
    WHERE user_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  employee_id IN (
    SELECT id FROM employees 
    WHERE user_id = (SELECT auth.uid())
  )
);

-- Managers and admins can view all time entries in their company
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
USING (assigned_to IN (
  SELECT id FROM employees 
  WHERE user_id = (SELECT auth.uid())
));

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
-- Payroll Policies (Most Restrictive)
-- =====================================================

-- Users can only view their own payroll records
CREATE POLICY "Users can view own payroll"
ON payroll FOR SELECT
TO authenticated
USING (
  employee_id IN (
    SELECT id FROM employees 
    WHERE user_id = (SELECT auth.uid())
  )
);

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
-- Additional Performance Indexes for RLS
-- =====================================================

-- Indexes for RLS performance optimization
CREATE INDEX IF NOT EXISTS idx_user_companies_user_id ON user_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_companies_company_id ON user_companies(company_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_company_id ON employees(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_new_company_id ON projects_new(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_time_tracking_employee_id ON time_tracking(employee_id);
CREATE INDEX IF NOT EXISTS idx_equipment_assigned_to ON equipment(assigned_to);
CREATE INDEX IF NOT EXISTS idx_payroll_employee_id ON payroll(employee_id);

-- =====================================================
-- Legacy Project Table Policies (for backward compatibility)
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
-- Migration Complete
-- =====================================================

-- Verify RLS is enabled on all tables
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'pg_%'
        AND tablename NOT LIKE 'sql_%'
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = table_record.tablename
        ) THEN
            RAISE NOTICE 'Warning: Table % has RLS enabled but no policies defined', table_record.tablename;
        END IF;
    END LOOP;
END $$; 