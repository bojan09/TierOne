-- 0001_profiles.sql
-- Phase 3 — authentication backbone: roles, profiles, default-deny RLS,
-- and automatic profile provisioning on signup.
--
-- Apply with the Supabase SQL editor or `supabase db push`. Idempotent-ish:
-- safe to read top-to-bottom; re-running requires a clean schema.

-- ─────────────────────────────────────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────────────────────────────────────
create type public.app_role as enum ('student', 'admin');
create type public.track    as enum ('helpdesk', 'sysadmin');

-- ─────────────────────────────────────────────────────────────────────────────
-- profiles — one row per auth user (1:1 with auth.users)
-- ─────────────────────────────────────────────────────────────────────────────
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role         public.app_role not null default 'student',
  track        public.track    not null default 'helpdesk',
  created_at   timestamptz     not null default now()
);

comment on table public.profiles is
  'Per-user profile, 1:1 with auth.users. role/track are authoritative here.';

-- ─────────────────────────────────────────────────────────────────────────────
-- is_admin() — SECURITY DEFINER so it bypasses RLS and cannot cause the
-- recursive policy evaluation that a self-referential profiles policy would.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- Privileges: default deny. anon gets nothing; authenticated gets row-scoped
-- read/insert and a COLUMN-LEVEL update that EXCLUDES `role` and `track`-less
-- escalation — i.e. a user can edit their display_name and switch track, but
-- cannot promote themselves to admin.
-- ─────────────────────────────────────────────────────────────────────────────
revoke all on public.profiles from anon, authenticated;
grant select               on public.profiles to authenticated;
grant insert               on public.profiles to authenticated;
grant update (display_name, track) on public.profiles to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

-- Read your own row; admins read everyone.
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

-- You may only ever insert a row keyed to yourself (defense in depth; the
-- trigger below normally creates it).
create policy "profiles_insert_self"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

-- You may update only your own row. Combined with the column grant above, the
-- updatable surface is display_name + track. role cannot be changed by clients.
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- No client delete policy → deletes are denied for anon/authenticated.

-- ─────────────────────────────────────────────────────────────────────────────
-- Auto-provision a profile when a new auth user is created.
-- SECURITY DEFINER so it can insert past RLS during signup.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(coalesce(new.email, ''), '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
