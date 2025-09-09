

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."transaction_type" AS ENUM (
    'income',
    'expense'
);


ALTER TYPE "public"."transaction_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_company_ids"() RETURNS "uuid"[]
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN ARRAY(
    SELECT company_id 
    FROM user_companies 
    WHERE user_id = (SELECT auth.uid())
  );
END;
$$;


ALTER FUNCTION "public"."get_user_company_ids"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_employee_id"() RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN (
    SELECT id FROM employees 
    WHERE user_id = (SELECT auth.uid())
    LIMIT 1
  );
END;
$$;


ALTER FUNCTION "public"."get_user_employee_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_role"() RETURNS character varying
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN (
    SELECT role FROM users 
    WHERE id = (SELECT auth.uid())
  );
END;
$$;


ALTER FUNCTION "public"."get_user_role"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_user_update"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."handle_user_update"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = (SELECT auth.uid()) 
    AND role = 'admin'
  );
END;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin_or_manager"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = (SELECT auth.uid()) 
    AND role IN ('admin', 'manager')
  );
END;
$$;


ALTER FUNCTION "public"."is_admin_or_manager"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_existing_users"() RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."sync_existing_users"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."change_orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "change_order_number" character varying(50) NOT NULL,
    "description" "text" NOT NULL,
    "reason" "text",
    "original_amount" numeric(12,2),
    "change_amount" numeric(12,2) NOT NULL,
    "new_total_amount" numeric(12,2),
    "original_end_date" "date",
    "new_end_date" "date",
    "days_added" integer DEFAULT 0,
    "status" character varying(20) DEFAULT 'draft'::character varying,
    "requested_by" "uuid",
    "approved_by" "uuid",
    "approval_date" "date",
    "notes" "text",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "change_orders_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['draft'::character varying, 'pending_approval'::character varying, 'approved'::character varying, 'rejected'::character varying])::"text"[])))
);


ALTER TABLE "public"."change_orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."clients" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "company_id" "uuid",
    "first_name" character varying(100) NOT NULL,
    "last_name" character varying(100) NOT NULL,
    "email" character varying(255),
    "phone" character varying(20),
    "company_name" character varying(255),
    "address_line1" character varying(255),
    "address_line2" character varying(255),
    "city" character varying(100),
    "state" character varying(50),
    "zip_code" character varying(20),
    "country" character varying(50) DEFAULT 'US'::character varying,
    "notes" "text",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "type" character varying(20) DEFAULT 'individual'::character varying,
    "secondary_phone" character varying(20),
    "preferred_contact_method" character varying(20) DEFAULT 'email'::character varying,
    "rating" integer DEFAULT 5,
    "is_active" boolean DEFAULT true,
    CONSTRAINT "clients_preferred_contact_method_check" CHECK ((("preferred_contact_method")::"text" = ANY ((ARRAY['email'::character varying, 'phone'::character varying, 'text'::character varying])::"text"[]))),
    CONSTRAINT "clients_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5))),
    CONSTRAINT "clients_type_check" CHECK ((("type")::"text" = ANY ((ARRAY['individual'::character varying, 'business'::character varying])::"text"[])))
);


ALTER TABLE "public"."clients" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."communications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "client_id" "uuid",
    "type" character varying(20) NOT NULL,
    "direction" character varying(20) NOT NULL,
    "subject" character varying(255),
    "content" "text",
    "communication_date" timestamp without time zone NOT NULL,
    "participants" "text",
    "follow_up_required" boolean DEFAULT false,
    "follow_up_date" "date",
    "created_by" "uuid",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "communications_direction_check" CHECK ((("direction")::"text" = ANY ((ARRAY['inbound'::character varying, 'outbound'::character varying])::"text"[]))),
    CONSTRAINT "communications_type_check" CHECK ((("type")::"text" = ANY ((ARRAY['email'::character varying, 'phone'::character varying, 'meeting'::character varying, 'text'::character varying, 'site_visit'::character varying])::"text"[])))
);


