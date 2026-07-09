-- 0054_seed_helpdesk_t01_lessons.sql — P33 Help Desk Tier 0/1 practical lessons. Idempotent.
insert into public.curriculum_lessons (id, slug, title, track, xp, sort_order) values
  ('hd-ess-01', 'intro-helpdesk', 'Introduction to Help Desk', 'helpdesk', 45, 7001),
  ('hd-ess-02', 'customer-communication', 'Customer Communication', 'helpdesk', 50, 7002),
  ('hd-ess-03', 'professionalism', 'Professionalism & Ethics', 'helpdesk', 45, 7003),
  ('hd-ess-04', 'documentation-kb', 'Documentation & Knowledge Bases', 'helpdesk', 50, 7004),
  ('hd-ess-05', 'ticket-lifecycle', 'Ticket Lifecycle & Prioritization', 'helpdesk', 50, 7005),
  ('hd-eve-01', 'password-mfa', 'Password Resets & MFA', 'helpdesk', 50, 7006),
  ('hd-eve-02', 'printer-support', 'Printer Support', 'helpdesk', 45, 7007),
  ('hd-eve-03', 'vpn-remote', 'VPN & Remote Support', 'helpdesk', 50, 7008),
  ('hd-eve-04', 'email-troubleshooting', 'Email Troubleshooting', 'helpdesk', 50, 7009),
  ('hd-eve-05', 'browser-troubleshooting', 'Browser Troubleshooting', 'helpdesk', 45, 7010),
  ('hd-t1-01', 'windows-troubleshooting', 'Windows Troubleshooting', 'helpdesk', 50, 7011),
  ('hd-t1-02', 'device-manager-drivers', 'Device Manager & Drivers', 'helpdesk', 50, 7012),
  ('hd-t1-03', 'windows-updates', 'Windows Updates', 'helpdesk', 45, 7013),
  ('hd-t1-04', 'remote-desktop', 'Remote Desktop & Access', 'helpdesk', 45, 7014),
  ('hd-t1-05', 'permissions-shares', 'Permissions & File Shares', 'helpdesk', 55, 7015)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, track=excluded.track, xp=excluded.xp, sort_order=excluded.sort_order;
