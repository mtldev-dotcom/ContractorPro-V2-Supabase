-- Migration to handle data before dropping the legacy projects table

-- Step 1: Migrate any projects from legacy table to projects_new that don't already exist
INSERT INTO "public"."projects_new" (
  "id", 
  "company_id", 
  "name", 
  "description", 
  "status", 
  "created_at", 
  "updated_at"
)
SELECT 
  p.id,
  p.company_id,
  p.name,
  p.description,
  p.status,
  p.created_at,
  p.updated_at
FROM "public"."projects" p
WHERE NOT EXISTS (
  SELECT 1 FROM "public"."projects_new" pn 
  WHERE pn.id = p.id
);

-- Step 2: Update any time_tracking records that reference non-existent projects in projects_new
-- For now, we'll delete orphaned time_tracking records that can't be migrated
-- (In production, you might want to manually review these first)
DELETE FROM "public"."time_tracking" 
WHERE project_id NOT IN (
  SELECT id FROM "public"."projects_new"
) AND project_id NOT IN (
  SELECT id FROM "public"."projects"
);

-- Step 3: Update time_tracking foreign key constraint
ALTER TABLE "public"."time_tracking" 
DROP CONSTRAINT "time_tracking_project_id_fkey";

ALTER TABLE "public"."time_tracking"
ADD CONSTRAINT "time_tracking_project_id_fkey" 
FOREIGN KEY ("project_id") REFERENCES "public"."projects_new"("id");

-- Step 4: Drop RLS policies for the legacy projects table
DROP POLICY IF EXISTS "Managers and admins can manage legacy projects" ON "public"."projects";
DROP POLICY IF EXISTS "Users can view legacy company projects" ON "public"."projects";

-- Step 5: Drop the legacy projects table
DROP TABLE "public"."projects";