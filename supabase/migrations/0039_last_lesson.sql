-- 0039_last_lesson.sql — server-authoritative "continue where you left off".
-- Adds last_lesson_id to user_stats and a self-scoped RPC to set it. Idempotent.

alter table public.user_stats
  add column if not exists last_lesson_id text;

-- Records the lesson the signed-in user most recently opened. Writes only for
-- auth.uid(), so it can't be spoofed for another user. Creates a default stats
-- row if none exists yet (a brand-new user visiting a lesson before earning XP).
create or replace function public.set_last_lesson(p_lesson_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    return;
  end if;

  insert into public.user_stats (user_id, total_xp, level, streak, earned_badges, last_lesson_id, updated_at)
  values (v_uid, 0, 1, 0, '[]'::jsonb, p_lesson_id, now())
  on conflict (user_id) do update
    set last_lesson_id = excluded.last_lesson_id,
        updated_at = now();
end;
$$;

grant execute on function public.set_last_lesson(text) to authenticated;