ALTER TABLE "public"."communications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."companies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "legal_name" character varying(255),
    "tax_id" character varying(50),
    "license_number" character varying(100),
    "address_line1" character varying(255),
    "address_line2" character varying(255),
    "city" character varying(100),
    "state" character varying(50),
    "zip_code" character varying(20),
    "country" character varying(50) DEFAULT 'US'::character varying,
    "phone" character varying(20),
    "email" character varying(255),
    "website" character varying(255),
    "logo_url" character varying(500),
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."companies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "company_id" "uuid",
    "project_id" "uuid",
    "client_id" "uuid",
    "name" character varying(255) NOT NULL,
    "description" "text",
    "file_url" character varying(500) NOT NULL,
    "file_type" character varying(50),
    "file_size" integer,
    "category" character varying(100),
    "tags" "text",
    "is_public" boolean DEFAULT false,
    "uploaded_by" "uuid",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."employees" (
    "id" "uuid" NOT NULL,
    "company_id" "uuid",
    "employee_number" character varying(50),
    "hire_date" "date" NOT NULL,
    "termination_date" "date",
    "job_title" character varying(100),
    "department" character varying(100),
    "hourly_rate" numeric(10,2),
    "salary" numeric(12,2),
    "pay_type" character varying(20) NOT NULL,
    "emergency_contact_name" character varying(255),
    "emergency_contact_phone" character varying(20),
    "certifications" "text",
    "skills" "text",
    "notes" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "role" character varying DEFAULT 'employee'::character varying,
    CONSTRAINT "employees_pay_type_check" CHECK ((("pay_type")::"text" = ANY ((ARRAY['hourly'::character varying, 'salary'::character varying, 'contract'::character varying])::"text"[]))),
    CONSTRAINT "employees_role_check" CHECK ((("role")::"text" = ANY (ARRAY['admin'::"text", 'manager'::"text", 'employee'::"text", 'client'::"text"])))
);


ALTER TABLE "public"."employees" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."equipment" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "company_id" "uuid",
    "name" character varying(255) NOT NULL,
    "category" character varying(100),
    "make" character varying(100),
    "model" character varying(100),
    "serial_number" character varying(255),
    "purchase_date" "date",
    "purchase_price" numeric(12,2),
    "current_value" numeric(12,2),
    "last_maintenance_date" "date",
    "next_maintenance_date" "date",
    "maintenance_interval_days" integer,
    "assigned_to" "uuid",
    "current_project_id" "uuid",
    "status" character varying(20) DEFAULT 'available'::character varying,
    "condition" character varying(20) DEFAULT 'good'::character varying,
    "location" character varying(255),
    "notes" "text",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "equipment_condition_check" CHECK ((("condition")::"text" = ANY ((ARRAY['excellent'::character varying, 'good'::character varying, 'fair'::character varying, 'poor'::character varying])::"text"[]))),
    CONSTRAINT "equipment_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['available'::character varying, 'in_use'::character varying, 'maintenance'::character varying, 'retired'::character varying])::"text"[])))
);


ALTER TABLE "public"."equipment" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."financial_transactions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "company_id" "uuid" NOT NULL,
    "project_id" "uuid",
    "user_id" "uuid" NOT NULL,
    "transaction_date" "date" NOT NULL,
    "description" "text" NOT NULL,
    "category" "text" NOT NULL,
    "amount" numeric(14,2) NOT NULL,
    "type" "public"."transaction_type" NOT NULL,
    "attachment_file" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."financial_transactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."material_usage" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "material_id" "uuid",
    "quantity_used" numeric(10,3) NOT NULL,
    "unit_cost" numeric(10,2),
    "total_cost" numeric(12,2),
    "usage_date" "date" NOT NULL,
    "used_by" "uuid",
    "notes" "text",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."material_usage" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."materials" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "company_id" "uuid",
    "name" character varying(255) NOT NULL,
    "category" character varying(100),
    "unit" character varying(50),
    "current_stock" numeric(10,3) DEFAULT 0,
    "minimum_stock" numeric(10,3) DEFAULT 0,
    "unit_cost" numeric(10,2),
    "supplier_id" "uuid",
    "sku" character varying(100),
    "location" character varying(255),
    "notes" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."materials" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payroll" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "employee_id" "uuid",
    "pay_period_start" "date" NOT NULL,
    "pay_period_end" "date" NOT NULL,
    "pay_date" "date" NOT NULL,
    "regular_hours" numeric(6,2) DEFAULT 0,
    "overtime_hours" numeric(6,2) DEFAULT 0,
    "regular_rate" numeric(10,2),
    "overtime_rate" numeric(10,2),
    "regular_pay" numeric(10,2) DEFAULT 0,
    "overtime_pay" numeric(10,2) DEFAULT 0,
    "bonus" numeric(10,2) DEFAULT 0,
    "gross_pay" numeric(10,2) NOT NULL,
    "federal_tax" numeric(10,2) DEFAULT 0,
    "state_tax" numeric(10,2) DEFAULT 0,
    "social_security" numeric(10,2) DEFAULT 0,
    "medicare" numeric(10,2) DEFAULT 0,
    "insurance" numeric(10,2) DEFAULT 0,
    "retirement" numeric(10,2) DEFAULT 0,
    "other_deductions" numeric(10,2) DEFAULT 0,
    "total_deductions" numeric(10,2) DEFAULT 0,
    "net_pay" numeric(10,2) NOT NULL,
    "status" character varying(20) DEFAULT 'draft'::character varying,
    "notes" "text",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "payroll_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['draft'::character varying, 'processed'::character varying, 'paid'::character varying])::"text"[])))
);


