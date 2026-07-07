-- 0043_review_rating.sql — split review grading from scheduling; scheduling is
-- driven by an Anki-style recall self-rating (Again/Hard/Good/Easy). Idempotent.

-- grade_review — read-only. Grades answers server-side (answer key never leaves
-- the DB) and returns correctness. Does NOT write or schedule.
create or replace function public.grade_review(p_lesson_id text, p_answers integer[])
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
  v_results jsonb := '[]'::jsonb;
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

  v_pct := floor((v_correct::numeric / v_total) * 100);
  return jsonb_build_object(
    'score_pct', v_pct,
    'correct', v_correct,
    'total', v_total,
    'passed', v_pct >= v_pass,
    'pass_pct', v_pass,
    'results', v_results
  );
end;
$$;

grant execute on function public.grade_review(text, integer[]) to authenticated;

-- schedule_review — applies simplified SM-2 using a recall self-rating.
-- p_quality: 0=Again, 1=Hard, 2=Good, 3=Easy.
create or replace function public.schedule_review(p_lesson_id text, p_quality integer)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid      uuid := auth.uid();
  v_ease     real;
  v_reps     integer;
  v_lapses   integer;
  v_interval integer;
  v_q        integer;
  v_due      timestamptz;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  -- map rating -> SM-2 quality (0..5)
  v_q := case p_quality when 0 then 1 when 1 then 3 when 2 then 4 when 3 then 5 else 4 end;

  select ease, reps, lapses, interval_days
    into v_ease, v_reps, v_lapses, v_interval
  from public.review_schedule
  where user_id = v_uid and lesson_id = p_lesson_id;
  if not found then
    v_ease := 2.5; v_reps := 0; v_lapses := 0; v_interval := 0;
  end if;

  v_ease := greatest(1.3, v_ease + (0.1 - (5 - v_q) * (0.08 + (5 - v_q) * 0.02)));

  if v_q < 3 then
    v_reps := 0; v_lapses := v_lapses + 1; v_interval := 1;
  else
    v_reps := v_reps + 1;
    if v_reps = 1 then v_interval := 1;
    elsif v_reps = 2 then v_interval := 3;
    else v_interval := ceil(v_interval * v_ease);
    end if;
  end if;

  v_due := now() + (v_interval || ' days')::interval;

  insert into public.review_schedule
    (user_id, lesson_id, due_at, interval_days, ease, reps, lapses, last_reviewed_at)
  values (v_uid, p_lesson_id, v_due, v_interval, v_ease, v_reps, v_lapses, now())
  on conflict (user_id, lesson_id) do update
    set due_at = excluded.due_at, interval_days = excluded.interval_days,
        ease = excluded.ease, reps = excluded.reps, lapses = excluded.lapses,
        last_reviewed_at = now();

  return jsonb_build_object('interval_days', v_interval, 'next_due', v_due);
end;
$$;

grant execute on function public.schedule_review(text, integer) to authenticated;

-- Retire the combined submit_review (replaced by grade_review + schedule_review).
drop function if exists public.submit_review(text, integer[]);
