# Auth Trigger Deployment Guide
## ContractorPro-V2 Automatic User Creation

### Overview

This guide explains how to deploy the auth trigger that automatically creates user records in the `public.users` table when new users sign up through Supabase Auth.

### What the Trigger Does

1. **Automatic User Creation**: When a user signs up through Supabase Auth, a corresponding record is automatically created in `public.users`
2. **User Updates**: When a user updates their profile in auth, the changes are synced to `public.users`
3. **Data Synchronization**: Existing users can be synced using the provided function

### Files Created

- `scripts/auth-trigger.sql` - Main trigger implementation
- `scripts/test-auth-trigger.sql` - Testing and verification script

### Deployment Steps

#### Step 1: Apply the Auth Trigger

```sql
-- Run the main trigger script
\i scripts/auth-trigger.sql
```

#### Step 2: Sync Existing Users

If you have existing users who signed up before the trigger was created:

```sql
-- Sync existing users
SELECT public.sync_existing_users();
```

This will return the number of users that were synced.

#### Step 3: Test the Trigger

```sql
-- Run the test script to verify everything works
\i scripts/test-auth-trigger.sql
```

### How It Works

#### Trigger Functions

1. **`handle_new_user()`** - Creates user records on signup
2. **`handle_user_update()`** - Updates user records on profile changes
3. **`sync_existing_users()`** - Syncs existing users

#### Data Mapping

| Auth Field | Public Users Field | Notes |
|------------|-------------------|-------|
| `id` | `id` | Direct mapping |
| `email` | `email` | Direct mapping |
| `raw_user_meta_data.first_name` | `first_name` | From metadata |
| `raw_user_meta_data.last_name` | `last_name` | From metadata |
| N/A | `password_hash` | Generated temporary hash |
| N/A | `role` | Defaults to 'admin' |
| N/A | `is_active` | Defaults to true |

### Verification

#### Check Trigger Status

```sql
-- Verify triggers are active
SELECT 
  trigger_name,
  event_manipulation,
  action_timing
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
  AND event_object_table = 'users'
  AND event_object_schema = 'auth';
```

#### Check Function Definitions

```sql
-- Verify functions exist
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('handle_new_user', 'handle_user_update', 'sync_existing_users');
```

### Troubleshooting

#### Common Issues

1. **Trigger Not Firing**
   - Check if triggers are properly created
   - Verify function permissions
   - Check for syntax errors in functions

2. **User Records Not Created**
   - Check if user exists in `auth.users`
   - Verify RLS policies allow insert
   - Check for unique constraint violations

3. **Sync Function Errors**
   - Check for orphaned records
   - Verify data types match
   - Check for missing required fields

#### Debug Commands

```sql
-- Check for orphaned records
SELECT 
  'Auth users without public records' as issue,
  COUNT(*) as count
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- Check recent user activity
SELECT 
  email,
  created_at,
  raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;
```

### Security Considerations

#### RLS Integration

The trigger functions use `SECURITY DEFINER`, which means they run with the privileges of the function creator. This allows them to:

- Bypass RLS policies when creating user records
- Access the `auth.users` table
- Insert into `public.users` table

#### Data Validation

- Email addresses are validated by Supabase Auth
- User metadata is extracted safely using JSON operators
- Error handling prevents trigger failures from breaking auth

### Performance Impact

#### Minimal Overhead

- Triggers only fire on user signup/update events
- Functions are optimized for speed
- Error handling prevents cascading failures

#### Monitoring

Monitor these metrics:
- Number of user signups per day
- Trigger execution time
- Error rates in function logs

### Rollback Procedure

If you need to remove the triggers:

```sql
-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_update();
DROP FUNCTION IF EXISTS public.sync_existing_users();
```

### Best Practices

1. **Test Thoroughly**: Always test in development before production
2. **Monitor Logs**: Check function logs for errors
3. **Backup Data**: Backup before deploying triggers
4. **Version Control**: Keep trigger scripts in version control
5. **Documentation**: Document any customizations

### Integration with Onboarding

The auth trigger works seamlessly with the onboarding system:

1. User signs up → Trigger creates user record
2. User accesses app → Middleware checks for company associations
3. No associations found → Redirected to onboarding
4. Onboarding completes → User-company association created
5. User can access dashboard

### Future Enhancements

#### Potential Improvements

1. **Role Assignment**: Allow different default roles based on signup method
2. **Company Auto-Creation**: Automatically create company for new users
3. **Email Verification**: Add email verification status tracking
4. **Profile Completion**: Track profile completion status

#### Customization Options

- Modify default role assignment
- Add custom fields to user records
- Implement different behavior for different signup methods
- Add notification systems for new user signups

### Support

If you encounter issues:

1. Check the test script output
2. Review function logs
3. Verify database permissions
4. Test with a new user signup
5. Check for RLS policy conflicts

The auth trigger ensures that every authenticated user has a corresponding record in your application's user management system, enabling seamless integration with your RLS policies and onboarding flow. 