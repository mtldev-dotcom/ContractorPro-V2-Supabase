-- Supabase Migration Script for ContractorPro
-- This script creates a complete contractor management database schema
-- Safe to run multiple times - uses IF NOT EXISTS where appropriate

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types (PostgreSQL enums)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'manager', 'employee', 'client');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE client_type AS ENUM ('individual', 'business');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE contact_method AS ENUM ('email', 'phone', 'text');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_status AS ENUM ('not_started', 'in_progress', 'completed', 'on_hold');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('income', 'expense');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('cash', 'check', 'credit_card', 'bank_transfer', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('pending', 'cleared', 'reconciled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE pay_type AS ENUM ('hourly', 'salary', 'contract');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE equipment_status AS ENUM ('available', 'in_use', 'maintenance', 'retired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE equipment_condition AS ENUM ('excellent', 'good', 'fair', 'poor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE time_tracking_status AS ENUM ('active', 'completed', 'approved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE communication_type AS ENUM ('email', 'phone', 'meeting', 'text', 'site_visit');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE communication_direction AS ENUM ('inbound', 'outbound');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE change_order_status AS ENUM ('draft', 'pending_approval', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payroll_status AS ENUM ('draft', 'processed', 'paid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Core Tables

-- Companies table (multi-tenancy support)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    tax_id VARCHAR(50),
    license_number VARCHAR(100),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'US',
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    type client_type NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    secondary_phone VARCHAR(20),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    preferred_contact_method contact_method DEFAULT 'email',
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    category VARCHAR(100),
    payment_terms VARCHAR(100),
    account_number VARCHAR(100),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    employee_number VARCHAR(50) UNIQUE,
    hire_date DATE NOT NULL,
    termination_date DATE,
    job_title VARCHAR(100),
    department VARCHAR(100),
    hourly_rate DECIMAL(10,2),
    salary DECIMAL(12,2),
    pay_type pay_type NOT NULL,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    certifications TEXT,
    skills TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    project_number VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    project_type VARCHAR(100),
    status project_status DEFAULT 'planning',
    priority priority_level DEFAULT 'medium',
    start_date DATE,
    estimated_end_date DATE,
    actual_end_date DATE,
    budget DECIMAL(15,2),
    contract_amount DECIMAL(15,2),
    site_address_line1 VARCHAR(255),
    site_address_line2 VARCHAR(255),
    site_city VARCHAR(100),
    site_state VARCHAR(50),
    site_zip_code VARCHAR(20),
    site_lat DECIMAL(10,8),
    site_lng DECIMAL(11,8),
    project_manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    parent_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status task_status DEFAULT 'not_started',
    priority priority_level DEFAULT 'medium',
    assigned_to UUID REFERENCES employees(id) ON DELETE SET NULL,
    estimated_hours DECIMAL(6,2),
    actual_hours DECIMAL(6,2),
    start_date DATE,
    due_date DATE,
    completion_date DATE,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    dependencies TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time Tracking table
CREATE TABLE IF NOT EXISTS time_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    clock_in TIMESTAMP WITH TIME ZONE NOT NULL,
    clock_out TIMESTAMP WITH TIME ZONE,
    break_duration INTEGER DEFAULT 0,
    total_hours DECIMAL(5,2),
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    hourly_rate DECIMAL(10,2),
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    notes TEXT,
    status time_tracking_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    type transaction_type NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    amount DECIMAL(12,2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    payment_method payment_method,
    reference_number VARCHAR(100),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    tax_category VARCHAR(100),
    is_taxable BOOLEAN DEFAULT true,
    is_billable BOOLEAN DEFAULT false,
    receipt_url VARCHAR(500),
    invoice_number VARCHAR(100),
    status transaction_status DEFAULT 'pending',
    notes TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    status invoice_status DEFAULT 'draft',
    subtotal DECIMAL(12,2) NOT NULL,
    tax_rate DECIMAL(5,4) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    payment_terms VARCHAR(255),
    notes TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoice Line Items table
CREATE TABLE IF NOT EXISTS invoice_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(12,2) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    make VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(255),
    purchase_date DATE,
    purchase_price DECIMAL(12,2),
    current_value DECIMAL(12,2),
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    maintenance_interval_days INTEGER,
    assigned_to UUID REFERENCES employees(id) ON DELETE SET NULL,
    current_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    status equipment_status DEFAULT 'available',
    condition equipment_condition DEFAULT 'good',
    location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Materials table
CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    unit VARCHAR(50),
    current_stock DECIMAL(10,3) DEFAULT 0,
    minimum_stock DECIMAL(10,3) DEFAULT 0,
    unit_cost DECIMAL(10,2),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    sku VARCHAR(100),
    location VARCHAR(255),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Material Usage table
CREATE TABLE IF NOT EXISTS material_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
    quantity_used DECIMAL(10,3) NOT NULL,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(12,2),
    usage_date DATE NOT NULL,
    used_by UUID REFERENCES employees(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    category VARCHAR(100),
    tags TEXT,
    is_public BOOLEAN DEFAULT false,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communications table
CREATE TABLE IF NOT EXISTS communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    type communication_type NOT NULL,
    direction communication_direction NOT NULL,
    subject VARCHAR(255),
    content TEXT,
    communication_date TIMESTAMP WITH TIME ZONE NOT NULL,
    participants TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Change Orders table
CREATE TABLE IF NOT EXISTS change_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    change_order_number VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    reason TEXT,
    original_amount DECIMAL(12,2),
    change_amount DECIMAL(12,2) NOT NULL,
    new_total_amount DECIMAL(12,2),
    original_end_date DATE,
    new_end_date DATE,
    days_added INTEGER DEFAULT 0,
    status change_order_status DEFAULT 'draft',
    requested_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approval_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payroll table
CREATE TABLE IF NOT EXISTS payroll (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    pay_date DATE NOT NULL,
    regular_hours DECIMAL(6,2) DEFAULT 0,
    overtime_hours DECIMAL(6,2) DEFAULT 0,
    regular_rate DECIMAL(10,2),
    overtime_rate DECIMAL(10,2),
    regular_pay DECIMAL(10,2) DEFAULT 0,
    overtime_pay DECIMAL(10,2) DEFAULT 0,
    bonus DECIMAL(10,2) DEFAULT 0,
    gross_pay DECIMAL(10,2) NOT NULL,
    federal_tax DECIMAL(10,2) DEFAULT 0,
    state_tax DECIMAL(10,2) DEFAULT 0,
    social_security DECIMAL(10,2) DEFAULT 0,
    medicare DECIMAL(10,2) DEFAULT 0,
    insurance DECIMAL(10,2) DEFAULT 0,
    retirement DECIMAL(10,2) DEFAULT 0,
    other_deductions DECIMAL(10,2) DEFAULT 0,
    total_deductions DECIMAL(10,2) DEFAULT 0,
    net_pay DECIMAL(10,2) NOT NULL,
    status payroll_status DEFAULT 'draft',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

CREATE INDEX IF NOT EXISTS idx_clients_company_id ON clients(company_id);
CREATE INDEX IF NOT EXISTS idx_clients_type ON clients(type);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_is_active ON clients(is_active);

CREATE INDEX IF NOT EXISTS idx_suppliers_company_id ON suppliers(company_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_category ON suppliers(category);
CREATE INDEX IF NOT EXISTS idx_suppliers_is_active ON suppliers(is_active);

CREATE INDEX IF NOT EXISTS idx_employees_company_id ON employees(company_id);
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_is_active ON employees(is_active);
CREATE INDEX IF NOT EXISTS idx_employees_employee_number ON employees(employee_number);

CREATE INDEX IF NOT EXISTS idx_projects_company_id ON projects(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_manager_id ON projects(project_manager_id);
CREATE INDEX IF NOT EXISTS idx_projects_project_number ON projects(project_number);

CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_parent_task_id ON tasks(parent_task_id);

CREATE INDEX IF NOT EXISTS idx_time_tracking_employee_id ON time_tracking(employee_id);
CREATE INDEX IF NOT EXISTS idx_time_tracking_project_id ON time_tracking(project_id);
CREATE INDEX IF NOT EXISTS idx_time_tracking_clock_in ON time_tracking(clock_in);
CREATE INDEX IF NOT EXISTS idx_time_tracking_status ON time_tracking(status);

CREATE INDEX IF NOT EXISTS idx_transactions_company_id ON transactions(company_id);
CREATE INDEX IF NOT EXISTS idx_transactions_project_id ON transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON invoices(issue_date);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

CREATE INDEX IF NOT EXISTS idx_invoice_line_items_invoice_id ON invoice_line_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_sort_order ON invoice_line_items(sort_order);

CREATE INDEX IF NOT EXISTS idx_equipment_company_id ON equipment(company_id);
CREATE INDEX IF NOT EXISTS idx_equipment_assigned_to ON equipment(assigned_to);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_equipment_current_project_id ON equipment(current_project_id);

CREATE INDEX IF NOT EXISTS idx_materials_company_id ON materials(company_id);
CREATE INDEX IF NOT EXISTS idx_materials_supplier_id ON materials(supplier_id);
CREATE INDEX IF NOT EXISTS idx_materials_is_active ON materials(is_active);

CREATE INDEX IF NOT EXISTS idx_material_usage_project_id ON material_usage(project_id);
CREATE INDEX IF NOT EXISTS idx_material_usage_material_id ON material_usage(material_id);
CREATE INDEX IF NOT EXISTS idx_material_usage_date ON material_usage(usage_date);

CREATE INDEX IF NOT EXISTS idx_documents_company_id ON documents(company_id);
CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents(client_id);

CREATE INDEX IF NOT EXISTS idx_communications_project_id ON communications(project_id);
CREATE INDEX IF NOT EXISTS idx_communications_client_id ON communications(client_id);
CREATE INDEX IF NOT EXISTS idx_communications_date ON communications(communication_date);

CREATE INDEX IF NOT EXISTS idx_change_orders_project_id ON change_orders(project_id);
CREATE INDEX IF NOT EXISTS idx_change_orders_status ON change_orders(status);

CREATE INDEX IF NOT EXISTS idx_payroll_employee_id ON payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_pay_period_start ON payroll(pay_period_start);
CREATE INDEX IF NOT EXISTS idx_payroll_status ON payroll(status);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables that have updated_at column
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_time_tracking_updated_at BEFORE UPDATE ON time_tracking FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_communications_updated_at BEFORE UPDATE ON communications FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_change_orders_updated_at BEFORE UPDATE ON change_orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_payroll_updated_at BEFORE UPDATE ON payroll FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to automatically calculate invoice totals
CREATE OR REPLACE FUNCTION calculate_invoice_totals()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE invoices 
    SET 
        subtotal = (
            SELECT COALESCE(SUM(line_total), 0) 
            FROM invoice_line_items 
            WHERE invoice_id = COALESCE(NEW.invoice_id, OLD.invoice_id)
        )
    WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
    
    UPDATE invoices 
    SET 
        tax_amount = subtotal * tax_rate,
        total_amount = subtotal + (subtotal * tax_rate) - discount_amount
    WHERE id = COALESCE(NEW.invoice_id, OLD.invoice_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for invoice line items
CREATE TRIGGER calculate_invoice_totals_insert 
    AFTER INSERT ON invoice_line_items 
    FOR EACH ROW EXECUTE FUNCTION calculate_invoice_totals();

CREATE TRIGGER calculate_invoice_totals_update 
    AFTER UPDATE ON invoice_line_items 
    FOR EACH ROW EXECUTE FUNCTION calculate_invoice_totals();

CREATE TRIGGER calculate_invoice_totals_delete 
    AFTER DELETE ON invoice_line_items 
    FOR EACH ROW EXECUTE FUNCTION calculate_invoice_totals();

-- Function to automatically calculate time tracking totals
CREATE OR REPLACE FUNCTION calculate_time_tracking_totals()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.clock_out IS NOT NULL THEN
        NEW.total_hours = EXTRACT(EPOCH FROM (NEW.clock_out - NEW.clock_in)) / 3600.0 - (NEW.break_duration / 60.0);
        
        -- Calculate overtime (over 8 hours per day)
        IF NEW.total_hours > 8 THEN
            NEW.overtime_hours = NEW.total_hours - 8;
        ELSE
            NEW.overtime_hours = 0;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_time_tracking_totals_trigger 
    BEFORE INSERT OR UPDATE ON time_tracking 
    FOR EACH ROW EXECUTE FUNCTION calculate_time_tracking_totals();

-- Insert default company if none exists
INSERT INTO companies (name, legal_name, email) 
SELECT 'ContractorPro Demo', 'ContractorPro Demo LLC', 'demo@contractorpro.com'
WHERE NOT EXISTS (SELECT 1 FROM companies);

-- Insert default admin user if none exists
INSERT INTO users (email, first_name, last_name, role) 
SELECT 'admin@contractorpro.com', 'System', 'Administrator', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE role = 'admin');

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Allow authenticated users to access their company's data)
-- Note: In production, you should create more specific policies based on user roles

-- Users can read all users (for employee assignment, etc.)
CREATE POLICY "Users can read all users" ON users FOR SELECT TO authenticated USING (true);

-- Company-based access policies
CREATE POLICY "Company members can access their company" ON companies FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM employees e 
        JOIN users u ON e.user_id = u.id 
        WHERE u.id = auth.uid() AND e.company_id = companies.id
    )
);

CREATE POLICY "Company members can access clients" ON clients FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM employees e 
        JOIN users u ON e.user_id = u.id 
        WHERE u.id = auth.uid() AND e.company_id = clients.company_id
    )
);

CREATE POLICY "Company members can access suppliers" ON suppliers FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM employees e 
        JOIN users u ON e.user_id = u.id 
        WHERE u.id = auth.uid() AND e.company_id = suppliers.company_id
    )
);

CREATE POLICY "Company members can access employees" ON employees FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM employees e 
        JOIN users u ON e.user_id = u.id 
        WHERE u.id = auth.uid() AND e.company_id = employees.company_id
    )
);

CREATE POLICY "Company members can access projects" ON projects FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM employees e 
        JOIN users u ON e.user_id = u.id 
        WHERE u.id = auth.uid() AND e.company_id = projects.company_id
    )
);

