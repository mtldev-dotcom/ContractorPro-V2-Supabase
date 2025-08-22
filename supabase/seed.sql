SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."companies" ("id", "name", "legal_name", "tax_id", "license_number", "address_line1", "address_line2", "city", "state", "zip_code", "country", "phone", "email", "website", "logo_url", "created_at", "updated_at") VALUES
	('7a80462a-79bd-4ada-b214-73ddb2ae7416', 'ContractorPro Demo', 'ContractorPro Demo LLC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'US', NULL, NULL, NULL, NULL, '2025-08-07 18:36:47.814154', '2025-08-07 18:36:47.814154'),
	('41dc31a4-b7aa-453b-b2e8-85f8b0e968a0', 'Casa C', 'casa-c-inc', '084883772', '61', '1741 Rowe Lodge', '151 Reinger Trace', 'Montreal', 'Quebec', 'J7W 5Y2', 'US', '5148889999', 'com@gmail.com', 'www.acem.com', NULL, '2025-08-08 02:24:08.868267', '2025-08-08 02:24:08.868267');


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."clients" ("id", "company_id", "first_name", "last_name", "email", "phone", "company_name", "address_line1", "address_line2", "city", "state", "zip_code", "country", "notes", "created_at", "updated_at", "type", "secondary_phone", "preferred_contact_method", "rating", "is_active") VALUES
	('6cbd9fc7-1ae0-486d-add2-985de60ca6af', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'Michael', 'Taylor', 'michael@email.com', '555-1003', 'Taylor Construction', '789 Pine St', NULL, 'Springfield', 'IL', '62703', 'US', NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894', 'individual', NULL, 'email', 5, true),
	('737d07f3-7cce-43c9-8e63-77d68472c16b', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'Emily', 'Davis', 'emily@email.com', '555-1002', 'Davis & Associates', '456 Oak Ave', NULL, 'Springfield', 'IL', '62702', 'US', NULL, '2025-08-07 18:44:28.351894', '2025-08-09 20:25:00.839136', 'individual', NULL, 'email', 4, true),
	('ff44f7cc-2ae5-473f-93bb-b9c867d64290', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'Robert', 'Brown', 'robert@email.com', '555-1001', 'Brown Enterprises', '123 Main St', NULL, 'Springfield', 'IL', '62701', 'US', NULL, '2025-08-07 18:44:28.351894', '2025-08-09 20:25:03.972119', 'individual', NULL, 'email', 2, true),
	('080ba071-4822-4ad2-ae77-13fc8cf0b9bb', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'Verona', 'Feil', 'your.email+fakedata90633@gmail.com', '560-179-9819', NULL, '870 Orion Heights', '81781 O''Conner Trail', 'Fort Wayne', 'NV', '67576-2802', 'US', '528', '2025-08-09 20:32:34.647637', '2025-08-09 20:32:34.647637', 'individual', '978-945-0857', 'email', 5, true),
	('76804a44-53e0-47ca-bb73-27887033b465', '41dc31a4-b7aa-453b-b2e8-85f8b0e968a0', 'Mike', 'Smile ', 'mike@gmail.com', '5142223366', NULL, '223 Sherbrooke ', NULL, 'Mtl', 'Quebec ', 'H7J7J', 'US', 'Mike is new', '2025-08-09 23:35:22.783228', '2025-08-09 23:35:22.783228', 'individual', NULL, 'email', 2, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "email", "password_hash", "first_name", "last_name", "phone", "role", "is_active", "last_login", "created_at", "updated_at") VALUES
	('f6d28427-ffa0-4cbf-b9ce-deef5935fdf7', 'manager@contractorpro.com', '$2a$12$K8HKs6/T3JDGci1fKZTDqeVG7RHnE5vyqj9uZkBrXKWguuZHhPWBq', 'Project', 'Manager', '555-0200', 'manager', true, NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('1d1b54cd-2d39-46d1-b2c9-f38121ae26ff', 'john@contractorpro.com', '$2a$12$K8HKs6/T3JDGci1fKZTDqeVG7RHnE5vyqj9uZkBrXKWguuZHhPWBq', 'John', 'Smith', '555-0301', 'employee', true, NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('23e8d3e1-df10-440d-9b73-482474f0d335', 'sarah@contractorpro.com', '$2a$12$K8HKs6/T3JDGci1fKZTDqeVG7RHnE5vyqj9uZkBrXKWguuZHhPWBq', 'Sarah', 'Johnson', '555-0302', 'employee', true, NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('f83732e8-236f-4937-9797-32e86ae07abd', 'mike@contractorpro.com', '$2a$12$K8HKs6/T3JDGci1fKZTDqeVG7RHnE5vyqj9uZkBrXKWguuZHhPWBq', 'Mike', 'Wilson', '555-0303', 'employee', true, NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('17f4cf87-5693-4167-a429-71020015288f', 'admin@contractorpro.com', '$2a$12$K8HKs6/T3JDGci1fKZTDqeVG7RHnE5vyqj9uZkBrXKWguuZHhPWBq', 'System', 'Admin', '555-0100', 'admin', true, NULL, '2025-08-07 18:44:28.351894', '2025-08-21 23:27:06.373602'),
	('d22b7df8-e70f-4e54-87d8-4d39308fc0d0', 'nickybcotroni@gmail.com', 'temp_hash_d22b7df8-e70f-4e54-87d8-4d39308fc0d0', 'Nicky', 'Bruno', '4384700773', 'admin', true, NULL, '2025-08-08 02:12:19.37729', '2025-08-10 00:48:21.587048');


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."employees" ("id", "user_id", "company_id", "employee_number", "hire_date", "termination_date", "job_title", "department", "hourly_rate", "salary", "pay_type", "emergency_contact_name", "emergency_contact_phone", "certifications", "skills", "notes", "is_active", "created_at", "updated_at") VALUES
	('13636604-3ccb-42db-a3ed-e9651719bc51', '1d1b54cd-2d39-46d1-b2c9-f38121ae26ff', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'EMP001', '2024-01-01', NULL, 'Senior Carpenter', 'Construction', 35.00, NULL, 'hourly', NULL, NULL, NULL, NULL, NULL, true, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('9c38dc4d-0758-45ad-a394-6c4fc0d40a9c', '23e8d3e1-df10-440d-9b73-482474f0d335', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'EMP002', '2024-01-01', NULL, 'Electrician', 'Electrical', 40.00, NULL, 'hourly', NULL, NULL, NULL, NULL, NULL, true, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('177cdda4-c0e6-42e3-8a04-a473cb9b85de', 'f83732e8-236f-4937-9797-32e86ae07abd', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'EMP003', '2024-01-01', NULL, 'Plumber', 'Plumbing', 38.00, NULL, 'hourly', NULL, NULL, NULL, NULL, NULL, true, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894');


--
-- Data for Name: projects_new; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."projects_new" ("id", "company_id", "client_id", "project_number", "name", "description", "project_type", "status", "priority", "start_date", "estimated_end_date", "actual_end_date", "budget", "contract_amount", "site_address_line1", "site_address_line2", "site_city", "site_state", "site_zip_code", "site_lat", "site_lng", "project_manager_id", "notes", "created_at", "updated_at") VALUES
	('0420c15b-2dce-4537-a236-73462365c661', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'ff44f7cc-2ae5-473f-93bb-b9c867d64290', '514-666-8899', 'Brown Residence Renovation', 'Complete home renovation including kitchen and bathrooms', NULL, 'in_progress', 'high', '2025-01-15', '2025-04-15', '2025-07-08', 150000.00, 175000.00, '77 McGill', NULL, 'Montreal', 'Quebec', 'H7H 8J8', NULL, NULL, '13636604-3ccb-42db-a3ed-e9651719bc51', NULL, '2025-08-07 18:44:28.351894', '2025-08-21 21:29:30.013356'),
	('72444d6b-7272-4c2d-ba76-f7982e76aed7', '7a80462a-79bd-4ada-b214-73ddb2ae7416', '737d07f3-7cce-43c9-8e63-77d68472c16b', '438-854-5522', 'Davis Office Building', 'New commercial office building construction', NULL, 'planning', 'high', '2025-03-01', '2025-09-01', '2025-09-01', 500000.00, 550000.00, '6767 Sherbrooke ', NULL, 'Montreal', 'Quebec', 'J8T 7T7', NULL, NULL, '13636604-3ccb-42db-a3ed-e9651719bc51', NULL, '2025-08-07 18:44:28.351894', '2025-08-21 21:30:14.334783'),
	('6c840f7f-260e-4fff-b2ca-18590e1be092', '7a80462a-79bd-4ada-b214-73ddb2ae7416', '737d07f3-7cce-43c9-8e63-77d68472c16b', '514-965-6655', 'Henri Adams', 'Eaque accusamus omnis sunt tempore dolor quidem reiciendis repellendus vitae.', NULL, 'in_progress', 'medium', '2025-08-08', '2024-10-29', NULL, 335.00, NULL, '7805 Pfannerstill Cape', NULL, 'Montreal', 'Quebec', 'L0KI9I', NULL, NULL, NULL, NULL, '2025-08-09 03:49:48.706273', '2025-08-21 21:31:33.555475'),
	('bc12d841-ebca-47a9-abcd-da4d2cd0215f', '41dc31a4-b7aa-453b-b2e8-85f8b0e968a0', '76804a44-53e0-47ca-bb73-27887033b465', '450-959-8822', 'Garage ', 'This is Mike’s first project ', NULL, 'in_progress', 'medium', '2025-08-09', '2025-08-16', NULL, 60400.00, NULL, '123 Main Street ', NULL, 'Montreal', 'Quebec', 'K0I9Y6', NULL, NULL, NULL, NULL, '2025-08-09 23:36:33.97373', '2025-08-21 21:31:41.147422');


--
-- Data for Name: change_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: communications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."equipment" ("id", "company_id", "name", "category", "make", "model", "serial_number", "purchase_date", "purchase_price", "current_value", "last_maintenance_date", "next_maintenance_date", "maintenance_interval_days", "assigned_to", "current_project_id", "status", "condition", "location", "notes", "created_at", "updated_at") VALUES
	('4d60c495-768d-4958-b017-479216ff3725', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'Excavator', 'Heavy Equipment', 'CAT', '320', NULL, '2024-01-01', 100000.00, 95000.00, NULL, NULL, NULL, NULL, NULL, 'available', 'good', NULL, NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('0ab85f2e-0bce-43dc-9a91-a2aab3ffef7e', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'Pickup Truck', 'Vehicles', 'Ford', 'F-150', NULL, '2024-01-01', 45000.00, 42000.00, NULL, NULL, NULL, NULL, NULL, 'available', 'good', NULL, NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894');


--
-- Data for Name: financial_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."financial_transactions" ("id", "company_id", "project_id", "user_id", "transaction_date", "description", "category", "amount", "type", "attachment_file", "created_at", "updated_at") VALUES
	('114463f4-831b-4563-b2b0-24d49f3b99a5', '7a80462a-79bd-4ada-b214-73ddb2ae7416', '6c840f7f-260e-4fff-b2ca-18590e1be092', '17f4cf87-5693-4167-a429-71020015288f', '2025-08-01', 'Bathroom Remodel - Final Payment', 'Project Payment', 8500.00, 'income', NULL, '2025-08-10 01:41:20.687646+00', '2025-08-10 01:41:20.687646+00'),
	('3e19e56d-4758-401e-ad41-87268f7ab703', '7a80462a-79bd-4ada-b214-73ddb2ae7416', '72444d6b-7272-4c2d-ba76-f7982e76aed7', '17f4cf87-5693-4167-a429-71020015288f', '2025-08-13', 'Electrical Work - Johnson Electric', 'Subcontractor', -3200.00, 'expense', NULL, '2025-08-10 01:41:20.687646+00', '2025-08-10 01:41:20.687646+00'),
	('5c11764f-7317-4e64-95c9-ecdd4cd374bd', '7a80462a-79bd-4ada-b214-73ddb2ae7416', '6c840f7f-260e-4fff-b2ca-18590e1be092', '17f4cf87-5693-4167-a429-71020015288f', '2025-08-13', 'Lumber Supply - Home Depot', 'Materials', -2500.00, 'expense', 'home-depot-receipt.jpg', '2025-08-10 01:41:20.687646+00', '2025-08-10 01:41:20.687646+00'),
	('7025268f-4ccc-4fca-981b-62fca9c8d0d6', '7a80462a-79bd-4ada-b214-73ddb2ae7416', '72444d6b-7272-4c2d-ba76-f7982e76aed7', '17f4cf87-5693-4167-a429-71020015288f', '2025-08-11', 'Tool Rental - United Rentals', 'Equipment', -450.00, 'expense', NULL, '2025-08-10 01:41:20.687646+00', '2025-08-10 01:41:20.687646+00'),
	('72dfffe1-0687-4f25-9550-8386d36d9696', '7a80462a-79bd-4ada-b214-73ddb2ae7416', '0420c15b-2dce-4537-a236-73462365c661', '17f4cf87-5693-4167-a429-71020015288f', '2025-08-10', 'Plumbing Supplies - Ferguson', 'Materials', -1200.00, 'expense', NULL, '2025-08-10 01:41:20.687646+00', '2025-08-10 01:41:20.687646+00'),
	('81ebe793-3647-45a9-bdfc-85b5a6e2bad9', '7a80462a-79bd-4ada-b214-73ddb2ae7416', '0420c15b-2dce-4537-a236-73462365c661', '17f4cf87-5693-4167-a429-71020015288f', '2025-08-15', 'Kitchen Renovation - Progress Payment', 'Project Payment', 15000.00, 'income', NULL, '2025-08-10 01:41:20.687646+00', '2025-08-10 01:41:20.687646+00');


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."suppliers" ("id", "company_id", "name", "contact_name", "email", "phone", "address_line1", "address_line2", "city", "state", "zip_code", "country", "tax_id", "payment_terms", "notes", "created_at", "updated_at") VALUES
	('dcc2f30d-dcdc-4eb6-a2db-1482199afb01', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'ABC Building Supply', 'Tom Wilson', 'tom@abcsupply.com', '555-2001', '100 Supply Dr', NULL, 'Springfield', 'IL', '62704', 'US', NULL, NULL, NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('1eebf765-b35d-4451-8d91-5ddb824b0e5a', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'XYZ Tools & Equipment', 'Jane Anderson', 'jane@xyztools.com', '555-2002', '200 Industrial Pkwy', NULL, 'Springfield', 'IL', '62705', 'US', NULL, NULL, NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894');


--
-- Data for Name: materials; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."materials" ("id", "company_id", "name", "category", "unit", "current_stock", "minimum_stock", "unit_cost", "supplier_id", "sku", "location", "notes", "is_active", "created_at", "updated_at") VALUES
	('c6302660-b2c7-475e-901b-3a0ebf55c374', '7a80462a-79bd-4ada-b214-73ddb2ae7416', '2x4 Lumber', 'Construction', 'piece', 1000.000, 200.000, 3.99, 'dcc2f30d-dcdc-4eb6-a2db-1482199afb01', NULL, NULL, NULL, true, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('ec7d8068-cd1f-4791-9a6e-4882238bf53e', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'Drywall 4x8', 'Construction', 'sheet', 500.000, 100.000, 12.99, 'dcc2f30d-dcdc-4eb6-a2db-1482199afb01', NULL, NULL, NULL, true, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('efa55ccd-d4ac-4fbf-bef4-c5ed69bc970d', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'Electrical Wire 12/2', 'Electrical', 'foot', 5000.000, 1000.000, 0.89, '1eebf765-b35d-4451-8d91-5ddb824b0e5a', NULL, NULL, NULL, true, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894');


--
-- Data for Name: material_usage; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payroll; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."projects" ("id", "company_id", "name", "description", "status", "created_at", "updated_at") VALUES
	('b39904c9-b25b-4b7f-979f-ac7d23d27f85', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'Brown Residence Renovation', 'Complete home renovation including kitchen and bathrooms', 'in_progress', '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('6a6d6047-81d8-4ec4-a9eb-6d759f0dd216', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'Davis Office Building', 'New commercial office building construction', 'planning', '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894');


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tasks" ("id", "project_id", "parent_task_id", "name", "description", "status", "priority", "assigned_to", "estimated_hours", "actual_hours", "start_date", "due_date", "completion_date", "completion_percentage", "dependencies", "notes", "created_at", "updated_at") VALUES
	('d87a8751-6a59-4273-a4bf-553ad6ff142a', '0420c15b-2dce-4537-a236-73462365c661', NULL, 'Kitchen Demo', 'Remove existing kitchen cabinets and appliances', 'in_progress', 'high', '13636604-3ccb-42db-a3ed-e9651719bc51', 40.00, NULL, NULL, NULL, NULL, 0, NULL, NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894'),
	('9870efec-588d-42da-9399-13133f8b13be', '0420c15b-2dce-4537-a236-73462365c661', NULL, 'Electrical Rough-in', 'Install new electrical wiring and outlets', 'not_started', 'high', '9c38dc4d-0758-45ad-a394-6c4fc0d40a9c', 30.00, NULL, NULL, NULL, NULL, 0, NULL, NULL, '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894');


--
-- Data for Name: time_tracking; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."time_tracking" ("id", "employee_id", "project_id", "clock_in", "clock_out", "break_duration", "total_hours", "overtime_hours", "hourly_rate", "location_lat", "location_lng", "notes", "status", "created_at", "updated_at") VALUES
	('c118fb71-2dfb-4906-be98-89fbda9586f8', '13636604-3ccb-42db-a3ed-e9651719bc51', 'b39904c9-b25b-4b7f-979f-ac7d23d27f85', '2024-01-15 08:00:00', '2024-01-15 16:00:00', 0, 8.00, 0.00, 35.00, NULL, NULL, NULL, 'completed', '2025-08-07 18:44:28.351894', '2025-08-07 18:44:28.351894');


--
-- Data for Name: user_companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_companies" ("user_id", "company_id", "role") VALUES
	('d22b7df8-e70f-4e54-87d8-4d39308fc0d0', '41dc31a4-b7aa-453b-b2e8-85f8b0e968a0', 'admin'),
	('17f4cf87-5693-4167-a429-71020015288f', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'admin'),
	('f6d28427-ffa0-4cbf-b9ce-deef5935fdf7', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'manager'),
	('23e8d3e1-df10-440d-9b73-482474f0d335', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'employee'),
	('1d1b54cd-2d39-46d1-b2c9-f38121ae26ff', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'employee'),
	('f83732e8-236f-4937-9797-32e86ae07abd', '7a80462a-79bd-4ada-b214-73ddb2ae7416', 'employee');


--
-- PostgreSQL database dump complete
--

RESET ALL;
