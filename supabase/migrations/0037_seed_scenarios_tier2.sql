-- 0037_seed_scenarios_tier2.sql — P20 Help Desk Tier 2 tickets (Virtual Help Desk).
-- Idempotent: upsert scenario, delete stages (cascades options), reseed. Answer key stays server-side.

-- ── Scenario 1: Windows won't boot ──
insert into public.scenarios (id, slug, title, track, intro_actor, intro_channel, intro_message, pass_pct, bonus_xp, sort) values
 ('sim-t2-boot','windows-wont-boot','Ticket: Windows won''t boot after an update','helpdesk','Dana — Finance','Ticket #6120','My laptop restarted for updates last night and now it just loops — it never reaches the login screen. I have month-end reports due.',60,80,20)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, intro_actor=excluded.intro_actor, intro_channel=excluded.intro_channel, intro_message=excluded.intro_message, pass_pct=excluded.pass_pct, bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.scenario_stages where scenario_id='sim-t2-boot';
insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
 ('sim-t2-boot',1,'triage','Dana''s PC loops before login. First move?'),
 ('sim-t2-boot',2,'diagnose','It reboots right after the logo, having failed several times. Best next step?'),
 ('sim-t2-boot',3,'resolve','Safe Mode works fine; normal boot fails after the recent update. Fix?'),
 ('sim-t2-boot',4,'communicate','She''s back up. Wrap-up?');
with s as (select id, sort from public.scenario_stages where scenario_id='sim-t2-boot')
insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback)
select s.id, v.osort, v.txt, v.ok, v.pts, v.fb from (values
 (1,1,'Reimage the laptop immediately',false,0,'Destructive and premature — recovery may save her data and time.'),
 (1,2,'Confirm the symptom and get into the Recovery Environment (WinRE)',true,10,'Reproduce, then use WinRE — the right entry point for boot issues.'),
 (1,3,'Tell her to keep waiting',false,0,'A loop won''t resolve itself.'),
 (1,4,'Replace the hard drive',false,0,'No evidence of a disk fault yet.'),
 (2,1,'Boot into Safe Mode to see if it starts with minimal drivers',true,10,'Safe Mode isolates whether a driver/update is the cause.'),
 (2,2,'Reinstall Windows from scratch',false,0,'Skips diagnosis and risks her data.'),
 (2,3,'Swap the RAM',false,0,'Nothing points to memory yet.'),
 (2,4,'Change her password',false,0,'Unrelated to booting.'),
 (3,1,'Use System Restore / uninstall the problem update from WinRE',true,10,'Roll back the bad update — the classic fix when Safe Mode is clean.'),
 (3,2,'Leave it in Safe Mode permanently',false,0,'Not a usable long-term state.'),
 (3,3,'Reimage anyway',false,3,'Would work but loses time/data unnecessarily when a rollback fixes it.'),
 (3,4,'Disable her account',false,0,'Blocks her entirely.'),
 (4,1,'Confirm normal boot, explain the bad update was rolled back, and note data was preserved',true,10,'Confirm, translate, reassure.'),
 (4,2,'Close without telling her',false,0,'Always confirm first.'),
 (4,3,'Tell her to stop installing updates',false,0,'Wrong advice — updates matter; this one was faulty.'),
 (4,4,'Reassign the ticket',false,0,'You resolved it.')
) v(ssort,osort,txt,ok,pts,fb) join s on s.sort=v.ssort;

-- ── Scenario 2: Outlook desktop won't activate (licensing) ──
insert into public.scenarios (id, slug, title, track, intro_actor, intro_channel, intro_message, pass_pct, bonus_xp, sort) values
 ('sim-t2-m365-license','outlook-wont-activate','Ticket: Outlook desktop won''t activate','helpdesk','Leo — Marketing','Ticket #6135','I can use email in the browser fine, but the Outlook desktop app keeps saying it needs activation and won''t let me in.',60,80,20)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, intro_actor=excluded.intro_actor, intro_channel=excluded.intro_channel, intro_message=excluded.intro_message, pass_pct=excluded.pass_pct, bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.scenario_stages where scenario_id='sim-t2-m365-license';
insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
 ('sim-t2-m365-license',1,'triage','Browser email works; desktop Outlook won''t activate. Start where?'),
 ('sim-t2-m365-license',2,'diagnose','In the admin center you see Leo is on Business Basic. What does that mean?'),
 ('sim-t2-m365-license',3,'resolve','How do you get him into the desktop apps — correctly?'),
 ('sim-t2-m365-license',4,'communicate','He''s working in desktop Outlook. Close-out?');
