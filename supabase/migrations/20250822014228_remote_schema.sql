drop extension if exists "pg_net";

create type "public"."transaction_type" as enum ('income', 'expense');


  create table "public"."change_orders" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid,
    "change_order_number" character varying(50) not null,
    "description" text not null,
    "reason" text,
    "original_amount" numeric(12,2),
    "change_amount" numeric(12,2) not null,
    "new_total_amount" numeric(12,2),
    "original_end_date" date,
    "new_end_date" date,
    "days_added" integer default 0,
    "status" character varying(20) default 'draft'::character varying,
    "requested_by" uuid,
    "approved_by" uuid,
    "approval_date" date,
    "notes" text,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP
      );


alter table "public"."change_orders" enable row level security;


  create table "public"."clients" (
    "id" uuid not null default gen_random_uuid(),
    "company_id" uuid,
    "first_name" character varying(100) not null,
    "last_name" character varying(100) not null,
    "email" character varying(255),
    "phone" character varying(20),
    "company_name" character varying(255),
    "address_line1" character varying(255),
    "address_line2" character varying(255),
    "city" character varying(100),
    "state" character varying(50),
    "zip_code" character varying(20),
    "country" character varying(50) default 'US'::character varying,
    "notes" text,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "type" character varying(20) default 'individual'::character varying,
    "secondary_phone" character varying(20),
    "preferred_contact_method" character varying(20) default 'email'::character varying,
    "rating" integer default 5,
    "is_active" boolean default true
      );


alter table "public"."clients" enable row level security;


  create table "public"."communications" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid,
    "client_id" uuid,
    "type" character varying(20) not null,
    "direction" character varying(20) not null,
    "subject" character varying(255),
    "content" text,
    "communication_date" timestamp without time zone not null,
    "participants" text,
    "follow_up_required" boolean default false,
    "follow_up_date" date,
    "created_by" uuid,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP
      );


alter table "public"."communications" enable row level security;


  create table "public"."companies" (
    "id" uuid not null default gen_random_uuid(),
    "name" character varying(255) not null,
    "legal_name" character varying(255),
    "tax_id" character varying(50),
    "license_number" character varying(100),
    "address_line1" character varying(255),
    "address_line2" character varying(255),
    "city" character varying(100),
    "state" character varying(50),
    "zip_code" character varying(20),
    "country" character varying(50) default 'US'::character varying,
    "phone" character varying(20),
    "email" character varying(255),
    "website" character varying(255),
    "logo_url" character varying(500),
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP
      );


alter table "public"."companies" enable row level security;


  create table "public"."documents" (
    "id" uuid not null default gen_random_uuid(),
    "company_id" uuid,
    "project_id" uuid,
    "client_id" uuid,
    "name" character varying(255) not null,
    "description" text,
    "file_url" character varying(500) not null,
    "file_type" character varying(50),
    "file_size" integer,
    "category" character varying(100),
    "tags" text,
    "is_public" boolean default false,
    "uploaded_by" uuid,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP
      );


alter table "public"."documents" enable row level security;


  create table "public"."employees" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "company_id" uuid,
    "employee_number" character varying(50),
    "hire_date" date not null,
    "termination_date" date,
    "job_title" character varying(100),
    "department" character varying(100),
    "hourly_rate" numeric(10,2),
    "salary" numeric(12,2),
    "pay_type" character varying(20) not null,
    "emergency_contact_name" character varying(255),
    "emergency_contact_phone" character varying(20),
    "certifications" text,
    "skills" text,
    "notes" text,
    "is_active" boolean default true,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP
      );


alter table "public"."employees" enable row level security;


  create table "public"."equipment" (
    "id" uuid not null default gen_random_uuid(),
    "company_id" uuid,
    "name" character varying(255) not null,
    "category" character varying(100),
    "make" character varying(100),
    "model" character varying(100),
    "serial_number" character varying(255),
    "purchase_date" date,
    "purchase_price" numeric(12,2),
    "current_value" numeric(12,2),
    "last_maintenance_date" date,
    "next_maintenance_date" date,
    "maintenance_interval_days" integer,
    "assigned_to" uuid,
    "current_project_id" uuid,
    "status" character varying(20) default 'available'::character varying,
    "condition" character varying(20) default 'good'::character varying,
    "location" character varying(255),
    "notes" text,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP
      );


alter table "public"."equipment" enable row level security;


  create table "public"."financial_transactions" (
    "id" uuid not null default uuid_generate_v4(),
    "company_id" uuid not null,
    "project_id" uuid,
    "user_id" uuid not null,
    "transaction_date" date not null,
    "description" text not null,
    "category" text not null,
    "amount" numeric(14,2) not null,
    "type" transaction_type not null,
    "attachment_file" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
      );



  create table "public"."material_usage" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid,
    "material_id" uuid,
    "quantity_used" numeric(10,3) not null,
    "unit_cost" numeric(10,2),
    "total_cost" numeric(12,2),
    "usage_date" date not null,
    "used_by" uuid,
    "notes" text,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP
      );


alter table "public"."material_usage" enable row level security;


  create table "public"."materials" (
    "id" uuid not null default gen_random_uuid(),
    "company_id" uuid,
    "name" character varying(255) not null,
    "category" character varying(100),
    "unit" character varying(50),
    "current_stock" numeric(10,3) default 0,
    "minimum_stock" numeric(10,3) default 0,
    "unit_cost" numeric(10,2),
    "supplier_id" uuid,
    "sku" character varying(100),
    "location" character varying(255),
    "notes" text,
    "is_active" boolean default true,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP
      );


alter table "public"."materials" enable row level security;


  create table "public"."payroll" (
    "id" uuid not null default gen_random_uuid(),
    "employee_id" uuid,
    "pay_period_start" date not null,
    "pay_period_end" date not null,
    "pay_date" date not null,
    "regular_hours" numeric(6,2) default 0,
    "overtime_hours" numeric(6,2) default 0,
    "regular_rate" numeric(10,2),
    "overtime_rate" numeric(10,2),
    "regular_pay" numeric(10,2) default 0,
    "overtime_pay" numeric(10,2) default 0,
    "bonus" numeric(10,2) default 0,
    "gross_pay" numeric(10,2) not null,
    "federal_tax" numeric(10,2) default 0,
    "state_tax" numeric(10,2) default 0,
    "social_security" numeric(10,2) default 0,
    "medicare" numeric(10,2) default 0,
    "insurance" numeric(10,2) default 0,
    "retirement" numeric(10,2) default 0,
    "other_deductions" numeric(10,2) default 0,
    "total_deductions" numeric(10,2) default 0,
    "net_pay" numeric(10,2) not null,
    "status" character varying(20) default 'draft'::character varying,
    "notes" text,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP
      );


alter table "public"."payroll" enable row level security;


  create table "public"."projects" (
    "id" uuid not null default gen_random_uuid(),
    "company_id" uuid,
    "name" character varying(255) not null,
    "description" text,
    "status" character varying(20) default 'planning'::character varying,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP
      );


