-- =====================================================
-- Test Auth Trigger for ContractorPro-V2
-- Use this to test and verify the auth trigger functionality
-- =====================================================

-- Check current state before testing
SELECT 'Current state check:' as test_step;
SELECT 
  'Auth users count' as metric,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Public users count',
  COUNT(*) as count
FROM public.users;

-- Check for users that exist in auth but not in public
SELECT 'Users missing from public.users:' as test_step;
SELECT 
  au.id,
  au.email,
  au.created_at as auth_created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ORDER BY au.created_at DESC;

-- Check for users that exist in public but not in auth
SELECT 'Users missing from auth.users:' as test_step;
SELECT 
  pu.id,
  pu.email,
  pu.created_at as public_created_at
FROM public.users pu
LEFT JOIN auth.users au ON pu.id = au.id
WHERE au.id IS NULL
ORDER BY pu.created_at DESC;

-- Test the sync function
SELECT 'Testing sync function:' as test_step;
SELECT public.sync_existing_users() as users_synced;

-- Check state after sync
SELECT 'State after sync:' as test_step;
SELECT 
  'Auth users count' as metric,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Public users count',
  COUNT(*) as count
FROM public.users;

-- Verify trigger is active
SELECT 'Trigger verification:' as test_step;
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
  AND event_object_table = 'users'
  AND event_object_schema = 'auth'
ORDER BY trigger_name;

-- Test creating a new user (simulate signup)
SELECT 'Testing new user creation:' as test_step;

-- Create a test user in auth.users (this should trigger the insert)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'test-trigger@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"first_name": "Test", "last_name": "User"}'::jsonb
);

-- Check if the trigger created the corresponding public.users record
SELECT 'Verifying trigger created user record:' as test_step;
SELECT 
  pu.id,
  pu.email,
  pu.first_name,
  pu.last_name,
  pu.role,
  pu.is_active,
  pu.created_at
FROM public.users pu
WHERE pu.email = 'test-trigger@example.com';

-- Test updating a user (simulate profile update)
SELECT 'Testing user update:' as test_step;

-- Update the test user's metadata
UPDATE auth.users 
SET 
  raw_user_meta_data = '{"first_name": "Updated", "last_name": "User"}'::jsonb,
  updated_at = NOW()
WHERE email = 'test-trigger@example.com';

-- Check if the trigger updated the corresponding public.users record
SELECT 'Verifying trigger updated user record:' as test_step;
SELECT 
  pu.id,
  pu.email,
  pu.first_name,
  pu.last_name,
  pu.role,
  pu.is_active,
  pu.updated_at
FROM public.users pu
WHERE pu.email = 'test-trigger@example.com';

-- Clean up test data
SELECT 'Cleaning up test data:' as test_step;
DELETE FROM public.users WHERE email = 'test-trigger@example.com';
DELETE FROM auth.users WHERE email = 'test-trigger@example.com';

-- Final verification
SELECT 'Final verification:' as test_step;
SELECT 
  'Auth users count' as metric,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Public users count',
  COUNT(*) as count
FROM public.users;

-- Check for any orphaned records
SELECT 'Checking for orphaned records:' as test_step;
SELECT 
  'Users in auth but not public' as issue,
  COUNT(*) as count
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
UNION ALL
SELECT 
  'Users in public but not auth',
  COUNT(*) as count
FROM public.users pu
LEFT JOIN auth.users au ON pu.id = au.id
WHERE au.id IS NULL;

-- Show recent user activity
SELECT 'Recent user activity:' as test_step;
SELECT 
  'Recent auth users' as source,
  email,
  created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5
UNION ALL
SELECT 
  'Recent public users' as source,
  email,
  created_at
FROM public.users 
ORDER BY created_at DESC 
LIMIT 5; 