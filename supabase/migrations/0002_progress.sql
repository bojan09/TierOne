-- 0002_progress.sql
-- Phase 4 — server-authoritative progress + gamification.
--
-- XP / level / streak / badges are computed in the database and written ONLY by
-- the SECURITY DEFINER RPC below. Clients can read their own progress but can
-- never write XP or stats directly, so progress cannot be forged.

-- ─────────────────────────────────────────────────────────────────────────────
-- curriculum_lessons — minimal XP authority for the spine.
-- The in-app spine drives navigation; THIS table is the trusted source of how
-- much XP a lesson is worth. Seeded here for the slice; P5 expands the seed
-- (generated from the spine) to the full lesson set.
-- ─────────────────────────────────────────────────────────────────────────────
create table public.curriculum_lessons (
  id         text primary key,
  slug       text not null,
  title      text not null,
  track      public.track not null,
  xp         integer not null check (xp >= 0),
  sort_order integer not null default 0
);

alter table public.curriculum_lessons enable row level security;

create policy "curriculum_lessons_read_all"
  on public.curriculum_lessons for select
  to authenticated
  using (true);

revoke all on public.curriculum_lessons from anon, authenticated;
grant select on public.curriculum_lessons to authenticated;

insert into public.curriculum_lessons (id, slug, title, track, xp, sort_order) values
  ('hdf-01', 'what-is-it-support',           'What IT Support Actually Is',          'helpdesk', 40, 1),
  ('hdf-02', 'troubleshooting-methodology',  'A Repeatable Troubleshooting Method',  'helpdesk', 50, 2),
  ('hdf-03', 'tickets-and-documentation',    'Writing Tickets People Can Use',       'helpdesk', 50, 3);

-- ─────────────────────────────────────────────────────────────────────────────
-- lesson_progress — one row per (user, lesson). Read-own; writes via RPC only.
-- ─────────────────────────────────────────────────────────────────────────────
create type public.lesson_status as enum ('not_started', 'in_progress', 'completed');

create table public.lesson_progress (
  user_id      uuid not null references auth.users (id) on delete cascade,
  lesson_id    text not null references public.curriculum_lessons (id) on delete cascade,
  status       public.lesson_status not null default 'completed',
  completed_at timestamptz,
  xp_awarded   integer not null default 0,
  primary key (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

create policy "lesson_progress_select_own"
  on public.lesson_progress for select
  to authenticated
  using (user_id = auth.uid());

-- No insert/update/delete grants → completion happens only through the RPC.
revoke all on public.lesson_progress from anon, authenticated;
grant select on public.lesson_progress to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- user_stats — denormalised rollup. Read-own; NEVER client-writable.
-- ─────────────────────────────────────────────────────────────────────────────
create table public.user_stats (
  user_id         uuid primary key references auth.users (id) on delete cascade,
  total_xp        integer not null default 0,
  level           integer not null default 1,
  streak          integer not null default 0,
  last_study_date date,
  earned_badges   jsonb not null default '[]'::jsonb,
  updated_at      timestamptz not null default now()
);

alter table public.user_stats enable row level security;

create policy "user_stats_select_own"
  on public.user_stats for select
  to authenticated
  using (user_id = auth.uid());

-- Read-only to clients; written exclusively by the RPC (definer).
revoke all on public.user_stats from anon, authenticated;
grant select on public.user_stats to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- level_for_xp — single source of level thresholds (mirror in TS for display).
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.level_for_xp(p_xp integer)
returns integer
language sql
immutable
as $$
  select case
    when p_xp >= 11000 then 10
    when p_xp >=  8000 then 9
    when p_xp >=  5500 then 8
    when p_xp >=  3500 then 7
    when p_xp >=  2000 then 6
    when p_xp >=  1000 then 5
    when p_xp >=   500 then 4
    when p_xp >=   250 then 3
    when p_xp >=   100 then 2
    else 1
  end;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- complete_lesson — the only path that awards XP. Idempotent: completing an
-- already-completed lesson is a no-op that returns current stats.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.complete_lesson(p_lesson_id text)
returns public.user_stats
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid       uuid := auth.uid();
  v_xp        integer;
  v_today     date := (now() at time zone 'utc')::date;
  v_completed integer;
  v_total_xp  integer;
  v_badges    jsonb;
  v_last      date;
  v_streak    integer;
  v_stats     public.user_stats;
begin
  if v_uid is null then
    raise exception 'not authenticated';
  end if;

  select xp into v_xp from public.curriculum_lessons where id = p_lesson_id;
  if not found then
    raise exception 'unknown lesson: %', p_lesson_id;
  end if;

  -- Record completion (idempotent on the PK).
  insert into public.lesson_progress (user_id, lesson_id, status, completed_at, xp_awarded)
  values (v_uid, p_lesson_id, 'completed', now(), v_xp)
  on conflict (user_id, lesson_id) do update
    set status = 'completed',
        completed_at = coalesce(public.lesson_progress.completed_at, now()),
        xp_awarded = excluded.xp_awarded;

  -- Authoritative recompute (drift-proof): total XP + completed count.
  select coalesce(sum(xp_awarded), 0), count(*)
    into v_total_xp, v_completed
    from public.lesson_progress
    where user_id = v_uid and status = 'completed';

  -- Streak: based on the prior last_study_date.
  select last_study_date into v_last from public.user_stats where user_id = v_uid;
  if v_last is null then
    v_streak := 1;
  elsif v_last = v_today then
    select streak into v_streak from public.user_stats where user_id = v_uid;
  elsif v_last = v_today - 1 then
    select streak + 1 into v_streak from public.user_stats where user_id = v_uid;
  else
    v_streak := 1;
  end if;

  -- Badges (additive).
  select coalesce(earned_badges, '[]'::jsonb) into v_badges
    from public.user_stats where user_id = v_uid;
  v_badges := coalesce(v_badges, '[]'::jsonb);
  if v_completed >= 1 and not (v_badges ? 'first-lesson') then
    v_badges := v_badges || '["first-lesson"]'::jsonb;
  end if;
  if v_completed >= 5 and not (v_badges ? 'five-lessons') then
    v_badges := v_badges || '["five-lessons"]'::jsonb;
  end if;
  if v_completed >= 10 and not (v_badges ? 'ten-lessons') then
    v_badges := v_badges || '["ten-lessons"]'::jsonb;
  end if;

  insert into public.user_stats (user_id, total_xp, level, streak, last_study_date, earned_badges, updated_at)
  values (v_uid, v_total_xp, public.level_for_xp(v_total_xp), v_streak, v_today, v_badges, now())
  on conflict (user_id) do update
    set total_xp = excluded.total_xp,
        level = excluded.level,
        streak = excluded.streak,
        last_study_date = excluded.last_study_date,
        earned_badges = excluded.earned_badges,
        updated_at = now()
  returning * into v_stats;

  return v_stats;
end;
$$;

revoke all on function public.complete_lesson(text) from anon;
grant execute on function public.complete_lesson(text) to authenticated;
