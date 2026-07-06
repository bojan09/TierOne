-- 0035_seed_helpdesk_tier2_lessons.sql — P20 Help Desk Tier 2 (curriculum_lessons XP authority). Idempotent.
insert into public.curriculum_lessons (id, slug, title, track, xp, sort_order) values
  ('t2-win-01', 'boot-process', 'Boot Process & Startup Failures', 'helpdesk', 80, 4001),
  ('t2-win-02', 'bsod', 'Blue Screens & Crash Analysis', 'helpdesk', 80, 4002),
  ('t2-win-03', 'safe-mode-winre', 'Safe Mode & Windows Recovery', 'helpdesk', 80, 4003),
  ('t2-win-04', 'restore-reset-registry', 'System Restore, Reset & the Registry', 'helpdesk', 80, 4004),
  ('t2-win-05', 'imaging', 'Imaging & Reimaging', 'helpdesk', 80, 4005),
  ('t2-ad-01', 'accounts-ous', 'Managing Accounts & OUs', 'helpdesk', 80, 4006),
  ('t2-ad-02', 'groups-access', 'Groups & Access', 'helpdesk', 80, 4007),
  ('t2-ad-03', 'lockouts', 'Passwords, Lockouts & Unlocks', 'helpdesk', 80, 4008),
  ('t2-ad-04', 'gpo-basics', 'Group Policy Basics for Support', 'helpdesk', 80, 4009),
  ('t2-m365-01', 'admin-center', 'The Microsoft 365 Admin Center', 'helpdesk', 80, 4010),
  ('t2-m365-02', 'licensing', 'Licensing & Plans', 'helpdesk', 80, 4011),
  ('t2-m365-03', 'exchange-online', 'Exchange Online Basics', 'helpdesk', 80, 4012),
  ('t2-m365-04', 'identity-mfa', 'Identity, MFA & Conditional Access', 'helpdesk', 85, 4013),
  ('t2-m365-05', 'teams-sharepoint-intune', 'Teams, SharePoint & Intune Intro', 'helpdesk', 80, 4014),
  ('t2-net-01', 'client-connectivity', 'Client Connectivity Issues', 'helpdesk', 80, 4015),
  ('t2-net-02', 'vpn-remote', 'VPN & Remote Access Issues', 'helpdesk', 80, 4016),
  ('t2-net-03', 'printers', 'Printers & Peripherals on the Network', 'helpdesk', 80, 4017),
  ('t2-itil-01', 'incident-problem-change', 'Incident, Problem & Change', 'helpdesk', 80, 4018),
  ('t2-itil-02', 'sla-escalation', 'SLAs, Priority & Escalation', 'helpdesk', 85, 4019),
  ('t2-itil-03', 'documentation', 'Documentation & Knowledge', 'helpdesk', 80, 4020)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, track=excluded.track, xp=excluded.xp, sort_order=excluded.sort_order;
