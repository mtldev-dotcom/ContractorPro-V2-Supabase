-- =====================================================
-- Auth Trigger for ContractorPro-V2
-- Automatically creates user records when new users sign up
-- =====================================================

-- Enable the pg_net extension for HTTP requests (if needed)
-- CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new record into the public.users table
  INSERT INTO public.users (
    id,
    email,
    password_hash,
    first_name,
    last_name,
    role,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,                                    -- User ID from auth.users
    NEW.email,                                 -- Email from auth.users
    'temp_hash_' || NEW.id,                   -- Temporary hash for auth users
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),  -- First name from metadata
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),   -- Last name from metadata
    'admin',                                   -- Default role for new users
    true,                                      -- Active by default
    NOW(),                                     -- Created timestamp
    NOW()                                      -- Updated timestamp
  );
  
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- If user already exists, just return the new record
    RAISE LOG 'User % already exists in public.users table', NEW.id;
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log any other errors but don't fail the auth process
    RAISE LOG 'Error creating user record for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on the auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- Additional Triggers for User Updates
-- =====================================================

-- Function to handle user updates
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the corresponding record in public.users table
  UPDATE public.users SET
    email = NEW.email,
    first_name = COALESCE(NEW.raw_user_meta_data->>'first_name', first_name),
    last_name = COALESCE(NEW.raw_user_meta_data->>'last_name', last_name),
    updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log any errors but don't fail the auth process
    RAISE LOG 'Error updating user record for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the update trigger
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- =====================================================
-- Function to Sync Existing Users
-- =====================================================

-- Function to sync existing auth users to public.users table
CREATE OR REPLACE FUNCTION public.sync_existing_users()
RETURNS INTEGER AS $$
DECLARE
  user_count INTEGER := 0;
  auth_user RECORD;
BEGIN
  -- Loop through all auth users that don't have corresponding public.users records
  FOR auth_user IN 
    SELECT 
      au.id,
      au.email,
      au.raw_user_meta_data,
      au.created_at
    FROM auth.users au
    LEFT JOIN public.users pu ON au.id = pu.id
    WHERE pu.id IS NULL
  LOOP
    BEGIN
      INSERT INTO public.users (
        id,
        email,
        password_hash,
        first_name,
        last_name,
        role,
        is_active,
        created_at,
        updated_at
      ) VALUES (
        auth_user.id,
        auth_user.email,
        'temp_hash_' || auth_user.id,
        COALESCE(auth_user.raw_user_meta_data->>'first_name', ''),
        COALESCE(auth_user.raw_user_meta_data->>'last_name', ''),
        'admin',
        true,
        auth_user.created_at,
        NOW()
      );
      
      user_count := user_count + 1;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE LOG 'Error syncing user %: %', auth_user.id, SQLERRM;
    END;
  END LOOP;
  
  RETURN user_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if triggers are created
SELECT 'Auth triggers check:' as info;
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

-- Check function definitions
SELECT 'Function definitions:' as info;
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('handle_new_user', 'handle_user_update', 'sync_existing_users')
ORDER BY routine_name;

-- =====================================================
-- Usage Instructions
-- =====================================================

/*
To sync existing users who signed up before this trigger was created:

SELECT public.sync_existing_users();

This will return the number of users that were synced.

To test the trigger manually:

-- This would normally be done by Supabase Auth automatically
INSERT INTO auth.users (id, email, raw_user_meta_data) 
VALUES (
  gen_random_uuid(), 
  'test@example.com', 
  '{"first_name": "John", "last_name": "Doe"}'::jsonb
);

To verify the trigger worked:

SELECT * FROM public.users WHERE email = 'test@example.com';
*/ 