#!/usr/bin/env python3
"""Phase 3a finish: PowerShell 17 -> 25 lessons."""
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
 L("sc-ps-18","rest-apis","REST APIs with PowerShell",20,60,
  "Talk to web services directly from the shell — the glue between tools.",
  [S("GET & POST",code="$r = Invoke-RestMethod https://api.example.com/servers `\n     -Headers @{ Authorization = 'Bearer TOKEN' }\n$r.servers\nInvoke-RestMethod https://api.example.com/tickets -Method Post `\n  -Body (@{title='Disk full'} | ConvertTo-Json) -ContentType 'application/json'"),
   S("Why Invoke-RestMethod",p="It parses JSON responses into objects automatically (vs Invoke-WebRequest which returns raw)."),
   S("Automate integrations",note=RW("A few lines of Invoke-RestMethod can open tickets, post Teams/Slack alerts, or pull cloud inventory — turning manual portal clicking into a scheduled job.")),],
  "Write a GET call with a bearer token that returns parsed objects.",
  [Q("Which auto-parses JSON into objects?",["Invoke-WebRequest","Invoke-RestMethod","Get-Web","Fetch-Url"],1,"Invoke-RestMethod parses JSON responses."),
   Q("A POST body is usually sent as…",["plain text","JSON via ConvertTo-Json","CSV","XML only"],1,"Convert a hashtable to JSON for the body."),
   Q("Auth tokens go in the…",["URL only","Headers","Body","Filename"],1,"Authorization header carries the token.")]),
 L("sc-ps-19","log-analysis","Log Analysis",20,60,
  "Turn raw log files into answers with pattern matching and grouping.",
  [S("Search text",code="Select-String -Path C:\\logs\\*.log -Pattern 'ERROR'\nSelect-String app.log -Pattern 'user (\\w+) failed' -AllMatches"),
   S("Aggregate",code="Select-String app.log -Pattern 'ERROR (\\w+)' |\n  ForEach-Object { $_.Matches.Groups[1].Value } |\n  Group-Object | Sort-Object Count -Descending"),
   S("Report",note=RW("Grouping errors by type across a day's logs turns a wall of text into a ranked 'top failures' list — the fastest way to know what to fix first.")),],
  "Write a command that counts occurrences of each ERROR type in a log.",
  [Q("Grep-like search in PowerShell is…",["Find-Text","Select-String","Search-Log","Match-Line"],1,"Select-String matches patterns in text."),
   Q("Tally values by frequency with…",["Group-Object","Count-Object","Sum-Object","Tally"],0,"Group-Object buckets by value."),
   Q("Regex capture groups are accessed via…",["$_.Matches.Groups","$_.Text","$_.Line only","$_.Value[0]"],0,"Matches.Groups holds captures.")]),
 L("sc-ps-20","monitoring","Monitoring Scripts",20,60,
  "Watch thresholds and alert before small problems become outages.",
  [S("Threshold check",code="$disk = Get-CimInstance Win32_LogicalDisk -Filter \"DeviceID='C:'\"\n$freePct = [math]::Round($disk.FreeSpace / $disk.Size * 100, 1)\nif ($freePct -lt 10) { Write-Warning \"Low disk: $freePct%\" }"),
   S("Repeatable checks",ul=["Disk free %, CPU load, service status, ping to key hosts","Emit a warning / send an alert when a threshold is crossed"]),
   S("Alerting",note=RW("A scheduled monitor that emails when disk < 10% or a service is down buys you hours of lead time — the difference between a calm fix and a 2am outage.")),],
  "Write a check that warns when C: free space drops below 10%.",
  [Q("Free space % comes from…",["FreeSpace / Size * 100","FreeSpace only","Size - 100","random"],0,"Free/Size*100 gives the percentage."),
   Q("A monitor reacts when a value crosses a…",["color","threshold","font","port"],1,"Thresholds trigger alerts."),
   Q("Monitors are typically run…",["once manually","on a schedule","never","at install only"],1,"Scheduled runs catch issues early.")]),
 L("sc-ps-21","backup-automation","Backup Automation",20,60,
  "Script reliable, dated, self-pruning backups.",
  [S("Timestamped copy",code="$stamp = Get-Date -Format yyyyMMdd\nCopy-Item C:\\data\\* \"D:\\backup\\$stamp\\\" -Recurse -Force"),
   S("Compress + retention",code="Compress-Archive C:\\data \"D:\\backup\\data_$stamp.zip\"\n# keep 14 days\nGet-ChildItem D:\\backup\\*.zip |\n  Where-Object LastWriteTime -lt (Get-Date).AddDays(-14) |\n  Remove-Item"),
   S("3-2-1",note=RW("A backup script that dates archives and prunes old ones enforces retention automatically — pair it with an offsite copy to satisfy the 3-2-1 rule.")),],
  "Write a snippet that zips a folder with today's date in the filename.",
  [Q("Create a zip archive with…",["Compress-Archive","Zip-Item","New-Zip","Archive-File"],0,"Compress-Archive builds a .zip."),
   Q("Dated filenames use…",["Get-Date -Format","Now()","Date-Stamp","Time-Tag"],0,"Get-Date -Format yyyyMMdd."),
   Q("Retention is enforced by deleting files older than…",["a threshold date","never","1 hour","the newest"],0,"Remove archives past the retention window.")]),
 L("sc-ps-22","group-policy","Group Policy Automation",18,60,
  "Report on and document Group Policy at scale.",
  [S("GPO cmdlets",code="Import-Module GroupPolicy\nGet-GPO -All | Select DisplayName, ModificationTime\nGet-GPOReport -Name 'Default Domain Policy' -ReportType Html -Path gpo.html"),
   S("Result on a client",code="gpresult /r          # applied policies\ngpresult /h rsop.html"),
   S("Documentation",note=RW("Get-GPOReport exports every policy to HTML — instant, auditable documentation that would take hours to compile by hand before a change or audit.")),],
  "Write a command to export a full HTML report of a named GPO.",
  [Q("List all GPOs with…",["Get-GPO -All","Get-Policy","List-GPO","GPO-All"],0,"Get-GPO -All enumerates them."),
   Q("Export a GPO to HTML with…",["Get-GPOReport -ReportType Html","Export-GPO","Save-GPO","GPO-Html"],0,"Get-GPOReport -ReportType Html."),
   Q("Applied policy on a client is shown by…",["gpresult /r","gpo /list","policy /show","rsop /r"],0,"gpresult /r lists applied GPOs.")]),
 L("sc-ps-23","troubleshooting","Troubleshooting Toolkit",18,60,
  "A grab-bag of diagnostic one-liners and safe-run habits.",
  [S("Fast diagnostics",code="Get-Service | Where Status -eq 'Stopped' -and StartType -eq 'Automatic'\nGet-CimInstance Win32_OperatingSystem | Select LastBootUpTime\nGet-WinEvent -FilterHashtable @{LogName='System';Level=1,2} -MaxEvents 20"),
   S("Safe habits",ul=["Use -WhatIf to preview destructive actions","Use -Verbose for traceable output","Test on one machine before a fleet"],note=RW("-WhatIf has saved countless admins from a bad Remove-Item across production — always dry-run destructive automation first.")),],
  "Name two switches that make a script safer to run.",
  [Q("Preview a destructive command with…",["-WhatIf","-Force","-Quiet","-Yes"],0,"-WhatIf shows what would happen."),
   Q("Traceable step-by-step output uses…",["-Verbose","-Silent","-Debug off","-Fast"],0,"-Verbose emits progress detail."),
   Q("Uptime comes from Win32_OperatingSystem's…",["LastBootUpTime","Uptime","BootDate","StartTime"],0,"LastBootUpTime gives boot time.")]),
 L("sc-ps-24","modules","Building Reusable Modules",20,65,
  "Package your functions into a shareable module.",
  [S("From script to module",code="# MyTools.psm1\nfunction Get-DiskFreeGB {\n  param([Parameter(Mandatory)][string]$Drive)\n  [math]::Round((Get-PSDrive $Drive).Free/1GB,1)\n}\nExport-ModuleMember -Function Get-DiskFreeGB"),
   S("Use it",code="Import-Module .\\MyTools.psm1\nGet-DiskFreeGB -Drive C"),
   S("Why modules",note=RW("Turning your best one-off functions into a shared module means the whole team runs the same vetted tools instead of copy-pasting snippets — the mark of a maturing automation practice.")),],
  "Write a .psm1 that exports a single function.",
  [Q("A PowerShell module file uses the extension…",["-.ps1",".psm1",".mod","-.dll"],1,".psm1 is a script module."),
   Q("Expose functions from a module with…",["Export-ModuleMember","Publish-Function","Show-Function","Export-Func"],0,"Export-ModuleMember -Function."),
   Q("Load a module with…",["Import-Module","Load-Module","Use-Module","Add-Module"],0,"Import-Module brings it into the session.")]),
 L("sc-ps-25","capstone-onboarding","Capstone: Onboarding Automation",26,85,
  "The definitive project: bulk-onboard users from a CSV, end to end.",
  [S("The brief",p="Read a CSV of new hires, create each AD user, add them to department groups, create a home folder, and write a result report — with error handling."),
   S("Skeleton",code="Import-Csv newhires.csv | ForEach-Object {\n  try {\n    New-ADUser -Name $_.Name -SamAccountName $_.User -Department $_.Dept -Enabled $true -ErrorAction Stop\n    Add-ADGroupMember $_.Dept -Members $_.User\n    New-Item \"\\\\srv\\home\\$($_.User)\" -ItemType Directory -Force\n    [pscustomobject]@{ User=$_.User; Status='OK' }\n  } catch {\n    [pscustomobject]@{ User=$_.User; Status=\"ERR: $($_.Exception.Message)\" }\n  }\n} | Export-Csv onboard_result.csv -NoTypeInformation"),
   S("Ship it",ul=["Validate CSV columns first","Log every action","Schedule or run on demand"],note=RW("This capstone mirrors a genuine HR-to-IT onboarding pipeline — being able to describe and build it is exactly what lands a junior sysadmin role.")),],
  "List the four actions your onboarding script performs per CSV row.",
  [Q("Bulk input for onboarding comes from…",["a GUI","Import-Csv","manual typing","the registry"],1,"Import-Csv feeds the hire list."),
   Q("Per-row failures are captured with…",["try/catch","ignore","reboot","-Force"],0,"try/catch records each row's outcome."),
   Q("Results are saved with…",["Export-Csv","print","Write-Host only","nothing"],0,"Export-Csv writes the run report.")]),
]
by={c["id"]:c for c in man["courses"]}; by["sc-powershell-scripting"]["lessons"].extend(PS)
MAN.write_text(json.dumps(man,ensure_ascii=False))
print("PS ->",len(by["sc-powershell-scripting"]["lessons"]),"lessons; track:",sum(len(c["lessons"]) for c in man["courses"]),"lessons,",sum(len(l["quiz"]) for c in man["courses"] for l in c["lessons"]),"quizzes")
