-- 0034_seed_labs_networking.sql — two Networking capstone labs (sysadmin track). Idempotent.
-- Command/answer matching is case-insensitive (LabPlayer uses RegExp(pattern,'i')).

-- ── Lab 1: Subnetting practice (answer-input) ──
insert into public.labs (id, slug, title, track, intro, est_minutes, bonus_xp, sort) values
('lab-nw-subnet', 'subnetting-practice', 'Lab: Subnetting practice', 'sysadmin',
 'Answer each subnetting question with the exact value (an address, mask, or number). Work it out with the block-size method: block = 256 − mask octet. Answers are checked exactly.',
 12, 80, 6)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, track=excluded.track,
  intro=excluded.intro, est_minutes=excluded.est_minutes, bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.lab_steps where lab_id='lab-nw-subnet';
insert into public.lab_steps (lab_id, sort, instruction, accept_pattern, output, hint) values
('lab-nw-subnet', 1, 'What is the NETWORK address of 192.168.10.37/27? (block size 256−224 = 32)',
  '^\s*192\.168\.10\.32\s*$', 'Correct — .37 falls in the 192.168.10.32 subnet.',
  'Subnets start at multiples of 32: .0, .32, .64 … which block holds .37?'),
('lab-nw-subnet', 2, 'What is the BROADCAST address of 192.168.10.37/27?',
  '^\s*192\.168\.10\.63\s*$', 'Correct — broadcast is one below the next subnet (.64 − 1 = .63).',
  'Broadcast = next subnet boundary minus one.'),
('lab-nw-subnet', 3, 'How many USABLE hosts does a /27 provide?',
  '^\s*30\s*$', 'Correct — 2^5 − 2 = 30.',
  'Host bits = 32 − 27 = 5; usable = 2^5 − 2.'),
('lab-nw-subnet', 4, 'What is the NETWORK address of 10.20.30.100/26? (block size 64)',
  '^\s*10\.20\.30\.64\s*$', 'Correct — .100 falls in the .64 subnet (.64–.127).',
  'Blocks of 64: .0, .64, .128, .192 — which holds .100?'),
('lab-nw-subnet', 5, 'What subnet MASK does a /26 use?',
  '^\s*255\.255\.255\.192\s*$', 'Correct — 26 bits → 255.255.255.192.',
  'Last octet: 11000000 = 192.'),
('lab-nw-subnet', 6, 'What is the BROADCAST address of 172.16.5.200/28? (block size 16)',
  '^\s*172\.16\.5\.207\s*$', 'Correct — .200 is in .192; broadcast .207.',
  'Blocks of 16: …176, 192, 208 — .200 sits in .192–.207.'),
('lab-nw-subnet', 7, 'How many usable hosts does a /30 provide? (point-to-point links)',
  '^\s*2\s*$', 'Correct — /30 gives exactly 2 usable hosts.',
  '2^(32−30) − 2 = 2.');

-- ── Lab 2: Network troubleshooting from the command line ──
insert into public.labs (id, slug, title, track, intro, est_minutes, bonus_xp, sort) values
('lab-nw-cli', 'network-cli-troubleshooting', 'Lab: Network troubleshooting from the command line', 'sysadmin',
 'Walk the classic bottom-up path — check your own config, reach the gateway, trace outward, and confirm DNS. Output is simulated; command matching is not case-sensitive.',
 10, 70, 7)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, track=excluded.track,
  intro=excluded.intro, est_minutes=excluded.est_minutes, bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.lab_steps where lab_id='lab-nw-cli';
insert into public.lab_steps (lab_id, sort, instruction, accept_pattern, output, hint) values
('lab-nw-cli', 1, 'Show your IP configuration — address, gateway, and DNS.',
  '^\s*(ipconfig|ifconfig|ip\s+a(ddr)?)\b.*$',
  'IPv4 Address. . . : 192.168.1.50\nSubnet Mask . . . : 255.255.255.0\nDefault Gateway . : 192.168.1.1\nDNS Servers . . . : 192.168.1.1',
  'Windows: ipconfig /all — Linux: ip addr or ifconfig.'),
('lab-nw-cli', 2, 'Test connectivity to your default gateway (ping it).',
  '^\s*ping\s+\S+.*$',
  'Reply from 192.168.1.1: bytes=32 time=1ms TTL=64\nReply from 192.168.1.1: bytes=32 time=1ms TTL=64',
  'ping 192.168.1.1 — confirms local layer-3 reachability.'),
('lab-nw-cli', 3, 'Trace the path to a public address (8.8.8.8) to see where traffic goes.',
  '^\s*(tracert|traceroute)\s+\S+.*$',
  '1  192.168.1.1   1 ms\n2  10.0.0.1      8 ms\n3  8.8.8.8       12 ms',
  'Windows: tracert 8.8.8.8 — Linux/macOS: traceroute 8.8.8.8.'),
('lab-nw-cli', 4, 'Confirm DNS is resolving a name to an address.',
  '^\s*(nslookup|dig)\s+\S+.*$',
  'Server:  192.168.1.1\nName:    example.com\nAddress: 93.184.216.34',
  'nslookup example.com (or dig example.com).'),
('lab-nw-cli', 5, 'View the ARP cache to see local MAC-to-IP mappings.',
  '^\s*arp\s+-a\b.*$',
  'Internet Address   Physical Address\n192.168.1.1        00-1a-2b-3c-4d-5e',
  'arp -a lists learned MAC/IP pairs.'),
('lab-nw-cli', 6, 'List active connections and listening ports.',
  '^\s*netstat\s+\S+.*$',
  'Proto  Local Address      State\nTCP    192.168.1.50:443   ESTABLISHED\nTCP    0.0.0.0:3389       LISTENING',
  'netstat -an (Windows) or ss -tuln (Linux).');