alter table "public"."projects" enable row level security;


  create table "public"."projects_new" (
    "id" uuid not null default gen_random_uuid(),
    "company_id" uuid,
    "client_id" uuid,
    "project_number" character varying(50),
    "name" character varying(255) not null,
    "description" text,
    "project_type" character varying(100),
    "status" character varying(20) default 'planning'::character varying,
    "priority" character varying(20) default 'medium'::character varying,
    "start_date" date,
    "estimated_end_date" date,
    "actual_end_date" date,
    "budget" numeric(15,2),
    "contract_amount" numeric(15,2),
    "site_address_line1" character varying(255),
    "site_address_line2" character varying(255),
    "site_city" character varying(100),
    "site_state" character varying(50),
    "site_zip_code" character varying(20),
    "site_lat" numeric(10,8),
    "site_lng" numeric(11,8),
    "project_manager_id" uuid,
    "notes" text,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP
      );


alter table "public"."projects_new" enable row level security;


  create table "public"."suppliers" (
    "id" uuid not null default gen_random_uuid(),
    "company_id" uuid,
    "name" character varying(255) not null,
    "contact_name" character varying(255),
    "email" character varying(255),
    "phone" character varying(20),
    "address_line1" character varying(255),
    "address_line2" character varying(255),
    "city" character varying(100),
    "state" character varying(50),
    "zip_code" character varying(20),
    "country" character varying(50) default 'US'::character varying,
    "tax_id" character varying(50),
    "payment_terms" character varying(100),
    "notes" text,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP
      );


alter table "public"."suppliers" enable row level security;


  create table "public"."tasks" (
    "id" uuid not null default gen_random_uuid(),
    "project_id" uuid,
    "parent_task_id" uuid,
    "name" character varying(255) not null,
    "description" text,
    "status" character varying(20) default 'not_started'::character varying,
    "priority" character varying(20) default 'medium'::character varying,
    "assigned_to" uuid,
    "estimated_hours" numeric(6,2),
    "actual_hours" numeric(6,2),
    "start_date" date,
    "due_date" date,
    "completion_date" date,
    "completion_percentage" integer default 0,
    "dependencies" text,
    "notes" text,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP
      );


alter table "public"."tasks" enable row level security;


  create table "public"."time_tracking" (
    "id" uuid not null default gen_random_uuid(),
    "employee_id" uuid,
    "project_id" uuid,
    "clock_in" timestamp without time zone not null,
    "clock_out" timestamp without time zone,
    "break_duration" integer default 0,
    "total_hours" numeric(5,2),
    "overtime_hours" numeric(5,2) default 0,
    "hourly_rate" numeric(10,2),
    "location_lat" numeric(10,8),
    "location_lng" numeric(11,8),
    "notes" text,
    "status" character varying(20) default 'active'::character varying,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP
      );


alter table "public"."time_tracking" enable row level security;


  create table "public"."user_companies" (
    "user_id" uuid not null,
    "company_id" uuid not null,
    "role" character varying(50)
      );


alter table "public"."user_companies" enable row level security;


  create table "public"."users" (
    "id" uuid not null default gen_random_uuid(),
    "email" character varying(255) not null,
    "password_hash" character varying(255) not null,
    "first_name" character varying(100) not null,
    "last_name" character varying(100) not null,
    "phone" character varying(20),
    "role" character varying(20) not null,
    "is_active" boolean default true,
    "last_login" timestamp without time zone,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone default CURRENT_TIMESTAMP
      );


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX change_orders_pkey ON public.change_orders USING btree (id);

CREATE UNIQUE INDEX clients_pkey ON public.clients USING btree (id);

CREATE UNIQUE INDEX communications_pkey ON public.communications USING btree (id);

CREATE UNIQUE INDEX companies_pkey ON public.companies USING btree (id);

CREATE UNIQUE INDEX documents_pkey ON public.documents USING btree (id);

CREATE UNIQUE INDEX employees_employee_number_key ON public.employees USING btree (employee_number);

CREATE UNIQUE INDEX employees_pkey ON public.employees USING btree (id);

CREATE UNIQUE INDEX equipment_pkey ON public.equipment USING btree (id);

CREATE INDEX financial_transactions_company_id_transaction_date_idx ON public.financial_transactions USING btree (company_id, transaction_date DESC);

CREATE UNIQUE INDEX financial_transactions_pkey ON public.financial_transactions USING btree (id);

CREATE INDEX idx_change_orders_project ON public.change_orders USING btree (project_id);

CREATE INDEX idx_clients_is_active ON public.clients USING btree (is_active);

CREATE INDEX idx_clients_preferred_contact ON public.clients USING btree (preferred_contact_method);

CREATE INDEX idx_clients_type ON public.clients USING btree (type);

CREATE INDEX idx_communications_project ON public.communications USING btree (project_id);

CREATE INDEX idx_documents_project ON public.documents USING btree (project_id);

CREATE INDEX idx_employees_company_id ON public.employees USING btree (company_id);

CREATE INDEX idx_employees_user_id ON public.employees USING btree (user_id);

CREATE INDEX idx_equipment_assigned ON public.equipment USING btree (assigned_to);

CREATE INDEX idx_equipment_assigned_to ON public.equipment USING btree (assigned_to);

CREATE INDEX idx_equipment_company ON public.equipment USING btree (company_id);

CREATE INDEX idx_material_usage_project ON public.material_usage USING btree (project_id);

CREATE INDEX idx_materials_company ON public.materials USING btree (company_id);

CREATE INDEX idx_payroll_employee ON public.payroll USING btree (employee_id);

CREATE INDEX idx_payroll_employee_id ON public.payroll USING btree (employee_id);

CREATE INDEX idx_projects_new_company_id ON public.projects_new USING btree (company_id);

CREATE INDEX idx_tasks_assigned ON public.tasks USING btree (assigned_to);

CREATE INDEX idx_tasks_assigned_to ON public.tasks USING btree (assigned_to);

CREATE INDEX idx_tasks_due_date ON public.tasks USING btree (due_date);

CREATE INDEX idx_tasks_project ON public.tasks USING btree (project_id);

CREATE INDEX idx_tasks_status ON public.tasks USING btree (status);

CREATE INDEX idx_time_tracking_employee_id ON public.time_tracking USING btree (employee_id);

CREATE INDEX idx_user_companies_company_id ON public.user_companies USING btree (company_id);

CREATE INDEX idx_user_companies_user_id ON public.user_companies USING btree (user_id);

CREATE INDEX idx_users_role ON public.users USING btree (role);

CREATE UNIQUE INDEX material_usage_pkey ON public.material_usage USING btree (id);

CREATE UNIQUE INDEX materials_pkey ON public.materials USING btree (id);

CREATE UNIQUE INDEX payroll_pkey ON public.payroll USING btree (id);

CREATE UNIQUE INDEX projects_new_pkey ON public.projects_new USING btree (id);

CREATE UNIQUE INDEX projects_new_project_number_key ON public.projects_new USING btree (project_number);

CREATE UNIQUE INDEX projects_pkey ON public.projects USING btree (id);

CREATE UNIQUE INDEX suppliers_pkey ON public.suppliers USING btree (id);

CREATE UNIQUE INDEX tasks_pkey ON public.tasks USING btree (id);

CREATE UNIQUE INDEX time_tracking_pkey ON public.time_tracking USING btree (id);

CREATE UNIQUE INDEX user_companies_pkey ON public.user_companies USING btree (user_id, company_id);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."change_orders" add constraint "change_orders_pkey" PRIMARY KEY using index "change_orders_pkey";