with s as (select id, sort from public.scenario_stages where scenario_id='sim-t2-m365-license')
insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback)
select s.id, v.osort, v.txt, v.ok, v.pts, v.fb from (values
 (1,1,'Reinstall Office five times',false,0,'Reinstalling won''t fix a licensing gap.'),
 (1,2,'Check his license assignment in the M365 admin center',true,10,'Web works but desktop doesn''t — licensing is the prime suspect.'),
 (1,3,'Replace his laptop',false,0,'No hardware fault indicated.'),
 (1,4,'Reset his password',false,0,'He can already sign in on the web.'),
 (2,1,'Business Basic includes web/mobile apps but not the desktop Office apps',true,10,'Exactly — Basic has no desktop Office, so activation fails.'),
 (2,2,'Business Basic includes everything',false,0,'Basic excludes the desktop apps.'),
 (2,3,'He has no license at all',false,3,'He does have one (web works) — it''s just the wrong tier.'),
 (2,4,'It means his mailbox is full',false,0,'Unrelated to activation.'),
 (3,1,'Assign a plan that includes desktop Office (e.g. Business Standard), then re-activate',true,10,'Right-size the license; desktop apps then activate.'),
 (3,2,'Tell him to only use the browser forever',false,3,'A workaround, not a fix, if his role needs the desktop apps.'),
 (3,3,'Give him Global Admin',false,0,'Irrelevant and a security risk.'),
 (3,4,'Delete and recreate his account',false,0,'Disproportionate and disruptive.'),
 (4,1,'Confirm activation, explain the license was upgraded, and note it may take a bit to apply',true,10,'Confirm, translate, set expectations.'),
 (4,2,'Close silently',false,0,'Confirm first.'),
 (4,3,'Tell him licensing is not your problem',false,0,'Ownership matters.'),
 (4,4,'Remove his web access too',false,0,'Never remove working access.')
) v(ssort,osort,txt,ok,pts,fb) join s on s.sort=v.ssort;

-- ── Scenario 3: VPN connected but no internal resources ──
insert into public.scenarios (id, slug, title, track, intro_actor, intro_channel, intro_message, pass_pct, bonus_xp, sort) values
 ('sim-t2-vpn','vpn-no-resources','Ticket: On VPN but can''t reach the file server','helpdesk','Sam — Remote','Chat','I''m connected to the VPN (it says connected) but I can''t open the shared drive or any internal site. Internet works fine.',60,80,20)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, intro_actor=excluded.intro_actor, intro_channel=excluded.intro_channel, intro_message=excluded.intro_message, pass_pct=excluded.pass_pct, bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.scenario_stages where scenario_id='sim-t2-vpn';
insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
 ('sim-t2-vpn',1,'triage','VPN shows connected, internet works, internal resources don''t. First step?'),
 ('sim-t2-vpn',2,'diagnose','He can reach the internet but not internal names or IPs over the VPN. Likely cause?'),
 ('sim-t2-vpn',3,'resolve','Reconnecting doesn''t help and it affects only him. Best action?'),
 ('sim-t2-vpn',4,'communicate','It''s escalated with your findings. What do you tell Sam?');
with s as (select id, sort from public.scenario_stages where scenario_id='sim-t2-vpn')
insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback)
select s.id, v.osort, v.txt, v.ok, v.pts, v.fb from (values
 (1,1,'Confirm what''s reachable (internet vs internal) and gather the exact error',true,10,'Scope it: internet OK but internal not narrows the cause fast.'),
 (1,2,'Tell him to reinstall Windows',false,0,'Wildly premature.'),
 (1,3,'Reset his password',false,0,'He''s connected — auth isn''t the issue.'),
 (1,4,'Tell him VPNs never work',false,0,'Unhelpful and untrue.'),
 (2,1,'The tunnel isn''t applying internal DNS/routes (so internal names/IPs fail)',true,10,'Internet works but internal doesn''t → missing VPN DNS/routing.'),
 (2,2,'His monitor is failing',false,0,'Unrelated.'),
 (2,3,'The file server was deleted',false,0,'Others can reach it; it''s specific to his tunnel.'),
 (2,4,'His RAM is bad',false,0,'Unrelated to routing.'),
 (3,1,'Try a reconnect/known-good profile; if it persists, escalate to networking with your findings',true,10,'Basic remediation, then escalate with evidence — keeping ownership.'),
 (3,2,'Close the ticket as user error',false,0,'It isn''t resolved.'),
 (3,3,'Tell him to use a colleague''s VPN login',false,0,'Never share credentials.'),
 (3,4,'Ignore it',false,0,'Not an option.'),
 (4,1,'Explain it''s a VPN routing/DNS issue, that you''ve escalated with details, and give a next-update time',true,10,'Translate, set expectations, keep ownership through escalation.'),
 (4,2,'Say nothing further',false,0,'Communicate status on escalation.'),
 (4,3,'Blame his home internet',false,0,'His internet works — that''s not it.'),
 (4,4,'Tell him it''s unfixable',false,0,'Untrue and unhelpful.')
) v(ssort,osort,txt,ok,pts,fb) join s on s.sort=v.ssort;
