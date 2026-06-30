-- 0011_seed_scenarios_batch.sql — Phase 7 content: 3 more Help Desk tickets.
-- Idempotent: upsert scenario, clear its stages (cascades options), reseed.

insert into public.scenarios (id, slug, title, track, intro_actor, intro_channel, intro_message, pass_pct, bonus_xp, sort) values
  ('sim-locked-account','account-locked-out','Ticket: Account locked out','helpdesk','Marcus — Sales','Ticket #5102','I''m locked out of my account and can''t log in — tried my password a few times. I have a client call in 20 minutes!',60,60,10)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, intro_actor=excluded.intro_actor, intro_channel=excluded.intro_channel, intro_message=excluded.intro_message, pass_pct=excluded.pass_pct, bonus_xp=excluded.bonus_xp;
delete from public.scenario_stages where scenario_id='sim-locked-account';
insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
  ('sim-locked-account',1,'triage','Marcus is locked out and in a hurry. First step?'),
  ('sim-locked-account',2,'diagnose','His account locked from too many bad attempts. Most likely cause?'),
  ('sim-locked-account',3,'resolve','How do you get him working again — correctly?'),
  ('sim-locked-account',4,'communicate','He''s back in. Wrap up?');
with s as (select id, sort from public.scenario_stages where scenario_id='sim-locked-account')
insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback)
select s.id, v.osort, v.txt, v.ok, v.pts, v.fb from (values
  (1,1,'Reset his password right away without checking anything',false,0,'Resetting blindly may be unnecessary and disruptive — confirm the lockout first.'),
  (1,2,'Acknowledge, verify his identity, and check the account''s lock status',true,10,'Verify identity and confirm the lockout before acting.'),
  (1,3,'Tell him to wait 30 minutes for the lock to expire',false,3,'Auto-unlock may exist, but his deadline makes waiting a poor first choice.'),
  (1,4,'Delete and recreate his account',false,0,'Wildly disproportionate to a lockout.'),
  (2,1,'A cached old password on another device (phone, mapped drive)',true,10,'The classic repeat-offender behind recurring lockouts.'),
  (2,2,'The server is down',false,0,'A down server wouldn''t lock his account.'),
  (2,3,'He forgot to turn his monitor on',false,0,'Unrelated to a lockout.'),
  (2,4,'His RAM is failing',false,0,'Unrelated to authentication.'),
  (3,1,'Unlock the account, reset if needed, and have him update saved credentials on his phone',true,10,'Unlock plus fixing the cached-credential source so it won''t relock.'),
  (3,2,'Just unlock and move on',false,5,'Unlocks him now, but a device with the old password may relock it.'),
  (3,3,'Disable the account',false,0,'That blocks him entirely.'),
  (3,4,'Tell him to use a colleague''s login',false,0,'Never share credentials — a security violation.'),
  (4,1,'Confirm he can log in, explain the cached-password cause, and remind him to update it on his phone',true,10,'Confirm, translate, and prevent recurrence.'),
  (4,2,'Close the ticket without telling him',false,0,'Always confirm before closing.'),
  (4,3,'Lecture him on password hygiene',false,0,'Condescending — keep it helpful.'),
  (4,4,'Tell him it''ll just happen again',false,0,'Unhelpful, and you addressed the cause.')
) v(ssort,osort,txt,ok,pts,fb) join s on s.sort=v.ssort;

insert into public.scenarios (id, slug, title, track, intro_actor, intro_channel, intro_message, pass_pct, bonus_xp, sort) values
  ('sim-wifi-no-internet','wifi-no-internet','Ticket: Wi-Fi connected but no internet','helpdesk','Priya — Remote','Chat','My laptop says it''s connected to Wi-Fi but nothing loads — no email, no web. It worked fine yesterday.',60,60,10)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, intro_actor=excluded.intro_actor, intro_channel=excluded.intro_channel, intro_message=excluded.intro_message, pass_pct=excluded.pass_pct, bonus_xp=excluded.bonus_xp;
delete from public.scenario_stages where scenario_id='sim-wifi-no-internet';
insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
  ('sim-wifi-no-internet',1,'triage','Where do you start?'),
  ('sim-wifi-no-internet',2,'diagnose','She''s on her home Wi-Fi. Which check best isolates it?'),
  ('sim-wifi-no-internet',3,'resolve','Valid IP, she can ping 8.8.8.8, but names won''t resolve. Fix?'),
  ('sim-wifi-no-internet',4,'communicate','Resolved. Close-out?');
