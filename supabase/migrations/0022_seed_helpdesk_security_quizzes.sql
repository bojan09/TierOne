-- 0022_seed_helpdesk_security_quizzes.sql — P15 batch 1 quizzes (12 Qs). Idempotent.

insert into public.lesson_quizzes (lesson_id, pass_pct, bonus_xp) values
  ('hdsec-01', 70, 30),
  ('hdsec-02', 70, 30),
  ('hdsec-03', 70, 30),
  ('hdsec-04', 70, 30)
on conflict (lesson_id) do update set pass_pct=excluded.pass_pct, bonus_xp=excluded.bonus_xp;

delete from public.quiz_questions where lesson_id in ('hdsec-01','hdsec-02','hdsec-03','hdsec-04');

insert into public.quiz_questions (lesson_id, sort, prompt, options, correct_index, explanation) values
  ('hdsec-01', 1, 'Which type of malware encrypts a victim''s files and demands payment?', '["Ransomware", "Adware", "A cryptominer", "Spyware"]'::jsonb, 0, 'Ransomware encrypts data and demands a ransom to release it.'),
  ('hdsec-01', 2, 'Following an authorised person through a secure door is called…', '["Tailgating", "Shoulder surfing", "Pretexting", "Phishing"]'::jsonb, 0, 'Tailgating is slipping through physical access controls behind someone.'),
  ('hdsec-01', 3, 'A user reports a suspicious email asking for their password. Best first action?', '["Reply to confirm if it''s legitimate", "Delete it and move on", "Don''t click or reply, and report it to security", "Forward it to colleagues to warn them"]'::jsonb, 2, 'Don''t interact with it; report through the proper channel.'),
  ('hdsec-02', 1, 'Which is a true example of multi-factor authentication?', '["Two different passwords", "A password plus a code from an authenticator app", "A longer, more complex password", "A password plus a security question"]'::jsonb, 1, 'MFA combines different factor types — here ''know'' + ''have''.'),
  ('hdsec-02', 2, 'Current best practice for strong passwords favours…', '["Frequent forced changes", "A long passphrase (length over complexity)", "Adding symbols to a short password", "Reusing one strong password everywhere"]'::jsonb, 1, 'Length matters most; long unique passphrases are best.'),
  ('hdsec-02', 3, 'Which MFA method is the strongest / most phishing-resistant?', '["SMS text code", "Authenticator app", "A hardware security key (FIDO2)", "Security question"]'::jsonb, 2, 'Hardware keys are phishing-resistant, unlike SMS.'),
  ('hdsec-03', 1, 'What best protects the data on a lost or stolen laptop?', '["Full-disk encryption (e.g. BitLocker)", "A strong Wi-Fi password", "Antivirus software", "A screen privacy filter"]'::jsonb, 0, 'Full-disk encryption makes the drive unreadable without the key.'),
  ('hdsec-03', 2, 'The 3-2-1 backup rule means…', '["3 copies on one disk", "3 copies, on 2 media types, with 1 offsite", "2 copies with 1 offsite", "1 copy backed up 3 times"]'::jsonb, 1, 'Three copies, two media types, one kept offsite.'),
  ('hdsec-03', 3, 'Best practice when you step away from your desk?', '["Turn off the monitor", "Lock the screen", "Close the laptop lid only", "Nothing \u2014 it''s fine briefly"]'::jsonb, 1, 'Locking the screen prevents unauthorised access.'),
  ('hdsec-04', 1, 'Why isn''t deleting files or formatting enough before disposing of a drive?', '["It is always enough", "The data can often still be recovered", "It permanently damages the drive", "It voids the warranty"]'::jsonb, 1, 'Deleted/formatted data is typically recoverable without proper wiping.'),
  ('hdsec-04', 2, 'What lets an organisation enforce policy and remotely wipe mobile devices?', '["VPN", "MDM (Mobile Device Management)", "DNS", "RAID"]'::jsonb, 1, 'MDM manages device policy and can remotely wipe.'),
  ('hdsec-04', 3, 'Which method securely destroys data on a dead or highly sensitive drive?', '["Moving files to the trash", "Physical destruction (e.g. shredding)", "Renaming the files", "A quick format"]'::jsonb, 1, 'Physical destruction is used when a drive can''t or shouldn''t be reused.');
