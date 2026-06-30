-- 0009_scenarios.sql — Phase 7. Virtual Help Desk (linear staged ticket sim).
-- A scenario is a ticket with ordered stages (triage → diagnose → resolve →
-- communicate). Each stage is a scored single-choice decision. Grading is
-- server-side; the answer key (is_correct/points/feedback) is never shipped —
-- get_scenario serves options without it, submit_scenario grades + returns it.
-- Scenario XP folds into the same authoritative total as lessons + quizzes.

create table if not exists public.scenarios (
  id            text primary key,
  slug          text not null unique,
  title         text not null,
  track         public.track not null default 'helpdesk',
  intro_actor   text not null,
  intro_channel text not null,
  intro_message text not null,
  pass_pct      integer not null default 60 check (pass_pct between 1 and 100),
  bonus_xp      integer not null default 60 check (bonus_xp >= 0),
  sort          integer not null default 0
);

create table if not exists public.scenario_stages (
  id          bigint generated always as identity primary key,
  scenario_id text not null references public.scenarios (id) on delete cascade,
  sort        integer not null default 0,
  kind        text not null,                 -- triage | diagnose | resolve | communicate
  prompt      text not null
);
create index if not exists scenario_stages_scenario_idx on public.scenario_stages (scenario_id, sort);

create table if not exists public.scenario_options (
  id         bigint generated always as identity primary key,
  stage_id   bigint not null references public.scenario_stages (id) on delete cascade,
  sort       integer not null default 0,
  text       text not null,
  is_correct boolean not null default false,
  points     integer not null default 0,
  feedback   text
);
create index if not exists scenario_options_stage_idx on public.scenario_options (stage_id, sort);

create table if not exists public.scenario_attempts (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  scenario_id text not null references public.scenarios (id) on delete cascade,
  score_pct   integer not null,
  passed      boolean not null,
  created_at  timestamptz not null default now()
);
create index if not exists scenario_attempts_user_idx on public.scenario_attempts (user_id, scenario_id);

-- ─── RLS: default-deny. Answer key (scenario_options) is never client-readable. ───
alter table public.scenarios         enable row level security;
alter table public.scenario_stages   enable row level security;
alter table public.scenario_options  enable row level security;
alter table public.scenario_attempts enable row level security;

revoke all on public.scenarios from anon, authenticated;
grant select on public.scenarios to authenticated;
create policy "scenarios_read" on public.scenarios for select to authenticated using (true);

revoke all on public.scenario_stages from anon, authenticated;  -- served via get_scenario only
revoke all on public.scenario_options from anon, authenticated; -- answer key, definer-only

