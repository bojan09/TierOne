-- 0006_seed_quizzes_helpdesk.sql — Phase 6 vertical slice.
-- Quizzes for the 3 IT Support Foundations lessons. Idempotent.

insert into public.lesson_quizzes (lesson_id, pass_pct, bonus_xp) values
  ('hdf-01', 70, 25), ('hdf-02', 70, 25), ('hdf-03', 70, 25)
on conflict (lesson_id) do update set pass_pct = excluded.pass_pct, bonus_xp = excluded.bonus_xp;

-- Re-seedable: clear then insert this lesson set.
delete from public.quiz_questions where lesson_id in ('hdf-01','hdf-02','hdf-03');

insert into public.quiz_questions (lesson_id, sort, prompt, options, correct_index, explanation) values
('hdf-01', 1, 'What does a strong technician do first on a new ticket?',
  '["Escalate it immediately","Understand the problem and reproduce it","Reboot and hope","Close it as user error"]', 1,
  'Understanding and reproducing the problem comes before any fix.'),
('hdf-01', 2, 'Why does documentation matter in support?',
  '["It is optional busywork","It lets others continue the work and reveals patterns","It replaces talking to users","It only matters for audits"]', 1,
  'Good notes make work transferable and surface recurring issues.'),
('hdf-01', 3, 'Tier-1 support mainly focuses on…',
  '["Designing data centres","First-line triage and common fixes","Writing kernel drivers","Setting budgets"]', 1,
  'Tier-1 is the first line: triage and the most common resolutions.'),

('hdf-02', 1, 'The core idea of a troubleshooting method is to…',
  '["Guess quickly","Change many things at once","Work systematically, one variable at a time","Always reinstall the OS"]', 2,
  'Isolating one variable at a time is what makes results meaningful.'),
('hdf-02', 2, 'After forming a hypothesis you should…',
  '["Assume it is correct","Test it before making broad changes","Escalate right away","Only document if it fails"]', 1,
  'Test the hypothesis cheaply before committing to bigger changes.'),
('hdf-02', 3, 'Why change only one thing at a time?',
  '["It is faster","So you know what actually fixed it","Policy demands it","To avoid documentation"]', 1,
  'Single changes tell you the true cause of the fix.'),

('hdf-03', 1, 'A good ticket primarily captures…',
  '["Only the final resolution","Symptoms, scope, steps tried, and their results","Just the user name","The technician mood"]', 1,
  'A useful ticket records the whole diagnostic trail, not just the end.'),
('hdf-03', 2, 'Why record the exact error text?',
  '["For style","It is searchable and unambiguous","To make tickets longer","It does not matter"]', 1,
  'Exact errors are searchable and prevent misremembering.'),
('hdf-03', 3, 'A good escalation includes…',
  '["Nothing, just reassign","What you tried and the outcomes","Only the symptom","A guess at the cause"]', 1,
  'Hand off the trail so the next person starts ahead, not from zero.');