CREATE POLICY "Company members can access tasks" ON tasks FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM employees e 
        JOIN users u ON e.user_id = u.id 
        JOIN projects p ON p.company_id = e.company_id
        WHERE u.id = auth.uid() AND p.id = tasks.project_id
    )
);

CREATE POLICY "Company members can access time tracking" ON time_tracking FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM employees e 
        JOIN users u ON e.user_id = u.id 
        WHERE u.id = auth.uid() AND e.id = time_tracking.employee_id
    )
    OR
    EXISTS (
        SELECT 1 FROM employees e 
        JOIN users u ON e.user_id = u.id 
        JOIN projects p ON p.company_id = e.company_id
        WHERE u.id = auth.uid() AND p.id = time_tracking.project_id
    )
);

CREATE POLICY "Company members can access transactions" ON transactions FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM employees e 
        JOIN users u ON e.user_id = u.id 
        WHERE u.id = auth.uid() AND e.company_id = transactions.company_id
    )
);

CREATE POLICY "Company members can access invoices" ON invoices FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM employees e 
        JOIN users u ON e.user_id = u.id 
        WHERE u.id = auth.uid() AND e.company_id = invoices.company_id
    )
);

CREATE POLICY "Company members can access invoice line items" ON invoice_line_items FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM employees e 
        JOIN users u ON e.user_id = u.id 
        JOIN invoices i ON i.company_id = e.company_id
        WHERE u.id = auth.uid() AND i.id = invoice_line_items.invoice_id
    )
);