ALTER TABLE "public"."payroll" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects_new" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "company_id" "uuid",
    "client_id" "uuid",
    "project_number" character varying(50),
    "name" character varying(255) NOT NULL,
    "description" "text",
    "project_type" character varying(100),
    "status" character varying(20) DEFAULT 'planning'::character varying,
    "priority" character varying(20) DEFAULT 'medium'::character varying,
    "start_date" "date",
    "estimated_end_date" "date",
    "actual_end_date" "date",
    "budget" numeric(15,2),
    "contract_amount" numeric(15,2),
    "site_address_line1" character varying(255),
    "site_address_line2" character varying(255),
    "site_city" character varying(100),
    "site_state" character varying(50),
    "site_zip_code" character varying(20),
    "site_lat" numeric(10,8),
    "site_lng" numeric(11,8),
    "project_manager_id" "uuid",
    "notes" "text",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "projects_new_priority_check" CHECK ((("priority")::"text" = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::"text"[]))),
    CONSTRAINT "projects_new_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['planning'::character varying, 'in_progress'::character varying, 'on_hold'::character varying, 'completed'::character varying, 'cancelled'::character varying])::"text"[])))
);


ALTER TABLE "public"."projects_new" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."suppliers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "company_id" "uuid",
    "name" character varying(255) NOT NULL,
    "contact_name" character varying(255),
    "email" character varying(255),
    "phone" character varying(20),
    "address_line1" character varying(255),
    "address_line2" character varying(255),
    "city" character varying(100),
    "state" character varying(50),
    "zip_code" character varying(20),
    "country" character varying(50) DEFAULT 'US'::character varying,
    "tax_id" character varying(50),
    "payment_terms" character varying(100),
    "notes" "text",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."suppliers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tasks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid",
    "parent_task_id" "uuid",
    "name" character varying(255) NOT NULL,
    "description" "text",
    "status" character varying(20) DEFAULT 'not_started'::character varying,
    "priority" character varying(20) DEFAULT 'medium'::character varying,
    "assigned_to" "uuid",
    "estimated_hours" numeric(6,2),
    "actual_hours" numeric(6,2),
    "start_date" "date",
    "due_date" "date",
    "completion_date" "date",
    "completion_percentage" integer DEFAULT 0,
    "dependencies" "text",
    "notes" "text",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tasks_completion_percentage_check" CHECK ((("completion_percentage" >= 0) AND ("completion_percentage" <= 100))),
    CONSTRAINT "tasks_priority_check" CHECK ((("priority")::"text" = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::"text"[]))),
    CONSTRAINT "tasks_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['not_started'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'on_hold'::character varying])::"text"[])))
);


ALTER TABLE "public"."tasks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."time_tracking" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "employee_id" "uuid",
    "project_id" "uuid",
    "clock_in" timestamp without time zone NOT NULL,
    "clock_out" timestamp without time zone,
    "break_duration" integer DEFAULT 0,
    "total_hours" numeric(5,2),
    "overtime_hours" numeric(5,2) DEFAULT 0,
    "hourly_rate" numeric(10,2),
    "location_lat" numeric(10,8),
    "location_lng" numeric(11,8),
    "notes" "text",
    "status" character varying(20) DEFAULT 'active'::character varying,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "time_tracking_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['active'::character varying, 'completed'::character varying, 'approved'::character varying])::"text"[])))
);


ALTER TABLE "public"."time_tracking" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_companies" (
    "user_id" "uuid" NOT NULL,
    "company_id" "uuid" NOT NULL,
    "role" character varying(50)
);


