-- 0015_seed_lab_linux_fs.sql — Phase 8 vertical slice lab.
-- "Navigate the Linux filesystem" — a scripted terminal exercise. Idempotent.

insert into public.labs (id, slug, title, track, intro, est_minutes, bonus_xp, sort) values
('lab-linux-fs', 'navigate-the-linux-filesystem', 'Lab: Navigate the Linux filesystem', 'sysadmin',
 'You are on a fresh Ubuntu server as the user "student". Work through each step by typing the command it asks for. Output is simulated — this is a safe practice shell.',
 10, 50, 1)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, intro=excluded.intro,
  est_minutes=excluded.est_minutes, bonus_xp=excluded.bonus_xp, sort=excluded.sort;

delete from public.lab_steps where lab_id = 'lab-linux-fs';

insert into public.lab_steps (lab_id, sort, instruction, accept_pattern, output, hint) values
('lab-linux-fs', 1, 'Print your current working directory.',
  '^\s*pwd\s*$', '/home/student', 'It is three letters: p-w-d.'),
('lab-linux-fs', 2, 'List the files in your home directory.',
  '^\s*ls(\s+-[la]+)?\s*$', 'Documents  Downloads  notes.txt', 'Use the ls command.'),
('lab-linux-fs', 3, 'Change into the system configuration directory, /etc.',
  '^\s*cd\s+/etc/?\s*$', '', 'Use cd followed by the path /etc.'),
('lab-linux-fs', 4, 'List the configuration files in /etc.',
  '^\s*ls(\s+-[la]+)?\s*$', 'hostname  hosts  passwd  ssh  systemd', 'ls again — you should see config files.'),
('lab-linux-fs', 5, 'Display the contents of the hosts file.',
  '^\s*cat\s+(/etc/)?hosts\s*$', '127.0.0.1   localhost
127.0.1.1   server01', 'Use cat on the hosts file.'),
('lab-linux-fs', 6, 'Return to your home directory.',
  '^\s*cd(\s+(~|/home/student))?\s*$', '', 'cd with no argument (or ~) goes home.');
