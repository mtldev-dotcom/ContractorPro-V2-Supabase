-- supabase/migrations/<timestamp>_fix_function_search_path.sql
-- keep this function hardened
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, email, created_at)
  values (new.id, new.email, now())
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- No args in these signatures, so () is correct.

ALTER FUNCTION public.get_user_company_ids()     SET search_path = '';
ALTER FUNCTION public.get_user_employee_id()     SET search_path = '';
ALTER FUNCTION public.get_user_role()            SET search_path = '';

-- Trigger functions
ALTER FUNCTION public.handle_new_user()          SET search_path = '';
ALTER FUNCTION public.handle_user_update()       SET search_path = '';
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';

-- Predicates/utilities
ALTER FUNCTION public.is_admin()                 SET search_path = '';
ALTER FUNCTION public.is_admin_or_manager()      SET search_path = '';
ALTER FUNCTION public.sync_existing_users()      SET search_path = '';
