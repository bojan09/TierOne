-- 0056_seed_scenarios_phase4.sql — Phase 4 interactive: 3 new ticket simulations. Idempotent.

-- ============ sim-vpn-remote ============
insert into public.scenarios (id, slug, title, track, intro_actor, intro_channel, intro_message, pass_pct, bonus_xp, sort)
values ('sim-vpn-remote', 'vpn-wont-connect', 'Ticket: Remote worker can''t reach the VPN', 'helpdesk',
  'Marco — Sales (remote)', 'Ticket #5140',
  'I''m working from home and the VPN won''t connect — I can''t get to any of our internal systems. I have a client demo in an hour!',
  60, 60, 30)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, intro_actor=excluded.intro_actor,
  intro_channel=excluded.intro_channel, intro_message=excluded.intro_message, pass_pct=excluded.pass_pct,
  bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.scenario_stages where scenario_id = 'sim-vpn-remote';
do $$
declare s1 bigint; s2 bigint; s3 bigint; s4 bigint;
begin
  insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
    ('sim-vpn-remote', 1, 'triage', 'Marco is on a deadline and off-site. What do you check first?') returning id into s1;
  insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback) values
    (s1, 1, 'Confirm he has working internet before anything else', true, 10, 'Correct — no internet, no VPN. Always verify the bottom of the stack first.'),
    (s1, 2, 'Reinstall the VPN client immediately', false, 0, 'Too heavy before you know internet even works.'),
    (s1, 3, 'Escalate to network engineering', false, 3, 'Premature — do the fast local checks first.'),
    (s1, 4, 'Tell him to try again later', false, 0, 'Ignores his deadline and does nothing.');

  insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
    ('sim-vpn-remote', 2, 'diagnose', 'His internet is fine (web loads). The VPN client errors on connect. Next step?') returning id into s2;
  insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback) values
    (s2, 1, 'Check the error, and verify credentials + MFA prompt are completing', true, 10, 'Right — most connect-time failures are auth/MFA or an expired client.'),
    (s2, 2, 'Reset his home router', false, 3, 'Internet already works; unnecessary.'),
    (s2, 3, 'Replace his laptop', false, 0, 'Wildly disproportionate.'),
    (s2, 4, 'Assume the VPN is down for everyone', false, 3, 'Check before assuming a mass outage — verify others first.');

  insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
    ('sim-vpn-remote', 3, 'resolve', 'He wasn''t completing the MFA push, and his client is a version behind. Best fix?') returning id into s3;
  insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback) values
    (s3, 1, 'Walk him through approving MFA, then update the VPN client', true, 10, 'Exactly — clear the auth blocker, then bring the client current.'),
    (s3, 2, 'Disable MFA for his account', false, 0, 'Never weaken security to fix convenience — that''s a serious risk.'),
    (s3, 3, 'Give him a colleague''s credentials', false, 0, 'Credential sharing is a security violation.'),
    (s3, 4, 'Tell him to use public wifi instead', false, 0, 'Irrelevant and less secure.');

  insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
    ('sim-vpn-remote', 4, 'communicate', 'VPN connects and internal systems load. How do you close?') returning id into s4;
  insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback) values
    (s4, 1, 'Confirm access works, explain the MFA + update fix simply, and note it for the KB', true, 10, 'Great close — confirm, translate, and capture it so the next tech is faster.'),
    (s4, 2, 'Close silently', false, 0, 'Always confirm with the user first.'),
    (s4, 3, 'Tell him to stop skipping MFA prompts', false, 3, 'The lesson is fine but the tone blames — coach, don''t scold.'),
    (s4, 4, 'Reassign to close it out', false, 0, 'You solved it — own the close.');
end $$;

-- ============ sim-lockout ============
insert into public.scenarios (id, slug, title, track, intro_actor, intro_channel, intro_message, pass_pct, bonus_xp, sort)
values ('sim-lockout', 'repeated-lockout', 'Ticket: Account keeps locking out', 'helpdesk',
  'Priya — Operations', 'Ticket #5166',
  'My account locks every few minutes. I reset my password this morning but it keeps happening. It''s driving me crazy!',
  60, 60, 31)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, intro_actor=excluded.intro_actor,
  intro_channel=excluded.intro_channel, intro_message=excluded.intro_message, pass_pct=excluded.pass_pct,
  bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.scenario_stages where scenario_id = 'sim-lockout';
