-- 0008_seed_quizzes_sysadmin_windows.sql — Phase 6.3. SysAdmin cross-track proof:
-- quizzes for the Windows Desktop Administration course (6 lessons). Idempotent.

insert into public.lesson_quizzes (lesson_id, pass_pct, bonus_xp) values
  ('windows-01', 70, 30),
  ('windows-02', 70, 30),
  ('windows-03', 70, 30),
  ('windows-04', 70, 30),
  ('windows-05', 70, 30),
  ('windows-06', 70, 30)
on conflict (lesson_id) do update set pass_pct=excluded.pass_pct, bonus_xp=excluded.bonus_xp;

delete from public.quiz_questions where lesson_id in ('windows-01', 'windows-02', 'windows-03', 'windows-04', 'windows-05', 'windows-06');

insert into public.quiz_questions (lesson_id, sort, prompt, options, correct_index, explanation) values
  ('windows-01', 1, 'In Windows, code running in kernel mode…', '["Is sandboxed like a normal app", "Has full hardware access and can crash the system", "Runs inside the browser", "Cannot touch drivers"]'::jsonb, 1, 'Kernel mode is privileged; a fault there can take down the OS.'),
  ('windows-01', 2, 'User-mode applications reach hardware…', '["Directly", "Through the Windows API / kernel, not directly", "Only via the registry", "They cannot at all"]'::jsonb, 1, 'Apps call APIs; the kernel mediates hardware access.'),
  ('windows-01', 3, 'Which component manages memory, processes and drivers?', '["The shell", "The kernel", "The taskbar", "The registry"]'::jsonb, 1, 'The kernel is the core that manages system resources.'),
  ('windows-02', 1, 'For a user over the network, the effective access from NTFS + share permissions is…', '["Whichever is more permissive", "The most restrictive of the two", "Always full control", "Share permissions only"]'::jsonb, 1, 'Combined NTFS and share permissions resolve to the most restrictive.'),
  ('windows-02', 2, 'An explicit Deny on NTFS…', '["Is ignored", "Overrides an Allow", "Applies only to admins", "Cannot be set"]'::jsonb, 1, 'Explicit Deny takes precedence over Allow.'),
  ('windows-02', 3, 'User Account Control (UAC) exists to…', '["Speed up the PC", "Run with least privilege and prompt for elevation", "Disable the firewall", "Manage Wi-Fi"]'::jsonb, 1, 'UAC keeps tasks at standard rights until elevation is approved.'),
  ('windows-03', 1, 'Which hive stores settings for the currently logged-on user?', '["HKEY_LOCAL_MACHINE", "HKEY_CURRENT_USER", "HKEY_CLASSES_ROOT", "HKEY_USERS"]'::jsonb, 1, 'HKCU holds the active user''s settings.'),
  ('windows-03', 2, 'Machine-wide settings live under…', '["HKEY_CURRENT_USER", "HKEY_LOCAL_MACHINE", "HKEY_CLASSES_ROOT", "HKEY_CURRENT_CONFIG"]'::jsonb, 1, 'HKLM holds system-wide configuration.'),
  ('windows-03', 3, 'Before making bulk registry edits you should…', '["Nothing", "Export/back up the affected keys first", "Disable antivirus", "Reinstall Windows"]'::jsonb, 1, 'Always export a backup before editing the registry.'),
  ('windows-04', 1, 'A Windows service differs from a normal app because it…', '["Always shows a window", "Runs in the background, often UI-less, and can auto-start", "Can never be stopped", "Runs in the browser"]'::jsonb, 1, 'Services run in the background and can start at boot.'),
  ('windows-04', 2, 'To see which process is consuming CPU you''d use…', '["Registry Editor", "Task Manager / Resource Monitor", "Notepad", "Disk Cleanup"]'::jsonb, 1, 'Task Manager and Resource Monitor show per-process usage.'),
  ('windows-04', 3, 'Which console manages Windows services?', '["services.msc", "calc.exe", "the BIOS", "Notepad"]'::jsonb, 0, 'services.msc is the Services management console.'),
  ('windows-05', 1, 'Which command shows a Windows machine''s IP configuration?', '["ping", "ipconfig", "tracert", "netstat"]'::jsonb, 1, 'ipconfig displays the IP configuration.'),
  ('windows-05', 2, 'To test DNS name resolution specifically you''d use…', '["chkdsk", "nslookup", "sfc", "diskpart"]'::jsonb, 1, 'nslookup queries DNS directly.'),
  ('windows-05', 3, 'Releasing and renewing a DHCP lease uses…', '["ipconfig /release and ipconfig /renew", "ping -t", "tracert", "netstat -an"]'::jsonb, 0, 'ipconfig /release then /renew cycles the DHCP lease.'),
  ('windows-06', 1, 'Which Event Viewer log records logon and audit events?', '["Application", "Security", "Setup", "Forwarded Events"]'::jsonb, 1, 'The Security log holds logon/audit events.'),
  ('windows-06', 2, 'Driver and service errors appear primarily in the…', '["Security log", "System log", "Application log", "DNS log"]'::jsonb, 1, 'The System log captures OS/driver/service events.'),
  ('windows-06', 3, 'An Event ID is useful because it…', '["Is random", "Uniquely identifies an event type for searching", "Sets permissions", "Is the user''s name"]'::jsonb, 1, 'Event IDs let you search and match known issues.');
