-- 0005_quizzes.sql — Phase 6. Server-authoritative quizzes & assessments.
-- Correct answers live only in quiz_questions and are NEVER granted to clients;
-- questions are served (sans answer) via get_lesson_quiz(), graded via submit_quiz().
-- Quiz XP is folded into the SAME authoritative total as lesson XP so the two
-- award paths can never drift.

-- ─────────────────────────────────────────────────────────────────────────────
-- Per-lesson quiz config (pass threshold + one-time XP bonus).
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.lesson_quizzes (
  lesson_id text primary key references public.curriculum_lessons (id) on delete cascade,
  pass_pct  integer not null default 70 check (pass_pct between 1 and 100),
  bonus_xp  integer not null default 25 check (bonus_xp >= 0)
);

create table if not exists public.quiz_questions (
  id          bigint generated always as identity primary key,
  lesson_id   text not null references public.curriculum_lessons (id) on delete cascade,
  sort        integer not null default 0,
  prompt      text not null,
  options     jsonb not null,                 -- ["A","B","C","D"]
  correct_index integer not null check (correct_index >= 0),
  explanation text
);
create index if not exists quiz_questions_lesson_idx on public.quiz_questions (lesson_id, sort);

create table if not exists public.quiz_attempts (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  lesson_id  text not null references public.curriculum_lessons (id) on delete cascade,
  score_pct  integer not null,
  passed     boolean not null,
  created_at timestamptz not null default now()
);
create index if not exists quiz_attempts_user_lesson_idx on public.quiz_attempts (user_id, lesson_id);

-- ─── RLS: default-deny everywhere. ───
alter table public.lesson_quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts  enable row level security;

-- Config (pass_pct/bonus_xp) is non-sensitive → readable.
revoke all on public.lesson_quizzes from anon, authenticated;
grant select on public.lesson_quizzes to authenticated;
create policy "lesson_quizzes_read" on public.lesson_quizzes
  for select to authenticated using (true);

-- quiz_questions: NO direct grant. Only definer functions read it (answer key).
revoke all on public.quiz_questions from anon, authenticated;

