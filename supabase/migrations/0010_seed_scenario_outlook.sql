-- 0010_seed_scenario_outlook.sql — Phase 7 vertical slice scenario.
-- "Outlook disconnected" — exercises triage → diagnose → resolve → communicate.
-- Idempotent: clears this scenario's stages/options then reseeds.

insert into public.scenarios (id, slug, title, track, intro_actor, intro_channel, intro_message, pass_pct, bonus_xp, sort)
values ('sim-outlook', 'outlook-disconnected', 'Ticket: Outlook is disconnected', 'helpdesk',
  'Dana — Finance', 'Ticket #4821',
  'Outlook says "Disconnected" and I can''t send or receive. I have a payment run due at 3pm — please help!',
  60, 60, 1)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, intro_actor=excluded.intro_actor,
  intro_channel=excluded.intro_channel, intro_message=excluded.intro_message, pass_pct=excluded.pass_pct,
  bonus_xp=excluded.bonus_xp, sort=excluded.sort;

delete from public.scenario_stages where scenario_id = 'sim-outlook';

do $$
declare s1 bigint; s2 bigint; s3 bigint; s4 bigint;
begin
  insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
    ('sim-outlook', 1, 'triage', 'Dana is stressed and on a deadline. What is your first move?') returning id into s1;
  insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback) values
    (s1, 1, 'Tell her to reboot and hope it sorts itself out', false, 0, 'Rebooting blindly skips the quick checks that actually locate the problem.'),
    (s1, 2, 'Acknowledge the ticket, note the 3pm deadline, and confirm basic network connectivity', true, 10, 'Right: acknowledge + set expectations, then start with the network — the bottom of the stack.'),
    (s1, 3, 'Escalate to the mail team immediately', false, 3, 'Too early — there are fast local checks you can do before escalating.'),
    (s1, 4, 'Reinstall Office straight away', false, 0, 'Heavy-handed and disruptive before any diagnosis.');

  insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
    ('sim-outlook', 2, 'diagnose', 'Her network is fine — web pages load. How do you isolate client vs. mailbox?') returning id into s2;
  insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback) values
    (s2, 1, 'Check the same account in webmail (browser)', true, 10, 'Exactly — webmail instantly tells you whether it is the local client or the service.'),
    (s2, 2, 'Reset the router', false, 3, 'Network is already confirmed working; a router reset is unnecessary.'),
    (s2, 3, 'Ask her to wait an hour and see', false, 0, 'Passive and ignores her deadline.'),
    (s2, 4, 'Replace her RAM', false, 0, 'Unrelated to an email connection problem.');

  insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
    ('sim-outlook', 3, 'resolve', 'Webmail works perfectly. What is the most likely cause and the right fix?') returning id into s3;
  insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback) values
    (s3, 1, 'Stale cached credentials — clear them in Credential Manager and restart Outlook', true, 10, 'Spot on: webmail-OK + client-fails points to the local client/credentials.'),
    (s3, 2, 'The mail server is down — wait for it to recover', false, 0, 'Webmail worked, so the service is clearly up.'),
    (s3, 3, 'Her mailbox is corrupt — rebuild the whole profile', false, 3, 'Possible later, but not the first, least-disruptive step.'),
    (s3, 4, 'Nothing can be done from your side', false, 0, 'Not true — this is a common, fixable local issue.');

  insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
    ('sim-outlook', 4, 'communicate', 'Outlook reconnects and mail flows. How do you close with Dana?') returning id into s4;
  insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback) values
    (s4, 1, 'Close the ticket silently', false, 0, 'Always confirm with the user before closing.'),
    (s4, 2, 'Confirm it is working, explain in plain terms what happened, and reassure her the 3pm run is safe', true, 10, 'Great close: confirm, translate, and address her real concern (the deadline).'),
    (s4, 3, 'Tell her it was her fault for using a bad password', false, 0, 'Never blame the user — it damages trust and is unprofessional.'),
    (s4, 4, 'Reassign it to another tech to close out', false, 0, 'You resolved it — own the close.');
end $$;
