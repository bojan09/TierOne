-- 0018_certificates.sql — Phase 11. Track-completion certificates.
-- Eligibility is verified server-side (all of a track's lessons completed) so a
-- certificate can never be claimed without finishing the track. The holder's
-- display name is snapshotted at issue time; a code allows public verification.

create table if not exists public.certificates (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  track       public.track not null,
  holder_name text not null,
  code        text not null unique,
  issued_at   timestamptz not null default now(),
  unique (user_id, track)
);

alter table public.certificates enable row level security;
revoke all on public.certificates from anon, authenticated;
grant select on public.certificates to authenticated;
drop policy if exists "certificates_select_own" on public.certificates;
create policy "certificates_select_own" on public.certificates
  for select to authenticated using (user_id = auth.uid());

-- ─── claim_certificate — verifies completion, issues once, returns the result. ───
create or replace function public.claim_certificate(p_track public.track)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid   uuid := auth.uid();
  v_total integer;
  v_done  integer;
  v_name  text;
  v_cert  public.certificates;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  select count(*) into v_total from public.curriculum_lessons where track = p_track;
  if v_total = 0 then raise exception 'unknown track: %', p_track; end if;

  select count(*) into v_done
    from public.lesson_progress lp
    join public.curriculum_lessons cl on cl.id = lp.lesson_id
    where lp.user_id = v_uid and lp.status = 'completed' and cl.track = p_track;

  if v_done < v_total then
    return jsonb_build_object('eligible', false, 'completed', v_done, 'total', v_total);
  end if;

  -- already issued?
  select * into v_cert from public.certificates where user_id = v_uid and track = p_track;
  if found then
    return jsonb_build_object('eligible', true, 'code', v_cert.code, 'issued_at', v_cert.issued_at,
                              'track', v_cert.track, 'holder_name', v_cert.holder_name, 'completed', v_done, 'total', v_total);
  end if;

  select coalesce(display_name, 'Learner') into v_name from public.profiles where id = v_uid;

  insert into public.certificates (user_id, track, holder_name, code)
  values (v_uid, p_track, v_name, upper(substr(md5(random()::text || clock_timestamp()::text), 1, 12)))
  returning * into v_cert;

  return jsonb_build_object('eligible', true, 'code', v_cert.code, 'issued_at', v_cert.issued_at,
                            'track', v_cert.track, 'holder_name', v_cert.holder_name, 'completed', v_done, 'total', v_total);
end;
$$;
revoke all on function public.claim_certificate(public.track) from anon;
grant execute on function public.claim_certificate(public.track) to authenticated;

-- ─── verify_certificate — public-facing lookup by code (name + track + date). ───
create or replace function public.verify_certificate(p_code text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select case when c.id is null then jsonb_build_object('valid', false)
              else jsonb_build_object('valid', true, 'holder_name', c.holder_name,
                                      'track', c.track, 'issued_at', c.issued_at) end
  from (select * from public.certificates where code = p_code) c
  right join (select 1) one on true;
$$;
grant execute on function public.verify_certificate(text) to anon, authenticated;
