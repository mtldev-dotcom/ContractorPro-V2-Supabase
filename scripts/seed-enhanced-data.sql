-- Seed data for the enhanced schema

-- Insert demo users
INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES 
('admin@contractorpro.com', '$2b$10$example_hash', 'Admin', 'User', '(555) 000-0001', 'admin'),
('manager@contractorpro.com', '$2b$10$example_hash', 'Project', 'Manager', '(555) 000-0002', 'manager'),
('john.martinez@contractorpro.com', '$2b$10$example_hash', 'John', 'Martinez', '(555) 123-4567', 'employee'),
('sarah.thompson@contractorpro.com', '$2b$10$example_hash', 'Sarah', 'Thompson', '(555) 234-5678', 'employee'),
('mike.rodriguez@contractorpro.com', '$2b$10$example_hash', 'Mike', 'Rodriguez', '(555) 345-6789', 'employee');

-- Insert enhanced employees
INSERT INTO employees (
    user_id, company_id, employee_number, hire_date, job_title, department, 
    hourly_rate, pay_type, emergency_contact_name, emergency_contact_phone,
    certifications, skills
) VALUES 
(
    (SELECT id FROM users WHERE email = 'john.martinez@contractorpro.com'),
    (SELECT id FROM companies LIMIT 1),
    'EMP-001', '2022-03-15', 'Project Manager', 'Management',
    35.00, 'hourly', 'Maria Martinez', '(555) 123-9999',
    'PMP Certified, OSHA 30-Hour',
    'Project Management, Electrical, Plumbing'
),
(
    (SELECT id FROM users WHERE email = 'sarah.thompson@contractorpro.com'),
    (SELECT id FROM companies LIMIT 1),
    'EMP-002', '2021-08-22', 'Lead Carpenter', 'Construction',
    28.00, 'hourly', 'Bob Thompson', '(555) 234-9999',
    'Carpentry License, Safety Certification',
    'Carpentry, Framing, Finish Work'
),
(
    (SELECT id FROM users WHERE email = 'mike.rodriguez@contractorpro.com'),
    (SELECT id FROM companies LIMIT 1),
    'EMP-003', '2023-01-10', 'Electrician', 'Electrical',
    32.00, 'hourly', 'Ana Rodriguez', '(555) 345-9999',
    'Master Electrician License',
    'Electrical, Wiring, Panel Installation'
);

-- Insert equipment
INSERT INTO equipment (
    company_id, name, category, make, model, serial_number, purchase_date, 
    purchase_price, current_value, status, condition, location
) VALUES 
(
    (SELECT id FROM companies LIMIT 1),
    'Dewalt Circular Saw', 'tools', 'Dewalt', 'DWE575SB', 'DW123456789',
    '2023-01-15', 199.99, 150.00, 'available', 'good', 'Tool Shed'
),
(
    (SELECT id FROM companies LIMIT 1),
    'Ford F-150 Work Truck', 'vehicles', 'Ford', 'F-150', 'VIN123456789',
    '2022-06-01', 35000.00, 28000.00, 'in_use', 'excellent', 'Main Office'
),
(
    (SELECT id FROM companies LIMIT 1),
    'Skid Steer Loader', 'machinery', 'Bobcat', 'S650', 'BOB987654321',
    '2021-03-20', 45000.00, 35000.00, 'available', 'good', 'Equipment Yard'
);

-- Insert materials
INSERT INTO materials (
    company_id, name, category, unit, current_stock, minimum_stock, 
    unit_cost, sku, location
) VALUES 
(
    (SELECT id FROM companies LIMIT 1),
    '2x4 Lumber - 8ft', 'lumber', 'each', 150.0, 50.0, 4.50, 'LUM-2X4-8', 'Lumber Yard'
),
(
    (SELECT id FROM companies LIMIT 1),
    'Drywall Sheets 4x8', 'drywall', 'each', 75.0, 25.0, 12.00, 'DRY-4X8', 'Material Storage'
),
(
    (SELECT id FROM companies LIMIT 1),
    'Concrete Mix 80lb', 'concrete', 'bags', 200.0, 50.0, 5.25, 'CON-80LB', 'Material Storage'
),
(
    (SELECT id FROM companies LIMIT 1),
    'Electrical Wire 12AWG', 'electrical', 'feet', 500.0, 100.0, 0.85, 'ELEC-12AWG', 'Electrical Storage'
);

-- Insert sample time tracking entries
INSERT INTO time_tracking (
    employee_id, project_id, clock_in, clock_out, total_hours, hourly_rate, status
) VALUES 
(
    (SELECT id FROM employees WHERE employee_number = 'EMP-001'),
    (SELECT id FROM projects LIMIT 1),
    '2024-02-15 08:00:00', '2024-02-15 17:00:00', 8.0, 35.00, 'completed'
),
(
    (SELECT id FROM employees WHERE employee_number = 'EMP-002'),
    (SELECT id FROM projects LIMIT 1),
    '2024-02-15 07:30:00', '2024-02-15 16:30:00', 8.0, 28.00, 'completed'
);

-- Insert sample documents
INSERT INTO documents (
    company_id, name, description, file_url, file_type, category, uploaded_by
) VALUES 
(
    (SELECT id FROM companies LIMIT 1),
    'Company Safety Manual', 'Comprehensive safety guidelines for all employees',
    '/documents/safety-manual.pdf', 'pdf', 'policy',
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
),
(
    (SELECT id FROM companies LIMIT 1),
    'Equipment Maintenance Log', 'Monthly equipment maintenance checklist',
    '/documents/maintenance-log.pdf', 'pdf', 'maintenance',
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
);

-- Insert sample communications
INSERT INTO communications (
    client_id, type, direction, subject, content, communication_date, created_by
) VALUES 
(
    (SELECT id FROM clients WHERE first_name = 'Sarah' AND last_name = 'Johnson'),
    'email', 'outbound', 'Project Update - Kitchen Renovation',
    'Hi Sarah, wanted to update you on the progress of your kitchen renovation...',
    '2024-02-15 10:30:00',
    (SELECT id FROM users WHERE role = 'manager' LIMIT 1)
);
