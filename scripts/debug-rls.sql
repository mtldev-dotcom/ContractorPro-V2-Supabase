-- =====================================================
-- RLS Debug Script for ContractorPro-V2
-- Use this to troubleshoot RLS-related data access issues
-- =====================================================

-- Check current user authentication
SELECT 'Current user info:' as debug_info;
SELECT 
  auth.uid() as current_user_id,
  auth.jwt() ->> 'email' as user_email,
  auth.jwt() ->> 'role' as user_role;

-- Check user's company associations
SELECT 'User company associations:' as debug_info;
SELECT 
  u.email,
  c.name as company_name,
  uc.role as user_role_in_company
FROM users u
JOIN user_companies uc ON u.id = uc.user_id
JOIN companies c ON uc.company_id = c.id
WHERE u.id = (SELECT auth.uid());

-- Check what projects are accessible
SELECT 'Accessible projects:' as debug_info;
SELECT 
  p.id,
  p.name,
  p.company_id,
  c.name as company_name,
  p.client_id,
  cl.first_name as client_first_name,
  cl.last_name as client_last_name
FROM projects_new p
LEFT JOIN companies c ON p.company_id = c.id
LEFT JOIN clients cl ON p.client_id = cl.id
LIMIT 10;

-- Check what clients are accessible
SELECT 'Accessible clients:' as debug_info;
SELECT 
  cl.id,
  cl.first_name,
  cl.last_name,
  cl.company_name,
  cl.company_id,
  c.name as company_name
FROM clients cl
LEFT JOIN companies c ON cl.company_id = c.id
LIMIT 10;

-- Check what employees are accessible
SELECT 'Accessible employees:' as debug_info;
SELECT 
  e.id,
  e.user_id,
  u.first_name,
  u.last_name,
  u.email,
  e.company_id,
  c.name as company_name
FROM employees e
LEFT JOIN users u ON e.user_id = u.id
LEFT JOIN companies c ON e.company_id = c.id
LIMIT 10;

-- Check RLS policies on projects_new table
SELECT 'RLS policies on projects_new:' as debug_info;
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'projects_new'
ORDER BY policyname;

-- Check if there are any orphaned records
SELECT 'Orphaned records check:' as debug_info;
SELECT 
  'Projects without company' as issue,
  COUNT(*) as count
FROM projects_new 
WHERE company_id IS NULL
UNION ALL
SELECT 
  'Clients without company',
  COUNT(*) 
FROM clients 
WHERE company_id IS NULL
UNION ALL
SELECT 
  'Employees without company',
  COUNT(*) 
FROM employees 
WHERE company_id IS NULL;

-- Test helper functions
SELECT 'Helper function tests:' as debug_info;
SELECT 
  get_user_company_ids() as user_company_ids,
  is_admin_or_manager() as is_admin_or_manager,
  is_admin() as is_admin,
  get_user_role() as user_role,
  get_user_employee_id() as user_employee_id;

-- Check total counts vs accessible counts
SELECT 'Data access summary:' as debug_info;
SELECT 
  'Total projects' as metric,
  (SELECT COUNT(*) FROM projects_new) as total_count,
  (SELECT COUNT(*) FROM projects_new WHERE company_id = ANY(get_user_company_ids())) as accessible_count
UNION ALL
SELECT 
  'Total clients',
  (SELECT COUNT(*) FROM clients),
  (SELECT COUNT(*) FROM clients WHERE company_id = ANY(get_user_company_ids()))
UNION ALL
SELECT 
  'Total employees',
  (SELECT COUNT(*) FROM employees),
  (SELECT COUNT(*) FROM employees WHERE company_id = ANY(get_user_company_ids()));

-- Check for any RLS policy conflicts
SELECT 'Potential RLS issues:' as debug_info;
SELECT 
  tablename,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
HAVING COUNT(*) > 5
ORDER BY policy_count DESC; 