-- quiz_attempts: read own; writes only via the RPC (definer).
revoke all on public.quiz_attempts from anon, authenticated;
grant select on public.quiz_attempts to authenticated;
create policy "quiz_attempts_select_own" on public.quiz_attempts
  for select to authenticated using (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────────
-- get_lesson_quiz — questions WITHOUT the answer key (definer).
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.get_lesson_quiz(p_lesson_id text)
returns table (id bigint, sort integer, prompt text, options jsonb)
language sql
security definer
set search_path = public
as $$
  select id, sort, prompt, options
  from public.quiz_questions
  where lesson_id = p_lesson_id
  order by sort, id;
$$;
revoke all on function public.get_lesson_quiz(text) from anon;
grant execute on function public.get_lesson_quiz(text) to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- _recompute_user_stats — single authoritative rollup used by BOTH award paths.
-- total_xp = completed-lesson XP + one-time bonus for each lesson with a pass.
-- Also advances the daily streak and additive badges. Returns user_stats.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public._recompute_user_stats(p_uid uuid)
returns public.user_stats
language plpgsql
security definer
set search_path = public
as $$
declare
  v_today     date := (now() at time zone 'utc')::date;
  v_lesson_xp integer;
  v_quiz_xp   integer;
  v_total_xp  integer;
  v_completed integer;
  v_quizzes   integer;
  v_badges    jsonb;
  v_last      date;
  v_streak    integer;
  v_stats     public.user_stats;
begin
  select coalesce(sum(xp_awarded), 0), count(*)
    into v_lesson_xp, v_completed
    from public.lesson_progress
    where user_id = p_uid and status = 'completed';

  select coalesce(sum(lq.bonus_xp), 0), count(*)
    into v_quiz_xp, v_quizzes
    from public.lesson_quizzes lq
    where exists (
      select 1 from public.quiz_attempts qa
      where qa.user_id = p_uid and qa.lesson_id = lq.lesson_id and qa.passed
    );

  v_total_xp := v_lesson_xp + v_quiz_xp;

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
  if v_completed >= 1  and not (v_badges ? 'first-lesson')  then v_badges := v_badges || '["first-lesson"]'::jsonb; end if;
  if v_completed >= 5  and not (v_badges ? 'five-lessons')  then v_badges := v_badges || '["five-lessons"]'::jsonb; end if;
  if v_completed >= 10 and not (v_badges ? 'ten-lessons')   then v_badges := v_badges || '["ten-lessons"]'::jsonb; end if;
  if v_quizzes  >= 1   and not (v_badges ? 'first-quiz')    then v_badges := v_badges || '["first-quiz"]'::jsonb; end if;

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
-- complete_lesson — REDEFINED to delegate the rollup to _recompute_user_stats
-- (so lesson + quiz XP stay in one authoritative total). Same signature/behaviour.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.complete_lesson(p_lesson_id text)
returns public.user_stats
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_xp  integer;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  select xp into v_xp from public.curriculum_lessons where id = p_lesson_id;
  if not found then raise exception 'unknown lesson: %', p_lesson_id; end if;

  insert into public.lesson_progress (user_id, lesson_id, status, completed_at, xp_awarded)
  values (v_uid, p_lesson_id, 'completed', now(), v_xp)
  on conflict (user_id, lesson_id) do update
    set status = 'completed',
        completed_at = coalesce(public.lesson_progress.completed_at, now()),
        xp_awarded = excluded.xp_awarded;

  return public._recompute_user_stats(v_uid);
end;
$$;
revoke all on function public.complete_lesson(text) from anon;
grant execute on function public.complete_lesson(text) to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- submit_quiz — grades server-side, records the attempt, folds the one-time
-- bonus into the authoritative total. Returns score + per-question correctness.
-- The answer key is never returned, only which of the user's answers were right.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.submit_quiz(p_lesson_id text, p_answers integer[])
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid     uuid := auth.uid();
  v_total   integer;
  v_correct integer := 0;
  v_pass    integer;
  v_pct     integer;
  v_passed  boolean;
  v_results jsonb := '[]'::jsonb;
  v_stats   public.user_stats;
  r         record;
  i         integer := 0;
  v_is_ok   boolean;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  select count(*) into v_total from public.quiz_questions where lesson_id = p_lesson_id;
  if v_total = 0 then raise exception 'no quiz for lesson: %', p_lesson_id; end if;

  select coalesce(pass_pct, 70) into v_pass from public.lesson_quizzes where lesson_id = p_lesson_id;
  if v_pass is null then v_pass := 70; end if;

  for r in
    select id, correct_index from public.quiz_questions where lesson_id = p_lesson_id order by sort, id
  loop
    v_is_ok := (p_answers[i + 1] is not null and p_answers[i + 1] = r.correct_index);
    if v_is_ok then v_correct := v_correct + 1; end if;
    v_results := v_results || jsonb_build_object('question_id', r.id, 'correct', coalesce(v_is_ok, false));
    i := i + 1;
  end loop;

  v_pct    := floor((v_correct::numeric / v_total) * 100);
  v_passed := v_pct >= v_pass;

  insert into public.quiz_attempts (user_id, lesson_id, score_pct, passed)
  values (v_uid, p_lesson_id, v_pct, v_passed);

  v_stats := public._recompute_user_stats(v_uid);

  return jsonb_build_object(
    'score_pct', v_pct,
    'correct', v_correct,
    'total', v_total,
    'passed', v_passed,
    'pass_pct', v_pass,
    'results', v_results,
    'total_xp', v_stats.total_xp,
    'level', v_stats.level
  );
end;
$$;
revoke all on function public.submit_quiz(text, integer[]) from anon;
grant execute on function public.submit_quiz(text, integer[]) to authenticated;
