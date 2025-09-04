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