ALTER TABLE "public"."user_companies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" character varying(255) NOT NULL,
    "password_hash" character varying(255) NOT NULL,
    "first_name" character varying(100) NOT NULL,
    "last_name" character varying(100) NOT NULL,
    "phone" character varying(20),
    "role" character varying(20) NOT NULL,
    "is_active" boolean DEFAULT true,
    "last_login" timestamp without time zone,
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_role_check" CHECK ((("role")::"text" = ANY ((ARRAY['admin'::character varying, 'manager'::character varying, 'employee'::character varying, 'client'::character varying])::"text"[])))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."change_orders"
    ADD CONSTRAINT "change_orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."communications"
    ADD CONSTRAINT "communications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_employee_number_key" UNIQUE ("employee_number");



ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."equipment"
    ADD CONSTRAINT "equipment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."financial_transactions"
    ADD CONSTRAINT "financial_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."material_usage"
    ADD CONSTRAINT "material_usage_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."materials"
    ADD CONSTRAINT "materials_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payroll"
    ADD CONSTRAINT "payroll_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projects_new"
    ADD CONSTRAINT "projects_new_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projects_new"
    ADD CONSTRAINT "projects_new_project_number_key" UNIQUE ("project_number");



ALTER TABLE ONLY "public"."suppliers"
    ADD CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."time_tracking"
    ADD CONSTRAINT "time_tracking_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_companies"
    ADD CONSTRAINT "user_companies_pkey" PRIMARY KEY ("user_id", "company_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE INDEX "financial_transactions_company_id_transaction_date_idx" ON "public"."financial_transactions" USING "btree" ("company_id", "transaction_date" DESC);



CREATE INDEX "idx_change_orders_project" ON "public"."change_orders" USING "btree" ("project_id");



CREATE INDEX "idx_clients_is_active" ON "public"."clients" USING "btree" ("is_active");



CREATE INDEX "idx_clients_preferred_contact" ON "public"."clients" USING "btree" ("preferred_contact_method");



CREATE INDEX "idx_clients_type" ON "public"."clients" USING "btree" ("type");



CREATE INDEX "idx_communications_project" ON "public"."communications" USING "btree" ("project_id");



CREATE INDEX "idx_documents_project" ON "public"."documents" USING "btree" ("project_id");



CREATE INDEX "idx_employees_company_id" ON "public"."employees" USING "btree" ("company_id");



CREATE INDEX "idx_equipment_assigned" ON "public"."equipment" USING "btree" ("assigned_to");



CREATE INDEX "idx_equipment_assigned_to" ON "public"."equipment" USING "btree" ("assigned_to");



CREATE INDEX "idx_equipment_company" ON "public"."equipment" USING "btree" ("company_id");



CREATE INDEX "idx_material_usage_project" ON "public"."material_usage" USING "btree" ("project_id");



CREATE INDEX "idx_materials_company" ON "public"."materials" USING "btree" ("company_id");



CREATE INDEX "idx_payroll_employee" ON "public"."payroll" USING "btree" ("employee_id");



CREATE INDEX "idx_payroll_employee_id" ON "public"."payroll" USING "btree" ("employee_id");



CREATE INDEX "idx_projects_new_company_id" ON "public"."projects_new" USING "btree" ("company_id");



CREATE INDEX "idx_tasks_assigned" ON "public"."tasks" USING "btree" ("assigned_to");



CREATE INDEX "idx_tasks_assigned_to" ON "public"."tasks" USING "btree" ("assigned_to");



CREATE INDEX "idx_tasks_due_date" ON "public"."tasks" USING "btree" ("due_date");



CREATE INDEX "idx_tasks_project" ON "public"."tasks" USING "btree" ("project_id");



CREATE INDEX "idx_tasks_status" ON "public"."tasks" USING "btree" ("status");



CREATE INDEX "idx_time_tracking_employee_id" ON "public"."time_tracking" USING "btree" ("employee_id");



CREATE INDEX "idx_user_companies_company_id" ON "public"."user_companies" USING "btree" ("company_id");



CREATE INDEX "idx_user_companies_user_id" ON "public"."user_companies" USING "btree" ("user_id");



CREATE INDEX "idx_users_role" ON "public"."users" USING "btree" ("role");



CREATE OR REPLACE TRIGGER "update_change_orders_updated_at" BEFORE UPDATE ON "public"."change_orders" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_clients_updated_at" BEFORE UPDATE ON "public"."clients" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_communications_updated_at" BEFORE UPDATE ON "public"."communications" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_companies_updated_at" BEFORE UPDATE ON "public"."companies" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_documents_updated_at" BEFORE UPDATE ON "public"."documents" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_employees_updated_at" BEFORE UPDATE ON "public"."employees" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_equipment_updated_at" BEFORE UPDATE ON "public"."equipment" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_material_usage_updated_at" BEFORE UPDATE ON "public"."material_usage" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_materials_updated_at" BEFORE UPDATE ON "public"."materials" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_payroll_updated_at" BEFORE UPDATE ON "public"."payroll" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_projects_new_updated_at" BEFORE UPDATE ON "public"."projects_new" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_suppliers_updated_at" BEFORE UPDATE ON "public"."suppliers" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_tasks_updated_at" BEFORE UPDATE ON "public"."tasks" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_time_tracking_updated_at" BEFORE UPDATE ON "public"."time_tracking" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."change_orders"
    ADD CONSTRAINT "change_orders_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."change_orders"
    ADD CONSTRAINT "change_orders_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects_new"("id");



ALTER TABLE ONLY "public"."change_orders"
    ADD CONSTRAINT "change_orders_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");