CREATE POLICY "Company members can access equipment" ON equipment FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM employees e 
        JOIN users u ON e.user_id = u.id 
        WHERE u.id = auth.uid() AND e.company_id = equipment.company_id
    )
);

CREATE POLICY "Company members can access materials" ON materials FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM employees e 
        JOIN users u ON e.user_id = u.id 
        WHERE u.id = auth.uid() AND e.company_id = materials.company_id
    )
);

CREATE POLICY "Company members can access material usage" ON material_usage FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM employees e 
        JOIN users u ON e.user_id = u.id 
        JOIN projects p ON p.company_id = e.company_id
        WHERE u.id = auth.uid() AND p.id = material_usage.project_id
    )
);

CREATE POLICY "Company members can access documents" ON documents FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM employees e 
        JOIN users u ON e.user_id = u.id 
        WHERE u.id = auth.uid() AND e.company_id = documents.company_id
    )
);

CREATE POLICY "Company members can access communications" ON communications FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM employees e 
        JOIN users u ON e.user_id = u.id 
        JOIN projects p ON p.company_id = e.company_id
        WHERE u.id = auth.uid() AND p.id = communications.project_id
    )
    OR
    EXISTS (
        SELECT 1 FROM employees e 
        JOIN users u ON e.user_id = u.id 
        JOIN clients c ON c.company_id = e.company_id
        WHERE u.id = auth.uid() AND c.id = communications.client_id
    )
);