alter table "public"."clients" add constraint "clients_pkey" PRIMARY KEY using index "clients_pkey";

alter table "public"."communications" add constraint "communications_pkey" PRIMARY KEY using index "communications_pkey";

alter table "public"."companies" add constraint "companies_pkey" PRIMARY KEY using index "companies_pkey";

alter table "public"."documents" add constraint "documents_pkey" PRIMARY KEY using index "documents_pkey";

alter table "public"."employees" add constraint "employees_pkey" PRIMARY KEY using index "employees_pkey";

alter table "public"."equipment" add constraint "equipment_pkey" PRIMARY KEY using index "equipment_pkey";

alter table "public"."financial_transactions" add constraint "financial_transactions_pkey" PRIMARY KEY using index "financial_transactions_pkey";

alter table "public"."material_usage" add constraint "material_usage_pkey" PRIMARY KEY using index "material_usage_pkey";

alter table "public"."materials" add constraint "materials_pkey" PRIMARY KEY using index "materials_pkey";

alter table "public"."payroll" add constraint "payroll_pkey" PRIMARY KEY using index "payroll_pkey";

alter table "public"."projects" add constraint "projects_pkey" PRIMARY KEY using index "projects_pkey";

alter table "public"."projects_new" add constraint "projects_new_pkey" PRIMARY KEY using index "projects_new_pkey";

alter table "public"."suppliers" add constraint "suppliers_pkey" PRIMARY KEY using index "suppliers_pkey";

alter table "public"."tasks" add constraint "tasks_pkey" PRIMARY KEY using index "tasks_pkey";

alter table "public"."time_tracking" add constraint "time_tracking_pkey" PRIMARY KEY using index "time_tracking_pkey";

alter table "public"."user_companies" add constraint "user_companies_pkey" PRIMARY KEY using index "user_companies_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."change_orders" add constraint "change_orders_approved_by_fkey" FOREIGN KEY (approved_by) REFERENCES users(id) not valid;

alter table "public"."change_orders" validate constraint "change_orders_approved_by_fkey";

alter table "public"."change_orders" add constraint "change_orders_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects_new(id) not valid;

alter table "public"."change_orders" validate constraint "change_orders_project_id_fkey";

alter table "public"."change_orders" add constraint "change_orders_requested_by_fkey" FOREIGN KEY (requested_by) REFERENCES users(id) not valid;

alter table "public"."change_orders" validate constraint "change_orders_requested_by_fkey";

alter table "public"."change_orders" add constraint "change_orders_status_check" CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'pending_approval'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[]))) not valid;

alter table "public"."change_orders" validate constraint "change_orders_status_check";

alter table "public"."clients" add constraint "clients_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) not valid;

alter table "public"."clients" validate constraint "clients_company_id_fkey";

alter table "public"."clients" add constraint "clients_preferred_contact_method_check" CHECK (((preferred_contact_method)::text = ANY ((ARRAY['email'::character varying, 'phone'::character varying, 'text'::character varying])::text[]))) not valid;

alter table "public"."clients" validate constraint "clients_preferred_contact_method_check";

alter table "public"."clients" add constraint "clients_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."clients" validate constraint "clients_rating_check";

alter table "public"."clients" add constraint "clients_type_check" CHECK (((type)::text = ANY ((ARRAY['individual'::character varying, 'business'::character varying])::text[]))) not valid;

alter table "public"."clients" validate constraint "clients_type_check";

alter table "public"."communications" add constraint "communications_client_id_fkey" FOREIGN KEY (client_id) REFERENCES clients(id) not valid;

alter table "public"."communications" validate constraint "communications_client_id_fkey";

alter table "public"."communications" add constraint "communications_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(id) not valid;

alter table "public"."communications" validate constraint "communications_created_by_fkey";

alter table "public"."communications" add constraint "communications_direction_check" CHECK (((direction)::text = ANY ((ARRAY['inbound'::character varying, 'outbound'::character varying])::text[]))) not valid;

alter table "public"."communications" validate constraint "communications_direction_check";

alter table "public"."communications" add constraint "communications_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects_new(id) not valid;

alter table "public"."communications" validate constraint "communications_project_id_fkey";

alter table "public"."communications" add constraint "communications_type_check" CHECK (((type)::text = ANY ((ARRAY['email'::character varying, 'phone'::character varying, 'meeting'::character varying, 'text'::character varying, 'site_visit'::character varying])::text[]))) not valid;

alter table "public"."communications" validate constraint "communications_type_check";

alter table "public"."documents" add constraint "documents_client_id_fkey" FOREIGN KEY (client_id) REFERENCES clients(id) not valid;

alter table "public"."documents" validate constraint "documents_client_id_fkey";

alter table "public"."documents" add constraint "documents_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) not valid;

alter table "public"."documents" validate constraint "documents_company_id_fkey";

alter table "public"."documents" add constraint "documents_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects_new(id) not valid;

alter table "public"."documents" validate constraint "documents_project_id_fkey";

alter table "public"."documents" add constraint "documents_uploaded_by_fkey" FOREIGN KEY (uploaded_by) REFERENCES users(id) not valid;

alter table "public"."documents" validate constraint "documents_uploaded_by_fkey";

alter table "public"."employees" add constraint "employees_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) not valid;

alter table "public"."employees" validate constraint "employees_company_id_fkey";

alter table "public"."employees" add constraint "employees_employee_number_key" UNIQUE using index "employees_employee_number_key";

alter table "public"."employees" add constraint "employees_pay_type_check" CHECK (((pay_type)::text = ANY ((ARRAY['hourly'::character varying, 'salary'::character varying, 'contract'::character varying])::text[]))) not valid;

alter table "public"."employees" validate constraint "employees_pay_type_check";

alter table "public"."employees" add constraint "employees_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."employees" validate constraint "employees_user_id_fkey";

alter table "public"."equipment" add constraint "equipment_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES employees(id) not valid;

alter table "public"."equipment" validate constraint "equipment_assigned_to_fkey";

alter table "public"."equipment" add constraint "equipment_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) not valid;

alter table "public"."equipment" validate constraint "equipment_company_id_fkey";

alter table "public"."equipment" add constraint "equipment_condition_check" CHECK (((condition)::text = ANY ((ARRAY['excellent'::character varying, 'good'::character varying, 'fair'::character varying, 'poor'::character varying])::text[]))) not valid;

alter table "public"."equipment" validate constraint "equipment_condition_check";

alter table "public"."equipment" add constraint "equipment_current_project_id_fkey" FOREIGN KEY (current_project_id) REFERENCES projects_new(id) not valid;

alter table "public"."equipment" validate constraint "equipment_current_project_id_fkey";

alter table "public"."equipment" add constraint "equipment_status_check" CHECK (((status)::text = ANY ((ARRAY['available'::character varying, 'in_use'::character varying, 'maintenance'::character varying, 'retired'::character varying])::text[]))) not valid;

alter table "public"."equipment" validate constraint "equipment_status_check";

alter table "public"."financial_transactions" add constraint "financial_transactions_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE not valid;

alter table "public"."financial_transactions" validate constraint "financial_transactions_company_id_fkey";

