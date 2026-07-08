-- 0053_exam_history.sql — record exam attempts + history. Idempotent.

create table if not exists public.exam_attempts (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  track      text not null,
  total      integer not null,
  correct    integer not null,
  score_pct  integer not null,
  passed     boolean not null,
  created_at timestamptz not null default now()
);
create index if not exists exam_attempts_user_idx on public.exam_attempts (user_id, created_at desc);
alter table public.exam_attempts enable row level security;
drop policy if exists "exam_attempts_select_own" on public.exam_attempts;
create policy "exam_attempts_select_own" on public.exam_attempts for select using (user_id = auth.uid());

-- Replace submit_exam with a track-aware version that records the attempt.
drop function if exists public.submit_exam(bigint[], integer[]);
create or replace function public.submit_exam(p_ids bigint[], p_answers integer[], p_track text default null)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_total integer := coalesce(array_length(p_ids,1),0);
  v_correct integer := 0;
  v_results jsonb := '[]'::jsonb;
  i integer; v_ci integer; v_ok boolean; v_pct integer; v_pass boolean;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  if v_total = 0 then raise exception 'no questions'; end if;
  for i in 1 .. v_total loop
    select correct_index into v_ci from public.quiz_questions where id = p_ids[i];
    v_ok := (v_ci is not null and p_answers[i] is not null and p_answers[i] = v_ci);
    if v_ok then v_correct := v_correct + 1; end if;
    v_results := v_results || jsonb_build_object('id', p_ids[i], 'correct', coalesce(v_ok,false), 'correct_index', v_ci);
  end loop;
  v_pct := floor((v_correct::numeric / v_total) * 100);
  v_pass := v_pct >= 70;
  if p_track is not null then
    insert into public.exam_attempts (user_id, track, total, correct, score_pct, passed)
    values (v_uid, p_track, v_total, v_correct, v_pct, v_pass);
  end if;
  return jsonb_build_object('total',v_total,'correct',v_correct,'score_pct',v_pct,'passed',v_pass,'results',v_results);
end;
$$;
grant execute on function public.submit_exam(bigint[], integer[], text) to authenticated;

create or replace function public.get_exam_history(p_limit integer default 10)
returns table (track text, score_pct integer, passed boolean, total integer, created_at timestamptz)
language sql security definer set search_path = public
as $$
  select track, score_pct, passed, total, created_at
  from public.exam_attempts
  where user_id = auth.uid()
  order by created_at desc
  limit greatest(1, least(p_limit, 50));
$$;
grant execute on function public.get_exam_history(integer) to authenticated;
