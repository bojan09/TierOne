-- 0014_labs.sql — Phase 8. Simulated in-browser labs (no VMs).
-- A lab is a scripted terminal exercise: ordered steps, each with an accepted
-- command pattern + simulated output. Validation is client-side (immediate
-- feedback); the server records completion and folds a one-time XP bonus into
-- the same authoritative total as lessons/quizzes/scenarios.

create table if not exists public.labs (
  id          text primary key,
  slug        text not null unique,
  title       text not null,
  track       public.track not null default 'sysadmin',
  intro       text not null,
  est_minutes integer not null default 10,
  bonus_xp    integer not null default 50,
  sort        integer not null default 0
);

create table if not exists public.lab_steps (
  id             bigint generated always as identity primary key,
  lab_id         text not null references public.labs (id) on delete cascade,
  sort           integer not null default 0,
  instruction    text not null,
  accept_pattern text not null,   -- JS-compatible regex tested against the typed command
  output         text,            -- simulated stdout shown on success
  hint           text
);
create index if not exists lab_steps_lab_idx on public.lab_steps (lab_id, sort);

create table if not exists public.lab_attempts (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  lab_id     text not null references public.labs (id) on delete cascade,
  completed  boolean not null default true,
  created_at timestamptz not null default now(),
  unique (user_id, lab_id)
);

-- ─── RLS: default-deny; lab content is non-secret and served via get_lab. ───
alter table public.labs         enable row level security;
alter table public.lab_steps    enable row level security;
alter table public.lab_attempts enable row level security;

revoke all on public.labs from anon, authenticated;
grant select on public.labs to authenticated;
create policy "labs_read" on public.labs for select to authenticated using (true);

revoke all on public.lab_steps from anon, authenticated;   -- served via get_lab only

revoke all on public.lab_attempts from anon, authenticated;
grant select on public.lab_attempts to authenticated;
create policy "lab_attempts_select_own" on public.lab_attempts
  for select to authenticated using (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────────
-- _recompute_user_stats — REDEFINED to also fold in lab bonuses.
-- total_xp = lesson XP + quiz bonus + scenario bonus + lab bonus.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public._recompute_user_stats(p_uid uuid)
returns public.user_stats
language plpgsql
security definer
set search_path = public
as $$
declare
  v_today       date := (now() at time zone 'utc')::date;
  v_lesson_xp   integer;
  v_quiz_xp     integer;
  v_scenario_xp integer;
  v_lab_xp      integer;
  v_total_xp    integer;
  v_completed   integer;
  v_quizzes     integer;
  v_scenarios   integer;
  v_labs        integer;
  v_badges      jsonb;
  v_last        date;
  v_streak      integer;
  v_stats       public.user_stats;
begin
  select coalesce(sum(xp_awarded), 0), count(*) into v_lesson_xp, v_completed
    from public.lesson_progress where user_id = p_uid and status = 'completed';

  select coalesce(sum(lq.bonus_xp), 0), count(*) into v_quiz_xp, v_quizzes
    from public.lesson_quizzes lq
    where exists (select 1 from public.quiz_attempts qa
                  where qa.user_id = p_uid and qa.lesson_id = lq.lesson_id and qa.passed);

  select coalesce(sum(sc.bonus_xp), 0), count(*) into v_scenario_xp, v_scenarios
    from public.scenarios sc
    where exists (select 1 from public.scenario_attempts sa
                  where sa.user_id = p_uid and sa.scenario_id = sc.id and sa.passed);

  select coalesce(sum(lb.bonus_xp), 0), count(*) into v_lab_xp, v_labs
    from public.labs lb
    where exists (select 1 from public.lab_attempts la
                  where la.user_id = p_uid and la.lab_id = lb.id and la.completed);

  v_total_xp := v_lesson_xp + v_quiz_xp + v_scenario_xp + v_lab_xp;

  select last_study_date into v_last from public.user_stats where user_id = p_uid;
  if v_last is null then v_streak := 1;
  elsif v_last = v_today then select streak into v_streak from public.user_stats where user_id = p_uid;
  elsif v_last = v_today - 1 then select streak + 1 into v_streak from public.user_stats where user_id = p_uid;
  else v_streak := 1;
  end if;

  select coalesce(earned_badges, '[]'::jsonb) into v_badges from public.user_stats where user_id = p_uid;
  v_badges := coalesce(v_badges, '[]'::jsonb);
  if v_completed >= 1  and not (v_badges ? 'first-lesson')   then v_badges := v_badges || '["first-lesson"]'::jsonb; end if;
  if v_completed >= 5  and not (v_badges ? 'five-lessons')   then v_badges := v_badges || '["five-lessons"]'::jsonb; end if;
  if v_completed >= 10 and not (v_badges ? 'ten-lessons')    then v_badges := v_badges || '["ten-lessons"]'::jsonb; end if;
  if v_quizzes  >= 1   and not (v_badges ? 'first-quiz')     then v_badges := v_badges || '["first-quiz"]'::jsonb; end if;
  if v_scenarios >= 1  and not (v_badges ? 'first-scenario') then v_badges := v_badges || '["first-scenario"]'::jsonb; end if;
  if v_labs     >= 1   and not (v_badges ? 'first-lab')      then v_badges := v_badges || '["first-lab"]'::jsonb; end if;

  insert into public.user_stats (user_id, total_xp, level, streak, last_study_date, earned_badges, updated_at)
  values (p_uid, v_total_xp, public.level_for_xp(v_total_xp), v_streak, v_today, v_badges, now())
  on conflict (user_id) do update
    set total_xp = excluded.total_xp, level = excluded.level, streak = excluded.streak,
        last_study_date = excluded.last_study_date, earned_badges = excluded.earned_badges, updated_at = now()
  returning * into v_stats;
  return v_stats;
end;
$$;
revoke all on function public._recompute_user_stats(uuid) from anon, authenticated;

-- ─── get_lab — intro + steps (content is non-secret). ───
create or replace function public.get_lab(p_lab_id text)
returns jsonb language sql security definer set search_path = public as $$
  select jsonb_build_object(
    'id', l.id, 'slug', l.slug, 'title', l.title, 'intro', l.intro,
    'est_minutes', l.est_minutes, 'bonus_xp', l.bonus_xp,
    'steps', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', st.id, 'sort', st.sort, 'instruction', st.instruction,
        'accept_pattern', st.accept_pattern, 'output', st.output, 'hint', st.hint
      ) order by st.sort, st.id)
      from public.lab_steps st where st.lab_id = l.id), '[]'::jsonb)
  )
  from public.labs l where l.id = p_lab_id;
$$;
revoke all on function public.get_lab(text) from anon;
grant execute on function public.get_lab(text) to authenticated;

-- ─── complete_lab — idempotent completion + one-time bonus via recompute. ───
create or replace function public.complete_lab(p_lab_id text)
returns public.user_stats language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  perform 1 from public.labs where id = p_lab_id;
  if not found then raise exception 'unknown lab: %', p_lab_id; end if;
  insert into public.lab_attempts (user_id, lab_id, completed)
  values (v_uid, p_lab_id, true)
  on conflict (user_id, lab_id) do update set completed = true;
  return public._recompute_user_stats(v_uid);
end;
$$;
revoke all on function public.complete_lab(text) from anon;
grant execute on function public.complete_lab(text) to authenticated;
