-- 0025_seed_helpdesk_gapfill.sql — P15 batch 3 (gap-fillers into existing courses).
-- curriculum_lessons XP authority. sort_order slots into each course's sequence.
-- Idempotent.
insert into public.curriculum_lessons (id, slug, title, track, xp, sort_order) values
  ('hdf-04',  'command-line-basics',           'Command-Line Basics for Support',            'helpdesk', 50, 104),
  ('hwos-04', 'windows-tools',                 'Windows Tools & the Control Panel',          'helpdesk', 50, 204),
  ('hwos-05', 'backup-and-recovery',           'Backup & Data Recovery',                     'helpdesk', 50, 205),
  ('work-05', 'collaboration-teams-sharepoint','Collaboration: Teams, SharePoint & OneDrive','helpdesk', 50, 405)
on conflict (id) do update
  set slug = excluded.slug, title = excluded.title, track = excluded.track,
      xp = excluded.xp, sort_order = excluded.sort_order;
