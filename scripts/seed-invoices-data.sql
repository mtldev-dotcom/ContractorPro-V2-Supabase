-- Insert sample invoices
INSERT INTO invoices (
    client_id, project_id, invoice_number, status, subtotal, tax_rate, tax_amount, 
    discount_amount, total_amount, paid_amount, issue_date, due_date, paid_date, 
    payment_terms, notes
) VALUES 
(
    (SELECT id FROM clients WHERE first_name = 'Sarah' AND last_name = 'Johnson' LIMIT 1),
    (SELECT id FROM projects WHERE name LIKE '%Kitchen%' LIMIT 1),
    'INV-2024-001', 'sent', 15000.00, 0.0875, 1312.50, 0.00, 16312.50, 0.00,
    '2024-02-15', '2024-03-15', NULL, 'Net 30',
    'Progress payment for kitchen renovation project'
),
(
    (SELECT id FROM clients WHERE first_name = 'Mike' AND last_name = 'Chen' LIMIT 1),
    (SELECT id FROM projects WHERE name LIKE '%Bathroom%' LIMIT 1),
    'INV-2024-002', 'paid', 8500.00, 0.0875, 743.75, 200.00, 9043.75, 9043.75,
    '2024-02-10', '2024-03-10', '2024-02-28', 'Net 30',
    'Final payment for bathroom renovation. Early payment discount applied.'
),
(
    (SELECT id FROM clients WHERE company_name = 'Rodriguez Property Management' LIMIT 1),
    (SELECT id FROM projects WHERE name LIKE '%Multi-Unit%' LIMIT 1),
    'INV-2024-003', 'overdue', 25000.00, 0.0875, 2187.50, 1000.00, 26187.50, 0.00,
    '2024-01-15', '2024-02-14', NULL, 'Net 30',
    'Bulk renovation work for rental units. Volume discount applied.'
),
(
    (SELECT id FROM clients WHERE first_name = 'Tom' AND last_name = 'Wilson' LIMIT 1),
    (SELECT id FROM projects WHERE name LIKE '%Deck%' LIMIT 1),
    'INV-2024-004', 'draft', 5000.00, 0.0875, 437.50, 0.00, 5437.50, 0.00,
    '2024-02-20', '2024-03-20', NULL, 'Net 30',
    'Initial payment for deck construction project'
),
(
    (SELECT id FROM clients WHERE first_name = 'Jennifer' AND last_name = 'Davis' LIMIT 1),
    (SELECT id FROM projects WHERE name LIKE '%Roof%' LIMIT 1),
    'INV-2024-005', 'sent', 12000.00, 0.0875, 1050.00, 0.00, 13050.00, 6525.00,
    '2024-02-12', '2024-03-12', NULL, 'Net 30',
    '50% deposit received. Balance due upon completion.'
);

-- Insert sample invoice line items
INSERT INTO invoice_line_items (invoice_id, description, quantity, unit_price, line_total, sort_order) VALUES 
-- Invoice 1 line items
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-001'), 'Kitchen cabinet installation', 1, 8000.00, 8000.00, 1),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-001'), 'Countertop installation - Granite', 25, 120.00, 3000.00, 2),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-001'), 'Plumbing rough-in work', 8, 125.00, 1000.00, 3),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-001'), 'Electrical work - outlets and lighting', 12, 250.00, 3000.00, 4),

-- Invoice 2 line items
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-002'), 'Bathroom tile installation', 1, 4500.00, 4500.00, 1),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-002'), 'Vanity and sink installation', 1, 2000.00, 2000.00, 2),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-002'), 'Shower fixture installation', 1, 2000.00, 2000.00, 3),

-- Invoice 3 line items
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-003'), 'Flooring installation - 3 units', 3, 5000.00, 15000.00, 1),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-003'), 'Kitchen updates - 2 units', 2, 3000.00, 6000.00, 2),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-003'), 'Bathroom updates - 2 units', 2, 2000.00, 4000.00, 3),

-- Invoice 4 line items
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-004'), 'Deck framing and foundation', 1, 2500.00, 2500.00, 1),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-004'), 'Composite decking materials', 500, 4.00, 2000.00, 2),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-004'), 'Railing installation', 1, 500.00, 500.00, 3),

-- Invoice 5 line items
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-005'), 'Roof tear-off and disposal', 1, 2000.00, 2000.00, 1),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-005'), 'Architectural shingles installation', 25, 300.00, 7500.00, 2),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2024-005'), 'Gutters and downspouts', 1, 2500.00, 2500.00, 3);
