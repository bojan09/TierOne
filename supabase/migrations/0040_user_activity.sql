-- 0040_user_activity.sql — daily activity for an accurate streak heatmap. Idempotent.

create table if not exists public.user_activity (
  user_id       uuid not null references auth.users (id) on delete cascade,
  activity_date date not null default current_date,
  primary key (user_id, activity_date)
);

alter table public.user_activity enable row level security;

drop policy if exists "user_activity_select_own" on public.user_activity;
create policy "user_activity_select_own"
  on public.user_activity for select
  using (user_id = auth.uid());
-- No client insert policy: writes go only through the SECURITY DEFINER RPC below.

-- Records the most recently opened lesson AND marks today's activity, both scoped
-- to auth.uid(). Creates a default stats row if none exists.
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

  insert into public.user_activity (user_id, activity_date)
  values (v_uid, current_date)
  on conflict do nothing;
end;
$$;

grant execute on function public.set_last_lesson(text) to authenticated;