ALTER TABLE ONLY "public"."communications"
    ADD CONSTRAINT "communications_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id");



ALTER TABLE ONLY "public"."communications"
    ADD CONSTRAINT "communications_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."communications"
    ADD CONSTRAINT "communications_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects_new"("id");



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id");



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects_new"("id");



ALTER TABLE ONLY "public"."documents"
    ADD CONSTRAINT "documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");



ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."equipment"
    ADD CONSTRAINT "equipment_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "public"."employees"("id");



ALTER TABLE ONLY "public"."equipment"
    ADD CONSTRAINT "equipment_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");



ALTER TABLE ONLY "public"."equipment"
    ADD CONSTRAINT "equipment_current_project_id_fkey" FOREIGN KEY ("current_project_id") REFERENCES "public"."projects_new"("id");



ALTER TABLE ONLY "public"."financial_transactions"
    ADD CONSTRAINT "financial_transactions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."financial_transactions"
    ADD CONSTRAINT "financial_transactions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects_new"("id");



ALTER TABLE ONLY "public"."financial_transactions"
    ADD CONSTRAINT "financial_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."material_usage"
    ADD CONSTRAINT "material_usage_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "public"."materials"("id");



ALTER TABLE ONLY "public"."material_usage"
    ADD CONSTRAINT "material_usage_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects_new"("id");



ALTER TABLE ONLY "public"."material_usage"
    ADD CONSTRAINT "material_usage_used_by_fkey" FOREIGN KEY ("used_by") REFERENCES "public"."employees"("id");



ALTER TABLE ONLY "public"."materials"
    ADD CONSTRAINT "materials_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");



ALTER TABLE ONLY "public"."materials"
    ADD CONSTRAINT "materials_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id");



ALTER TABLE ONLY "public"."payroll"
    ADD CONSTRAINT "payroll_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id");



ALTER TABLE ONLY "public"."projects_new"
    ADD CONSTRAINT "projects_new_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id");



ALTER TABLE ONLY "public"."projects_new"
    ADD CONSTRAINT "projects_new_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");



ALTER TABLE ONLY "public"."projects_new"
    ADD CONSTRAINT "projects_new_project_manager_id_fkey" FOREIGN KEY ("project_manager_id") REFERENCES "public"."employees"("id");



ALTER TABLE ONLY "public"."suppliers"
    ADD CONSTRAINT "suppliers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_parent_task_id_fkey" FOREIGN KEY ("parent_task_id") REFERENCES "public"."tasks"("id");



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects_new"("id");



ALTER TABLE ONLY "public"."time_tracking"
    ADD CONSTRAINT "time_tracking_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id");



ALTER TABLE ONLY "public"."time_tracking"
    ADD CONSTRAINT "time_tracking_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects_new"("id");



ALTER TABLE ONLY "public"."user_companies"
    ADD CONSTRAINT "user_companies_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");



ALTER TABLE ONLY "public"."user_companies"
    ADD CONSTRAINT "user_companies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



CREATE POLICY "Managers and admins can insert projects" ON "public"."projects_new" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_admin_or_manager"());



CREATE POLICY "Managers and admins can manage change orders" ON "public"."change_orders" TO "authenticated" USING ((("project_id" IN ( SELECT "projects_new"."id"
   FROM "public"."projects_new"
  WHERE ("projects_new"."company_id" = ANY ("public"."get_user_company_ids"())))) AND "public"."is_admin_or_manager"())) WITH CHECK ((("project_id" IN ( SELECT "projects_new"."id"
   FROM "public"."projects_new"
  WHERE ("projects_new"."company_id" = ANY ("public"."get_user_company_ids"())))) AND "public"."is_admin_or_manager"()));



CREATE POLICY "Managers and admins can manage clients" ON "public"."clients" TO "authenticated" USING ((("company_id" = ANY ("public"."get_user_company_ids"())) AND "public"."is_admin_or_manager"())) WITH CHECK ((("company_id" = ANY ("public"."get_user_company_ids"())) AND "public"."is_admin_or_manager"()));



