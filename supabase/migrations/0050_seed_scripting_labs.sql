-- 0050_seed_scripting_labs.sql — PowerShell + Python hands-on labs. Idempotent.
-- Command matching is case-insensitive (LabPlayer uses RegExp(pattern,'i')).

insert into public.labs (id, slug, title, track, intro, est_minutes, bonus_xp, sort) values
('lab-sc-ps', 'powershell-pipeline', 'Lab: PowerShell — discover, filter, export', 'scripting',
 'Use PowerShell the way admins do: discover a command, list processes, filter and shape objects on the pipeline, and export to CSV. Output is simulated; commands are not case-sensitive.',
 10, 70, 10)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, track=excluded.track,
  intro=excluded.intro, est_minutes=excluded.est_minutes, bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.lab_steps where lab_id='lab-sc-ps';
insert into public.lab_steps (lab_id, sort, instruction, accept_pattern, output, hint) values
('lab-sc-ps', 1, 'Discover commands that work with processes.',
  '^\s*get-command\s+.*process.*$', 'CommandType  Name\n-----------  ----\nCmdlet       Get-Process\nCmdlet       Stop-Process\nCmdlet       Start-Process',
  'Get-Command *process*'),
('lab-sc-ps', 2, 'List the running processes.',
  '^\s*get-process\s*$', 'Handles  CPU(s)  Id  ProcessName\n-------  ------  --  -----------\n    512   142.3  10  chrome\n    233    88.1  22  code',
  'Get-Process'),
('lab-sc-ps', 3, 'Filter to processes using more than 100 CPU.',
  '^\s*get-process\s*\|\s*where-object\s+cpu\s+-gt\s+100\b.*$', 'chrome   142.3\n', 'Get-Process | Where-Object CPU -gt 100'),
('lab-sc-ps', 4, 'Show only the Name and CPU columns.',
  '^\s*get-process\s*\|\s*select-object\s+name.*cpu.*$', 'Name    CPU\n----    ---\nchrome  142.3\ncode     88.1',
  'Get-Process | Select-Object Name, CPU'),
('lab-sc-ps', 5, 'Export the processes to a CSV file.',
  '^\s*get-process\s*\|.*export-csv.*$', 'CSV written: processes.csv', 'Get-Process | Export-Csv processes.csv -NoTypeInformation');

insert into public.labs (id, slug, title, track, intro, est_minutes, bonus_xp, sort) values
('lab-sc-py', 'python-basics', 'Lab: Python — from REPL to a script', 'scripting',
 'Run Python end to end: check the version, print in the REPL, loop, install a package, and run a script. Output is simulated; commands are not case-sensitive.',
 10, 70, 11)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, track=excluded.track,
  intro=excluded.intro, est_minutes=excluded.est_minutes, bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.lab_steps where lab_id='lab-sc-py';
insert into public.lab_steps (lab_id, sort, instruction, accept_pattern, output, hint) values
('lab-sc-py', 1, 'Check the installed Python version.',
  '^\s*python3?\s+--version\s*$', 'Python 3.12.1', 'python --version'),
('lab-sc-py', 2, 'In the REPL, print a greeting.',
  '^\s*print\(.+\)\s*$', 'Hello, automation!', 'print(''Hello, automation!'')'),
('lab-sc-py', 3, 'Start a for loop over a range of numbers.',
  '^\s*for\s+\w+\s+in\s+range\(.+\)\s*:.*$', '0\n1\n2\n3\n4', 'for i in range(5):'),
('lab-sc-py', 4, 'Install the requests package.',
  '^\s*pip3?\s+install\s+\w+.*$', 'Successfully installed requests', 'pip install requests'),
('lab-sc-py', 5, 'Run your script file.',
  '^\s*python3?\s+\S+\.py\b.*$', 'Script finished: 3 records processed.', 'python automate.py');
