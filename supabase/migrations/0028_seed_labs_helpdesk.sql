-- 0028_seed_labs_helpdesk.sql — two Help Desk command-line labs (in-browser sim).
-- Idempotent: upsert lab, clear its steps, reseed.

-- ── Lab 1: connectivity diagnosis ──
insert into public.labs (id, slug, title, track, intro, est_minutes, bonus_xp, sort) values
('lab-net-cli', 'diagnose-connectivity-cli', 'Lab: Diagnose connectivity from the command line', 'helpdesk',
 'A user reports that websites will not load. You are at a Windows command prompt on their PC. Work through the checks a technician runs to isolate a connectivity problem, one command per step. Output is simulated.',
 10, 50, 2)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, track=excluded.track,
  intro=excluded.intro, est_minutes=excluded.est_minutes, bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.lab_steps where lab_id='lab-net-cli';
insert into public.lab_steps (lab_id, sort, instruction, accept_pattern, output, hint) values
('lab-net-cli', 1, 'Show the full network configuration — IP address, default gateway, and DNS servers.',
  '^\s*ipconfig\s*(/all)?\s*$',
  'IPv4 Address . . . . . . : 192.168.1.42
Default Gateway . . . . . : 192.168.1.1
DNS Servers . . . . . . . : 192.168.1.1',
  'The command starts with ipconfig (optionally /all).'),
('lab-net-cli', 2, 'Check whether the default gateway is reachable.',
  '^\s*ping\s+192\.168\.1\.1\s*$',
  'Reply from 192.168.1.1: bytes=32 time=1ms TTL=64',
  'ping the gateway address 192.168.1.1'),
('lab-net-cli', 3, 'Check whether the internet is reachable by IP address.',
  '^\s*ping\s+8\.8\.8\.8\s*$',
  'Reply from 8.8.8.8: bytes=32 time=14ms TTL=118',
  'ping a public IP such as 8.8.8.8'),
('lab-net-cli', 4, 'Test whether names resolve — query DNS for a domain.',
  '^\s*nslookup\s+\S+\s*$',
  'Server:  dns.local
Name:    example.com
Address: 93.184.216.34',
  'use nslookup followed by a domain name, e.g. nslookup example.com'),
('lab-net-cli', 5, 'Clear the DNS resolver cache (a common fix for name-resolution issues).',
  '^\s*ipconfig\s*/flushdns\s*$',
  'Successfully flushed the DNS Resolver Cache.',
  'ipconfig /flushdns'),
('lab-net-cli', 6, 'Renew the DHCP lease to pull fresh network settings.',
  '^\s*ipconfig\s*/renew\s*$',
  'IPv4 Address . . . . . . : 192.168.1.42 (lease renewed)',
  'ipconfig /renew');

-- ── Lab 2: Windows support toolkit ──
insert into public.labs (id, slug, title, track, intro, est_minutes, bonus_xp, sort) values
('lab-win-toolkit', 'windows-support-toolkit', 'Lab: Windows support command toolkit', 'helpdesk',
 'Get comfortable with the commands that answer the most common Windows support questions. Type each one at the prompt. Output is simulated.',
 8, 50, 3)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, track=excluded.track,
  intro=excluded.intro, est_minutes=excluded.est_minutes, bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.lab_steps where lab_id='lab-win-toolkit';
insert into public.lab_steps (lab_id, sort, instruction, accept_pattern, output, hint) values
('lab-win-toolkit', 1, 'Show this computer''s name.',
  '^\s*hostname\s*$', 'WS-DESIGN-07', 'one word: hostname'),
('lab-win-toolkit', 2, 'Show which user account you are signed in as.',
  '^\s*whoami\s*$', 'corp\raj', 'whoami'),
('lab-win-toolkit', 3, 'List the running processes.',
  '^\s*tasklist\s*$',
  'Image Name          PID    Mem Usage
chrome.exe          12345  318,204 K
outlook.exe          6789  142,880 K
teams.exe            4567  205,116 K',
  'tasklist'),
('lab-win-toolkit', 4, 'Check and repair protected Windows system files.',
  '^\s*sfc\s*/scannow\s*$',
  'Beginning system scan.
Windows Resource Protection did not find any integrity violations.',
  'sfc /scannow'),
('lab-win-toolkit', 5, 'Force the machine to reapply Group Policy.',
  '^\s*gpupdate\s*/force\s*$',
  'Updating policy...
Computer Policy update has completed successfully.
User Policy update has completed successfully.',
  'gpupdate /force');
