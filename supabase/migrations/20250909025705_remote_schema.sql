drop extension if exists "pg_net";

alter table "public"."change_orders" drop constraint "change_orders_status_check";

alter table "public"."clients" drop constraint "clients_preferred_contact_method_check";

alter table "public"."clients" drop constraint "clients_type_check";

alter table "public"."communications" drop constraint "communications_direction_check";

alter table "public"."communications" drop constraint "communications_type_check";

alter table "public"."employees" drop constraint "employees_pay_type_check";

alter table "public"."equipment" drop constraint "equipment_condition_check";

alter table "public"."equipment" drop constraint "equipment_status_check";

alter table "public"."payroll" drop constraint "payroll_status_check";

alter table "public"."projects_new" drop constraint "projects_new_priority_check";

alter table "public"."projects_new" drop constraint "projects_new_status_check";

alter table "public"."tasks" drop constraint "tasks_priority_check";

alter table "public"."tasks" drop constraint "tasks_status_check";

alter table "public"."time_tracking" drop constraint "time_tracking_status_check";

alter table "public"."users" drop constraint "users_role_check";

drop index if exists "public"."idx_equipment_assigned_to";

alter table "public"."employees" add column "user_id" uuid;

alter table "public"."users" drop column "password_hash";

CREATE UNIQUE INDEX employees_user_id_key ON public.employees USING btree (user_id);

alter table "public"."employees" add constraint "employees_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."employees" validate constraint "employees_user_id_fkey";

alter table "public"."employees" add constraint "employees_user_id_key" UNIQUE using index "employees_user_id_key";

alter table "public"."change_orders" add constraint "change_orders_status_check" CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'pending_approval'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[]))) not valid;

alter table "public"."change_orders" validate constraint "change_orders_status_check";

alter table "public"."clients" add constraint "clients_preferred_contact_method_check" CHECK (((preferred_contact_method)::text = ANY ((ARRAY['email'::character varying, 'phone'::character varying, 'text'::character varying])::text[]))) not valid;

alter table "public"."clients" validate constraint "clients_preferred_contact_method_check";

alter table "public"."clients" add constraint "clients_type_check" CHECK (((type)::text = ANY ((ARRAY['individual'::character varying, 'business'::character varying])::text[]))) not valid;

alter table "public"."clients" validate constraint "clients_type_check";

alter table "public"."communications" add constraint "communications_direction_check" CHECK (((direction)::text = ANY ((ARRAY['inbound'::character varying, 'outbound'::character varying])::text[]))) not valid;

alter table "public"."communications" validate constraint "communications_direction_check";

alter table "public"."communications" add constraint "communications_type_check" CHECK (((type)::text = ANY ((ARRAY['email'::character varying, 'phone'::character varying, 'meeting'::character varying, 'text'::character varying, 'site_visit'::character varying])::text[]))) not valid;

alter table "public"."communications" validate constraint "communications_type_check";

alter table "public"."employees" add constraint "employees_pay_type_check" CHECK (((pay_type)::text = ANY ((ARRAY['hourly'::character varying, 'salary'::character varying, 'contract'::character varying])::text[]))) not valid;

alter table "public"."employees" validate constraint "employees_pay_type_check";

alter table "public"."equipment" add constraint "equipment_condition_check" CHECK (((condition)::text = ANY ((ARRAY['excellent'::character varying, 'good'::character varying, 'fair'::character varying, 'poor'::character varying])::text[]))) not valid;

alter table "public"."equipment" validate constraint "equipment_condition_check";

alter table "public"."equipment" add constraint "equipment_status_check" CHECK (((status)::text = ANY ((ARRAY['available'::character varying, 'in_use'::character varying, 'maintenance'::character varying, 'retired'::character varying])::text[]))) not valid;

alter table "public"."equipment" validate constraint "equipment_status_check";

alter table "public"."payroll" add constraint "payroll_status_check" CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'processed'::character varying, 'paid'::character varying])::text[]))) not valid;

alter table "public"."payroll" validate constraint "payroll_status_check";

alter table "public"."projects_new" add constraint "projects_new_priority_check" CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::text[]))) not valid;

