-- First, create a function to update the timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Companies table (multi-tenancy) - Create this first as others reference it
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for companies
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default company for existing data
INSERT INTO companies (name, legal_name) VALUES ('ContractorPro Demo', 'ContractorPro Demo LLC');

-- Users table (core authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) CHECK (role IN ('admin', 'manager', 'employee', 'client')) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    company_name VARCHAR(255),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'US',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for clients
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'US',
    tax_id VARCHAR(50),
    payment_terms VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for suppliers
CREATE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update existing clients and suppliers with default company
UPDATE clients SET company_id = (SELECT id FROM companies LIMIT 1) WHERE company_id IS NULL;
UPDATE suppliers SET company_id = (SELECT id FROM companies LIMIT 1) WHERE company_id IS NULL;

-- Enhanced Employees table
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    company_id UUID REFERENCES companies(id),
    employee_number VARCHAR(50) UNIQUE,
    hire_date DATE NOT NULL,
    termination_date DATE,
    job_title VARCHAR(100),
    department VARCHAR(100),
    hourly_rate DECIMAL(10,2),
    salary DECIMAL(12,2),
    pay_type VARCHAR(20) CHECK (pay_type IN ('hourly', 'salary', 'contract')) NOT NULL,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    certifications TEXT,
    skills TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for employees
CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Base Projects table (needed for time_tracking)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'planning',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for projects
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Time Tracking table
CREATE TABLE IF NOT EXISTS time_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id),
    project_id UUID REFERENCES projects(id),
    clock_in TIMESTAMP NOT NULL,
    clock_out TIMESTAMP,
    break_duration INTEGER DEFAULT 0,
    total_hours DECIMAL(5,2),
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    hourly_rate DECIMAL(10,2),
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    notes TEXT,
    status VARCHAR(20) CHECK (status IN ('active', 'completed', 'approved')) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for time_tracking
CREATE TRIGGER update_time_tracking_updated_at
    BEFORE UPDATE ON time_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enhanced Projects table
CREATE TABLE IF NOT EXISTS projects_new (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    client_id UUID REFERENCES clients(id),
    project_number VARCHAR(50) UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    project_type VARCHAR(100),
    status VARCHAR(20) CHECK (status IN ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled')) DEFAULT 'planning',
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
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
    project_manager_id UUID REFERENCES employees(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for projects_new
CREATE TRIGGER update_projects_new_updated_at
    BEFORE UPDATE ON projects_new
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enhanced Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects_new(id),
    parent_task_id UUID REFERENCES tasks(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) CHECK (status IN ('not_started', 'in_progress', 'completed', 'on_hold')) DEFAULT 'not_started',
    priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    assigned_to UUID REFERENCES employees(id),
    estimated_hours DECIMAL(6,2),
    actual_hours DECIMAL(6,2),
    start_date DATE,
    due_date DATE,
    completion_date DATE,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    dependencies TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for tasks
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Materials table
CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    unit VARCHAR(50),
    current_stock DECIMAL(10,3) DEFAULT 0,
    minimum_stock DECIMAL(10,3) DEFAULT 0,
    unit_cost DECIMAL(10,2),
    supplier_id UUID REFERENCES suppliers(id),
    sku VARCHAR(100),
    location VARCHAR(255),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for materials
CREATE TRIGGER update_materials_updated_at
    BEFORE UPDATE ON materials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
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
    assigned_to UUID REFERENCES employees(id),
    current_project_id UUID REFERENCES projects_new(id),
    status VARCHAR(20) CHECK (status IN ('available', 'in_use', 'maintenance', 'retired')) DEFAULT 'available',
    condition VARCHAR(20) CHECK (condition IN ('excellent', 'good', 'fair', 'poor')) DEFAULT 'good',
    location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for equipment
CREATE TRIGGER update_equipment_updated_at
    BEFORE UPDATE ON equipment
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id),
    project_id UUID REFERENCES projects_new(id),
    client_id UUID REFERENCES clients(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    category VARCHAR(100),
    tags TEXT,
    is_public BOOLEAN DEFAULT false,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for documents
CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Communications table
CREATE TABLE IF NOT EXISTS communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects_new(id),
    client_id UUID REFERENCES clients(id),
    type VARCHAR(20) CHECK (type IN ('email', 'phone', 'meeting', 'text', 'site_visit')) NOT NULL,
    direction VARCHAR(20) CHECK (direction IN ('inbound', 'outbound')) NOT NULL,
    subject VARCHAR(255),
    content TEXT,
    communication_date TIMESTAMP NOT NULL,
    participants TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for communications
CREATE TRIGGER update_communications_updated_at
    BEFORE UPDATE ON communications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Change Orders table
CREATE TABLE IF NOT EXISTS change_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects_new(id),
    change_order_number VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    reason TEXT,
    original_amount DECIMAL(12,2),
    change_amount DECIMAL(12,2) NOT NULL,
    new_total_amount DECIMAL(12,2),
    original_end_date DATE,
    new_end_date DATE,
    days_added INTEGER DEFAULT 0,
    status VARCHAR(20) CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected')) DEFAULT 'draft',
    requested_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approval_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for change_orders
CREATE TRIGGER update_change_orders_updated_at
    BEFORE UPDATE ON change_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Material Usage table
CREATE TABLE IF NOT EXISTS material_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects_new(id),
    material_id UUID REFERENCES materials(id),
    quantity_used DECIMAL(10,3) NOT NULL,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(12,2),
    usage_date DATE NOT NULL,
    used_by UUID REFERENCES employees(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for material_usage
CREATE TRIGGER update_material_usage_updated_at
    BEFORE UPDATE ON material_usage
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Payroll table
CREATE TABLE IF NOT EXISTS payroll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id),
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
    status VARCHAR(20) CHECK (status IN ('draft', 'processed', 'paid')) DEFAULT 'draft',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for payroll
CREATE TRIGGER update_payroll_updated_at
    BEFORE UPDATE ON payroll
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_materials_company ON materials(company_id);
CREATE INDEX IF NOT EXISTS idx_equipment_company ON equipment(company_id);
CREATE INDEX IF NOT EXISTS idx_equipment_assigned ON equipment(assigned_to);
CREATE INDEX IF NOT EXISTS idx_documents_project ON documents(project_id);
CREATE INDEX IF NOT EXISTS idx_communications_project ON communications(project_id);
CREATE INDEX IF NOT EXISTS idx_change_orders_project ON change_orders(project_id);
CREATE INDEX IF NOT EXISTS idx_material_usage_project ON material_usage(project_id);
CREATE INDEX IF NOT EXISTS idx_payroll_employee ON payroll(employee_id);
