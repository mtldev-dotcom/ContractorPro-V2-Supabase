-- Demo seed data for public.tasks (one INSERT per row to avoid VALUES length mismatches)
-- Safe to run multiple times: uses fixed UUIDs and ON CONFLICT DO NOTHING.
-- Targets projects already seeded in supabase/seed.sql.

-- Columns for reference:
-- (id, project_id, parent_task_id, name, description, status, priority, assigned_to, estimated_hours, actual_hours, start_date, due_date, completion_date, completion_percentage, dependencies, notes, created_at, updated_at)

INSERT INTO public.tasks (id, project_id, parent_task_id, name, description, status, priority, assigned_to, estimated_hours, actual_hours, start_date, due_date, completion_date, completion_percentage, dependencies, notes, created_at, updated_at)
VALUES ('d87a8751-6a59-4273-a4bf-553ad6ff142a', '0420c15b-2dce-4537-a236-73462365c661', NULL, 'Kitchen Demo', 'Remove existing kitchen cabinets and appliances', 'in_progress', 'high', '13636604-3ccb-42db-a3ed-e9651719bc51', 40.00, NULL, NULL, NULL, NULL, 0, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tasks (id, project_id, parent_task_id, name, description, status, priority, assigned_to, estimated_hours, actual_hours, start_date, due_date, completion_date, completion_percentage, dependencies, notes, created_at, updated_at)
VALUES ('9870efec-588d-42da-9399-13133f8b13be', '0420c15b-2dce-4537-a236-73462365c661', NULL, 'Electrical Rough-in', 'Install new electrical wiring and outlets', 'not_started', 'high', '9c38dc4d-0758-45ad-a394-6c4fc0d40a9c', 30.00, NULL, NULL, NULL, NULL, 0, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tasks (id, project_id, parent_task_id, name, description, status, priority, assigned_to, estimated_hours, actual_hours, start_date, due_date, completion_date, completion_percentage, dependencies, notes, created_at, updated_at)
VALUES ('44444444-4444-4444-4444-444444444444', '0420c15b-2dce-4537-a236-73462365c661', NULL, 'Cabinet Install', 'Install new kitchen cabinets and hardware', 'not_started', 'medium', '13636604-3ccb-42db-a3ed-e9651719bc51', 24.00, NULL, NULL, NULL, NULL, 0, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Davis Office Building
INSERT INTO public.tasks (id, project_id, parent_task_id, name, description, status, priority, assigned_to, estimated_hours, actual_hours, start_date, due_date, completion_date, completion_percentage, dependencies, notes, created_at, updated_at)
VALUES ('55555555-5555-5555-5555-555555555555', '72444d6b-7272-4c2d-ba76-f7982e76aed7', NULL, 'Site Prep - Davis', 'Clear and grade site; set up erosion control', 'completed', 'high', '13636604-3ccb-42db-a3ed-e9651719bc51', 16.00, 16.00, '2025-07-10', '2025-07-12', '2025-07-12', 100, NULL, 'Completed before foundation', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tasks (id, project_id, parent_task_id, name, description, status, priority, assigned_to, estimated_hours, actual_hours, start_date, due_date, completion_date, completion_percentage, dependencies, notes, created_at, updated_at)
VALUES ('66666666-6666-6666-6666-666666666666', '72444d6b-7272-4c2d-ba76-f7982e76aed7', NULL, 'Foundation', 'Pour foundations and footings', 'not_started', 'high', NULL, 120.00, NULL, NULL, NULL, NULL, 0, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tasks (id, project_id, parent_task_id, name, description, status, priority, assigned_to, estimated_hours, actual_hours, start_date, due_date, completion_date, completion_percentage, dependencies, notes, created_at, updated_at)
VALUES ('77777777-7777-7777-7777-777777777777', '72444d6b-7272-4c2d-ba76-f7982e76aed7', '66666666-6666-6666-6666-666666666666', 'Framing', 'Framing for floors and walls', 'not_started', 'high', '13636604-3ccb-42db-a3ed-e9651719bc51', 200.00, NULL, NULL, NULL, NULL, 0, 'depends_on:foundation', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Garage project
INSERT INTO public.tasks (id, project_id, parent_task_id, name, description, status, priority, assigned_to, estimated_hours, actual_hours, start_date, due_date, completion_date, completion_percentage, dependencies, notes, created_at, updated_at)
VALUES ('88888888-8888-8888-8888-888888888888', 'bc12d841-ebca-47a9-abcd-da4d2cd0215f', NULL, 'Garage Site Prep', 'Prepare small garage site and pour slab', 'completed', 'medium', '13636604-3ccb-42db-a3ed-e9651719bc51', 12.00, 12.00, '2025-08-10', '2025-08-12', '2025-08-12', 100, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tasks (id, project_id, parent_task_id, name, description, status, priority, assigned_to, estimated_hours, actual_hours, start_date, due_date, completion_date, completion_percentage, dependencies, notes, created_at, updated_at)
VALUES ('99999999-9999-9999-9999-999999999999', 'bc12d841-ebca-47a9-abcd-da4d2cd0215f', '88888888-8888-8888-8888-888888888888', 'Garage Roof', 'Install roofing materials and flashing', 'not_started', 'medium', '177cdda4-c0e6-42e3-8a04-a473cb9b85de', 20.00, NULL, NULL, NULL, NULL, 0, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tasks (id, project_id, parent_task_id, name, description, status, priority, assigned_to, estimated_hours, actual_hours, start_date, due_date, completion_date, completion_percentage, dependencies, notes, created_at, updated_at)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bc12d841-ebca-47a9-abcd-da4d2cd0215f', NULL, 'Paint & Finish', 'Paint exterior and finish trim', 'not_started', 'low', NULL, 8.00, NULL, NULL, NULL, NULL, 0, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Henri Adams project
INSERT INTO public.tasks (id, project_id, parent_task_id, name, description, status, priority, assigned_to, estimated_hours, actual_hours, start_date, due_date, completion_date, completion_percentage, dependencies, notes, created_at, updated_at)
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '6c840f7f-260e-4fff-b2ca-18590e1be092', NULL, 'Initial Inspection', 'Third-party inspection before finishing', 'completed', 'medium', NULL, 2.00, 2.00, '2025-08-09', '2025-08-09', '2025-08-09', 100, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tasks (id, project_id, parent_task_id, name, description, status, priority, assigned_to, estimated_hours, actual_hours, start_date, due_date, completion_date, completion_percentage, dependencies, notes, created_at, updated_at)
VALUES ('cccccccc-cccc-cccc-cccc-cccccccccccc', '6c840f7f-260e-4fff-b2ca-18590e1be092', NULL, 'Finish Work', 'Final carpentry, trim and punchlist', 'not_started', 'medium', '13636604-3ccb-42db-a3ed-e9651719bc51', 18.00, NULL, NULL, NULL, NULL, 0, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tasks (id, project_id, parent_task_id, name, description, status, priority, assigned_to, estimated_hours, actual_hours, start_date, due_date, completion_date, completion_percentage, dependencies, notes, created_at, updated_at)
VALUES ('dddddddd-dddd-dddd-dddd-dddddddddddd', '6c840f7f-260e-4fff-b2ca-18590e1be092', NULL, 'Plumbing Final', 'Complete plumbing fixtures and testing', 'not_started', 'high', '177cdda4-c0e6-42e3-8a04-a473cb9b85de', 10.00, NULL, NULL, NULL, NULL, 0, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