CREATE POLICY "Company members can access change orders" ON change_orders FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM employees e 
        JOIN users u ON e.user_id = u.id 
        JOIN projects p ON p.company_id = e.company_id
        WHERE u.id = auth.uid() AND p.id = change_orders.project_id
    )
);

CREATE POLICY "Company members can access payroll" ON payroll FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM employees e 
        JOIN users u ON e.user_id = u.id 
        WHERE u.id = auth.uid() AND e.id = payroll.employee_id
    )
    OR
    EXISTS (
        SELECT 1 FROM employees e 
        JOIN users u ON e.user_id = u.id 
        JOIN employees target_emp ON target_emp.company_id = e.company_id
        WHERE u.id = auth.uid() AND u.role IN ('admin', 'manager') AND target_emp.id = payroll.employee_id
    )
);

-- Comprehensive reporting views for better data access
CREATE OR REPLACE VIEW project_summary AS
SELECT 
    p.id,
    p.name,
    p.status,
    p.priority,
    p.budget,
    p.contract_amount,
    CASE 
        WHEN c.type = 'business' THEN c.company_name
        ELSE COALESCE(c.first_name || ' ' || c.last_name, 'Unknown Client')
    END AS client_name,
    COALESCE(c.first_name || ' ' || c.last_name, c.company_name, 'Unknown Contact') AS client_contact,
    COALESCE(u.first_name || ' ' || u.last_name, 'Unassigned') AS project_manager,
    COUNT(DISTINCT t.id) AS total_tasks,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) AS completed_tasks,
    COALESCE(SUM(tt.total_hours), 0) AS total_hours_logged,
    COALESCE(SUM(tr.amount) FILTER (WHERE tr.type = 'expense'), 0) AS total_expenses,
    COALESCE(SUM(tr.amount) FILTER (WHERE tr.type = 'income'), 0) AS total_income
