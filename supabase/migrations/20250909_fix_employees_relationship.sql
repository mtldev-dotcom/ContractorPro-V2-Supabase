-- Fix the ambiguous relationship between employees and users tables
-- Remove the incorrect foreign key constraint employees.id -> users.id
-- Keep only the correct relationship: employees.user_id -> users.id

-- Drop the incorrect foreign key constraint
ALTER TABLE "public"."employees" 
DROP CONSTRAINT IF EXISTS "employees_id_fkey";

-- Ensure the correct foreign key exists and is properly named
ALTER TABLE "public"."employees" 
DROP CONSTRAINT IF EXISTS "employees_user_id_fkey";

-- Add the correct foreign key constraint with proper naming
ALTER TABLE "public"."employees" 
ADD CONSTRAINT "employees_user_id_fkey" 
FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") 
ON DELETE CASCADE;