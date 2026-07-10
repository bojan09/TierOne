-- 0057_seed_labs_gap_fill.sql — Phase 6.3. Closes the biggest lab-coverage gaps:
-- Help Desk Tier-0 (hd-essentials/hd-everyday/hd-tier1-win) had ZERO labs despite
-- being the largest course group; CompTIA A+ had labs for only 2 of 6 domains
-- (hardware + security untouched); Scripting had only the two basics labs (no
-- lab past sc-ps-06/sc-py-06 despite 25 lessons each). Idempotent, mirrors the
-- exact pattern of 0050/0051 (LabPlayer matches accept_pattern case-insensitively).

insert into public.labs (id, slug, title, track, intro, est_minutes, bonus_xp, sort) values
('lab-hd-tier0', 'tier0-support-toolkit', 'Lab: Tier-0 Support Toolkit', 'helpdesk',
 'The first commands a Tier-0 tech reaches for before escalating a ticket: check the machine, check the network, force a policy refresh, repair system files. Output is simulated; commands are not case-sensitive.',
 10, 60, 14)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, track=excluded.track,
  intro=excluded.intro, est_minutes=excluded.est_minutes, bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.lab_steps where lab_id='lab-hd-tier0';
insert into public.lab_steps (lab_id, sort, instruction, accept_pattern, output, hint) values
('lab-hd-tier0', 1, 'Pull a full system info summary — OS version, install date, memory.',
  '^\s*systeminfo\s*$', 'OS Name:      Microsoft Windows 11 Pro\nOS Version:   10.0.22631\nTotal Physical Memory: 16,105 MB', 'systeminfo'),
('lab-hd-tier0', 2, 'Show the full network configuration — IP, gateway, DNS.',
  '^\s*ipconfig\s+/all\s*$', 'Ethernet adapter:\n  IPv4 Address. . : 192.168.1.44\n  Default Gateway : 192.168.1.1\n  DNS Servers . . : 192.168.1.1', 'ipconfig /all'),
('lab-hd-tier0', 3, 'Confirm the machine can reach the internet.',
  '^\s*ping\s+\S+.*$', 'Reply from 8.8.8.8: bytes=32 time=14ms TTL=118\nReply from 8.8.8.8: bytes=32 time=13ms TTL=118', 'ping 8.8.8.8'),
('lab-hd-tier0', 4, 'Force the machine to pull the latest Group Policy — the classic "have you tried" fix.',
  '^\s*gpupdate\s*(/force)?\s*$', 'Updating policy...\nComputer Policy update has completed successfully.\nUser Policy update has completed successfully.', 'gpupdate /force'),
('lab-hd-tier0', 5, 'Scan and repair protected Windows system files.',
  '^\s*sfc\s+/scannow\s*$', 'Beginning system scan. This process will take some time.\nWindows Resource Protection found corrupt files and repaired them.', 'sfc /scannow');

insert into public.labs (id, slug, title, track, intro, est_minutes, bonus_xp, sort) values
('lab-ca-hardware', 'hardware-diagnostics', 'Lab: Hardware Diagnostics', 'comptia',
 'Diagnose hardware from the command line the way A+ expects: drivers, disk health, installed updates, battery. Output is simulated; commands are not case-sensitive.',
 10, 60, 15)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, track=excluded.track,
  intro=excluded.intro, est_minutes=excluded.est_minutes, bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.lab_steps where lab_id='lab-ca-hardware';
insert into public.lab_steps (lab_id, sort, instruction, accept_pattern, output, hint) values
('lab-ca-hardware', 1, 'List all installed device drivers.',
  '^\s*driverquery\s*.*$', 'Module Name  Display Name         Driver Type\n-----------  --------------------  -----------\nnvlddmkm     NVIDIA Display Driver  Kernel', 'driverquery'),
('lab-ca-hardware', 2, 'Pull a hardware/OS summary for the machine.',
  '^\s*systeminfo\s*$', 'System Manufacturer: Dell Inc.\nSystem Model:        Latitude 5420\nTotal Physical Memory: 16,105 MB', 'systeminfo'),
('lab-ca-hardware', 3, 'Check the health status of the disk drive.',
  '^\s*wmic\s+diskdrive\s+get\s+status.*$', 'Status\nOK', 'wmic diskdrive get status'),
('lab-ca-hardware', 4, 'List installed hotfixes and updates.',
  '^\s*wmic\s+qfe\s+(list|get\s+.+)\s*$', 'HotFixID   InstalledOn\nKB5034441  2/13/2024\nKB5034763  3/12/2024', 'wmic qfe list'),
