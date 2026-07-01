-- 0027_seed_scenarios_batch2.sql — more Help Desk tickets (security, devices, collaboration).
-- Idempotent: upsert scenario, clear its stages (cascades options), reseed.

insert into public.scenarios (id, slug, title, track, intro_actor, intro_channel, intro_message, pass_pct, bonus_xp, sort) values
  ('sim-phishing','suspicious-email','Ticket: Suspicious email','helpdesk','Dana — Finance','Ticket #5440','I got an email saying our CEO urgently needs me to buy gift cards and send the codes. It looks a bit off, but it has his name on it. What do I do?',60,60,20)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, intro_actor=excluded.intro_actor, intro_channel=excluded.intro_channel, intro_message=excluded.intro_message, pass_pct=excluded.pass_pct, bonus_xp=excluded.bonus_xp;
delete from public.scenario_stages where scenario_id='sim-phishing';
insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
  ('sim-phishing',1,'triage','Dana received an urgent, suspicious email. First step?'),
  ('sim-phishing',2,'diagnose','What kind of attack is this most likely?'),
  ('sim-phishing',3,'resolve','How should this be handled?'),
  ('sim-phishing',4,'communicate','How do you close with Dana?');
with s as (select id, sort from public.scenario_stages where scenario_id='sim-phishing')
insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback)
select s.id, v.osort, v.txt, v.ok, v.pts, v.fb from (values
  (1,1,'Tell her to buy the gift cards to be safe',false,0,'Never act on the demand — this is a classic scam.'),
  (1,2,'Reassure her, tell her not to click, reply, or act, and keep the email in place for review',true,10,'Don''t engage; preserve it for the security team.'),
  (1,3,'Tell her to just delete it and forget about it',false,3,'Better than acting, but it should be reported first.'),
  (1,4,'Have her forward it to the whole finance team as a warning',false,0,'Forwarding spreads the risk — report through the proper channel instead.'),
  (2,1,'Business email compromise / phishing (social engineering)',true,10,'Urgency + gift cards + impersonation is textbook BEC phishing.'),
  (2,2,'A hardware failure',false,0,'Unrelated to hardware.'),
  (2,3,'A printer problem',false,0,'Unrelated.'),
  (2,4,'A DNS outage',false,0,'Unrelated to email fraud.'),
  (3,1,'Report it to the security team through the proper channel and check whether others received it',true,10,'Report and assess the blast radius.'),
  (3,2,'Reply asking the sender to verify who they are',false,0,'Never reply — that confirms a live target.'),
  (3,3,'Pay now and claim reimbursement later',false,0,'Never pay; it''s fraud.'),
  (3,4,'Ignore it and move on',false,3,'Safer than acting, but it should still be reported.'),
  (4,1,'Thank her for reporting, confirm she did exactly the right thing, and remind her how to spot these',true,10,'Reinforce good behaviour — she''s your early-warning system.'),
  (4,2,'Tell her she almost caused a breach',false,0,'Never shame the person who reports.'),
  (4,3,'Close the ticket without replying',false,0,'Always confirm and reassure.'),
  (4,4,'Tell her to handle it herself next time',false,0,'Reporting is exactly what you want her to keep doing.')
) v(ssort,osort,txt,ok,pts,fb) join s on s.sort=v.ssort;

insert into public.scenarios (id, slug, title, track, intro_actor, intro_channel, intro_message, pass_pct, bonus_xp, sort) values
  ('sim-no-display','second-monitor-no-signal','Ticket: Second monitor not working','helpdesk','Raj — Design','Chat','My second monitor just says ''No Signal'' since I got back to my desk. The laptop screen itself works fine.',60,60,20)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, intro_actor=excluded.intro_actor, intro_channel=excluded.intro_channel, intro_message=excluded.intro_message, pass_pct=excluded.pass_pct, bonus_xp=excluded.bonus_xp;
delete from public.scenario_stages where scenario_id='sim-no-display';
insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
  ('sim-no-display',1,'triage','Where do you start?'),
  ('sim-no-display',2,'diagnose','The cable is seated and the monitor is powered. Best next check?'),
  ('sim-no-display',3,'resolve','It''s plugged into his dock, which he just reconnected. Likely fix?'),
  ('sim-no-display',4,'communicate','Both screens work now. Wrap up?');
