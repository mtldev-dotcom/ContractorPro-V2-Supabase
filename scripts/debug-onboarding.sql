-- =====================================================
-- Onboarding Debug Script for ContractorPro-V2
-- Use this to troubleshoot onboarding-related issues
-- =====================================================

-- Check current authentication status
SELECT 'Authentication Status:' as debug_info;
SELECT 
  auth.uid() as current_user_id,
  auth.jwt() ->> 'email' as user_email,
  auth.jwt() ->> 'role' as user_role,
  auth.jwt() ->> 'aud' as audience;

-- Check if users table exists and has data
SELECT 'Users table check:' as debug_info;
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_users
FROM users;

-- Check for specific user (replace with actual user ID)
-- SELECT 'Specific user check:' as debug_info;
-- SELECT * FROM users WHERE id = 'your-user-id-here';

-- Check user_companies table
SELECT 'User companies table check:' as debug_info;
SELECT 
  COUNT(*) as total_associations,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT company_id) as unique_companies
FROM user_companies;

-- Check companies table
SELECT 'Companies table check:' as debug_info;
SELECT 
  COUNT(*) as total_companies,
  COUNT(CASE WHEN name IS NOT NULL THEN 1 END) as companies_with_names
FROM companies;

-- Check RLS policies on users table
SELECT 'RLS policies on users table:' as debug_info;
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

-- Check RLS policies on user_companies table
SELECT 'RLS policies on user_companies table:' as debug_info;
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_companies'
ORDER BY policyname;

-- Check RLS policies on companies table
SELECT 'RLS policies on companies table:' as debug_info;
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'companies'
ORDER BY policyname;

-- Test helper functions
SELECT 'Helper function tests:' as debug_info;
SELECT 
  get_user_company_ids() as user_company_ids,
  is_admin_or_manager() as is_admin_or_manager,
  is_admin() as is_admin,
  get_user_role() as user_role,
  get_user_employee_id() as user_employee_id;

-- Check if user can access their own data
SELECT 'User data access test:' as debug_info;
SELECT 
  'Can access own user record' as test,
  COUNT(*) as accessible_records
FROM users 
WHERE id = (SELECT auth.uid())
UNION ALL
SELECT 
  'Can access own company associations',
  COUNT(*) 
FROM user_companies 
WHERE user_id = (SELECT auth.uid())
UNION ALL
SELECT 
  'Can access companies',
  COUNT(*) 
FROM companies 
WHERE id = ANY(get_user_company_ids());

-- Check for orphaned records
SELECT 'Orphaned records check:' as debug_info;
SELECT 
  'Users without company associations' as issue,
  COUNT(*) as count
FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_companies uc WHERE uc.user_id = u.id
)
UNION ALL
SELECT 
  'Company associations without users',
  COUNT(*) 
FROM user_companies uc
WHERE NOT EXISTS (
  SELECT 1 FROM users u WHERE u.id = uc.user_id
)
UNION ALL
SELECT 
  'Company associations without companies',
  COUNT(*) 
FROM user_companies uc
WHERE NOT EXISTS (
  SELECT 1 FROM companies c WHERE c.id = uc.company_id
);

-- Check table structure
SELECT 'Table structure check:' as debug_info;
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'companies', 'user_companies')
ORDER BY table_name, ordinal_position;

-- Check for any recent errors in the logs (if available)
SELECT 'Recent database activity:' as debug_info;
SELECT 
  schemaname,
  tablename,
  operation,
  COUNT(*) as operation_count
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
  AND tablename IN ('users', 'companies', 'user_companies')
GROUP BY schemaname, tablename, operation
ORDER BY operation_count DESC; 