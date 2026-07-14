-- ============================================================
-- Confirmar Presença Miguel – Migration 001: Initial Schema
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

create type user_role as enum ('admin', 'guest');

-- ============================================================
-- user_profiles
-- ============================================================

create table user_profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null default '',
  email         text,
  role          user_role not null default 'guest',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.user_profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    'guest'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- rsvps
-- ============================================================

create table rsvps (
  id                 uuid primary key default uuid_generate_v4(),
  guest_name         text not null,
  companions_count   smallint not null default 0,
  message            text,
  created_at         timestamptz not null default now()
);

create index idx_rsvps_created_at on rsvps (created_at desc);

-- ============================================================
-- updated_at trigger
-- ============================================================

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_user_profiles_updated_at before update on user_profiles for each row execute procedure set_updated_at();
