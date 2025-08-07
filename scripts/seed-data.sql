-- Seed data for development and testing

-- Insert admin user
INSERT INTO users (
    email, password_hash, first_name, last_name, phone, role
) VALUES (
    'admin@contractorpro.com',
    '$2a$12$K8HKs6/T3JDGci1fKZTDqeVG7RHnE5vyqj9uZkBrXKWguuZHhPWBq', -- password: admin123
    'System',
    'Admin',
    '555-0100',
    'admin'
);

-- Insert manager
INSERT INTO users (
    email, password_hash, first_name, last_name, phone, role
) VALUES (
    'manager@contractorpro.com',
    '$2a$12$K8HKs6/T3JDGci1fKZTDqeVG7RHnE5vyqj9uZkBrXKWguuZHhPWBq', -- password: admin123
    'Project',
    'Manager',
    '555-0200',
    'manager'
);

-- Insert employees
INSERT INTO users (
    email, password_hash, first_name, last_name, phone, role
) VALUES 
    ('john@contractorpro.com', '$2a$12$K8HKs6/T3JDGci1fKZTDqeVG7RHnE5vyqj9uZkBrXKWguuZHhPWBq', 'John', 'Smith', '555-0301', 'employee'),
    ('sarah@contractorpro.com', '$2a$12$K8HKs6/T3JDGci1fKZTDqeVG7RHnE5vyqj9uZkBrXKWguuZHhPWBq', 'Sarah', 'Johnson', '555-0302', 'employee'),
    ('mike@contractorpro.com', '$2a$12$K8HKs6/T3JDGci1fKZTDqeVG7RHnE5vyqj9uZkBrXKWguuZHhPWBq', 'Mike', 'Wilson', '555-0303', 'employee');

-- Insert clients
INSERT INTO clients (
    company_id, first_name, last_name, email, phone, company_name,
    address_line1, city, state, zip_code
) VALUES 
    ((SELECT id FROM companies LIMIT 1), 'Robert', 'Brown', 'robert@email.com', '555-1001', 'Brown Enterprises',
     '123 Main St', 'Springfield', 'IL', '62701'),
    ((SELECT id FROM companies LIMIT 1), 'Emily', 'Davis', 'emily@email.com', '555-1002', 'Davis & Associates',
     '456 Oak Ave', 'Springfield', 'IL', '62702'),
    ((SELECT id FROM companies LIMIT 1), 'Michael', 'Taylor', 'michael@email.com', '555-1003', 'Taylor Construction',
     '789 Pine St', 'Springfield', 'IL', '62703');

-- Insert suppliers
INSERT INTO suppliers (
    company_id, name, contact_name, email, phone,
    address_line1, city, state, zip_code
) VALUES 
    ((SELECT id FROM companies LIMIT 1), 'ABC Building Supply', 'Tom Wilson', 'tom@abcsupply.com', '555-2001',
     '100 Supply Dr', 'Springfield', 'IL', '62704'),
    ((SELECT id FROM companies LIMIT 1), 'XYZ Tools & Equipment', 'Jane Anderson', 'jane@xyztools.com', '555-2002',
     '200 Industrial Pkwy', 'Springfield', 'IL', '62705');

-- Insert employees with references to users
INSERT INTO employees (
    user_id, company_id, employee_number, hire_date, job_title,
    department, hourly_rate, pay_type
) VALUES 
    ((SELECT id FROM users WHERE email = 'john@contractorpro.com'),
     (SELECT id FROM companies LIMIT 1),
     'EMP001', '2024-01-01', 'Senior Carpenter',
     'Construction', 35.00, 'hourly'),
    ((SELECT id FROM users WHERE email = 'sarah@contractorpro.com'),
     (SELECT id FROM companies LIMIT 1),
     'EMP002', '2024-01-01', 'Electrician',
     'Electrical', 40.00, 'hourly'),
    ((SELECT id FROM users WHERE email = 'mike@contractorpro.com'),
     (SELECT id FROM companies LIMIT 1),
     'EMP003', '2024-01-01', 'Plumber',
     'Plumbing', 38.00, 'hourly');

