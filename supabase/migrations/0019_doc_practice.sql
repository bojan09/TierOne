-- 0019_doc_practice.sql — Phase 12. AI-graded documentation practice.
-- Exercises are readable study content. Submissions are written by the
-- grade-doc Edge Function (service role) and hold the AI score/feedback;
-- clients can read their own for history. The Edge Function also uses this
-- table to enforce a per-day rate cap. Works without AI (regular mode) too.

create table if not exists public.doc_exercises (
  id           text primary key,
  track        public.track not null default 'helpdesk',
  title        text not null,
  prompt       text not null,          -- what the learner must write
  context      text not null default '',-- scenario background shown to the learner
  criteria     jsonb not null default '[]'::jsonb, -- array of strings (rubric)
  model_answer text not null default '',
  sort         integer not null default 0
);

create table if not exists public.doc_submissions (
  id               bigint generated always as identity primary key,
  user_id          uuid not null references auth.users (id) on delete cascade,
  exercise_id      text not null references public.doc_exercises (id) on delete cascade,
  content          text not null,
  score            integer,            -- null = ungraded (regular mode)
  feedback         text,
  criteria_results jsonb,              -- [{label, met, note}]
  graded_by        text,               -- e.g. 'ai' | null
  created_at       timestamptz not null default now()
);
create index if not exists doc_submissions_user_day_idx
  on public.doc_submissions (user_id, created_at);

alter table public.doc_exercises   enable row level security;
alter table public.doc_submissions enable row level security;

revoke all on public.doc_exercises from anon, authenticated;
grant select on public.doc_exercises to authenticated;
drop policy if exists "doc_exercises_read" on public.doc_exercises;
create policy "doc_exercises_read" on public.doc_exercises
  for select to authenticated using (true);

-- Clients may read their own submissions (history); writes go through the
-- Edge Function via the service role, so no client insert/update grants.
revoke all on public.doc_submissions from anon, authenticated;
grant select on public.doc_submissions to authenticated;
drop policy if exists "doc_submissions_select_own" on public.doc_submissions;
create policy "doc_submissions_select_own" on public.doc_submissions
  for select to authenticated using (user_id = auth.uid());
