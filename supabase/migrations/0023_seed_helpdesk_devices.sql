-- 0023_seed_helpdesk_devices.sql — P15 batch 2.
-- Seed the "Devices & Peripherals" Help Desk course into curriculum_lessons
-- (XP authority). Matches src/content/curriculum/helpdesk.ts. Idempotent.
insert into public.curriculum_lessons (id, slug, title, track, xp, sort_order) values
  ('hddev-01', 'laptops-and-mobile-devices', 'Laptops & Mobile Devices',            'helpdesk', 50, 601),
  ('hddev-02', 'printers-and-scanners',      'Printers & Scanners',                 'helpdesk', 50, 602),
  ('hddev-03', 'peripherals-and-displays',   'Peripherals & Display Connectivity',  'helpdesk', 50, 603),
  ('hddev-04', 'remote-support-tools',       'Remote Support Tools',                'helpdesk', 50, 604)
on conflict (id) do update
  set slug = excluded.slug, title = excluded.title, track = excluded.track,
      xp = excluded.xp, sort_order = excluded.sort_order;
