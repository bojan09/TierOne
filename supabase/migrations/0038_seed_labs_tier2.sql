-- 0038_seed_labs_tier2.sql — P20 Help Desk Tier 2 labs (helpdesk track). Idempotent.
-- Command matching is case-insensitive (LabPlayer uses RegExp(pattern,'i')).

-- ── Lab 1: Recover a locked-out account with PowerShell ──
insert into public.labs (id, slug, title, track, intro, est_minutes, bonus_xp, sort) values
('lab-t2-ad-unlock', 'ad-account-recovery', 'Lab: Recover a locked-out account (PowerShell)', 'helpdesk',
 'A user is locked out. Use the Active Directory PowerShell module to find the lockout, unlock the account, reset the password, and verify — the exact Tier 2 workflow. Output is simulated; commands are not case-sensitive.',
 10, 70, 8)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, track=excluded.track,
  intro=excluded.intro, est_minutes=excluded.est_minutes, bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.lab_steps where lab_id='lab-t2-ad-unlock';
insert into public.lab_steps (lab_id, sort, instruction, accept_pattern, output, hint) values
('lab-t2-ad-unlock', 1, 'Load the Active Directory module.',
  '^\s*import-module\s+activedirectory\s*$', 'ActiveDirectory module loaded.',
  'Import-Module ActiveDirectory'),
('lab-t2-ad-unlock', 2, 'Find all currently locked-out accounts.',
  '^\s*search-adaccount\s+-lockedout\b.*$',
  'Name        LockedOut\n----        ---------\njsmith      True',
  'Search-ADAccount -LockedOut'),
('lab-t2-ad-unlock', 3, 'Unlock the affected account (jsmith).',
  '^\s*unlock-adaccount\s+.+$', 'Account jsmith unlocked.',
  'Unlock-ADAccount -Identity jsmith'),
('lab-t2-ad-unlock', 4, 'Reset the password (they will change it at next logon).',
  '^\s*set-adaccountpassword\s+.+$', 'Password reset for jsmith.',
  'Set-ADAccountPassword -Identity jsmith -Reset ...'),
('lab-t2-ad-unlock', 5, 'Verify the account is enabled and no longer locked.',
  '^\s*get-aduser\s+\S+.*$',
  'Name : jsmith\nEnabled : True\nLockedOut : False',
  'Get-ADUser jsmith -Properties LockedOut,Enabled');

-- ── Lab 2: Repair Windows from the command line ──
insert into public.labs (id, slug, title, track, intro, est_minutes, bonus_xp, sort) values
('lab-t2-winre', 'windows-recovery-cli', 'Lab: Repair Windows from the command line', 'helpdesk',
 'A PC has corrupted system files and boot problems. Run the standard repair sequence a Tier 2 tech uses from an elevated prompt / WinRE. Output is simulated; commands are not case-sensitive.',
 10, 70, 9)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, track=excluded.track,
  intro=excluded.intro, est_minutes=excluded.est_minutes, bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.lab_steps where lab_id='lab-t2-winre';
insert into public.lab_steps (lab_id, sort, instruction, accept_pattern, output, hint) values
('lab-t2-winre', 1, 'Scan and repair protected system files.',
  '^\s*sfc\s+/scannow\s*$',
  'Beginning system scan...\nWindows Resource Protection found corrupt files and repaired them.',
  'sfc /scannow'),
('lab-t2-winre', 2, 'Repair the underlying Windows component image.',
  '^\s*dism\s+.*/restorehealth\b.*$',
  'Deployment Image Servicing and Management tool\nThe restore operation completed successfully.',
  'DISM /Online /Cleanup-Image /RestoreHealth'),
('lab-t2-winre', 3, 'Rebuild the boot configuration data.',
  '^\s*bootrec\s+/rebuildbcd\b.*$',
  'Scanning all disks for Windows installations...\nTotal identified Windows installations: 1\nThe operation completed successfully.',
  'bootrec /rebuildbcd'),
('lab-t2-winre', 4, 'Check the system drive for errors (fix on next boot).',
  '^\s*chkdsk\s+.+$',
  'Windows will check the disk on the next restart.',
  'chkdsk C: /f'),
('lab-t2-winre', 5, 'Confirm system files are now clean with a final scan.',
  '^\s*sfc\s+/verifyonly\s*$',
  'Windows Resource Protection did not find any integrity violations.',
  'sfc /verifyonly');
