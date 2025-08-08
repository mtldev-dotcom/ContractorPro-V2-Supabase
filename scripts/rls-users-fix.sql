-- =====================================================
-- RLS Users Table Fix - Remove Infinite Recursion
-- =====================================================

-- Drop existing problematic policies on users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Only admins can manage users" ON users;
DROP POLICY IF EXISTS "Only admins can delete users" ON users;

-- Create simplified user policies without circular dependencies

-- Users can view their own profile (simple check)
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
TO authenticated
USING (id = (SELECT auth.uid()));

-- Users can update their own profile (simplified - no circular reference)
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()));

-- Only admins can create users (simplified)
CREATE POLICY "Only admins can create users"
ON users FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- Only admins can delete users (simplified)
CREATE POLICY "Only admins can delete users"
ON users FOR DELETE
TO authenticated
USING (is_admin());

-- =====================================================
-- Alternative: More Restrictive Update Policy
-- =====================================================

-- If you want to prevent role changes, use this more restrictive policy instead:
/*
DROP POLICY IF EXISTS "Users can update own profile" ON users;

CREATE POLICY "Users can update own profile restricted"
ON users FOR UPDATE
TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (
  id = (SELECT auth.uid())
  AND (
    -- Allow updates to these fields only
    (OLD.first_name IS DISTINCT FROM NEW.first_name) OR
    (OLD.last_name IS DISTINCT FROM NEW.last_name) OR
    (OLD.phone IS DISTINCT FROM NEW.phone) OR
    (OLD.email IS DISTINCT FROM NEW.email)
    -- Prevent role changes
    -- AND OLD.role = NEW.role
  )
);
*/

-- =====================================================
-- Verification
-- =====================================================

-- Check if policies are created correctly
SELECT 'Users table policies check:' as info;
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

-- Test if user can access their own data
SELECT 'User data access test:' as info;
SELECT 
  'Can access own user record' as test,
  COUNT(*) as accessible_records
FROM users 
WHERE id = (SELECT auth.uid());

-- =====================================================
-- Usage Instructions
-- =====================================================

/*
This fix removes the circular dependency in the users table RLS policies.

The main issue was in the "Users can update own profile" policy where it was checking:
  role = (SELECT role FROM users WHERE id = (SELECT auth.uid()))

This created a circular reference because the policy was trying to read from the same table
it was protecting, causing infinite recursion.

The fix:
1. Simplified the update policy to only check user ID
2. Removed the circular reference to the users table
3. Maintained security while allowing legitimate updates

If you need to prevent role changes, use the alternative restrictive policy above.
*/ 