FROM projects p
LEFT JOIN clients c ON p.client_id = c.id
LEFT JOIN employees e ON p.project_manager_id = e.id
LEFT JOIN users u ON e.user_id = u.id
LEFT JOIN tasks t ON p.id = t.project_id
LEFT JOIN time_tracking tt ON p.id = tt.project_id
LEFT JOIN transactions tr ON p.id = tr.project_id
GROUP BY p.id, p.name, p.status, p.priority, p.budget, p.contract_amount, c.type, c.company_name, c.first_name, c.last_name, u.first_name, u.last_name;

-- Employee performance view
CREATE OR REPLACE VIEW employee_performance AS
SELECT 
    e.id,
    COALESCE(u.first_name || ' ' || u.last_name, 'Unknown Employee') AS employee_name,
    e.job_title,
    COUNT(DISTINCT t.id) AS total_tasks_assigned,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) AS tasks_completed,
    COALESCE(SUM(tt.total_hours), 0) AS total_hours_logged,
    COALESCE(AVG(tt.total_hours), 0) AS avg_hours_per_day,
    COUNT(DISTINCT tt.project_id) AS projects_worked_on
FROM employees e
LEFT JOIN users u ON e.user_id = u.id
LEFT JOIN tasks t ON e.id = t.assigned_to
LEFT JOIN time_tracking tt ON e.id = tt.employee_id
WHERE e.is_active = true
GROUP BY e.id, u.first_name, u.last_name, e.job_title;

-- Financial summary view
CREATE OR REPLACE VIEW financial_summary AS
SELECT 
    company_id,
    DATE_TRUNC('month', transaction_date) AS month,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expenses,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS net_profit,
    COUNT(*) AS transaction_count
FROM transactions
GROUP BY company_id, DATE_TRUNC('month', transaction_date)
ORDER BY company_id, month DESC;

-- Migration completed successfully
-- You can now run this script in your Supabase SQL editor
-- The schema includes all necessary tables, indexes, triggers, and basic RLS policies