revoke all on public.scenario_attempts from anon, authenticated;
grant select on public.scenario_attempts to authenticated;
create policy "scenario_attempts_select_own" on public.scenario_attempts
  for select to authenticated using (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────────
-- _recompute_user_stats — REDEFINED to also fold in scenario bonuses, so lessons
-- + quizzes + scenarios share one authoritative total (no drift across paths).
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
  v_total_xp    integer;
  v_completed   integer;
  v_quizzes     integer;
  v_scenarios   integer;
  v_badges      jsonb;
  v_last        date;
  v_streak      integer;
  v_stats       public.user_stats;
begin
  select coalesce(sum(xp_awarded), 0), count(*)
    into v_lesson_xp, v_completed
    from public.lesson_progress
    where user_id = p_uid and status = 'completed';

  select coalesce(sum(lq.bonus_xp), 0), count(*)
    into v_quiz_xp, v_quizzes
    from public.lesson_quizzes lq
    where exists (select 1 from public.quiz_attempts qa
                  where qa.user_id = p_uid and qa.lesson_id = lq.lesson_id and qa.passed);

  select coalesce(sum(sc.bonus_xp), 0), count(*)
    into v_scenario_xp, v_scenarios
    from public.scenarios sc
    where exists (select 1 from public.scenario_attempts sa
                  where sa.user_id = p_uid and sa.scenario_id = sc.id and sa.passed);

  v_total_xp := v_lesson_xp + v_quiz_xp + v_scenario_xp;

  select last_study_date into v_last from public.user_stats where user_id = p_uid;
  if v_last is null then
    v_streak := 1;
  elsif v_last = v_today then
    select streak into v_streak from public.user_stats where user_id = p_uid;
  elsif v_last = v_today - 1 then
    select streak + 1 into v_streak from public.user_stats where user_id = p_uid;
  else
    v_streak := 1;
  end if;

  select coalesce(earned_badges, '[]'::jsonb) into v_badges
    from public.user_stats where user_id = p_uid;
  v_badges := coalesce(v_badges, '[]'::jsonb);
  if v_completed >= 1  and not (v_badges ? 'first-lesson')   then v_badges := v_badges || '["first-lesson"]'::jsonb; end if;
  if v_completed >= 5  and not (v_badges ? 'five-lessons')   then v_badges := v_badges || '["five-lessons"]'::jsonb; end if;
  if v_completed >= 10 and not (v_badges ? 'ten-lessons')    then v_badges := v_badges || '["ten-lessons"]'::jsonb; end if;
  if v_quizzes  >= 1   and not (v_badges ? 'first-quiz')     then v_badges := v_badges || '["first-quiz"]'::jsonb; end if;
  if v_scenarios >= 1  and not (v_badges ? 'first-scenario') then v_badges := v_badges || '["first-scenario"]'::jsonb; end if;

  insert into public.user_stats (user_id, total_xp, level, streak, last_study_date, earned_badges, updated_at)
  values (p_uid, v_total_xp, public.level_for_xp(v_total_xp), v_streak, v_today, v_badges, now())
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
revoke all on function public._recompute_user_stats(uuid) from anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- get_scenario — full scenario WITHOUT the answer key (definer).
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.get_scenario(p_scenario_id text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'id', s.id,
    'slug', s.slug,
    'title', s.title,
    'pass_pct', s.pass_pct,
    'bonus_xp', s.bonus_xp,
    'intro', jsonb_build_object('actor', s.intro_actor, 'channel', s.intro_channel, 'message', s.intro_message),
    'stages', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', st.id, 'sort', st.sort, 'kind', st.kind, 'prompt', st.prompt,
        'options', coalesce((
          select jsonb_agg(jsonb_build_object('id', o.id, 'sort', o.sort, 'text', o.text) order by o.sort, o.id)
          from public.scenario_options o where o.stage_id = st.id), '[]'::jsonb)
      ) order by st.sort, st.id)
      from public.scenario_stages st where st.scenario_id = s.id), '[]'::jsonb)
  )
  from public.scenarios s
  where s.id = p_scenario_id;
$$;
revoke all on function public.get_scenario(text) from anon;
grant execute on function public.get_scenario(text) to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- submit_scenario — grades chosen options server-side (partial credit by points),
-- records the attempt, folds the one-time bonus into the authoritative total.
-- p_choices: [{ "stage_id": <id>, "option_id": <id> }, ...]
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.submit_scenario(p_scenario_id text, p_choices jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid     uuid := auth.uid();
  v_pass    integer;
  v_earned  integer := 0;
  v_max     integer := 0;
  v_best    integer;
  v_pct     integer;
  v_passed  boolean;
  v_choice  bigint;
  v_results jsonb := '[]'::jsonb;
  v_stats   public.user_stats;
  st        record;
  o         record;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  select pass_pct into v_pass from public.scenarios where id = p_scenario_id;
  if not found then raise exception 'unknown scenario: %', p_scenario_id; end if;

  for st in
    select id from public.scenario_stages where scenario_id = p_scenario_id order by sort, id
  loop
    select max(points) into v_best from public.scenario_options where stage_id = st.id;
    v_max := v_max + coalesce(v_best, 0);

    select (c->>'option_id')::bigint into v_choice
      from jsonb_array_elements(p_choices) c
      where (c->>'stage_id')::bigint = st.id
      limit 1;

    if v_choice is not null then
      select id, points, is_correct, feedback into o
        from public.scenario_options where id = v_choice and stage_id = st.id;
      if found then
        v_earned := v_earned + coalesce(o.points, 0);
        v_results := v_results || jsonb_build_object(
          'stage_id', st.id, 'option_id', o.id, 'is_correct', o.is_correct,
          'points', o.points, 'feedback', o.feedback);
      end if;
    end if;
  end loop;

  v_pct    := case when v_max > 0 then floor((v_earned::numeric / v_max) * 100) else 0 end;
  v_passed := v_pct >= coalesce(v_pass, 60);

  insert into public.scenario_attempts (user_id, scenario_id, score_pct, passed)
  values (v_uid, p_scenario_id, v_pct, v_passed);

  v_stats := public._recompute_user_stats(v_uid);

  return jsonb_build_object(
    'score_pct', v_pct, 'earned', v_earned, 'max', v_max,
    'passed', v_passed, 'pass_pct', coalesce(v_pass, 60),
    'results', v_results, 'total_xp', v_stats.total_xp, 'level', v_stats.level);
end;
$$;
revoke all on function public.submit_scenario(text, jsonb) from anon;
grant execute on function public.submit_scenario(text, jsonb) to authenticated;