alter table "public"."financial_transactions" add constraint "financial_transactions_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects_new(id) not valid;

alter table "public"."financial_transactions" validate constraint "financial_transactions_project_id_fkey";

alter table "public"."financial_transactions" add constraint "financial_transactions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL not valid;

alter table "public"."financial_transactions" validate constraint "financial_transactions_user_id_fkey";

alter table "public"."material_usage" add constraint "material_usage_material_id_fkey" FOREIGN KEY (material_id) REFERENCES materials(id) not valid;

alter table "public"."material_usage" validate constraint "material_usage_material_id_fkey";

alter table "public"."material_usage" add constraint "material_usage_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects_new(id) not valid;

alter table "public"."material_usage" validate constraint "material_usage_project_id_fkey";

alter table "public"."material_usage" add constraint "material_usage_used_by_fkey" FOREIGN KEY (used_by) REFERENCES employees(id) not valid;

alter table "public"."material_usage" validate constraint "material_usage_used_by_fkey";

alter table "public"."materials" add constraint "materials_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) not valid;

alter table "public"."materials" validate constraint "materials_company_id_fkey";

alter table "public"."materials" add constraint "materials_supplier_id_fkey" FOREIGN KEY (supplier_id) REFERENCES suppliers(id) not valid;

alter table "public"."materials" validate constraint "materials_supplier_id_fkey";

alter table "public"."payroll" add constraint "payroll_employee_id_fkey" FOREIGN KEY (employee_id) REFERENCES employees(id) not valid;

alter table "public"."payroll" validate constraint "payroll_employee_id_fkey";

alter table "public"."payroll" add constraint "payroll_status_check" CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'processed'::character varying, 'paid'::character varying])::text[]))) not valid;

alter table "public"."payroll" validate constraint "payroll_status_check";

alter table "public"."projects" add constraint "projects_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) not valid;

alter table "public"."projects" validate constraint "projects_company_id_fkey";

alter table "public"."projects_new" add constraint "projects_new_client_id_fkey" FOREIGN KEY (client_id) REFERENCES clients(id) not valid;

alter table "public"."projects_new" validate constraint "projects_new_client_id_fkey";

alter table "public"."projects_new" add constraint "projects_new_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) not valid;

alter table "public"."projects_new" validate constraint "projects_new_company_id_fkey";

alter table "public"."projects_new" add constraint "projects_new_priority_check" CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::text[]))) not valid;

alter table "public"."projects_new" validate constraint "projects_new_priority_check";

alter table "public"."projects_new" add constraint "projects_new_project_manager_id_fkey" FOREIGN KEY (project_manager_id) REFERENCES employees(id) not valid;

alter table "public"."projects_new" validate constraint "projects_new_project_manager_id_fkey";

alter table "public"."projects_new" add constraint "projects_new_project_number_key" UNIQUE using index "projects_new_project_number_key";

alter table "public"."projects_new" add constraint "projects_new_status_check" CHECK (((status)::text = ANY ((ARRAY['planning'::character varying, 'in_progress'::character varying, 'on_hold'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[]))) not valid;

alter table "public"."projects_new" validate constraint "projects_new_status_check";

alter table "public"."suppliers" add constraint "suppliers_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) not valid;

alter table "public"."suppliers" validate constraint "suppliers_company_id_fkey";

alter table "public"."tasks" add constraint "tasks_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES employees(id) not valid;

alter table "public"."tasks" validate constraint "tasks_assigned_to_fkey";

alter table "public"."tasks" add constraint "tasks_completion_percentage_check" CHECK (((completion_percentage >= 0) AND (completion_percentage <= 100))) not valid;

alter table "public"."tasks" validate constraint "tasks_completion_percentage_check";

alter table "public"."tasks" add constraint "tasks_parent_task_id_fkey" FOREIGN KEY (parent_task_id) REFERENCES tasks(id) not valid;

alter table "public"."tasks" validate constraint "tasks_parent_task_id_fkey";

alter table "public"."tasks" add constraint "tasks_priority_check" CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::text[]))) not valid;

alter table "public"."tasks" validate constraint "tasks_priority_check";

alter table "public"."tasks" add constraint "tasks_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects_new(id) not valid;

alter table "public"."tasks" validate constraint "tasks_project_id_fkey";

alter table "public"."tasks" add constraint "tasks_status_check" CHECK (((status)::text = ANY ((ARRAY['not_started'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'on_hold'::character varying])::text[]))) not valid;

alter table "public"."tasks" validate constraint "tasks_status_check";

alter table "public"."time_tracking" add constraint "time_tracking_employee_id_fkey" FOREIGN KEY (employee_id) REFERENCES employees(id) not valid;

alter table "public"."time_tracking" validate constraint "time_tracking_employee_id_fkey";

alter table "public"."time_tracking" add constraint "time_tracking_project_id_fkey" FOREIGN KEY (project_id) REFERENCES projects(id) not valid;

alter table "public"."time_tracking" validate constraint "time_tracking_project_id_fkey";

alter table "public"."time_tracking" add constraint "time_tracking_status_check" CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'completed'::character varying, 'approved'::character varying])::text[]))) not valid;

alter table "public"."time_tracking" validate constraint "time_tracking_status_check";

alter table "public"."user_companies" add constraint "user_companies_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) not valid;

alter table "public"."user_companies" validate constraint "user_companies_company_id_fkey";

alter table "public"."user_companies" add constraint "user_companies_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."user_companies" validate constraint "user_companies_user_id_fkey";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

alter table "public"."users" add constraint "users_role_check" CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'manager'::character varying, 'employee'::character varying, 'client'::character varying])::text[]))) not valid;

