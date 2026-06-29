-- 0003_seed_helpdesk.sql
-- Phase 5.4 — seed the Help Desk track into curriculum_lessons (XP authority).
-- Idempotent: re-running updates values. Generated to match
-- src/content/curriculum/helpdesk.ts — keep the two in sync.

insert into public.curriculum_lessons (id, slug, title, track, xp, sort_order) values
  ('hdf-01',  'what-is-it-support',          'What IT Support Actually Is',          'helpdesk', 40, 101),
  ('hdf-02',  'troubleshooting-methodology', 'A Repeatable Troubleshooting Method',  'helpdesk', 50, 102),
  ('hdf-03',  'tickets-and-documentation',   'Writing Tickets People Can Use',       'helpdesk', 50, 103),
  ('hwos-01', 'hardware-essentials',         'Inside the Machine: Hardware Essentials','helpdesk',40, 201),
  ('hwos-02', 'operating-systems-overview',  'Operating Systems at a Glance',        'helpdesk', 45, 202),
  ('hwos-03', 'files-users-permissions',     'Files, Users & Permissions',           'helpdesk', 50, 203),
  ('net-01',  'how-networks-work',           'How Networks Actually Work',           'helpdesk', 45, 301),
  ('net-02',  'connectivity-troubleshooting','Diagnosing Connectivity Problems',     'helpdesk', 55, 302),
  ('net-03',  'wifi-vpn-remote',             'Wi-Fi, VPN & Remote Work',             'helpdesk', 50, 303),
  ('work-01', 'active-directory-basics',     'Active Directory for Tier-1',          'helpdesk', 55, 401),
  ('work-02', 'microsoft-365-essentials',    'Microsoft 365 Essentials',             'helpdesk', 50, 402),
  ('work-03', 'email-troubleshooting',       'Troubleshooting Email & Outlook',      'helpdesk', 55, 403),
  ('work-04', 'customer-communication',      'Customer Communication & Escalation',  'helpdesk', 45, 404)
on conflict (id) do update
  set slug = excluded.slug,
      title = excluded.title,
      track = excluded.track,
      xp = excluded.xp,
      sort_order = excluded.sort_order;