with s as (select id, sort from public.scenario_stages where scenario_id='sim-no-display')
insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback)
select s.id, v.osort, v.txt, v.ok, v.pts, v.fb from (values
  (1,1,'Acknowledge and check the basics — is the monitor on the right input source and the cable seated?',true,10,'Wrong input source and loose cables are the usual causes.'),
  (1,2,'Tell him to buy a new monitor',false,0,'No diagnosis yet.'),
  (1,3,'Reinstall Windows',false,0,'Wildly disproportionate.'),
  (1,4,'Escalate to hardware immediately',false,3,'Quick local checks first.'),
  (2,1,'Confirm the input source matches the cable, and use Windows+P / Detect to find the display',true,10,'Undetected display or wrong input is the common cause.'),
  (2,2,'Replace the laptop battery',false,0,'Unrelated to display output.'),
  (2,3,'Run a virus scan',false,0,'Unrelated.'),
  (2,4,'Reset his password',false,0,'Unrelated.'),
  (3,1,'Reseat the dock connection and cable, then Detect the display — docks are a common single point of failure',true,10,'Reconnected docks frequently drop the external display.'),
  (3,2,'Reinstall the operating system',false,0,'Unnecessary.'),
  (3,3,'Tell him one screen is enough',false,0,'Dismissive and unhelpful.'),
  (3,4,'Replace the graphics card',false,0,'No evidence of a GPU fault.'),
  (4,1,'Confirm the extended desktop looks right, explain it was the dock/input, and note Windows+P if it recurs',true,10,'Confirm, explain, and empower.'),
  (4,2,'Close the ticket silently',false,0,'Confirm first.'),
  (4,3,'Tell him not to touch the dock again',false,0,'Unhelpful.'),
  (4,4,'Blame the monitor brand',false,0,'Unprofessional.')
) v(ssort,osort,txt,ok,pts,fb) join s on s.sort=v.ssort;

insert into public.scenarios (id, slug, title, track, intro_actor, intro_channel, intro_message, pass_pct, bonus_xp, sort) values
  ('sim-onedrive','onedrive-not-syncing','Ticket: Can''t find a shared file','helpdesk','Mei — Marketing','Ticket #5502','The file my teammate shared isn''t showing up, and my OneDrive icon has a red X. Nothing seems to be syncing.',60,60,20)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, intro_actor=excluded.intro_actor, intro_channel=excluded.intro_channel, intro_message=excluded.intro_message, pass_pct=excluded.pass_pct, bonus_xp=excluded.bonus_xp;
delete from public.scenario_stages where scenario_id='sim-onedrive';
insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
  ('sim-onedrive',1,'triage','First step?'),
  ('sim-onedrive',2,'diagnose','The red X means a sync problem. Common causes?'),
  ('sim-onedrive',3,'resolve','Sync is fixed, but she still can''t see the shared file. Where is it?'),
  ('sim-onedrive',4,'communicate','Resolved. Close-out?');
with s as (select id, sort from public.scenario_stages where scenario_id='sim-onedrive')
insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback)
select s.id, v.osort, v.txt, v.ok, v.pts, v.fb from (values
  (1,1,'Acknowledge and check OneDrive status — is she signed in and is the sync client running?',true,10,'Start with sync state before anything drastic.'),
  (1,2,'Tell her to email the file back and forth from now on',false,0,'A workaround, not a fix.'),
  (1,3,'Reinstall Windows',false,0,'Disproportionate.'),
  (1,4,'Rebuild her user profile',false,3,'Far too drastic before basic checks.'),
  (2,1,'A signed-out client, no free space, or a filename conflict',true,10,'These cover the large majority of sync failures.'),
  (2,2,'A failing monitor',false,0,'Unrelated.'),
  (2,3,'A printer jam',false,0,'Unrelated.'),
  (2,4,'A dead battery',false,0,'Unrelated.'),
  (3,1,'A file shared in a Teams channel lives in that team''s SharePoint — check there and confirm she has access',true,10,'Teams channel files live in SharePoint; access may need granting.'),
  (3,2,'It''s gone forever',false,0,'Shared files aren''t simply lost.'),
  (3,3,'It''s stuck on the printer',false,0,'Unrelated.'),
  (3,4,'Only in her recycle bin',false,3,'Worth a look, but channel files live in SharePoint.'),
  (4,1,'Confirm she can open the file, briefly explain sync vs sharing, and how to find channel files next time',true,10,'Confirm, explain, and empower.'),
  (4,2,'Close silently',false,0,'Confirm first.'),
  (4,3,'Tell her it was her fault',false,0,'Never blame the user.'),
  (4,4,'Reassign the ticket',false,0,'You resolved it.')
) v(ssort,osort,txt,ok,pts,fb) join s on s.sort=v.ssort;
