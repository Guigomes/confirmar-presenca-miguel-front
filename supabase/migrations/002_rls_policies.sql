-- ============================================================
-- Confirmar Presença Miguel – Migration 002: Row Level Security
-- ============================================================

alter table user_profiles enable row level security;
alter table rsvps         enable row level security;

-- ============================================================
-- Helper function
-- ============================================================

create or replace function auth_user_role()
returns user_role language sql stable security definer as $$
  select role from public.user_profiles where id = auth.uid();
$$;

-- ============================================================
-- user_profiles
-- ============================================================

create policy "profiles_select_own" on user_profiles for select using (id = auth.uid() or auth_user_role() = 'admin');
create policy "profiles_update_own" on user_profiles for update using (id = auth.uid()) with check (id = auth.uid());
-- Insert handled by the on_auth_user_created trigger, no insert policy needed

-- ============================================================
-- rsvps
-- ============================================================

-- Anyone (including anonymous guests) can confirm presence
create policy "rsvps_insert_public" on rsvps for insert with check (true);

-- Only admins (Miguel's parents) can see, edit or remove confirmations
create policy "rsvps_select_admin" on rsvps for select using (auth_user_role() = 'admin');
create policy "rsvps_update_admin" on rsvps for update using (auth_user_role() = 'admin');
create policy "rsvps_delete_admin" on rsvps for delete using (auth_user_role() = 'admin');
