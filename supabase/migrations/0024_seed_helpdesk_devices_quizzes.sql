-- 0024_seed_helpdesk_devices_quizzes.sql — P15 batch 2 quizzes (12 Qs). Idempotent.

insert into public.lesson_quizzes (lesson_id, pass_pct, bonus_xp) values
  ('hddev-01', 70, 30),
  ('hddev-02', 70, 30),
  ('hddev-03', 70, 30),
  ('hddev-04', 70, 30)
on conflict (lesson_id) do update set pass_pct=excluded.pass_pct, bonus_xp=excluded.bonus_xp;

delete from public.quiz_questions where lesson_id in ('hddev-01','hddev-02','hddev-03','hddev-04');

insert into public.quiz_questions (lesson_id, sort, prompt, options, correct_index, explanation) values
  ('hddev-01', 1, 'A laptop user reports ''plugged in, not charging.'' Which area do you check first?', '["The monitor''s input source", "The power adapter, wattage and battery", "The print spooler", "DNS settings"]'::jsonb, 1, 'Battery/adapter is the most common laptop power issue.'),
  ('hddev-01', 2, 'A quick way to tell a black laptop screen from a wider system fault is to…', '["Reinstall the OS", "Connect an external monitor", "Replace the RAM", "Run a virus scan"]'::jsonb, 1, 'If an external monitor works, the system is fine and the built-in display is suspect.'),
  ('hddev-01', 3, 'A corporate phone reporting ''can''t install updates'' most often needs…', '["A new SIM card", "Free storage space", "A faster CPU", "A different charger"]'::jsonb, 1, 'Full storage commonly blocks updates and sync.'),
  ('hddev-02', 1, 'Print jobs pile up but nothing prints and there''s no error. Best first check?', '["Reinstall Windows", "The print queue and Print Spooler service", "The monitor cable", "The user''s password"]'::jsonb, 1, 'A stuck queue/spooler is the classic cause.'),
  ('hddev-02', 2, 'A laser printer producing faded, streaky output most likely needs…', '["A new network cable", "Toner or a cleaning/fuser check", "More RAM", "A driver for a different model"]'::jsonb, 1, 'Faded/streaky laser output points to toner or the fuser.'),
  ('hddev-02', 3, 'Scan-to-folder suddenly fails for everyone. The most likely cause is…', '["The flatbed glass", "A network/permissions issue on the destination", "The paper tray", "The monitor resolution"]'::jsonb, 1, 'Scan destinations usually fail on network or folder-permission issues.'),
  ('hddev-03', 1, 'A monitor shows ''No Signal'' though it''s powered on. First thing to check?', '["The correct input source and the cable", "The print spooler", "The BIOS password", "The antivirus"]'::jsonb, 0, 'Wrong input source or a loose/faulty cable is the usual cause.'),
  ('hddev-03', 2, 'Which Windows shortcut switches between duplicate and extend for a second display?', '["Windows+L", "Windows+P", "Ctrl+Alt+Del", "Alt+F4"]'::jsonb, 1, 'Windows+P toggles projection mode (duplicate/extend/second-only).'),
  ('hddev-03', 3, 'Text looks blurry on an external monitor. The best fix is usually to…', '["Replace the GPU", "Set the display to its native resolution", "Disable Wi-Fi", "Reinstall the printer driver"]'::jsonb, 1, 'Running a display at its native resolution fixes most blur/scaling issues.'),
  ('hddev-04', 1, 'Before taking control of a user''s screen remotely, you should always…', '["Reboot their PC", "Get their explicit consent", "Change their password", "Disable their antivirus"]'::jsonb, 1, 'Always obtain consent and tell the user when you take control.'),
  ('hddev-04', 2, 'Good remote-support security hygiene includes…', '["Leaving the session open for next time", "Ending sessions cleanly and using only approved tools", "Sharing the session link publicly", "Skipping documentation"]'::jsonb, 1, 'End sessions cleanly, use sanctioned tools, and document changes.'),
  ('hddev-04', 3, 'Connecting to and controlling a Windows machine as if sitting at it describes…', '["DNS", "Remote Desktop (RDP)", "DHCP", "BitLocker"]'::jsonb, 1, 'RDP provides full remote control of a Windows session.');
