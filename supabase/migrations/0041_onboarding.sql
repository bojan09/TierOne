-- 0041_onboarding.sql — onboarding prefs on profiles (track already exists). Idempotent.

alter table public.profiles
  add column if not exists daily_goal  integer     not null default 1,
  add column if not exists onboarded_at timestamptz;

-- Extend the existing column-level UPDATE grant to cover the new prefs.
grant update (display_name, track, daily_goal, onboarded_at) on public.profiles to authenticated;
