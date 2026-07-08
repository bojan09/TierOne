-- 0052_exam.sql — practice exam mode. Idempotent. Answer keys stay server-side.

-- Random N questions for a track (no correct answers leave the DB).
create or replace function public.get_exam(p_track text, p_count integer default 20)
returns table (id bigint, lesson_id text, prompt text, options jsonb)
language sql
security definer
set search_path = public
as $$
  select q.id, q.lesson_id, q.prompt, q.options
  from public.quiz_questions q
  join public.curriculum_lessons l on l.id = q.lesson_id
  where l.track = p_track::public.track
  order by random()
  limit greatest(1, least(p_count, 100));
$$;

grant execute on function public.get_exam(text, integer) to authenticated;

-- Grade an exam server-side. Returns score + per-question correctness (with the
-- correct index, so the client can show a review). No XP, no attempt record.
create or replace function public.submit_exam(p_ids bigint[], p_answers integer[])
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total   integer := coalesce(array_length(p_ids, 1), 0);
  v_correct integer := 0;
  v_results jsonb := '[]'::jsonb;
  i         integer;
  v_ci      integer;
  v_ok      boolean;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if v_total = 0 then raise exception 'no questions'; end if;

  for i in 1 .. v_total loop
    select correct_index into v_ci from public.quiz_questions where id = p_ids[i];
    v_ok := (v_ci is not null and p_answers[i] is not null and p_answers[i] = v_ci);
    if v_ok then v_correct := v_correct + 1; end if;
    v_results := v_results || jsonb_build_object('id', p_ids[i], 'correct', coalesce(v_ok, false), 'correct_index', v_ci);
  end loop;

  return jsonb_build_object(
    'total', v_total,
    'correct', v_correct,
    'score_pct', floor((v_correct::numeric / v_total) * 100),
    'passed', floor((v_correct::numeric / v_total) * 100) >= 70,
    'results', v_results
  );
end;
$$;

grant execute on function public.submit_exam(bigint[], integer[]) to authenticated;
