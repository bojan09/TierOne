-- 0016_interview_prep.sql — Phase 9. Interview prep question bank (study tool).
-- Reference/study content (model answers are meant to be seen), so it's readable;
-- no grading/XP here — it's a flashcard-style prep tool.

create table if not exists public.interview_questions (
  id           bigint generated always as identity primary key,
  category     text not null,            -- behavioral | technical
  track        public.track,             -- helpdesk | sysadmin | null = general
  difficulty   text not null default 'core',
  prompt       text not null,
  sample_answer text not null,
  key_points   jsonb not null default '[]'::jsonb,
  sort         integer not null default 0
);
create index if not exists interview_questions_cat_idx on public.interview_questions (category, sort);

alter table public.interview_questions enable row level security;
revoke all on public.interview_questions from anon, authenticated;
grant select on public.interview_questions to authenticated;
create policy "interview_questions_read" on public.interview_questions
  for select to authenticated using (true);
