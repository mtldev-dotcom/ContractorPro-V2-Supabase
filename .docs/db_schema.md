✅ Companies

Columns: id, name, legal_name, tax_id, license_number, address_line1/2, city, state, zip_code, country, phone, email, website, logo_url, timestamps

20250909015255_remote_schema

.

RLS: only admins can manage; users can view their own companies

20250909015255_remote_schema

.

✅ Users

Columns: id, email, first_name, last_name, phone, role, is_active, last_login, timestamps

20250909015255_remote_schema

.

password_hash was dropped (auth handled only in auth.users)

20250909025705_remote_schema

.

Default role for new users now = employee (patched)

20250909025705_remote_schema

.

✅ Employees

Columns: id (also FK to users.id), user_id (unique link to users), company_id, employee_number, hire_date, termination_date, job_title, department, pay details, role (admin/manager/employee/client), timestamps

20250909025705_remote_schema

.

get_user_employee_id() now resolves via employees.user_id

20250909025705_remote_schema

.

✅ Clients

Rich schema: first_name, last_name, email, phone, company_name, full address, notes, type (individual or business), rating, etc.

20250909015255_remote_schema

.

✅ Projects

Table: projects_new.

Columns: id, company_id, client_id, project_number (unique), name, description, type, status (planning, in_progress, completed, etc.), priority, dates, budget/contract_amount, full site address, coordinates, project_manager_id (FK employees), notes, timestamps

20250909015255_remote_schema

.

✅ Tasks

Columns: id, project_id, parent_task_id, name, description, status (not_started, in_progress, etc.), priority, assigned_to (FK users), estimated/actual hours, dates, dependencies, completion %, timestamps

20250909015255_remote_schema

.

Policies let employees view/update assigned tasks, admins/managers manage project tasks

20250909025705_remote_schema

.

✅ Financial Transactions

Columns: id, company_id, project_id, user_id, transaction_date, description, category, amount, type (income/expense), attachments, timestamps

20250909015255_remote_schema

.

✅ Time Tracking

Columns: id, employee_id, project_id, clock_in, clock_out, break_duration, total_hours, overtime, hourly_rate, geolocation, notes, status, timestamps

20250909015255_remote_schema

.

Policies restrict to employee’s own rows

20250909025705_remote_schema

.

✅ Extras

Suppliers, Materials, Equipment, Payroll, Change Orders, Documents, Communications all exist — so your schema supports full construction/contractor workflows