CREATE POLICY "Managers and admins can manage communications" ON "public"."communications" TO "authenticated" USING (((("project_id" IN ( SELECT "projects_new"."id"
   FROM "public"."projects_new"
  WHERE ("projects_new"."company_id" = ANY ("public"."get_user_company_ids"())))) OR ("client_id" IN ( SELECT "clients"."id"
   FROM "public"."clients"
  WHERE ("clients"."company_id" = ANY ("public"."get_user_company_ids"()))))) AND "public"."is_admin_or_manager"())) WITH CHECK (((("project_id" IN ( SELECT "projects_new"."id"
   FROM "public"."projects_new"
  WHERE ("projects_new"."company_id" = ANY ("public"."get_user_company_ids"())))) OR ("client_id" IN ( SELECT "clients"."id"
   FROM "public"."clients"
  WHERE ("clients"."company_id" = ANY ("public"."get_user_company_ids"()))))) AND "public"."is_admin_or_manager"()));



CREATE POLICY "Managers and admins can manage documents" ON "public"."documents" TO "authenticated" USING ((("company_id" = ANY ("public"."get_user_company_ids"())) AND "public"."is_admin_or_manager"())) WITH CHECK ((("company_id" = ANY ("public"."get_user_company_ids"())) AND "public"."is_admin_or_manager"()));



CREATE POLICY "Managers and admins can manage employees" ON "public"."employees" TO "authenticated" USING ((("company_id" = ANY ("public"."get_user_company_ids"())) AND "public"."is_admin_or_manager"())) WITH CHECK ((("company_id" = ANY ("public"."get_user_company_ids"())) AND "public"."is_admin_or_manager"()));



CREATE POLICY "Managers and admins can manage equipment" ON "public"."equipment" TO "authenticated" USING ((("company_id" = ANY ("public"."get_user_company_ids"())) AND "public"."is_admin_or_manager"())) WITH CHECK ((("company_id" = ANY ("public"."get_user_company_ids"())) AND "public"."is_admin_or_manager"()));



CREATE POLICY "Managers and admins can manage material usage" ON "public"."material_usage" TO "authenticated" USING ((("project_id" IN ( SELECT "projects_new"."id"
   FROM "public"."projects_new"
  WHERE ("projects_new"."company_id" = ANY ("public"."get_user_company_ids"())))) AND "public"."is_admin_or_manager"())) WITH CHECK ((("project_id" IN ( SELECT "projects_new"."id"
   FROM "public"."projects_new"
  WHERE ("projects_new"."company_id" = ANY ("public"."get_user_company_ids"())))) AND "public"."is_admin_or_manager"()));



CREATE POLICY "Managers and admins can manage materials" ON "public"."materials" TO "authenticated" USING ((("company_id" = ANY ("public"."get_user_company_ids"())) AND "public"."is_admin_or_manager"())) WITH CHECK ((("company_id" = ANY ("public"."get_user_company_ids"())) AND "public"."is_admin_or_manager"()));



CREATE POLICY "Managers and admins can manage projects" ON "public"."projects_new" TO "authenticated" USING ((("company_id" = ANY ("public"."get_user_company_ids"())) AND "public"."is_admin_or_manager"())) WITH CHECK ((("company_id" = ANY ("public"."get_user_company_ids"())) AND "public"."is_admin_or_manager"()));



CREATE POLICY "Managers and admins can manage suppliers" ON "public"."suppliers" TO "authenticated" USING ((("company_id" = ANY ("public"."get_user_company_ids"())) AND "public"."is_admin_or_manager"())) WITH CHECK ((("company_id" = ANY ("public"."get_user_company_ids"())) AND "public"."is_admin_or_manager"()));



CREATE POLICY "Managers and admins can manage tasks" ON "public"."tasks" TO "authenticated" USING ((("project_id" IN ( SELECT "projects_new"."id"
   FROM "public"."projects_new"
  WHERE ("projects_new"."company_id" = ANY ("public"."get_user_company_ids"())))) AND "public"."is_admin_or_manager"())) WITH CHECK ((("project_id" IN ( SELECT "projects_new"."id"
   FROM "public"."projects_new"
  WHERE ("projects_new"."company_id" = ANY ("public"."get_user_company_ids"())))) AND "public"."is_admin_or_manager"()));



CREATE POLICY "Only admins can create users" ON "public"."users" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_admin"());



