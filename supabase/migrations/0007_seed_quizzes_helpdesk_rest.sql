-- 0007_seed_quizzes_helpdesk_rest.sql — Phase 6.2. Quizzes for the remaining
-- 10 Help Desk lessons (original questions, aligned to A+/Tier-1 scope). Idempotent.

insert into public.lesson_quizzes (lesson_id, pass_pct, bonus_xp) values
  ('hwos-01', 70, 25),
  ('hwos-02', 70, 25),
  ('hwos-03', 70, 25),
  ('net-01', 70, 25),
  ('net-02', 70, 25),
  ('net-03', 70, 25),
  ('work-01', 70, 25),
  ('work-02', 70, 25),
  ('work-03', 70, 25),
  ('work-04', 70, 25)
on conflict (lesson_id) do update set pass_pct=excluded.pass_pct, bonus_xp=excluded.bonus_xp;

delete from public.quiz_questions where lesson_id in ('hwos-01', 'hwos-02', 'hwos-03', 'net-01', 'net-02', 'net-03', 'work-01', 'work-02', 'work-03', 'work-04');

insert into public.quiz_questions (lesson_id, sort, prompt, options, correct_index, explanation) values
  ('hwos-01', 1, 'A user reports a very slow PC with apps freezing. Most likely hardware cause?', '["The GPU", "Too little RAM or a failing/full drive", "The motherboard battery", "The keyboard"]'::jsonb, 1, 'Slowness and freezing usually trace to memory pressure or a failing/full disk.'),
  ('hwos-01', 2, 'No display on the monitor, but the PC is powered on. Best first suspects?', '["The amount of RAM", "Cable, monitor input, or GPU connection", "CPU temperature", "Free disk space"]'::jsonb, 1, 'No-display issues are usually the video path: cable, input source, or GPU seating.'),
  ('hwos-01', 3, 'Which component stores the operating system and user files?', '["RAM", "CPU", "Storage (SSD/HDD)", "Power supply"]'::jsonb, 2, 'Persistent data lives on storage; RAM is volatile working memory.'),
  ('hwos-02', 1, 'What does an operating system primarily do?', '["Only run a browser", "Manage hardware, processes, users and services", "Replace the BIOS", "Provide the internet"]'::jsonb, 1, 'The OS is the layer that manages resources, processes, users and services.'),
  ('hwos-02', 2, 'A single application is frozen. Cleanest first step?', '["Reinstall the OS", "End that process and relaunch the app", "Replace the RAM", "Reset the network"]'::jsonb, 1, 'End the hung process and relaunch before anything drastic.'),
  ('hwos-02', 3, 'Which Windows tool shows live resource usage?', '["Event Viewer", "Task Manager", "Disk Cleanup", "Notepad"]'::jsonb, 1, 'Task Manager shows CPU/memory/disk and running processes.'),
  ('hwos-03', 1, 'A user suddenly can''t open a shared folder. Most common cause?', '["The folder was deleted", "They were removed from (or never in) the right group", "The OS is corrupt", "Their RAM failed"]'::jsonb, 1, 'Access loss is usually group membership, not corruption.'),
  ('hwos-03', 2, 'Granting access to groups instead of individuals is preferred because…', '["It''s the only option", "It scales and is far easier to manage", "It''s faster for the CPU", "Users prefer it"]'::jsonb, 1, 'Group-based access scales and is maintainable.'),
  ('hwos-03', 3, 'The principle of least privilege means…', '["Give everyone admin", "Grant exactly the access needed, no more", "Remove all access", "Only managers get access"]'::jsonb, 1, 'Least privilege limits blast radius from error or compromise.'),
  ('net-01', 1, 'A device pings public IP addresses fine, but no website names load. Likely problem?', '["Default gateway", "DNS", "Subnet mask", "Power"]'::jsonb, 1, 'Names failing while IPs work is the classic DNS symptom.'),
  ('net-01', 2, 'What automatically assigns a device its IP address on most networks?', '["DNS", "DHCP", "NAT", "VPN"]'::jsonb, 1, 'DHCP leases addresses automatically.'),
  ('net-01', 3, 'The default gateway is…', '["The DNS server", "The router \u2014 the way out to other networks", "A firewall password", "The Wi-Fi name"]'::jsonb, 1, 'The gateway is the router that forwards traffic off the local network.'),
  ('net-02', 1, 'A PC shows a 169.254.x.x address. What does that indicate?', '["Normal internet access", "DHCP failed to assign an address", "DNS is down", "A VPN is active"]'::jsonb, 1, '169.254.x.x is APIPA — the device got no DHCP lease.'),
  ('net-02', 2, 'On the connectivity ladder, where do you stop?', '["At the top, always", "At the first rung that fails", "At DNS only", "You never stop"]'::jsonb, 1, 'The first failing rung is where the problem lives.'),
  ('net-02', 3, 'Able to ping IPs but not names points to…', '["The physical layer", "DNS", "The power supply", "The monitor"]'::jsonb, 1, 'Numbers work, names don''t → name resolution (DNS).'),
  ('net-03', 1, 'A user''s VPN won''t connect. First thing to check?', '["Reinstall Windows", "Whether the internet works without the VPN", "Their RAM", "The printer"]'::jsonb, 1, 'No underlying internet means it''s a connectivity problem, not a VPN one.'),
  ('net-03', 2, '''Connected'' to Wi-Fi but no internet at a hotel usually means…', '["Hardware failure", "A captive-portal login wasn''t completed", "The CPU overheated", "The DNS cache is full"]'::jsonb, 1, 'Hotel/airport Wi-Fi needs the portal login finished.'),
  ('net-03', 3, 'Everything is slow while on the VPN. This is usually…', '["A virus", "Expected \u2014 all traffic routes through the tunnel", "A failing disk", "A DNS error"]'::jsonb, 1, 'Full-tunnel VPNs route everything, which can slow things; often expected.'),
  ('work-01', 1, 'Which is the single most frequent Tier-1 Active Directory task?', '["Designing OUs", "Password resets", "Editing Group Policy", "Building domains"]'::jsonb, 1, 'Password resets dominate Tier-1 identity work.'),
  ('work-01', 2, 'An account keeps locking repeatedly. Usual root cause?', '["A failing CPU", "A cached old password on a device (phone, mapped drive)", "Low disk space", "A DNS error"]'::jsonb, 1, 'Stale cached credentials re-lock the account; fix the source.'),
  ('work-01', 3, 'Adding a user to a group typically…', '["Deletes their account", "Grants access to that group''s resources", "Resets their password", "Locks the account"]'::jsonb, 1, 'Group membership grants the group''s access.'),
  ('work-02', 1, 'An M365 app fails in the desktop client but works in the browser. This points to…', '["The service is down", "The local install or cached credentials", "A full network outage", "A tenant-wide licensing error"]'::jsonb, 1, 'Browser-works/app-fails isolates the problem to the local client.'),
  ('work-02', 2, 'Most Microsoft 365 problems begin at…', '["Printing", "Authentication \u2014 sign-in / MFA", "Disk space", "The mouse"]'::jsonb, 1, 'Auth is the common root; confirm sign-in/MFA first.'),
  ('work-02', 3, 'A user says OneDrive files are ''missing'' right after saving. Often it''s…', '["Permanent data loss", "Sync simply hasn''t completed yet", "A virus", "A failed CPU"]'::jsonb, 1, 'Sync isn''t instant; files usually appear once it catches up.'),
  ('work-03', 1, 'Outlook shows ''disconnected.'' After confirming the network, best diagnostic?', '["Reinstall Office", "Check the same account in webmail", "Replace the RAM", "Reset the router"]'::jsonb, 1, 'Webmail isolates client-vs-service quickly.'),
  ('work-03', 2, 'Mail works in webmail but not in Outlook. Most likely the problem is…', '["The mailbox/service", "The local client or cached credentials", "Company-wide DNS", "The user''s chair"]'::jsonb, 1, 'Webmail-OK means the mailbox is fine; suspect the local client.'),
  ('work-03', 3, 'For a delivery failure (bounce), you should…', '["Ignore it", "Read the bounce for the exact reason", "Delete the email", "Reset the password"]'::jsonb, 1, 'The bounce text states the precise cause.'),
  ('work-04', 1, 'What should you do first on a ticket, even before you have a fix?', '["Close it", "Acknowledge it and set expectations", "Escalate immediately", "Nothing"]'::jsonb, 1, 'A fast acknowledgement plus expectations beats silence.'),
  ('work-04', 2, 'A good escalation hands off…', '["Just the ticket number", "Symptom, scope, what you tried, and the results", "A guess", "Only the user''s name"]'::jsonb, 1, 'Give the next person the full trail.'),
  ('work-04', 3, 'With a frustrated user under pressure, the priority is…', '["Speed above all", "Empathy and clear communication, then the fix", "Technical jargon", "Avoiding them"]'::jsonb, 1, 'People calm when heard and informed; empathy first, then fix.');