do $$
declare s1 bigint; s2 bigint; s3 bigint; s4 bigint;
begin
  insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
    ('sim-lockout', 1, 'triage', 'Priya already reset her password but keeps locking out. First move?') returning id into s1;
  insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback) values
    (s1, 1, 'Just unlock the account again and close it', false, 0, 'It''ll re-lock in minutes — you haven''t found the cause.'),
    (s1, 2, 'Unlock it, then find the SOURCE of the bad attempts (lockout event on the DC)', true, 10, 'Correct — repeated lockouts mean a stale credential somewhere; find it.'),
    (s1, 3, 'Delete and recreate her account', false, 0, 'Drastic and skips diagnosis.'),
    (s1, 4, 'Tell her to change her password again', false, 3, 'She already did — that isn''t the problem.');

  insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
    ('sim-lockout', 2, 'diagnose', 'The lockout event points to her phone. What''s the likely cause?') returning id into s2;
  insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback) values
    (s2, 1, 'Her phone''s saved mail/wifi credentials still use the OLD password', true, 10, 'Exactly — a device retrying old creds is the classic repeat-lockout source.'),
    (s2, 2, 'Her keyboard is broken', false, 0, 'Unrelated to a phone-sourced lockout.'),
    (s2, 3, 'The domain controller is failing', false, 3, 'The DC is doing its job — reporting the lockout.'),
    (s2, 4, 'She has a virus', false, 3, 'Jumping to malware without evidence.');

  insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
    ('sim-lockout', 3, 'resolve', 'How do you stop the lockouts for good?') returning id into s3;
  insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback) values
    (s3, 1, 'Update the saved password on her phone (mail + wifi), then unlock', true, 10, 'Right — clear every place the old credential is cached.'),
    (s3, 2, 'Turn off account lockout policy', false, 0, 'That removes a key security control — never do this.'),
    (s3, 3, 'Ignore it; it''ll stop eventually', false, 0, 'It won''t, and she can''t work.'),
    (s3, 4, 'Block her phone from the network permanently', false, 3, 'Overkill — just update the credentials.');

  insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
    ('sim-lockout', 4, 'communicate', 'Lockouts stop. How do you wrap up with Priya?') returning id into s4;
  insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback) values
    (s4, 1, 'Confirm it''s resolved and remind her to update saved passwords on all devices after a reset', true, 10, 'Perfect — resolve plus a tip that prevents the repeat.'),
    (s4, 2, 'Close without a word', false, 0, 'Confirm with the user first.'),
    (s4, 3, 'Tell her phones are always trouble', false, 0, 'Unhelpful and unprofessional.'),
    (s4, 4, 'Suggest she stop using her phone for email', false, 3, 'Impractical; the real fix is updating credentials.');
end $$;

-- ============ sim-printer ============
insert into public.scenarios (id, slug, title, track, intro_actor, intro_channel, intro_message, pass_pct, bonus_xp, sort)
values ('sim-printer', 'shared-printer-down', 'Ticket: Shared printer is offline for the floor', 'helpdesk',
  'Tom — Reception', 'Ticket #5190',
  'Nobody on the 2nd floor can print — it just says the printer is offline. We have visitor badges to print for a 10am tour!',
  60, 60, 32)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, intro_actor=excluded.intro_actor,
  intro_channel=excluded.intro_channel, intro_message=excluded.intro_message, pass_pct=excluded.pass_pct,
  bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.scenario_stages where scenario_id = 'sim-printer';
do $$
declare s1 bigint; s2 bigint; s3 bigint; s4 bigint;
begin
  insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
    ('sim-printer', 1, 'triage', 'It''s offline for EVERYONE on the floor. What does that tell you?') returning id into s1;
  insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback) values
    (s1, 1, 'It''s a shared/network-side issue, not one PC — check the printer itself', true, 10, 'Correct — an outage for everyone points to the printer/network, not a single client.'),
    (s1, 2, 'Reinstall the driver on Tom''s PC', false, 3, 'That only helps one PC; everyone is affected.'),
    (s1, 3, 'Tell everyone to reboot their PCs', false, 0, 'Won''t fix a printer/network-side outage.'),
    (s1, 4, 'Order a new printer', false, 0, 'Way premature.');

  insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
    ('sim-printer', 2, 'diagnose', 'You go to the printer. How do you check it?') returning id into s2;
  insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback) values
    (s2, 1, 'Check power, network cable/link light, and whether it holds an IP', true, 10, 'Right — confirm it''s powered, on the network, and reachable.'),
    (s2, 2, 'Immediately replace the toner', false, 3, 'Toner doesn''t cause an ''offline'' state for everyone.'),
    (s2, 3, 'Factory-reset it right away', false, 0, 'Destructive before diagnosis.'),
    (s2, 4, 'Assume it''s fine and blame the network team', false, 3, 'Check before escalating/blaming.');

  insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
    ('sim-printer', 3, 'resolve', 'It powered on but dropped off the network (no link light). Best fix?') returning id into s3;
  insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback) values
    (s3, 1, 'Reseat/replace the network cable and confirm it gets an IP again', true, 10, 'Exactly — restore the network link, then verify reachability.'),
    (s3, 2, 'Reinstall drivers on every PC', false, 0, 'The problem is the printer''s network link, not clients.'),
    (s3, 3, 'Tell reception to use another floor''s printer forever', false, 3, 'A stopgap at best; doesn''t fix the issue.'),
    (s3, 4, 'Wait and see if it comes back', false, 0, 'Ignores the 10am deadline.');

  insert into public.scenario_stages (scenario_id, sort, kind, prompt) values
    ('sim-printer', 4, 'communicate', 'Printing works again. How do you close with Tom?') returning id into s4;
  insert into public.scenario_options (stage_id, sort, text, is_correct, points, feedback) values
    (s4, 1, 'Confirm printing works, mention the badges are covered, and log the cable fix in the KB', true, 10, 'Great — confirm, address his real concern (the tour), and document.'),
    (s4, 2, 'Close it without telling anyone', false, 0, 'Confirm with the user first.'),
    (s4, 3, 'Tell him printers are unreliable', false, 0, 'Unprofessional and unhelpful.'),
    (s4, 4, 'Leave it for the next shift to verify', false, 3, 'You fixed it — confirm and close.');
end $$;
