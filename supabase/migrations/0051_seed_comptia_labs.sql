-- 0051_seed_comptia_labs.sql — CompTIA A+ hands-on labs. Idempotent.
-- Command matching is case-insensitive (LabPlayer uses RegExp(pattern,'i')).

insert into public.labs (id, slug, title, track, intro, est_minutes, bonus_xp, sort) values
('lab-ca-win-cli', 'windows-command-line', 'Lab: Windows Command Line', 'comptia',
 'Practice the core Windows commands A+ expects: navigate, inspect the network, and run repair tools. Output is simulated; commands are not case-sensitive.',
 10, 60, 12)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, track=excluded.track,
  intro=excluded.intro, est_minutes=excluded.est_minutes, bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.lab_steps where lab_id='lab-ca-win-cli';
insert into public.lab_steps (lab_id, sort, instruction, accept_pattern, output, hint) values
('lab-ca-win-cli', 1, 'List the contents of the current directory.',
  '^\s*dir\b.*$', ' Directory of C:\\Users\\student\n\nDocuments\nDownloads\nreport.txt', 'dir'),
('lab-ca-win-cli', 2, 'Show the full network configuration.',
  '^\s*ipconfig\s+/all\s*$', 'Ethernet adapter:\n  IPv4 Address. . : 192.168.1.20\n  Default Gateway : 192.168.1.1\n  DNS Servers . . : 192.168.1.1', 'ipconfig /all'),
('lab-ca-win-cli', 3, 'Test connectivity to a public host.',
  '^\s*ping\s+\S+.*$', 'Reply from 8.8.8.8: bytes=32 time=12ms TTL=118\nReply from 8.8.8.8: bytes=32 time=11ms TTL=118', 'ping 8.8.8.8'),
('lab-ca-win-cli', 4, 'Scan and repair protected system files.',
  '^\s*sfc\s+/scannow\s*$', 'Windows Resource Protection found corrupt files and repaired them.', 'sfc /scannow'),
('lab-ca-win-cli', 5, 'Schedule a disk check with automatic fixing.',
  '^\s*chkdsk\s+.+$', 'Windows will check the disk on the next restart.', 'chkdsk C: /f');

insert into public.labs (id, slug, title, track, intro, est_minutes, bonus_xp, sort) values
('lab-ca-net-ts', 'network-troubleshooting', 'Lab: Network Troubleshooting', 'comptia',
 'Diagnose "no internet" the A+ way: check addressing, gateway, public reachability, then DNS. Output is simulated; commands are not case-sensitive.',
 10, 60, 13)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, track=excluded.track,
  intro=excluded.intro, est_minutes=excluded.est_minutes, bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.lab_steps where lab_id='lab-ca-net-ts';
insert into public.lab_steps (lab_id, sort, instruction, accept_pattern, output, hint) values
('lab-ca-net-ts', 1, 'Check the adapter''s IP, gateway, and DNS.',
  '^\s*ipconfig\s+/all\s*$', 'IPv4 Address. . : 192.168.1.20\nDefault Gateway : 192.168.1.1\nDNS Servers . . : 192.168.1.1', 'ipconfig /all'),
('lab-ca-net-ts', 2, 'Confirm you can reach the default gateway.',
  '^\s*ping\s+192\.168\.1\.1\s*$', 'Reply from 192.168.1.1: bytes=32 time=1ms TTL=64', 'ping 192.168.1.1'),
('lab-ca-net-ts', 3, 'Test reachability to a public IP (bypasses DNS).',
  '^\s*ping\s+8\.8\.8\.8\s*$', 'Reply from 8.8.8.8: bytes=32 time=12ms TTL=118', 'ping 8.8.8.8'),
('lab-ca-net-ts', 4, 'Resolve a name to test DNS (this is where it fails).',
  '^\s*nslookup\s+\S+.*$', '*** request to server timed out  (DNS not resolving)', 'nslookup example.com'),
('lab-ca-net-ts', 5, 'Clear the DNS resolver cache to fix stale records.',
  '^\s*ipconfig\s+/flushdns\s*$', 'Successfully flushed the DNS Resolver Cache.', 'ipconfig /flushdns');
