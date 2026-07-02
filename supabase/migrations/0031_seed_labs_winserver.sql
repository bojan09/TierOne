-- 0031_seed_labs_winserver.sql — two Windows Server capstone labs (in-browser PowerShell sim, sysadmin track).
-- Idempotent: upsert lab, clear its steps, reseed. Command matching is case-insensitive.

-- ── Lab 1: Active Directory bulk administration with PowerShell ──
insert into public.labs (id, slug, title, track, intro, est_minutes, bonus_xp, sort) values
('lab-ws-ad-ps', 'ad-bulk-powershell', 'Lab: Bulk Active Directory administration with PowerShell', 'sysadmin',
 'You are on a domain controller''s PowerShell console. Work through the commands an administrator uses to manage Active Directory at scale — from loading the module to creating users in bulk and resetting a password. Output is simulated; command matching is not case-sensitive.',
 12, 70, 4)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, track=excluded.track,
  intro=excluded.intro, est_minutes=excluded.est_minutes, bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.lab_steps where lab_id='lab-ws-ad-ps';
insert into public.lab_steps (lab_id, sort, instruction, accept_pattern, output, hint) values
('lab-ws-ad-ps', 1, 'Load the Active Directory PowerShell module.',
  '^\s*import-module\s+activedirectory\s*$',
  'ModuleType Version Name\n---------- ------- ----\nManifest   1.0.1.0 ActiveDirectory',
  'Use Import-Module followed by the module name ActiveDirectory.'),
('lab-ws-ad-ps', 2, 'List all Active Directory user accounts (filter for everything).',
  '^\s*get-aduser\s+-filter\s+\*\s*$',
  'DistinguishedName : CN=Raj Patel,OU=Staff,DC=corp,DC=example,DC=com\nEnabled           : True\nName              : Raj Patel\n... (42 users)',
  'Get-ADUser -Filter * returns every user.'),
('lab-ws-ad-ps', 3, 'Preview creating a new user WITHOUT making the change (a safe dry run).',
  '^\s*new-aduser\s+.*-whatif\s*$',
  'What if: Performing the operation "New-ADUser" on target "CN=Test User,...".',
  'Append -WhatIf to New-ADUser to preview the action.'),
('lab-ws-ad-ps', 4, 'Create users in bulk by piping a CSV into New-ADUser.',
  '^\s*import-csv\s+.+\|\s*.*new-aduser.*$',
  'Created: jsmith\nCreated: alee\nCreated: mgomez\n3 user(s) created.',
  'Import-Csv .\\users.csv | ForEach-Object { New-ADUser ... }'),
('lab-ws-ad-ps', 5, 'Add a user to a security group.',
  '^\s*add-adgroupmember\s+.+$',
  'jsmith added to group GG_Sales.',
  'Use Add-ADGroupMember -Identity <group> -Members <user>.'),
('lab-ws-ad-ps', 6, 'Reset a user''s password.',
  '^\s*set-adaccountpassword\s+.+$',
  'Password for jsmith has been reset.',
  'Use Set-ADAccountPassword -Identity <user> -Reset ...'),
('lab-ws-ad-ps', 7, 'Confirm a single user account and its enabled status.',
  '^\s*get-aduser\s+\S+.*$',
  'Name    : jsmith\nEnabled : True\nSamAccountName : jsmith',
  'Get-ADUser <samAccountName> shows one account.');

-- ── Lab 2: Stand up DNS and DHCP with PowerShell ──
insert into public.labs (id, slug, title, track, intro, est_minutes, bonus_xp, sort) values
('lab-ws-dns-dhcp', 'dns-dhcp-powershell', 'Lab: Stand up DNS and DHCP with PowerShell', 'sysadmin',
 'A new branch server needs core network services. Install and configure DNS and DHCP from PowerShell, the way it is done at scale. Output is simulated; command matching is not case-sensitive.',
 12, 70, 5)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, track=excluded.track,
  intro=excluded.intro, est_minutes=excluded.est_minutes, bonus_xp=excluded.bonus_xp, sort=excluded.sort;
delete from public.lab_steps where lab_id='lab-ws-dns-dhcp';
insert into public.lab_steps (lab_id, sort, instruction, accept_pattern, output, hint) values
('lab-ws-dns-dhcp', 1, 'Install the DNS Server role including its management tools.',
  '^\s*install-windowsfeature\s+dns.*$',
  'Success Restart Needed Exit Code\n------- -------------- ---------\nTrue    No             Success',
  'Install-WindowsFeature DNS -IncludeManagementTools'),
('lab-ws-dns-dhcp', 2, 'Create a primary forward lookup zone for corp.example.com.',
  '^\s*add-dnsserverprimaryzone\s+.+$',
  'Primary zone corp.example.com created (AD-integrated).',
  'Add-DnsServerPrimaryZone -Name corp.example.com ...'),
('lab-ws-dns-dhcp', 3, 'Add an A record for a host in that zone.',
  '^\s*add-dnsserverresourcerecorda\s+.+$',
  'A record srv01.corp.example.com -> 10.0.0.10 added.',
  'Add-DnsServerResourceRecordA -Name srv01 -ZoneName corp.example.com -IPv4Address 10.0.0.10'),
('lab-ws-dns-dhcp', 4, 'Install the DHCP Server role including its management tools.',
  '^\s*install-windowsfeature\s+dhcp.*$',
  'Success Restart Needed Exit Code\n------- -------------- ---------\nTrue    No             Success',
  'Install-WindowsFeature DHCP -IncludeManagementTools'),
('lab-ws-dns-dhcp', 5, 'Create a DHCP IPv4 scope for the branch subnet.',
  '^\s*add-dhcpserverv4scope\s+.+$',
  'Scope 10.0.0.0 (Branch-LAN) created, range 10.0.0.100-10.0.0.200.',
  'Add-DhcpServerv4Scope -Name Branch-LAN -StartRange 10.0.0.100 -EndRange 10.0.0.200 -SubnetMask 255.255.255.0'),
('lab-ws-dns-dhcp', 6, 'Reserve a fixed address for a printer by its MAC.',
  '^\s*add-dhcpserverv4reservation\s+.+$',
  'Reservation 10.0.0.150 -> AA-BB-CC-DD-EE-FF added.',
  'Add-DhcpServerv4Reservation -ScopeId 10.0.0.0 -IPAddress 10.0.0.150 -ClientId AABBCCDDEEFF'),
('lab-ws-dns-dhcp', 7, 'List the DHCP scopes to confirm your work.',
  '^\s*get-dhcpserverv4scope\s*$',
  'ScopeId   Name       State  StartRange   EndRange\n-------   ----       -----  ----------   --------\n10.0.0.0  Branch-LAN Active 10.0.0.100   10.0.0.200',
  'Get-DhcpServerv4Scope lists configured scopes.');
