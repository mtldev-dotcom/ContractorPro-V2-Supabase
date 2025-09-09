BEGIN;

-- Drop RLS policies depending on employees.id
DROP POLICY IF EXISTS "Managers can view company time entries" ON public.time_tracking;
DROP POLICY IF EXISTS "Only admins can manage payroll" ON public.payroll;

-- Drop dependent foreign key constraints
ALTER TABLE public.time_tracking DROP CONSTRAINT IF EXISTS time_tracking_employee_id_fkey;
ALTER TABLE public.projects_new DROP CONSTRAINT IF EXISTS projects_new_project_manager_id_fkey;
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_assigned_to_fkey;
ALTER TABLE public.equipment DROP CONSTRAINT IF EXISTS equipment_assigned_to_fkey;
ALTER TABLE public.material_usage DROP CONSTRAINT IF EXISTS material_usage_used_by_fkey;
ALTER TABLE public.payroll DROP CONSTRAINT IF EXISTS payroll_employee_id_fkey;

-- Drop existing primary key and user_id foreign key/index
ALTER TABLE public.employees DROP CONSTRAINT IF EXISTS employees_pkey;
ALTER TABLE public.employees DROP CONSTRAINT IF EXISTS employees_user_id_fkey;
DROP INDEX IF EXISTS idx_employees_user_id;

-- Rename existing id to old_id, swap with user_id, and re-establish keys
ALTER TABLE public.employees RENAME COLUMN id TO old_id;
ALTER TABLE public.employees RENAME COLUMN user_id TO id;
ALTER TABLE public.employees DROP CONSTRAINT IF EXISTS employees_pkey;
ALTER TABLE public.employees ADD PRIMARY KEY (id);
DROP INDEX IF EXISTS idx_employees_user_id;
ALTER TABLE public.employees DROP CONSTRAINT IF EXISTS employees_user_id_fkey;
ALTER TABLE public.employees ADD CONSTRAINT employees_id_fkey FOREIGN KEY (id) REFERENCES public.users(id);
-- Update dependent tables to use new employee PK
UPDATE public.time_tracking tt SET employee_id = e.id
  FROM public.employees e WHERE tt.employee_id = e.old_id;
UPDATE public.projects_new pn SET project_manager_id = e.id
  FROM public.employees e WHERE pn.project_manager_id = e.old_id;
UPDATE public.tasks t SET assigned_to = e.id
  FROM public.employees e WHERE t.assigned_to = e.old_id;
UPDATE public.equipment eq SET assigned_to = e.id
  FROM public.employees e WHERE eq.assigned_to = e.old_id;
UPDATE public.material_usage mu SET used_by = e.id
  FROM public.employees e WHERE mu.used_by = e.old_id;
UPDATE public.payroll p SET employee_id = e.id
  FROM public.employees e WHERE p.employee_id = e.old_id;

-- Optionally drop old_id now that id has been set
ALTER TABLE public.employees DROP COLUMN IF EXISTS old_id;

-- Re-add foreign key constraints from dependent tables
ALTER TABLE public.time_tracking ADD CONSTRAINT time_tracking_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id);
ALTER TABLE public.projects_new ADD CONSTRAINT projects_new_project_manager_id_fkey FOREIGN KEY (project_manager_id) REFERENCES public.employees(id);
ALTER TABLE public.tasks ADD CONSTRAINT tasks_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.employees(id);
ALTER TABLE public.equipment ADD CONSTRAINT equipment_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.employees(id);
ALTER TABLE public.material_usage ADD CONSTRAINT material_usage_used_by_fkey FOREIGN KEY (used_by) REFERENCES public.employees(id);
ALTER TABLE public.payroll ADD CONSTRAINT payroll_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id);

-- Add role column to employees
ALTER TABLE public.employees 
  ADD COLUMN role VARCHAR 
    CHECK(role::text = ANY(ARRAY['admin','manager','employee','client']::text[])) 
    DEFAULT 'employee';

-- Insert any users from user_companies into employees table, supplying required fields
INSERT INTO public.employees (id, company_id, role, hire_date, pay_type, created_at, updated_at)
SELECT
  uc.user_id,
  uc.company_id,
  uc.role,
  CURRENT_DATE AS hire_date,
  'salary'::VARCHAR AS pay_type,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM public.user_companies uc
WHERE uc.user_id NOT IN (SELECT id FROM public.employees);

COMMIT;