CREATE POLICY "Only admins can delete users" ON "public"."users" FOR DELETE TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "Only admins can manage companies" ON "public"."companies" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Only admins can manage user-company associations" ON "public"."user_companies" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Users can manage own time entries" ON "public"."time_tracking" TO "authenticated" USING (("employee_id" = "public"."get_user_employee_id"())) WITH CHECK (("employee_id" = "public"."get_user_employee_id"()));



CREATE POLICY "Users can update assigned tasks" ON "public"."tasks" FOR UPDATE TO "authenticated" USING (("assigned_to" = "public"."get_user_employee_id"())) WITH CHECK (("assigned_to" = "public"."get_user_employee_id"()));



CREATE POLICY "Users can update own employee record" ON "public"."employees" FOR UPDATE TO "authenticated" USING (("id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK ((("id" = ( SELECT "auth"."uid"() AS "uid")) AND ("company_id" = ANY ("public"."get_user_company_ids"()))));



CREATE POLICY "Users can update own profile" ON "public"."users" FOR UPDATE TO "authenticated" USING (("id" = ( SELECT "auth"."uid"() AS "uid"))) WITH CHECK (("id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can view assigned equipment" ON "public"."equipment" FOR SELECT TO "authenticated" USING (("assigned_to" = "public"."get_user_employee_id"()));



CREATE POLICY "Users can view assigned tasks" ON "public"."tasks" FOR SELECT TO "authenticated" USING (("assigned_to" = "public"."get_user_employee_id"()));



CREATE POLICY "Users can view company change orders" ON "public"."change_orders" FOR SELECT TO "authenticated" USING (("project_id" IN ( SELECT "projects_new"."id"
   FROM "public"."projects_new"
  WHERE ("projects_new"."company_id" = ANY ("public"."get_user_company_ids"())))));



CREATE POLICY "Users can view company clients" ON "public"."clients" FOR SELECT TO "authenticated" USING (("company_id" = ANY ("public"."get_user_company_ids"())));



CREATE POLICY "Users can view company communications" ON "public"."communications" FOR SELECT TO "authenticated" USING ((("project_id" IN ( SELECT "projects_new"."id"
   FROM "public"."projects_new"
  WHERE ("projects_new"."company_id" = ANY ("public"."get_user_company_ids"())))) OR ("client_id" IN ( SELECT "clients"."id"
   FROM "public"."clients"
  WHERE ("clients"."company_id" = ANY ("public"."get_user_company_ids"()))))));



CREATE POLICY "Users can view company documents" ON "public"."documents" FOR SELECT TO "authenticated" USING (("company_id" = ANY ("public"."get_user_company_ids"())));



CREATE POLICY "Users can view company employees" ON "public"."employees" FOR SELECT TO "authenticated" USING (("company_id" = ANY ("public"."get_user_company_ids"())));



CREATE POLICY "Users can view company equipment" ON "public"."equipment" FOR SELECT TO "authenticated" USING (("company_id" = ANY ("public"."get_user_company_ids"())));



CREATE POLICY "Users can view company material usage" ON "public"."material_usage" FOR SELECT TO "authenticated" USING (("project_id" IN ( SELECT "projects_new"."id"
   FROM "public"."projects_new"
  WHERE ("projects_new"."company_id" = ANY ("public"."get_user_company_ids"())))));



CREATE POLICY "Users can view company materials" ON "public"."materials" FOR SELECT TO "authenticated" USING (("company_id" = ANY ("public"."get_user_company_ids"())));



CREATE POLICY "Users can view company projects" ON "public"."projects_new" FOR SELECT TO "authenticated" USING (("company_id" = ANY ("public"."get_user_company_ids"())));



CREATE POLICY "Users can view company suppliers" ON "public"."suppliers" FOR SELECT TO "authenticated" USING (("company_id" = ANY ("public"."get_user_company_ids"())));



CREATE POLICY "Users can view company tasks" ON "public"."tasks" FOR SELECT TO "authenticated" USING (("project_id" IN ( SELECT "projects_new"."id"
   FROM "public"."projects_new"
  WHERE ("projects_new"."company_id" = ANY ("public"."get_user_company_ids"())))));



CREATE POLICY "Users can view own employee record" ON "public"."employees" FOR SELECT TO "authenticated" USING (("id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can view own payroll" ON "public"."payroll" FOR SELECT TO "authenticated" USING (("employee_id" = "public"."get_user_employee_id"()));



CREATE POLICY "Users can view own profile" ON "public"."users" FOR SELECT TO "authenticated" USING (("id" = ( SELECT "auth"."uid"() AS "uid")));



CREATE POLICY "Users can view own time entries" ON "public"."time_tracking" FOR SELECT TO "authenticated" USING (("employee_id" = "public"."get_user_employee_id"()));



CREATE POLICY "Users can view public documents" ON "public"."documents" FOR SELECT TO "authenticated" USING (("is_public" = true));



CREATE POLICY "Users can view their companies" ON "public"."companies" FOR SELECT TO "authenticated" USING (("id" = ANY ("public"."get_user_company_ids"())));



CREATE POLICY "Users can view their company associations" ON "public"."user_companies" FOR SELECT TO "authenticated" USING (("user_id" = ( SELECT "auth"."uid"() AS "uid")));



ALTER TABLE "public"."change_orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."clients" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."communications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."companies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."documents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."employees" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."equipment" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."material_usage" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."materials" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payroll" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."projects_new" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."suppliers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tasks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."time_tracking" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_companies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."get_user_company_ids"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_company_ids"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_company_ids"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_employee_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_employee_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_employee_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_role"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_user_update"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_user_update"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_user_update"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin_or_manager"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin_or_manager"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin_or_manager"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_existing_users"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_existing_users"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_existing_users"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."change_orders" TO "anon";
GRANT ALL ON TABLE "public"."change_orders" TO "authenticated";
GRANT ALL ON TABLE "public"."change_orders" TO "service_role";



GRANT ALL ON TABLE "public"."clients" TO "anon";
GRANT ALL ON TABLE "public"."clients" TO "authenticated";
GRANT ALL ON TABLE "public"."clients" TO "service_role";



GRANT ALL ON TABLE "public"."communications" TO "anon";
GRANT ALL ON TABLE "public"."communications" TO "authenticated";
GRANT ALL ON TABLE "public"."communications" TO "service_role";



GRANT ALL ON TABLE "public"."companies" TO "anon";
GRANT ALL ON TABLE "public"."companies" TO "authenticated";
GRANT ALL ON TABLE "public"."companies" TO "service_role";



GRANT ALL ON TABLE "public"."documents" TO "anon";
GRANT ALL ON TABLE "public"."documents" TO "authenticated";
GRANT ALL ON TABLE "public"."documents" TO "service_role";



GRANT ALL ON TABLE "public"."employees" TO "anon";
GRANT ALL ON TABLE "public"."employees" TO "authenticated";
GRANT ALL ON TABLE "public"."employees" TO "service_role";



GRANT ALL ON TABLE "public"."equipment" TO "anon";
GRANT ALL ON TABLE "public"."equipment" TO "authenticated";
GRANT ALL ON TABLE "public"."equipment" TO "service_role";



GRANT ALL ON TABLE "public"."financial_transactions" TO "anon";
GRANT ALL ON TABLE "public"."financial_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."financial_transactions" TO "service_role";



GRANT ALL ON TABLE "public"."material_usage" TO "anon";
GRANT ALL ON TABLE "public"."material_usage" TO "authenticated";
GRANT ALL ON TABLE "public"."material_usage" TO "service_role";



GRANT ALL ON TABLE "public"."materials" TO "anon";
GRANT ALL ON TABLE "public"."materials" TO "authenticated";
GRANT ALL ON TABLE "public"."materials" TO "service_role";



GRANT ALL ON TABLE "public"."payroll" TO "anon";
GRANT ALL ON TABLE "public"."payroll" TO "authenticated";
GRANT ALL ON TABLE "public"."payroll" TO "service_role";



GRANT ALL ON TABLE "public"."projects_new" TO "anon";
GRANT ALL ON TABLE "public"."projects_new" TO "authenticated";
GRANT ALL ON TABLE "public"."projects_new" TO "service_role";



GRANT ALL ON TABLE "public"."suppliers" TO "anon";
GRANT ALL ON TABLE "public"."suppliers" TO "authenticated";
GRANT ALL ON TABLE "public"."suppliers" TO "service_role";



GRANT ALL ON TABLE "public"."tasks" TO "anon";
GRANT ALL ON TABLE "public"."tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."tasks" TO "service_role";



GRANT ALL ON TABLE "public"."time_tracking" TO "anon";
GRANT ALL ON TABLE "public"."time_tracking" TO "authenticated";
GRANT ALL ON TABLE "public"."time_tracking" TO "service_role";



GRANT ALL ON TABLE "public"."user_companies" TO "anon";
GRANT ALL ON TABLE "public"."user_companies" TO "authenticated";
GRANT ALL ON TABLE "public"."user_companies" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