with s as (select id, sort from public.scenario_stages where scenario_id='sim-wifi-no-internet')
insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback)
select s.id, v.osort, v.txt, v.ok, v.pts, v.fb from (values
  (1,1,'Acknowledge and confirm what ''connected but nothing loads'' means (which network, any error)',true,10,'Pin down the exact symptom before acting.'),
  (1,2,'Tell her to buy a new router',false,0,'No diagnosis yet.'),
  (1,3,'Escalate to networking immediately',false,3,'Quick local checks come first.'),
  (1,4,'Reinstall her OS',false,0,'Hugely disproportionate.'),
  (2,1,'Check her IP — valid, or a 169.254.x.x self-assigned address?',true,10,'169.254 means DHCP failed; a valid IP points elsewhere (e.g. DNS).'),
  (2,2,'Replace her laptop',false,0,'No evidence of a hardware fault.'),
  (2,3,'Ask her to wait a day',false,0,'Passive and unhelpful.'),
  (2,4,'Reset her password',false,0,'Unrelated to connectivity.'),
  (3,1,'It''s DNS — renew the connection / set a known-good DNS and retest',true,10,'IPs work, names don''t → DNS.'),
  (3,2,'Reinstall Windows',false,0,'Unnecessary.'),
  (3,3,'Tell her the internet is down everywhere',false,0,'Her ping works, so it isn''t a full outage.'),
  (3,4,'Replace the RAM',false,0,'Unrelated.'),
  (4,1,'Confirm pages load, explain it was a DNS issue, and note how to reconnect if it recurs',true,10,'Confirm, translate, empower.'),
  (4,2,'Close silently',false,0,'Confirm first.'),
  (4,3,'Tell her it was her fault',false,0,'Never blame the user.'),
  (4,4,'Reassign the ticket',false,0,'You resolved it.')
) v(ssort,osort,txt,ok,pts,fb) join s on s.sort=v.ssort;

insert into public.scenarios (id, slug, title, track, intro_actor, intro_channel, intro_message, pass_pct, bonus_xp, sort) values
  ('sim-printer','cant-print','Ticket: Can''t print','helpdesk','Tom — Operations','Ticket #5310','I can''t print the shipping labels — the printer worked this morning but now nothing comes out.',60,60,10)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, intro_actor=excluded.intro_actor, intro_channel=excluded.intro_channel, intro_message=excluded.intro_message, pass_pct=excluded.pass_pct, bonus_xp=excluded.bonus_xp;
delete from public.scenario_stages where scenario_id='sim-printer';
insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
  ('sim-printer',1,'triage','First move?'),
  ('sim-printer',2,'diagnose','No error — jobs just sit in the queue. Best check?'),
  ('sim-printer',3,'resolve','The queue is stuck with a jammed job and the printer shows offline. Fix?'),
  ('sim-printer',4,'communicate','Printing again. Wrap-up?');
with s as (select id, sort from public.scenario_stages where scenario_id='sim-printer')
insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback)
select s.id, v.osort, v.txt, v.ok, v.pts, v.fb from (values
  (1,1,'Acknowledge and ask exactly what happens — any error, which printer, anything in the queue',true,10,'Gather the specifics before acting.'),
  (1,2,'Tell him printers are unreliable, try later',false,0,'Dismissive and unhelpful.'),
  (1,3,'Order a new printer',false,0,'No diagnosis yet.'),
  (1,4,'Escalate to the vendor immediately',false,3,'Local checks first.'),
  (2,1,'Check the print queue and printer status (paused/offline) and the print spooler',true,10,'Stuck queues and offline status are the usual culprits.'),
  (2,2,'Reinstall his OS',false,0,'Disproportionate.'),
  (2,3,'Replace his keyboard',false,0,'Unrelated.'),
  (2,4,'Reset his password',false,0,'Unrelated.'),
  (3,1,'Clear the stuck job (restart the spooler if needed), set the printer back online, and test',true,10,'Clear the jam, restore online, verify.'),
  (3,2,'Delete the printer permanently',false,0,'Removes access entirely.'),
  (3,3,'Tell him to email labels to a colleague from now on',false,3,'A workaround, not a fix.'),
  (3,4,'Do nothing',false,0,'Leaves him stuck.'),
  (4,1,'Confirm a test print works, explain the stuck-queue cause, and show him how to clear it next time',true,10,'Confirm, translate, empower.'),
  (4,2,'Close silently',false,0,'Confirm first.'),
  (4,3,'Blame the printer brand',false,0,'Unprofessional.'),
  (4,4,'Reassign',false,0,'You resolved it.')
) v(ssort,osort,txt,ok,pts,fb) join s on s.sort=v.ssort;
