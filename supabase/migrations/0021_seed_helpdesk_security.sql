-- 0021_seed_helpdesk_security.sql — P15 batch 1.
-- Seed the new "Security Essentials for Support" Help Desk course into
-- curriculum_lessons (XP authority). Matches src/content/curriculum/helpdesk.ts.
-- Idempotent.
insert into public.curriculum_lessons (id, slug, title, track, xp, sort_order) values
  ('hdsec-01', 'malware-and-phishing',         'Malware, Phishing & Social Engineering', 'helpdesk', 50, 501),
  ('hdsec-02', 'authentication-and-passwords', 'Authentication, MFA & Passwords',        'helpdesk', 50, 502),
  ('hdsec-03', 'physical-and-data-security',   'Physical & Data Security',               'helpdesk', 50, 503),
  ('hdsec-04', 'secure-disposal-and-byod',     'Secure Disposal, Mobile & BYOD',         'helpdesk', 50, 504)
on conflict (id) do update
  set slug = excluded.slug, title = excluded.title, track = excluded.track,
      xp = excluded.xp, sort_order = excluded.sort_order;
