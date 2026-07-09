#!/usr/bin/env python3
"""Phase 3a: PowerShell 9 -> 17 lessons (admin automation coverage + capstone)."""
import json, pathlib
MAN=pathlib.Path('/home/claude/it-academy/scripts/manifests/p29.json'); man=json.loads(MAN.read_text())
def L(i,s,t,mi,x,intro,se,pr,q):return{"id":i,"slug":s,"title":t,"minutes":mi,"xp":x,"content":{"intro":intro,"sections":se,"practice":pr},"quiz":q}
def S(h,p=None,ul=None,note=None,code=None):
    d={"h":h}
    if p:d["p"]=p if isinstance(p,list) else [p]
    if ul:d["ul"]=ul
    if code:d["code"]=code
    if note:d["note"]=note
    return d
def Q(p,o,ci,ex):return{"p":p,"o":o,"ci":ci,"ex":ex}
def RW(t):return{"kind":"info","text":"In the real world: "+t}
PS=[
 L("sc-ps-10","files-folders","Files & Folder Automation",22,60,
  "Bulk file work is the bread and butter of scripting — enumerate, filter, and act on files at scale.",
  [S("Enumerate & filter",code="Get-ChildItem C:\\logs -Recurse -Filter *.log\nGet-ChildItem | Where-Object Length -gt 1MB\nGet-ChildItem -Directory   # folders only"),
   S("Act on files",code="Copy-Item a.txt D:\\backup\\\nMove-Item *.tmp C:\\temp\\\nRemove-Item old.log\nNew-Item -ItemType Directory -Path C:\\reports"),
   S("Clean-up pattern",code="# delete logs older than 30 days\nGet-ChildItem C:\\logs -Recurse -File |\n  Where-Object LastWriteTime -lt (Get-Date).AddDays(-30) |\n  Remove-Item -Force",note=RW("Automated log/temp cleanup on a schedule is one of the first scripts every admin writes — it reclaims disk before it becomes an outage.")),],
  "Write a pipeline that deletes .tmp files older than 7 days under C:\\temp.",
  [Q("List files recursively with…",["Get-Item","Get-ChildItem -Recurse","dir /s only","Find-File"],1,"Get-ChildItem -Recurse walks subfolders."),
   Q("Filter to files over 1MB uses…",["Where-Object Length -gt 1MB","Select big","-Large","Sort-Size"],0,"Where-Object filters on the Length property."),
   Q("(Get-Date).AddDays(-30) gives…",["30 days ahead","30 days ago","today","an error"],1,"Negative days subtract from now.")]),
 L("sc-ps-11","services-processes","Services & Processes",20,60,
  "Query and control Windows services and running processes — core troubleshooting automation.",
  [S("Services",code="Get-Service | Where-Object Status -eq 'Stopped'\nStart-Service Spooler\nRestart-Service Spooler\nSet-Service Spooler -StartupType Automatic"),
   S("Processes",code="Get-Process | Sort-Object CPU -Descending | Select-Object -First 5\nStop-Process -Name notepad -Force"),
   S("Health check",note=RW("A script that finds auto-start services which are stopped and restarts them keeps critical apps (print, backup agents) alive without a human noticing they fell over.")),],
  "Write a command to find all stopped services set to start automatically.",
  [Q("Restart a service with…",["Reset-Service","Restart-Service","Cycle-Service","Bounce-Service"],1,"Restart-Service stops then starts it."),
   Q("Kill a process by name…",["Stop-Process -Name","End-Task","Kill-Process","Remove-Process"],0,"Stop-Process -Name <n> -Force."),
   Q("Set a service to auto-start via…",["Set-Service -StartupType Automatic","Auto-Service","Enable-Service","Start-Type"],0,"Set-Service -StartupType Automatic.")]),
 L("sc-ps-12","events-registry","Event Logs & Registry",20,60,
  "Read the Windows event log and registry programmatically for diagnostics and configuration.",
  [S("Event logs",code="Get-WinEvent -LogName System -MaxEvents 20\nGet-WinEvent -FilterHashtable @{LogName='System'; Level=2}  # errors\nGet-EventLog -LogName Application -EntryType Error -Newest 10"),
   S("Registry",code="Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion'\nSet-ItemProperty 'HKCU:\\Software\\MyApp' -Name Mode -Value 'fast'\nNew-Item 'HKCU:\\Software\\MyApp'",note=RW("Pulling the last N System errors into a daily email means you spot a failing disk or driver before users report it.")),],
  "Write a command to pull the 10 most recent System error events.",
  [Q("Modern event querying uses…",["Get-WinEvent","Read-Log","Get-Text","Event-View"],0,"Get-WinEvent is the modern cmdlet."),
   Q("Registry is accessed via which drive prefix?",["C:\\","HKLM:\\ / HKCU:\\","REG:\\","SYS:\\"],1,"PowerShell exposes the registry as HKLM:/HKCU: drives."),
   Q("Level=2 in a System log filter means…",["Info","Warning","Error","Verbose"],2,"Level 2 = Error.")]),
 L("sc-ps-13","networking","Networking with PowerShell",20,60,
  "Test connectivity and inspect network config without leaving the shell.",
  [S("Connectivity",code="Test-Connection google.com -Count 2   # ping\nTest-NetConnection -ComputerName srv01 -Port 443\nResolve-DnsName example.com"),
   S("Config",code="Get-NetIPAddress\nGet-NetAdapter\nGet-DnsClientServerAddress"),
   S("Bulk reachability",note=RW("Test-NetConnection to a port (not just ping) tells you if a service is actually reachable through the firewall — the real question behind most 'is the server up?' tickets.")),],
  "Write a command to test whether port 443 is open on host srv01.",
  [Q("Ping in PowerShell is…",["Ping-Host","Test-Connection","Send-Ping","Net-Ping"],1,"Test-Connection sends ICMP echo."),
   Q("Test a specific TCP port with…",["Test-NetConnection -Port","Test-Port","Get-Port","Check-Port"],0,"Test-NetConnection -Port checks a port."),
   Q("Resolve a name to IP with…",["Resolve-DnsName","Get-DNS","Lookup-Name","Find-Host"],0,"Resolve-DnsName queries DNS.")]),
 L("sc-ps-14","ad-users","Active Directory & User Management",22,65,
  "Automate the user lifecycle in Active Directory — the highest-value admin automation.",
  [S("Query users",code="Import-Module ActiveDirectory\nGet-ADUser -Filter \"Enabled -eq 'True'\" -Properties LastLogonDate\nSearch-ADAccount -LockedOut\nSearch-ADAccount -AccountInactive -TimeSpan 90.00:00:00"),
   S("Manage",code="New-ADUser -Name 'Ada Byte' -SamAccountName abyte -Enabled $true\nSet-ADUser abyte -Department 'IT'\nAdd-ADGroupMember 'Helpdesk' -Members abyte\nDisable-ADAccount abyte"),
   S("Lifecycle",note=RW("Onboarding and offboarding are almost entirely scriptable — New-ADUser + group adds on hire, Disable-ADAccount + group removal on exit. This is a top interview talking point.")),],
  "Write a command to find AD accounts inactive for 90+ days.",
  [Q("Find locked-out accounts with…",["Search-ADAccount -LockedOut","Get-Locked","Find-Lock","AD-Locked"],0,"Search-ADAccount -LockedOut lists them."),
   Q("Add a user to a group via…",["Add-ADGroupMember","Join-Group","Set-Group","Group-Add"],0,"Add-ADGroupMember -Members."),
   Q("Offboarding disables an account with…",["Remove-ADUser","Disable-ADAccount","Stop-ADUser","Lock-Account"],1,"Disable-ADAccount disables without deleting.")]),
 L("sc-ps-15","scheduled-wmi","Scheduled Tasks & WMI/CIM",20,60,
  "Run scripts on a schedule and query deep system info via CIM/WMI.",
  [S("Scheduled tasks",code="$a = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-File C:\\s\\report.ps1'\n$t = New-ScheduledTaskTrigger -Daily -At 6am\nRegister-ScheduledTask -TaskName 'DailyReport' -Action $a -Trigger $t"),
   S("CIM/WMI",code="Get-CimInstance Win32_LogicalDisk | Select DeviceID, FreeSpace, Size\nGet-CimInstance Win32_OperatingSystem\nGet-CimInstance Win32_ComputerSystem"),
   S("Why CIM",note=RW("Get-CimInstance surfaces hardware/OS details (disk space, uptime, model) that power inventory and monitoring scripts across a whole fleet.")),],
  "Write a CIM query that reports free space on each logical disk.",
  [Q("Register a recurring task with…",["Register-ScheduledTask","Add-Task","New-Cron","Schedule-Run"],0,"Register-ScheduledTask creates it."),
   Q("Modern replacement for Get-WmiObject is…",["Get-CimInstance","Get-WMI2","Get-System","Get-Info"],0,"Get-CimInstance is the modern cmdlet."),
   Q("Win32_LogicalDisk exposes…",["CPU temp","Disk space","AD users","Event logs"],1,"It reports disk size/free space.")]),
 L("sc-ps-16","data-formats","CSV, JSON & XML",20,60,
  "Read and write the data formats every integration and report uses.",
  [S("CSV",code="Import-Csv users.csv | ForEach-Object { $_.Email }\nGet-Process | Export-Csv procs.csv -NoTypeInformation"),
   S("JSON",code="$data = Get-Content config.json | ConvertFrom-Json\n$data.servers\n@{name='srv01'} | ConvertTo-Json"),
   S("XML",code="[xml]$doc = Get-Content data.xml\n$doc.root.item",note=RW("Import-Csv drives bulk operations — feed a spreadsheet of new hires into New-ADUser and you've onboarded 50 people in one run.")),],
  "Write a line that reads users.csv and outputs each Email field.",
  [Q("Read a CSV into objects with…",["Import-Csv","Read-Csv","Get-Csv","Open-Csv"],0,"Import-Csv parses rows into objects."),
   Q("Parse JSON text with…",["ConvertFrom-Json","Parse-Json","Read-Json","Get-Json"],0,"ConvertFrom-Json builds objects."),
   Q("Export objects to CSV with…",["Export-Csv -NoTypeInformation","Save-Csv","Write-Csv","Out-Csv"],0,"Export-Csv writes objects to CSV.")]),
 L("sc-ps-17","capstone","Capstone: Automated Health Report",26,80,
  "Combine everything into a real deliverable: a scheduled system health report.",
  [S("The brief",p="Build a script that gathers disk space, stopped auto-start services, and recent system errors, then writes a timestamped report and (optionally) emails it — scheduled daily."),
   S("Skeleton",code="$report = @()\n$report += Get-CimInstance Win32_LogicalDisk |\n  Select DeviceID, @{n='FreeGB';e={[math]::Round($_.FreeSpace/1GB,1)}}\n$stopped = Get-Service | Where-Object {$_.StartType -eq 'Automatic' -and $_.Status -eq 'Stopped'}\n$errors  = Get-WinEvent -FilterHashtable @{LogName='System';Level=2} -MaxEvents 10\n$report | Export-Csv \"C:\\reports\\health_$(Get-Date -f yyyyMMdd).csv\" -NoTypeInformation"),
   S("Finish it",ul=["Wrap in try/catch + logging","Register-ScheduledTask to run daily","Optionally Send-MailMessage the summary"],note=RW("This single script is portfolio-worthy — it demonstrates CIM, filtering, error handling, exporting, and scheduling: exactly what a junior admin role expects.")),],
  "Outline the three data sources your health report gathers and where it writes them.",
  [Q("Rounding free bytes to GB uses…",["[math]::Round($x/1GB,1)","/1000","Round-GB","ToGB()"],0,"Divide by 1GB and [math]::Round."),
   Q("The report is made recurring by…",["Register-ScheduledTask","a while loop","manual runs","Task-Loop"],0,"Schedule it with Register-ScheduledTask."),
   Q("Robust scripts wrap logic in…",["try/catch + logging","nothing","comments only","a GUI"],0,"Error handling + logging make it production-safe.")]),
]
by={c["id"]:c for c in man["courses"]}; by["sc-powershell-scripting"]["lessons"].extend(PS)
MAN.write_text(json.dumps(man,ensure_ascii=False))
print("PS ->",len(by["sc-powershell-scripting"]["lessons"]),"lessons; track totals:",sum(len(c["lessons"]) for c in man["courses"]),"lessons,",sum(len(l["quiz"]) for c in man["courses"] for l in c["lessons"]),"quizzes")
