-- 0026_seed_helpdesk_gapfill_quizzes.sql — P15 batch 3 quizzes (12 Qs). Idempotent.

insert into public.lesson_quizzes (lesson_id, pass_pct, bonus_xp) values
  ('hdf-04', 70, 30),
  ('hwos-04', 70, 30),
  ('hwos-05', 70, 30),
  ('work-05', 70, 30)
on conflict (lesson_id) do update set pass_pct=excluded.pass_pct, bonus_xp=excluded.bonus_xp;

delete from public.quiz_questions where lesson_id in ('hdf-04','hwos-04','hwos-05','work-05');

insert into public.quiz_questions (lesson_id, sort, prompt, options, correct_index, explanation) values
  ('hdf-04', 1, 'Which command shows a Windows machine''s IP, gateway, and DNS?', '["ipconfig /all", "dir", "tasklist", "sfc /scannow"]'::jsonb, 0, 'ipconfig /all reports the full network configuration.'),
  ('hdf-04', 2, 'IPs are reachable but names won''t resolve. Which command confirms a DNS issue?', '["ping", "nslookup", "cd", "tracert"]'::jsonb, 1, 'nslookup tests name resolution directly.'),
  ('hdf-04', 3, 'Why copy command output into the ticket?', '["To make it longer", "To give the next person the exact facts you saw", "It''s required by law", "To hide the cause"]'::jsonb, 1, 'Precise evidence beats vague descriptions and speeds resolution.'),
  ('hwos-04', 1, 'A user says their PC is slow and an app is frozen. Which tool do you open first?', '["Task Manager", "Disk Management", "Event Viewer", "Control Panel"]'::jsonb, 0, 'Task Manager shows resource use and can End Task on a frozen app.'),
  ('hwos-04', 2, 'A device isn''t working and shows a yellow warning icon. Where do you look?', '["Device Manager", "Programs & Features", "Services", "Task Manager"]'::jsonb, 0, 'Device Manager flags driver/device problems with a yellow icon.'),
  ('hwos-04', 3, 'Which Run command opens Disk Management?', '["diskmgmt.msc", "devmgmt.msc", "services.msc", "eventvwr"]'::jsonb, 0, 'diskmgmt.msc opens Disk Management.'),
  ('hwos-05', 1, 'Which backup type copies only what changed since the last full backup?', '["Full", "Differential", "Incremental", "Mirror"]'::jsonb, 1, 'A differential captures changes since the last full backup.'),
  ('hwos-05', 2, 'The 3-2-1 rule means…', '["3 copies on 1 disk", "3 copies, 2 media types, 1 offsite", "2 copies, 1 in the cloud", "1 copy backed up 3 times"]'::jsonb, 1, 'Three copies, two media types, one offsite.'),
  ('hwos-05', 3, 'The highest-value Tier-1 habit for protecting a user''s files is to…', '["Defragment the disk weekly", "Ensure important files live in a backed-up location like OneDrive", "Increase the screen resolution", "Disable Windows Update"]'::jsonb, 1, 'Getting data into a synced/backed-up location protects it before disaster.'),
  ('work-05', 1, 'Files shared in a Teams channel are actually stored in…', '["The user''s OneDrive", "That team''s SharePoint site", "Local Documents", "The recycle bin"]'::jsonb, 1, 'Teams channel files live in the team''s SharePoint document library.'),
  ('work-05', 2, 'A user gets ''access denied'' opening a shared file. The usual cause is…', '["A dead printer", "A permissions / sharing issue", "A DNS outage", "A full battery"]'::jsonb, 1, 'Access-denied errors are typically permission/sharing problems.'),
  ('work-05', 3, 'OneDrive isn''t syncing. A good first check is…', '["Replace the monitor", "Confirm the user is signed in, the client is running, and there''s free space", "Reset the router to factory", "Reinstall the OS"]'::jsonb, 1, 'Sign-in, a running sync client, and free space resolve most sync issues.');
