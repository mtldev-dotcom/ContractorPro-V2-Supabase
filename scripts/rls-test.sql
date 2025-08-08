-- =====================================================
-- RLS Test Script for ContractorPro-V2
-- Use this to verify RLS policies are working correctly
-- =====================================================

-- Test Helper Functions
-- These queries should work for any authenticated user

-- Test 1: Check if helper functions work
SELECT 'Testing helper functions...' as test_step;

-- Test get_user_company_ids function
SELECT get_user_company_ids() as user_company_ids;

-- Test role checking functions
SELECT 
  is_admin() as is_admin,
  is_admin_or_manager() as is_admin_or_manager,
  get_user_role() as user_role;

-- Test 2: Verify RLS is enabled on all tables
SELECT 'Verifying RLS is enabled...' as test_step;

SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename NOT LIKE 'pg_%'
  AND tablename NOT LIKE 'sql_%'
ORDER BY tablename;

-- Test 3: Check policies exist
SELECT 'Checking RLS policies...' as test_step;

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Test 4: Test data access (run these as different users)
SELECT 'Testing data access...' as test_step;

-- Test company access
SELECT 'Companies accessible:' as test_info;
SELECT COUNT(*) as company_count FROM companies;

-- Test user access
SELECT 'Users accessible:' as test_info;
SELECT COUNT(*) as user_count FROM users;

-- Test client access
SELECT 'Clients accessible:' as test_info;
SELECT COUNT(*) as client_count FROM clients;

-- Test project access
SELECT 'Projects accessible:' as test_info;
SELECT COUNT(*) as project_count FROM projects_new;

-- Test task access
SELECT 'Tasks accessible:' as test_info;
SELECT COUNT(*) as task_count FROM tasks;

-- Test employee access
SELECT 'Employees accessible:' as test_info;
SELECT COUNT(*) as employee_count FROM employees;

-- Test material access
SELECT 'Materials accessible:' as test_info;
SELECT COUNT(*) as material_count FROM materials;

-- Test equipment access
SELECT 'Equipment accessible:' as test_info;
SELECT COUNT(*) as equipment_count FROM equipment;

-- Test time tracking access
SELECT 'Time tracking entries accessible:' as test_info;
SELECT COUNT(*) as time_tracking_count FROM time_tracking;

-- Test payroll access (should be restricted)
SELECT 'Payroll entries accessible:' as test_info;
SELECT COUNT(*) as payroll_count FROM payroll;

-- =====================================================
-- Role-based Access Tests
-- =====================================================

-- Test 5: Verify role-based restrictions
SELECT 'Testing role-based access...' as test_step;

-- Check if user can see their own profile
SELECT 'Own profile accessible:' as test_info;
SELECT COUNT(*) as own_profile_count 
FROM users 
WHERE id = (SELECT auth.uid());

-- Check if user can see their company associations
SELECT 'Company associations accessible:' as test_info;
SELECT COUNT(*) as company_associations_count 
FROM user_companies 
WHERE user_id = (SELECT auth.uid());

-- Check if user can see their own employee record
SELECT 'Own employee record accessible:' as test_info;
SELECT COUNT(*) as own_employee_count 
FROM employees 
WHERE user_id = (SELECT auth.uid());

-- Check if user can see their own time entries
SELECT 'Own time entries accessible:' as test_info;
SELECT COUNT(*) as own_time_entries_count 
FROM time_tracking 
WHERE employee_id IN (
  SELECT id FROM employees 
  WHERE user_id = (SELECT auth.uid())
);

-- Check if user can see their own payroll (should be 0 for non-admins)
SELECT 'Own payroll accessible:' as test_info;
SELECT COUNT(*) as own_payroll_count 
FROM payroll 
WHERE employee_id IN (
  SELECT id FROM employees 
  WHERE user_id = (SELECT auth.uid())
);

-- =====================================================
-- Company Isolation Tests
-- =====================================================

-- Test 6: Verify company isolation
SELECT 'Testing company isolation...' as test_step;

-- Get user's companies
SELECT 'User companies:' as test_info;
SELECT c.name, c.id 
FROM companies c
WHERE c.id = ANY(get_user_company_ids());

-- Check if user can only see clients from their companies
SELECT 'Clients from user companies:' as test_info;
SELECT c.company_name, cl.company_id
FROM clients cl
JOIN companies c ON cl.company_id = c.id
WHERE cl.company_id = ANY(get_user_company_ids())
LIMIT 5;

-- Check if user can only see projects from their companies
SELECT 'Projects from user companies:' as test_info;
SELECT p.name, p.company_id
FROM projects_new p
WHERE p.company_id = ANY(get_user_company_ids())
LIMIT 5;

-- =====================================================
-- Performance Tests
-- =====================================================

-- Test 7: Check if indexes exist for RLS performance
SELECT 'Checking RLS performance indexes...' as test_step;

SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- =====================================================
-- Security Verification
-- =====================================================

-- Test 8: Verify no data leakage between companies
SELECT 'Security verification...' as test_step;

-- This should only return companies the user belongs to
SELECT 'Total companies in database vs accessible:' as test_info;
SELECT 
  (SELECT COUNT(*) FROM companies) as total_companies,
  (SELECT COUNT(*) FROM companies WHERE id = ANY(get_user_company_ids())) as accessible_companies;

-- This should only return users from the same companies
SELECT 'Total users in database vs accessible:' as test_info;
SELECT 
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM users WHERE id = (SELECT auth.uid())) as accessible_users;

-- =====================================================
-- Test Summary
-- =====================================================

SELECT 'RLS Test Summary' as summary;

SELECT 
  'Companies accessible: ' || (SELECT COUNT(*) FROM companies WHERE id = ANY(get_user_company_ids())) as result
UNION ALL
SELECT 
  'Clients accessible: ' || (SELECT COUNT(*) FROM clients WHERE company_id = ANY(get_user_company_ids())) as result
UNION ALL
SELECT 
  'Projects accessible: ' || (SELECT COUNT(*) FROM projects_new WHERE company_id = ANY(get_user_company_ids())) as result
UNION ALL
SELECT 
  'Tasks accessible: ' || (SELECT COUNT(*) FROM tasks WHERE project_id IN (SELECT id FROM projects_new WHERE company_id = ANY(get_user_company_ids())))) as result
UNION ALL
SELECT 
  'Employees accessible: ' || (SELECT COUNT(*) FROM employees WHERE company_id = ANY(get_user_company_ids())) as result
UNION ALL
SELECT 
  'Materials accessible: ' || (SELECT COUNT(*) FROM materials WHERE company_id = ANY(get_user_company_ids())) as result
UNION ALL
SELECT 
  'Equipment accessible: ' || (SELECT COUNT(*) FROM equipment WHERE company_id = ANY(get_user_company_ids())) as result
UNION ALL
SELECT 
  'Payroll accessible: ' || (SELECT COUNT(*) FROM payroll WHERE employee_id IN (SELECT id FROM employees WHERE company_id = ANY(get_user_company_ids())))) as result; 