alter table "public"."users" validate constraint "users_role_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_company_ids()
 RETURNS uuid[]
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN ARRAY(
    SELECT company_id 
    FROM user_companies 
    WHERE user_id = (SELECT auth.uid())
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_employee_id()
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN (
    SELECT id FROM employees 
    WHERE user_id = (SELECT auth.uid())
    LIMIT 1
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_role()
 RETURNS character varying
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN (
    SELECT role FROM users 
    WHERE id = (SELECT auth.uid())
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.handle_user_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = (SELECT auth.uid()) 
    AND role = 'admin'
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = (SELECT auth.uid()) 
    AND role IN ('admin', 'manager')
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.sync_existing_users()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."change_orders" to "anon";

grant insert on table "public"."change_orders" to "anon";

grant references on table "public"."change_orders" to "anon";

grant select on table "public"."change_orders" to "anon";

grant trigger on table "public"."change_orders" to "anon";

grant truncate on table "public"."change_orders" to "anon";

grant update on table "public"."change_orders" to "anon";

grant delete on table "public"."change_orders" to "authenticated";

grant insert on table "public"."change_orders" to "authenticated";

grant references on table "public"."change_orders" to "authenticated";

grant select on table "public"."change_orders" to "authenticated";

grant trigger on table "public"."change_orders" to "authenticated";

grant truncate on table "public"."change_orders" to "authenticated";

grant update on table "public"."change_orders" to "authenticated";

grant delete on table "public"."change_orders" to "service_role";

grant insert on table "public"."change_orders" to "service_role";

grant references on table "public"."change_orders" to "service_role";

grant select on table "public"."change_orders" to "service_role";

grant trigger on table "public"."change_orders" to "service_role";

grant truncate on table "public"."change_orders" to "service_role";

grant update on table "public"."change_orders" to "service_role";

grant delete on table "public"."clients" to "anon";

grant insert on table "public"."clients" to "anon";

grant references on table "public"."clients" to "anon";

grant select on table "public"."clients" to "anon";

grant trigger on table "public"."clients" to "anon";

grant truncate on table "public"."clients" to "anon";

grant update on table "public"."clients" to "anon";

grant delete on table "public"."clients" to "authenticated";

grant insert on table "public"."clients" to "authenticated";

grant references on table "public"."clients" to "authenticated";

grant select on table "public"."clients" to "authenticated";

grant trigger on table "public"."clients" to "authenticated";

grant truncate on table "public"."clients" to "authenticated";

grant update on table "public"."clients" to "authenticated";

grant delete on table "public"."clients" to "service_role";

grant insert on table "public"."clients" to "service_role";

grant references on table "public"."clients" to "service_role";

grant select on table "public"."clients" to "service_role";

grant trigger on table "public"."clients" to "service_role";

grant truncate on table "public"."clients" to "service_role";

grant update on table "public"."clients" to "service_role";

grant delete on table "public"."communications" to "anon";

grant insert on table "public"."communications" to "anon";

grant references on table "public"."communications" to "anon";

grant select on table "public"."communications" to "anon";

grant trigger on table "public"."communications" to "anon";

grant truncate on table "public"."communications" to "anon";

grant update on table "public"."communications" to "anon";

grant delete on table "public"."communications" to "authenticated";

grant insert on table "public"."communications" to "authenticated";

grant references on table "public"."communications" to "authenticated";

grant select on table "public"."communications" to "authenticated";

grant trigger on table "public"."communications" to "authenticated";

grant truncate on table "public"."communications" to "authenticated";

grant update on table "public"."communications" to "authenticated";

grant delete on table "public"."communications" to "service_role";

grant insert on table "public"."communications" to "service_role";

grant references on table "public"."communications" to "service_role";

grant select on table "public"."communications" to "service_role";

grant trigger on table "public"."communications" to "service_role";

grant truncate on table "public"."communications" to "service_role";

grant update on table "public"."communications" to "service_role";

grant delete on table "public"."companies" to "anon";

grant insert on table "public"."companies" to "anon";

grant references on table "public"."companies" to "anon";

grant select on table "public"."companies" to "anon";

grant trigger on table "public"."companies" to "anon";

grant truncate on table "public"."companies" to "anon";

grant update on table "public"."companies" to "anon";

grant delete on table "public"."companies" to "authenticated";

grant insert on table "public"."companies" to "authenticated";

grant references on table "public"."companies" to "authenticated";

grant select on table "public"."companies" to "authenticated";

grant trigger on table "public"."companies" to "authenticated";

grant truncate on table "public"."companies" to "authenticated";

grant update on table "public"."companies" to "authenticated";

grant delete on table "public"."companies" to "service_role";

grant insert on table "public"."companies" to "service_role";

grant references on table "public"."companies" to "service_role";

grant select on table "public"."companies" to "service_role";

grant trigger on table "public"."companies" to "service_role";

grant truncate on table "public"."companies" to "service_role";

grant update on table "public"."companies" to "service_role";

grant delete on table "public"."documents" to "anon";

grant insert on table "public"."documents" to "anon";

grant references on table "public"."documents" to "anon";

grant select on table "public"."documents" to "anon";

grant trigger on table "public"."documents" to "anon";

grant truncate on table "public"."documents" to "anon";

grant update on table "public"."documents" to "anon";

grant delete on table "public"."documents" to "authenticated";

grant insert on table "public"."documents" to "authenticated";

grant references on table "public"."documents" to "authenticated";

grant select on table "public"."documents" to "authenticated";

grant trigger on table "public"."documents" to "authenticated";

grant truncate on table "public"."documents" to "authenticated";

grant update on table "public"."documents" to "authenticated";

grant delete on table "public"."documents" to "service_role";

grant insert on table "public"."documents" to "service_role";

grant references on table "public"."documents" to "service_role";

grant select on table "public"."documents" to "service_role";

grant trigger on table "public"."documents" to "service_role";

grant truncate on table "public"."documents" to "service_role";

grant update on table "public"."documents" to "service_role";

grant delete on table "public"."employees" to "anon";

grant insert on table "public"."employees" to "anon";

grant references on table "public"."employees" to "anon";

grant select on table "public"."employees" to "anon";

grant trigger on table "public"."employees" to "anon";

grant truncate on table "public"."employees" to "anon";

grant update on table "public"."employees" to "anon";

grant delete on table "public"."employees" to "authenticated";

grant insert on table "public"."employees" to "authenticated";

grant references on table "public"."employees" to "authenticated";

grant select on table "public"."employees" to "authenticated";

grant trigger on table "public"."employees" to "authenticated";

grant truncate on table "public"."employees" to "authenticated";

grant update on table "public"."employees" to "authenticated";

grant delete on table "public"."employees" to "service_role";

grant insert on table "public"."employees" to "service_role";

grant references on table "public"."employees" to "service_role";

grant select on table "public"."employees" to "service_role";

grant trigger on table "public"."employees" to "service_role";

grant truncate on table "public"."employees" to "service_role";

grant update on table "public"."employees" to "service_role";

grant delete on table "public"."equipment" to "anon";

grant insert on table "public"."equipment" to "anon";

grant references on table "public"."equipment" to "anon";

grant select on table "public"."equipment" to "anon";

grant trigger on table "public"."equipment" to "anon";

grant truncate on table "public"."equipment" to "anon";

grant update on table "public"."equipment" to "anon";

grant delete on table "public"."equipment" to "authenticated";

grant insert on table "public"."equipment" to "authenticated";

grant references on table "public"."equipment" to "authenticated";

grant select on table "public"."equipment" to "authenticated";

grant trigger on table "public"."equipment" to "authenticated";

grant truncate on table "public"."equipment" to "authenticated";

grant update on table "public"."equipment" to "authenticated";

grant delete on table "public"."equipment" to "service_role";

grant insert on table "public"."equipment" to "service_role";

grant references on table "public"."equipment" to "service_role";

grant select on table "public"."equipment" to "service_role";

grant trigger on table "public"."equipment" to "service_role";

grant truncate on table "public"."equipment" to "service_role";

grant update on table "public"."equipment" to "service_role";

grant delete on table "public"."financial_transactions" to "anon";

grant insert on table "public"."financial_transactions" to "anon";

grant references on table "public"."financial_transactions" to "anon";

grant select on table "public"."financial_transactions" to "anon";

grant trigger on table "public"."financial_transactions" to "anon";

grant truncate on table "public"."financial_transactions" to "anon";

grant update on table "public"."financial_transactions" to "anon";

grant delete on table "public"."financial_transactions" to "authenticated";

grant insert on table "public"."financial_transactions" to "authenticated";

grant references on table "public"."financial_transactions" to "authenticated";

grant select on table "public"."financial_transactions" to "authenticated";

grant trigger on table "public"."financial_transactions" to "authenticated";

grant truncate on table "public"."financial_transactions" to "authenticated";

grant update on table "public"."financial_transactions" to "authenticated";

grant delete on table "public"."financial_transactions" to "service_role";

grant insert on table "public"."financial_transactions" to "service_role";

grant references on table "public"."financial_transactions" to "service_role";

grant select on table "public"."financial_transactions" to "service_role";

grant trigger on table "public"."financial_transactions" to "service_role";

grant truncate on table "public"."financial_transactions" to "service_role";

grant update on table "public"."financial_transactions" to "service_role";

grant delete on table "public"."material_usage" to "anon";

grant insert on table "public"."material_usage" to "anon";

grant references on table "public"."material_usage" to "anon";

grant select on table "public"."material_usage" to "anon";

grant trigger on table "public"."material_usage" to "anon";

grant truncate on table "public"."material_usage" to "anon";

grant update on table "public"."material_usage" to "anon";

grant delete on table "public"."material_usage" to "authenticated";

grant insert on table "public"."material_usage" to "authenticated";

grant references on table "public"."material_usage" to "authenticated";

grant select on table "public"."material_usage" to "authenticated";

grant trigger on table "public"."material_usage" to "authenticated";

grant truncate on table "public"."material_usage" to "authenticated";

grant update on table "public"."material_usage" to "authenticated";

grant delete on table "public"."material_usage" to "service_role";

grant insert on table "public"."material_usage" to "service_role";

grant references on table "public"."material_usage" to "service_role";

grant select on table "public"."material_usage" to "service_role";

grant trigger on table "public"."material_usage" to "service_role";

grant truncate on table "public"."material_usage" to "service_role";

grant update on table "public"."material_usage" to "service_role";

grant delete on table "public"."materials" to "anon";

grant insert on table "public"."materials" to "anon";

grant references on table "public"."materials" to "anon";

grant select on table "public"."materials" to "anon";

grant trigger on table "public"."materials" to "anon";

grant truncate on table "public"."materials" to "anon";

grant update on table "public"."materials" to "anon";

grant delete on table "public"."materials" to "authenticated";

grant insert on table "public"."materials" to "authenticated";

grant references on table "public"."materials" to "authenticated";

grant select on table "public"."materials" to "authenticated";

grant trigger on table "public"."materials" to "authenticated";

grant truncate on table "public"."materials" to "authenticated";

grant update on table "public"."materials" to "authenticated";

grant delete on table "public"."materials" to "service_role";

grant insert on table "public"."materials" to "service_role";

grant references on table "public"."materials" to "service_role";

grant select on table "public"."materials" to "service_role";

grant trigger on table "public"."materials" to "service_role";

grant truncate on table "public"."materials" to "service_role";

grant update on table "public"."materials" to "service_role";

grant delete on table "public"."payroll" to "anon";

grant insert on table "public"."payroll" to "anon";

grant references on table "public"."payroll" to "anon";

grant select on table "public"."payroll" to "anon";

grant trigger on table "public"."payroll" to "anon";

grant truncate on table "public"."payroll" to "anon";

grant update on table "public"."payroll" to "anon";

grant delete on table "public"."payroll" to "authenticated";

grant insert on table "public"."payroll" to "authenticated";

grant references on table "public"."payroll" to "authenticated";

grant select on table "public"."payroll" to "authenticated";

grant trigger on table "public"."payroll" to "authenticated";

grant truncate on table "public"."payroll" to "authenticated";

grant update on table "public"."payroll" to "authenticated";

grant delete on table "public"."payroll" to "service_role";

grant insert on table "public"."payroll" to "service_role";

grant references on table "public"."payroll" to "service_role";

grant select on table "public"."payroll" to "service_role";

grant trigger on table "public"."payroll" to "service_role";

grant truncate on table "public"."payroll" to "service_role";

grant update on table "public"."payroll" to "service_role";

grant delete on table "public"."projects" to "anon";

grant insert on table "public"."projects" to "anon";

grant references on table "public"."projects" to "anon";

grant select on table "public"."projects" to "anon";

grant trigger on table "public"."projects" to "anon";

grant truncate on table "public"."projects" to "anon";

grant update on table "public"."projects" to "anon";

grant delete on table "public"."projects" to "authenticated";

grant insert on table "public"."projects" to "authenticated";

grant references on table "public"."projects" to "authenticated";

grant select on table "public"."projects" to "authenticated";

grant trigger on table "public"."projects" to "authenticated";

grant truncate on table "public"."projects" to "authenticated";

grant update on table "public"."projects" to "authenticated";

grant delete on table "public"."projects" to "service_role";

grant insert on table "public"."projects" to "service_role";

grant references on table "public"."projects" to "service_role";

grant select on table "public"."projects" to "service_role";

grant trigger on table "public"."projects" to "service_role";

grant truncate on table "public"."projects" to "service_role";

grant update on table "public"."projects" to "service_role";

grant delete on table "public"."projects_new" to "anon";

grant insert on table "public"."projects_new" to "anon";

grant references on table "public"."projects_new" to "anon";

grant select on table "public"."projects_new" to "anon";

grant trigger on table "public"."projects_new" to "anon";

grant truncate on table "public"."projects_new" to "anon";

grant update on table "public"."projects_new" to "anon";

grant delete on table "public"."projects_new" to "authenticated";

grant insert on table "public"."projects_new" to "authenticated";

grant references on table "public"."projects_new" to "authenticated";

grant select on table "public"."projects_new" to "authenticated";

grant trigger on table "public"."projects_new" to "authenticated";

grant truncate on table "public"."projects_new" to "authenticated";

grant update on table "public"."projects_new" to "authenticated";

grant delete on table "public"."projects_new" to "service_role";

grant insert on table "public"."projects_new" to "service_role";

grant references on table "public"."projects_new" to "service_role";

grant select on table "public"."projects_new" to "service_role";

grant trigger on table "public"."projects_new" to "service_role";

grant truncate on table "public"."projects_new" to "service_role";

grant update on table "public"."projects_new" to "service_role";

grant delete on table "public"."suppliers" to "anon";

grant insert on table "public"."suppliers" to "anon";

grant references on table "public"."suppliers" to "anon";

grant select on table "public"."suppliers" to "anon";

grant trigger on table "public"."suppliers" to "anon";

grant truncate on table "public"."suppliers" to "anon";

grant update on table "public"."suppliers" to "anon";

grant delete on table "public"."suppliers" to "authenticated";

grant insert on table "public"."suppliers" to "authenticated";

grant references on table "public"."suppliers" to "authenticated";

grant select on table "public"."suppliers" to "authenticated";

grant trigger on table "public"."suppliers" to "authenticated";

grant truncate on table "public"."suppliers" to "authenticated";

grant update on table "public"."suppliers" to "authenticated";

grant delete on table "public"."suppliers" to "service_role";

grant insert on table "public"."suppliers" to "service_role";

grant references on table "public"."suppliers" to "service_role";

grant select on table "public"."suppliers" to "service_role";

grant trigger on table "public"."suppliers" to "service_role";

grant truncate on table "public"."suppliers" to "service_role";

grant update on table "public"."suppliers" to "service_role";

grant delete on table "public"."tasks" to "anon";

grant insert on table "public"."tasks" to "anon";

grant references on table "public"."tasks" to "anon";

grant select on table "public"."tasks" to "anon";

grant trigger on table "public"."tasks" to "anon";

grant truncate on table "public"."tasks" to "anon";

grant update on table "public"."tasks" to "anon";

grant delete on table "public"."tasks" to "authenticated";

grant insert on table "public"."tasks" to "authenticated";

grant references on table "public"."tasks" to "authenticated";

grant select on table "public"."tasks" to "authenticated";

grant trigger on table "public"."tasks" to "authenticated";

grant truncate on table "public"."tasks" to "authenticated";

grant update on table "public"."tasks" to "authenticated";

grant delete on table "public"."tasks" to "service_role";

grant insert on table "public"."tasks" to "service_role";

grant references on table "public"."tasks" to "service_role";

grant select on table "public"."tasks" to "service_role";

grant trigger on table "public"."tasks" to "service_role";

grant truncate on table "public"."tasks" to "service_role";

grant update on table "public"."tasks" to "service_role";

grant delete on table "public"."time_tracking" to "anon";

grant insert on table "public"."time_tracking" to "anon";

grant references on table "public"."time_tracking" to "anon";

grant select on table "public"."time_tracking" to "anon";

grant trigger on table "public"."time_tracking" to "anon";

grant truncate on table "public"."time_tracking" to "anon";

grant update on table "public"."time_tracking" to "anon";

grant delete on table "public"."time_tracking" to "authenticated";

grant insert on table "public"."time_tracking" to "authenticated";

grant references on table "public"."time_tracking" to "authenticated";

grant select on table "public"."time_tracking" to "authenticated";

grant trigger on table "public"."time_tracking" to "authenticated";

grant truncate on table "public"."time_tracking" to "authenticated";

grant update on table "public"."time_tracking" to "authenticated";

grant delete on table "public"."time_tracking" to "service_role";

grant insert on table "public"."time_tracking" to "service_role";

grant references on table "public"."time_tracking" to "service_role";

grant select on table "public"."time_tracking" to "service_role";

grant trigger on table "public"."time_tracking" to "service_role";

grant truncate on table "public"."time_tracking" to "service_role";

grant update on table "public"."time_tracking" to "service_role";

grant delete on table "public"."user_companies" to "anon";

grant insert on table "public"."user_companies" to "anon";

grant references on table "public"."user_companies" to "anon";

grant select on table "public"."user_companies" to "anon";

grant trigger on table "public"."user_companies" to "anon";

grant truncate on table "public"."user_companies" to "anon";

grant update on table "public"."user_companies" to "anon";

grant delete on table "public"."user_companies" to "authenticated";

grant insert on table "public"."user_companies" to "authenticated";

grant references on table "public"."user_companies" to "authenticated";

grant select on table "public"."user_companies" to "authenticated";

grant trigger on table "public"."user_companies" to "authenticated";

grant truncate on table "public"."user_companies" to "authenticated";

grant update on table "public"."user_companies" to "authenticated";

grant delete on table "public"."user_companies" to "service_role";

grant insert on table "public"."user_companies" to "service_role";

grant references on table "public"."user_companies" to "service_role";

grant select on table "public"."user_companies" to "service_role";

grant trigger on table "public"."user_companies" to "service_role";

grant truncate on table "public"."user_companies" to "service_role";

grant update on table "public"."user_companies" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";


  create policy "Managers and admins can manage change orders"
  on "public"."change_orders"
  as permissive
  for all
  to authenticated
using (((project_id IN ( SELECT projects_new.id
   FROM projects_new
  WHERE (projects_new.company_id = ANY (get_user_company_ids())))) AND is_admin_or_manager()))
with check (((project_id IN ( SELECT projects_new.id
   FROM projects_new
  WHERE (projects_new.company_id = ANY (get_user_company_ids())))) AND is_admin_or_manager()));



  create policy "Users can view company change orders"
  on "public"."change_orders"
  as permissive
  for select
  to authenticated
using ((project_id IN ( SELECT projects_new.id
   FROM projects_new
  WHERE (projects_new.company_id = ANY (get_user_company_ids())))));



  create policy "Managers and admins can manage clients"
  on "public"."clients"
  as permissive
  for all
  to authenticated
using (((company_id = ANY (get_user_company_ids())) AND is_admin_or_manager()))
with check (((company_id = ANY (get_user_company_ids())) AND is_admin_or_manager()));



  create policy "Users can view company clients"
  on "public"."clients"
  as permissive
  for select
  to authenticated
using ((company_id = ANY (get_user_company_ids())));



  create policy "Managers and admins can manage communications"
  on "public"."communications"
  as permissive
  for all
  to authenticated
using ((((project_id IN ( SELECT projects_new.id
   FROM projects_new
  WHERE (projects_new.company_id = ANY (get_user_company_ids())))) OR (client_id IN ( SELECT clients.id
   FROM clients
  WHERE (clients.company_id = ANY (get_user_company_ids()))))) AND is_admin_or_manager()))
with check ((((project_id IN ( SELECT projects_new.id
   FROM projects_new
  WHERE (projects_new.company_id = ANY (get_user_company_ids())))) OR (client_id IN ( SELECT clients.id
   FROM clients
  WHERE (clients.company_id = ANY (get_user_company_ids()))))) AND is_admin_or_manager()));



  create policy "Users can view company communications"
  on "public"."communications"
  as permissive
  for select
  to authenticated
using (((project_id IN ( SELECT projects_new.id
   FROM projects_new
  WHERE (projects_new.company_id = ANY (get_user_company_ids())))) OR (client_id IN ( SELECT clients.id
   FROM clients
  WHERE (clients.company_id = ANY (get_user_company_ids()))))));



  create policy "Only admins can manage companies"
  on "public"."companies"
  as permissive
  for all
  to authenticated
using (is_admin())
with check (is_admin());



  create policy "Users can view their companies"
  on "public"."companies"
  as permissive
  for select
  to authenticated
using ((id = ANY (get_user_company_ids())));



  create policy "Managers and admins can manage documents"
  on "public"."documents"
  as permissive
  for all
  to authenticated
using (((company_id = ANY (get_user_company_ids())) AND is_admin_or_manager()))
with check (((company_id = ANY (get_user_company_ids())) AND is_admin_or_manager()));



  create policy "Users can view company documents"
  on "public"."documents"
  as permissive
  for select
  to authenticated
using ((company_id = ANY (get_user_company_ids())));



  create policy "Users can view public documents"
  on "public"."documents"
  as permissive
  for select
  to authenticated
using ((is_public = true));



  create policy "Managers and admins can manage employees"
  on "public"."employees"
  as permissive
  for all
  to authenticated
using (((company_id = ANY (get_user_company_ids())) AND is_admin_or_manager()))
with check (((company_id = ANY (get_user_company_ids())) AND is_admin_or_manager()));



  create policy "Users can update own employee record"
  on "public"."employees"
  as permissive
  for update
  to authenticated
using ((user_id = ( SELECT auth.uid() AS uid)))
with check (((user_id = ( SELECT auth.uid() AS uid)) AND (company_id = ANY (get_user_company_ids()))));



  create policy "Users can view company employees"
  on "public"."employees"
  as permissive
  for select
  to authenticated
using ((company_id = ANY (get_user_company_ids())));



  create policy "Users can view own employee record"
  on "public"."employees"
  as permissive
  for select
  to authenticated
using ((user_id = ( SELECT auth.uid() AS uid)));



  create policy "Managers and admins can manage equipment"
  on "public"."equipment"
  as permissive
  for all
  to authenticated
using (((company_id = ANY (get_user_company_ids())) AND is_admin_or_manager()))
with check (((company_id = ANY (get_user_company_ids())) AND is_admin_or_manager()));



  create policy "Users can view assigned equipment"
  on "public"."equipment"
  as permissive
  for select
  to authenticated
using ((assigned_to = get_user_employee_id()));



  create policy "Users can view company equipment"
  on "public"."equipment"
  as permissive
  for select
  to authenticated
using ((company_id = ANY (get_user_company_ids())));



  create policy "Managers and admins can manage material usage"
  on "public"."material_usage"
  as permissive
  for all
  to authenticated
using (((project_id IN ( SELECT projects_new.id
   FROM projects_new
  WHERE (projects_new.company_id = ANY (get_user_company_ids())))) AND is_admin_or_manager()))
with check (((project_id IN ( SELECT projects_new.id
   FROM projects_new
  WHERE (projects_new.company_id = ANY (get_user_company_ids())))) AND is_admin_or_manager()));



  create policy "Users can view company material usage"
  on "public"."material_usage"
  as permissive
  for select
  to authenticated
using ((project_id IN ( SELECT projects_new.id
   FROM projects_new
  WHERE (projects_new.company_id = ANY (get_user_company_ids())))));



  create policy "Managers and admins can manage materials"
  on "public"."materials"
  as permissive
  for all
  to authenticated
using (((company_id = ANY (get_user_company_ids())) AND is_admin_or_manager()))
with check (((company_id = ANY (get_user_company_ids())) AND is_admin_or_manager()));



  create policy "Users can view company materials"
  on "public"."materials"
  as permissive
  for select
  to authenticated
using ((company_id = ANY (get_user_company_ids())));



  create policy "Only admins can manage payroll"
  on "public"."payroll"
  as permissive
  for all
  to authenticated
using (((employee_id IN ( SELECT employees.id
   FROM employees
  WHERE (employees.company_id = ANY (get_user_company_ids())))) AND is_admin()))
with check (((employee_id IN ( SELECT employees.id
   FROM employees
  WHERE (employees.company_id = ANY (get_user_company_ids())))) AND is_admin()));



  create policy "Users can view own payroll"
  on "public"."payroll"
  as permissive
  for select
  to authenticated
using ((employee_id = get_user_employee_id()));



  create policy "Managers and admins can manage legacy projects"
  on "public"."projects"
  as permissive
  for all
  to authenticated
using (((company_id = ANY (get_user_company_ids())) AND is_admin_or_manager()))
with check (((company_id = ANY (get_user_company_ids())) AND is_admin_or_manager()));



  create policy "Users can view legacy company projects"
  on "public"."projects"
  as permissive
  for select
  to authenticated
using ((company_id = ANY (get_user_company_ids())));



  create policy "Managers and admins can insert projects"
  on "public"."projects_new"
  as permissive
  for insert
  to authenticated
with check (is_admin_or_manager());



  create policy "Managers and admins can manage projects"
  on "public"."projects_new"
  as permissive
  for all
  to authenticated
using (((company_id = ANY (get_user_company_ids())) AND is_admin_or_manager()))
with check (((company_id = ANY (get_user_company_ids())) AND is_admin_or_manager()));



  create policy "Users can view company projects"
  on "public"."projects_new"
  as permissive
  for select
  to authenticated
using ((company_id = ANY (get_user_company_ids())));



  create policy "Managers and admins can manage suppliers"
  on "public"."suppliers"
  as permissive
  for all
  to authenticated
using (((company_id = ANY (get_user_company_ids())) AND is_admin_or_manager()))
with check (((company_id = ANY (get_user_company_ids())) AND is_admin_or_manager()));



  create policy "Users can view company suppliers"
  on "public"."suppliers"
  as permissive
  for select
  to authenticated
using ((company_id = ANY (get_user_company_ids())));



  create policy "Managers and admins can manage tasks"
  on "public"."tasks"
  as permissive
  for all
  to authenticated
using (((project_id IN ( SELECT projects_new.id
   FROM projects_new
  WHERE (projects_new.company_id = ANY (get_user_company_ids())))) AND is_admin_or_manager()))
with check (((project_id IN ( SELECT projects_new.id
   FROM projects_new
  WHERE (projects_new.company_id = ANY (get_user_company_ids())))) AND is_admin_or_manager()));



  create policy "Users can update assigned tasks"
  on "public"."tasks"
  as permissive
  for update
  to authenticated
using ((assigned_to = get_user_employee_id()))
with check ((assigned_to = get_user_employee_id()));



  create policy "Users can view assigned tasks"
  on "public"."tasks"
  as permissive
  for select
  to authenticated
using ((assigned_to = get_user_employee_id()));



  create policy "Users can view company tasks"
  on "public"."tasks"
  as permissive
  for select
  to authenticated
using ((project_id IN ( SELECT projects_new.id
   FROM projects_new
  WHERE (projects_new.company_id = ANY (get_user_company_ids())))));



  create policy "Managers can view company time entries"
  on "public"."time_tracking"
  as permissive
  for select
  to authenticated
using (((employee_id IN ( SELECT employees.id
   FROM employees
  WHERE (employees.company_id = ANY (get_user_company_ids())))) AND is_admin_or_manager()));



  create policy "Users can manage own time entries"
  on "public"."time_tracking"
  as permissive
  for all
  to authenticated
using ((employee_id = get_user_employee_id()))
with check ((employee_id = get_user_employee_id()));



  create policy "Users can view own time entries"
  on "public"."time_tracking"
  as permissive
  for select
  to authenticated
using ((employee_id = get_user_employee_id()));



  create policy "Only admins can manage user-company associations"
  on "public"."user_companies"
  as permissive
  for all
  to authenticated
using (is_admin())
with check (is_admin());



  create policy "Users can view their company associations"
  on "public"."user_companies"
  as permissive
  for select
  to authenticated
using ((user_id = ( SELECT auth.uid() AS uid)));



  create policy "Only admins can create users"
  on "public"."users"
  as permissive
  for insert
  to authenticated
with check (is_admin());



  create policy "Only admins can delete users"
  on "public"."users"
  as permissive
  for delete
  to authenticated
using (is_admin());



  create policy "Users can update own profile"
  on "public"."users"
  as permissive
  for update
  to authenticated
using ((id = ( SELECT auth.uid() AS uid)))
with check ((id = ( SELECT auth.uid() AS uid)));



  create policy "Users can view own profile"
  on "public"."users"
  as permissive
  for select
  to authenticated
using ((id = ( SELECT auth.uid() AS uid)));


CREATE TRIGGER update_change_orders_updated_at BEFORE UPDATE ON public.change_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communications_updated_at BEFORE UPDATE ON public.communications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON public.equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_material_usage_updated_at BEFORE UPDATE ON public.material_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON public.materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payroll_updated_at BEFORE UPDATE ON public.payroll FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_new_updated_at BEFORE UPDATE ON public.projects_new FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_time_tracking_updated_at BEFORE UPDATE ON public.time_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