-- Insert materials
INSERT INTO materials (
    company_id, name, category, unit, current_stock,
    minimum_stock, unit_cost, supplier_id
) VALUES 
    ((SELECT id FROM companies LIMIT 1), '2x4 Lumber', 'Construction', 'piece', 1000,
     200, 3.99, (SELECT id FROM suppliers WHERE name = 'ABC Building Supply')),
    ((SELECT id FROM companies LIMIT 1), 'Drywall 4x8', 'Construction', 'sheet', 500,
     100, 12.99, (SELECT id FROM suppliers WHERE name = 'ABC Building Supply')),
    ((SELECT id FROM companies LIMIT 1), 'Electrical Wire 12/2', 'Electrical', 'foot', 5000,
     1000, 0.89, (SELECT id FROM suppliers WHERE name = 'XYZ Tools & Equipment'));

-- Insert equipment
INSERT INTO equipment (
    company_id, name, category, make, model,
    purchase_date, purchase_price, current_value
) VALUES 
    ((SELECT id FROM companies LIMIT 1), 'Excavator', 'Heavy Equipment', 'CAT', '320',
     '2024-01-01', 100000.00, 95000.00),
    ((SELECT id FROM companies LIMIT 1), 'Pickup Truck', 'Vehicles', 'Ford', 'F-150',
     '2024-01-01', 45000.00, 42000.00);

-- Insert into base projects table first (needed for time_tracking)
INSERT INTO projects (
    company_id, name, description, status
) VALUES 
    ((SELECT id FROM companies LIMIT 1),
     'Brown Residence Renovation',
     'Complete home renovation including kitchen and bathrooms',
     'in_progress'),
    ((SELECT id FROM companies LIMIT 1),
     'Davis Office Building',
     'New commercial office building construction',
     'planning');

-- Insert into projects_new
INSERT INTO projects_new (
    company_id, client_id, project_number, name, description,
    status, priority, start_date, estimated_end_date,
    budget, contract_amount, project_manager_id
) VALUES 
    ((SELECT id FROM companies LIMIT 1),
     (SELECT id FROM clients WHERE first_name = 'Robert' AND last_name = 'Brown'),
     'PRJ001',
     'Brown Residence Renovation',
     'Complete home renovation including kitchen and bathrooms',
     'in_progress',
     'high',
     '2024-01-15',
     '2024-04-15',
     150000.00,
     175000.00,
     (SELECT id FROM employees WHERE employee_number = 'EMP001')),
    ((SELECT id FROM companies LIMIT 1),
     (SELECT id FROM clients WHERE first_name = 'Emily' AND last_name = 'Davis'),
     'PRJ002',
     'Davis Office Building',
     'New commercial office building construction',
     'planning',
     'high',
     '2024-03-01',
     '2024-09-01',
     500000.00,
     550000.00,
     (SELECT id FROM employees WHERE employee_number = 'EMP001'));

-- Insert tasks
INSERT INTO tasks (
    project_id, name, description, status,
    priority, assigned_to, estimated_hours
) VALUES 
    ((SELECT id FROM projects_new WHERE project_number = 'PRJ001'),
     'Kitchen Demo',
     'Remove existing kitchen cabinets and appliances',
     'in_progress',
     'high',
     (SELECT id FROM employees WHERE employee_number = 'EMP001'),
     40),
    ((SELECT id FROM projects_new WHERE project_number = 'PRJ001'),
     'Electrical Rough-in',
     'Install new electrical wiring and outlets',
     'not_started',
     'high',
     (SELECT id FROM employees WHERE employee_number = 'EMP002'),
     30);

-- Insert time tracking entries
INSERT INTO time_tracking (
    employee_id, project_id, clock_in, clock_out,
    total_hours, hourly_rate, status
) VALUES 
    ((SELECT id FROM employees WHERE employee_number = 'EMP001'),
     (SELECT id FROM projects WHERE name = 'Brown Residence Renovation'),
     '2024-01-15 08:00:00',
     '2024-01-15 16:00:00',
     8,
     35.00,
     'completed');
