-- Insert sample clients
INSERT INTO clients (
    type, first_name, last_name, company_name, email, phone, secondary_phone,
    address_line1, address_line2, city, state, zip_code, 
    preferred_contact_method, notes, rating, is_active
) VALUES 
(
    'individual', 'Sarah', 'Johnson', NULL, 'sarah.johnson@email.com', 
    '(555) 123-4567', NULL, '123 Maple Street', NULL, 'Springfield', 'IL', '62701',
    'email', 'Prefers morning appointments. Has two dogs.', 5, true
),
(
    'individual', 'Mike', 'Chen', NULL, 'mike.chen@email.com',
    '(555) 234-5678', '(555) 234-5679', '456 Oak Avenue', 'Apt 2B', 'Springfield', 'IL', '62702',
    'phone', 'Works from home, flexible scheduling.', 4, true
),
(
    'business', NULL, NULL, 'Rodriguez Property Management', 'lisa@rodriguezpm.com',
    '(555) 345-6789', NULL, '789 Pine Street', 'Suite 100', 'Springfield', 'IL', '62703',
    'email', 'Manages multiple rental properties. Bulk discount applied.', 5, true
),
(
    'individual', 'Tom', 'Wilson', NULL, 'tom.wilson@email.com',
    '(555) 456-7890', NULL, '321 Elm Drive', NULL, 'Springfield', 'IL', '62704',
    'text', 'Prefers text communication. Weekend availability.', 4, true
),
(
    'individual', 'Jennifer', 'Davis', NULL, 'jennifer.davis@email.com',
    '(555) 567-8901', NULL, '654 Cedar Lane', NULL, 'Springfield', 'IL', '62705',
    'phone', 'Emergency contact available 24/7.', 3, true
);

-- Insert sample suppliers
INSERT INTO suppliers (
    name, contact_person, email, phone, address_line1, address_line2,
    city, state, zip_code, category, payment_terms, account_number, rating, notes, is_active
) VALUES 
(
    'Home Depot Pro', 'Mark Stevens', 'mark.stevens@homedepot.com', '(555) 111-2222',
    '1000 Industrial Blvd', NULL, 'Springfield', 'IL', '62701',
    'materials', 'Net 30', 'HD-12345', 4, 'Bulk pricing available. Delivery service included.', true
),
(
    'Johnson Electric Supply', 'Robert Johnson', 'rob@johnsonelectric.com', '(555) 222-3333',
    '500 Electric Avenue', NULL, 'Springfield', 'IL', '62702',
    'materials', 'Net 15', 'JE-67890', 5, 'Specialized in electrical supplies. Same-day delivery available.', true
),
(
    'United Rentals', 'Amanda Foster', 'amanda@unitedrentals.com', '(555) 333-4444',
    '750 Equipment Way', NULL, 'Springfield', 'IL', '62703',
    'equipment', 'Due on Return', 'UR-11111', 4, 'Wide selection of construction equipment. Weekly rates available.', true
),
(
    'Ferguson Plumbing', 'David Martinez', 'david@ferguson.com', '(555) 444-5555',
    '200 Plumbing Plaza', NULL, 'Springfield', 'IL', '62704',
    'materials', 'Net 30', 'FP-22222', 5, 'Premium plumbing fixtures and supplies. Trade discount applied.', true
),
(
    'ABC Concrete Services', 'Lisa Thompson', 'lisa@abcconcrete.com', '(555) 555-6666',
    '300 Concrete Court', NULL, 'Springfield', 'IL', '62705',
    'services', 'COD', 'ABC-33333', 4, 'Concrete delivery and pumping services. Minimum order requirements.', true
);