alter table "public"."projects_new" validate constraint "projects_new_priority_check";

alter table "public"."projects_new" add constraint "projects_new_status_check" CHECK (((status)::text = ANY ((ARRAY['planning'::character varying, 'in_progress'::character varying, 'on_hold'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[]))) not valid;

alter table "public"."projects_new" validate constraint "projects_new_status_check";

alter table "public"."tasks" add constraint "tasks_priority_check" CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::text[]))) not valid;

alter table "public"."tasks" validate constraint "tasks_priority_check";

alter table "public"."tasks" add constraint "tasks_status_check" CHECK (((status)::text = ANY ((ARRAY['not_started'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'on_hold'::character varying])::text[]))) not valid;

alter table "public"."tasks" validate constraint "tasks_status_check";

alter table "public"."time_tracking" add constraint "time_tracking_status_check" CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'completed'::character varying, 'approved'::character varying])::text[]))) not valid;

alter table "public"."time_tracking" validate constraint "time_tracking_status_check";

alter table "public"."users" add constraint "users_role_check" CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'manager'::character varying, 'employee'::character varying, 'client'::character varying])::text[]))) not valid;

alter table "public"."users" validate constraint "users_role_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_employee_id()
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  emp_id uuid;
BEGIN
  SELECT e.id INTO emp_id
  FROM public.employees e
  WHERE e.user_id = (SELECT auth.uid())
  LIMIT 1;

  RETURN emp_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, role, is_active, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name',''),
    COALESCE(NEW.raw_user_meta_data->>'last_name',''),
    'employee',                          -- <<< changed from 'admin'
    TRUE,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        updated_at = NOW();

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.sync_existing_users()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  inserted_count integer := 0;
BEGIN
  WITH ins AS (
    INSERT INTO public.users (id, email, first_name, last_name, role, is_active, created_at, updated_at)
    SELECT
      au.id,
      au.email,
      COALESCE(au.raw_user_meta_data->>'first_name',''),
      COALESCE(au.raw_user_meta_data->>'last_name',''),
      'employee',                        -- <<< changed from 'admin'
      TRUE,
      NOW(),
      NOW()
    FROM auth.users au
    LEFT JOIN public.users u ON u.id = au.id
    WHERE u.id IS NULL
    RETURNING 1
  )
  SELECT COUNT(*) INTO inserted_count FROM ins;

  RETURN inserted_count;
END;
$function$
;


  create policy "Employee updates self"
  on "public"."employees"
  as permissive
  for update
  to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));



  create policy "Tasks insert in companies"
  on "public"."tasks"
  as permissive
  for insert
  to authenticated
with check ((project_id IN ( SELECT p.id
   FROM projects_new p
  WHERE (p.company_id = ANY (get_user_company_ids())))));



  create policy "Tasks select in companies"
  on "public"."tasks"
  as permissive
  for select
  to authenticated
using ((project_id IN ( SELECT p.id
   FROM projects_new p
  WHERE (p.company_id = ANY (get_user_company_ids())))));



  create policy "Tasks update in companies"
  on "public"."tasks"
  as permissive
  for update
  to authenticated
using ((project_id IN ( SELECT p.id
   FROM projects_new p
  WHERE (p.company_id = ANY (get_user_company_ids())))))
with check ((project_id IN ( SELECT p.id
   FROM projects_new p
  WHERE (p.company_id = ANY (get_user_company_ids())))));



  create policy "TimeTracking insert own"
  on "public"."time_tracking"
  as permissive
  for insert
  to authenticated
with check ((employee_id = get_user_employee_id()));



  create policy "TimeTracking select own"
  on "public"."time_tracking"
  as permissive
  for select
  to authenticated
using ((employee_id = get_user_employee_id()));



  create policy "TimeTracking update own"
  on "public"."time_tracking"
  as permissive
  for update
  to authenticated
using ((employee_id = get_user_employee_id()))
with check ((employee_id = get_user_employee_id()));



  create policy "Users update own profile"
  on "public"."users"
  as permissive
  for update
  to authenticated
using ((id = auth.uid()))
with check ((id = auth.uid()));