('lab-ca-hardware', 5, 'Generate a battery health report on a laptop.',
  '^\s*powercfg\s+/batteryreport.*$', 'Battery life report saved to battery-report.html\nDesign Capacity:  58,000 mWh\nFull Charge Capacity: 51,200 mWh', 'powercfg /batteryreport');

insert into public.labs (id, slug, title, track, intro, est_minutes, bonus_xp, sort) values
('lab-ca-sec', 'security-basics', 'Lab: Security Basics', 'comptia',
 'Spot suspicious activity and lock things down from the command line — connections, processes, firewall, and a malware scan. Output is simulated; commands are not case-sensitive.',
 10, 60, 16)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, track=excluded.track,
  intro=excluded.intro, est_minutes=excluded.est_minutes, bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.lab_steps where lab_id='lab-ca-sec';
insert into public.lab_steps (lab_id, sort, instruction, accept_pattern, output, hint) values
('lab-ca-sec', 1, 'List active connections and listening ports.',
  '^\s*netstat\s+-\w*a\w*n\w*.*$', 'Proto  Local Address     Foreign Address    State\nTCP    0.0.0.0:445       0.0.0.0:0          LISTENING\nTCP    192.168.1.44:51022 203.0.113.9:443   ESTABLISHED', 'netstat -ano'),
('lab-ca-sec', 2, 'List running processes to spot anything unusual.',
  '^\s*tasklist\s*.*$', 'Image Name          PID   Session Name  Mem Usage\nsvchost.exe         4821  Services         12,340 K\nunusual_miner.exe   6650  Console          88,204 K', 'tasklist'),
('lab-ca-sec', 3, 'Terminate the suspicious process by its PID.',
  '^\s*taskkill\s+/pid\s+\d+\s+/f\s*$', 'SUCCESS: The process with PID 6650 has been terminated.', 'taskkill /PID 6650 /F'),
('lab-ca-sec', 4, 'Confirm the firewall is enabled on every profile.',
  '^\s*netsh\s+advfirewall\s+show\s+allprofiles\s*$', 'Domain Profile Settings:\n  State  ON\nPrivate Profile Settings:\n  State  ON\nPublic Profile Settings:\n  State  ON', 'netsh advfirewall show allprofiles'),
('lab-ca-sec', 5, 'Run a full malware scan.',
  '^\s*mpcmdrun(\.exe)?\s+-scan\s+-scantype\s+2\s*$', 'Scan starting...\nScan finished.\nNo threats detected.', 'MpCmdRun.exe -Scan -ScanType 2');

insert into public.labs (id, slug, title, track, intro, est_minutes, bonus_xp, sort) values
('lab-sc-ps-json', 'powershell-json-apis', 'Lab: PowerShell — JSON & REST APIs', 'scripting',
 'Pull data from a REST API and work with JSON the way a real automation script does — call, parse, reshape, save, and reload. Output is simulated; commands are not case-sensitive.',
 10, 70, 17)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, track=excluded.track,
  intro=excluded.intro, est_minutes=excluded.est_minutes, bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.lab_steps where lab_id='lab-sc-ps-json';
insert into public.lab_steps (lab_id, sort, instruction, accept_pattern, output, hint) values
('lab-sc-ps-json', 1, 'Call a REST endpoint and get the response.',
  '^\s*invoke-restmethod\s+-uri\s+\S+.*$', 'status   count\n------   -----\nok       42', 'Invoke-RestMethod -Uri https://api.example.com/status'),
('lab-sc-ps-json', 2, 'Convert a JSON string into a PowerShell object.',
  '^\s*.*convertfrom-json.*$', 'status : ok\ncount  : 42', '$data = $json | ConvertFrom-Json'),
('lab-sc-ps-json', 3, 'Convert a PowerShell object back into JSON text.',
  '^\s*.*convertto-json.*$', '{\n  "status": "ok",\n  "count": 42\n}', '$data | ConvertTo-Json'),
('lab-sc-ps-json', 4, 'Save the JSON to a file on disk.',
  '^\s*.*(out-file|set-content)\s+.*\.json.*$', 'File written: status.json', '$data | ConvertTo-Json | Set-Content status.json'),
('lab-sc-ps-json', 5, 'Read the JSON file back and inspect the status property.',
  '^\s*.*get-content\s+.*\.json.*\|.*convertfrom-json.*$', 'ok', '(Get-Content status.json | ConvertFrom-Json).status');
