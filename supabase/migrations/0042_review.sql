-- 0042_review.sql — spaced-repetition review (simplified SM-2). Idempotent.
-- Answer keys never leave the DB; grading + scheduling happen in SECURITY DEFINER RPCs.
-- Reviews do NOT award XP or record quiz_attempts (mastery stats stay about first pass).

create table if not exists public.review_schedule (
  user_id          uuid not null references auth.users (id) on delete cascade,
  lesson_id        text not null references public.curriculum_lessons (id) on delete cascade,
  due_at           timestamptz not null default now(),
  interval_days    integer     not null default 0,
  ease             real        not null default 2.5,
  reps             integer     not null default 0,
  lapses           integer     not null default 0,
  last_reviewed_at timestamptz,
  primary key (user_id, lesson_id)
);
create index if not exists review_schedule_due_idx on public.review_schedule (user_id, due_at);

alter table public.review_schedule enable row level security;
drop policy if exists "review_schedule_select_own" on public.review_schedule;
create policy "review_schedule_select_own"
  on public.review_schedule for select
  using (user_id = auth.uid());
-- No client write policy: writes go only through submit_review (definer).

-- Lessons the user has passed that are due for review (unscheduled = due now).
create or replace function public.get_due_reviews()
returns table (lesson_id text, due_at timestamptz, reps integer)
language sql
security definer
set search_path = public
as $$
  select p.lesson_id,
         coalesce(rs.due_at, now()) as due_at,
         coalesce(rs.reps, 0)       as reps
  from (
    select distinct lesson_id
    from public.quiz_attempts
    where user_id = auth.uid() and passed
  ) p
  left join public.review_schedule rs
    on rs.user_id = auth.uid() and rs.lesson_id = p.lesson_id
  where rs.lesson_id is null or rs.due_at <= now()
  order by due_at;
$$;

grant execute on function public.get_due_reviews() to authenticated;

-- Grade a review answer set and reschedule with simplified SM-2.
create or replace function public.submit_review(p_lesson_id text, p_answers integer[])
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
  r         record;
  i         integer := 0;
  v_is_ok   boolean;
  -- schedule state
  v_ease     real;
  v_reps     integer;
  v_lapses   integer;
  v_interval integer;
  v_q        integer;  -- SM-2 quality 0..5
  v_due      timestamptz;
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
  v_q      := least(5, floor(v_pct::numeric / 20))::integer;  -- 0..5

  -- Load existing schedule (defaults for a first review)
  select ease, reps, lapses, interval_days
    into v_ease, v_reps, v_lapses, v_interval
  from public.review_schedule
  where user_id = v_uid and lesson_id = p_lesson_id;
  if not found then
    v_ease := 2.5; v_reps := 0; v_lapses := 0; v_interval := 0;
  end if;

  -- SM-2 ease update
  v_ease := greatest(1.3, v_ease + (0.1 - (5 - v_q) * (0.08 + (5 - v_q) * 0.02)));

  if v_q < 3 then
    v_reps := 0;
    v_lapses := v_lapses + 1;
    v_interval := 1;
  else
    v_reps := v_reps + 1;
    if v_reps = 1 then
      v_interval := 1;
    elsif v_reps = 2 then
      v_interval := 3;
    else
      v_interval := ceil(v_interval * v_ease);
    end if;
  end if;

  v_due := now() + (v_interval || ' days')::interval;

  insert into public.review_schedule
    (user_id, lesson_id, due_at, interval_days, ease, reps, lapses, last_reviewed_at)
  values (v_uid, p_lesson_id, v_due, v_interval, v_ease, v_reps, v_lapses, now())
  on conflict (user_id, lesson_id) do update
    set due_at = excluded.due_at,
        interval_days = excluded.interval_days,
        ease = excluded.ease,
        reps = excluded.reps,
        lapses = excluded.lapses,
        last_reviewed_at = now();

  return jsonb_build_object(
    'score_pct', v_pct,
    'correct', v_correct,
    'total', v_total,
    'passed', v_passed,
    'pass_pct', v_pass,
    'results', v_results,
    'interval_days', v_interval,
    'next_due', v_due
  );
end;
$$;

revoke all on function public.submit_review(text, integer[]) from anon;
grant execute on function public.submit_review(text, integer[]) to authenticated;
