#!/usr/bin/env python3
"""Expand p29 (Scripting): +3 advanced lessons per course, with real-world callouts."""
import json, pathlib
MAN = pathlib.Path('/home/claude/it-academy/scripts/manifests/p29.json')
man = json.loads(MAN.read_text())
def L(id,slug,title,minutes,xp,intro,sections,practice,quiz):
    return {"id":id,"slug":slug,"title":title,"minutes":minutes,"xp":xp,"content":{"intro":intro,"sections":sections,"practice":practice},"quiz":quiz}
def S(h,p=None,ul=None,note=None,code=None):
    d={"h":h}
    if p:d["p"]=p if isinstance(p,list) else [p]
    if ul:d["ul"]=ul
    if code:d["code"]=code
    if note:d["note"]=note
    return d
def Q(p,o,ci,ex):return{"p":p,"o":o,"ci":ci,"ex":ex}
def RW(text):return {"kind":"info","text":"In the real world: "+text}

NEW={
 "sc-powershell-scripting":[
  L("sc-ps-07","error-handling","Error Handling & Debugging",22,60,
   "Production scripts must fail safely. Handle errors, control their behavior, and debug when things break.",
   [S("try / catch / finally",code="try {\n  Get-Content missing.txt -ErrorAction Stop\n} catch {\n  Write-Warning \"Failed: $($_.Exception.Message)\"\n} finally {\n  'cleanup runs always'\n}"),
    S("Error control",ul=[{"b":"-ErrorAction Stop","t":"makes a non-terminating error catchable"},{"b":"$Error[0]","t":"the most recent error"},{"b":"-ErrorVariable e","t":"capture without stopping"}],note=RW("Cmdlet errors are non-terminating by default — without -ErrorAction Stop your catch block never runs and a broken script keeps going.")),
    S("Debugging",p="Set-PSBreakpoint or the VS Code debugger; Write-Verbose with -Verbose for traceable output.")],
   "Wrap a file read in try/catch so a missing file logs a warning instead of crashing.",
   [Q("Which makes a cmdlet error catchable by try/catch?",["-Force","-ErrorAction Stop","-WhatIf","-Confirm"],1,"Non-terminating errors need -ErrorAction Stop to be caught."),
    Q("Code that must always run goes in…",["try","catch","finally","trap"],2,"finally always executes."),
    Q("The most recent error is in…",["$LastError","$Error[0]","$?","$_"],1,"$Error[0] holds the latest error.")]),
  L("sc-ps-08","remoting-modules","Remoting & Modules",22,60,
   "Run commands on remote machines and extend PowerShell with modules from the Gallery.",
   [S("Remoting",code="Invoke-Command -ComputerName SRV01 -ScriptBlock { Get-Service }\n$s = New-PSSession -ComputerName SRV01\nInvoke-Command -Session $s -ScriptBlock { $env:COMPUTERNAME }"),
    S("Modules",code="Get-Module -ListAvailable\nImport-Module ActiveDirectory\nInstall-Module -Name Pester   # from PSGallery"),
    S("Why it matters",note=RW("Admins rarely log into servers one by one — Invoke-Command runs a fix across dozens of machines at once, and modules (like ActiveDirectory) are how real admin tasks get automated.")),],
   "Write a command that runs Get-Service on a remote server named SRV01.",
   [Q("Which runs a scriptblock on a remote host?",["Enter-Host","Invoke-Command","Run-Remote","Get-Session"],1,"Invoke-Command -ComputerName runs remotely."),
    Q("Third-party modules install from…",["the BIOS","PowerShell Gallery","Task Scheduler","the registry"],1,"Install-Module pulls from PSGallery."),
    Q("A reusable, persistent remote connection is a…",["job","PSSession","pipe","cmdlet"],1,"New-PSSession creates a reusable session.")]),
  L("sc-ps-09","real-scripts","Real-World Scripts",24,70,
   "Combine parameters, pipeline input, and logging into a script you'd actually run in production.",
   [S("A parameterized, logged script",code="param([Parameter(Mandatory)][string]$UserName)\n\n$log = \"C:\\logs\\offboard.log\"\nfunction Write-Log($m){ \"$(Get-Date -f s) $m\" | Add-Content $log }\n\ntry {\n  Write-Log \"Disabling $UserName\"\n  # Disable-ADAccount -Identity $UserName -ErrorAction Stop\n  Write-Log \"Done\"\n} catch { Write-Log \"ERROR: $($_.Exception.Message)\" }"),
    S("Good script hygiene",ul=["Mandatory params + validation","Log actions with timestamps","-WhatIf support for safe dry-runs","Idempotent where possible"]),
    S("Scheduling",note=RW("This is how routine ops actually run: a parameterized script + Task Scheduler handles nightly cleanups, user offboarding, and report generation without anyone touching a console.")),],
   "Sketch a script with a mandatory -UserName parameter that logs each action with a timestamp.",
   [Q("A required parameter uses…",["[Optional]","[Parameter(Mandatory)]","[Switch]","[AllowNull]"],1,"[Parameter(Mandatory)] forces a value."),
    Q("A safe dry-run is enabled by supporting…",["-Force","-WhatIf","-Quiet","-Silent"],1,"-WhatIf previews without acting."),
    Q("Recurring script execution is handled by…",["Task Scheduler","Notepad","the pipeline","Get-Help"],0,"Task Scheduler runs scripts on a schedule.")]),
 ],
 "sc-python-scripting":[
  L("sc-py-07","regex","Regular Expressions",22,60,
   "Regex extracts structure from text — indispensable for parsing logs, configs, and output.",
   [S("The re module",code="import re\nre.search(r'\\d+', 'abc123')      # first match object\nre.findall(r'\\d+', 'a1 b2 c3')     # ['1','2','3']\nm = re.search(r'(\\w+)@(\\w+)', 'ada@corp')\nm.group(1)                         # 'ada'"),
    S("Common patterns",ul=[{"b":"\\d","t":"digit"},{"b":"\\w","t":"word char"},{"b":"\\s","t":"whitespace"},{"b":"+ * ?","t":"quantifiers"},{"b":"( )","t":"capture group"}]),
    S("Where it pays off",note=RW("Extracting IPs, timestamps, or error codes from thousands of log lines is a regex one-liner — this is the single most reused skill in IT scripting.")),],
   "Write a findall that pulls every number out of a string.",
   [Q("Which returns all matches as a list?",["re.match","re.findall","re.split only","re.compile"],1,"re.findall returns all matches."),
    Q("A capture group is written with…",["[ ]","( )","{ }","< >"],1,"( ) captures a group."),
    Q("\\d matches a…",["letter","digit","space","word"],1,"\\d matches a digit.")]),
  L("sc-py-08","apis","Working with APIs",22,60,
   "Most automation talks to web APIs. Use requests to fetch and send JSON.",
   [S("GET and JSON",code="import requests\nr = requests.get('https://api.example.com/servers',\n                 headers={'Authorization': 'Bearer TOKEN'})\nr.raise_for_status()\ndata = r.json()"),
    S("POST",code="requests.post(url, json={'name': 'srv01'}, headers=headers)"),
    S("Status codes",ul=[{"b":"200","t":"OK"},{"b":"401/403","t":"auth problem"},{"b":"404","t":"not found"},{"b":"429","t":"rate limited"},{"b":"5xx","t":"server error"}],note=RW("Cloud and monitoring tools (Azure, ticketing, Slack) all expose REST APIs — a short Python script can pull inventory, open tickets, or post alerts automatically.")),],
   "Write a GET request with a bearer token that parses the JSON response.",
   [Q("Parse a JSON API body with…",["r.text","r.json()","r.raw","r.body"],1,"response.json() parses JSON."),
    Q("A 401 status means…",["Success","Auth problem","Not found","Rate limited"],1,"401 is unauthorized."),
    Q("raise_for_status() does what?",["Nothing","Raises on HTTP error","Prints","Retries"],1,"It raises an exception on 4xx/5xx.")]),
  L("sc-py-09","log-parsing","Log Parsing & a Mini-Project",24,70,
   "Tie it together: read a log, extract with regex, aggregate, and write a report.",
   [S("Count errors by type",code="import re, collections\ncounts = collections.Counter()\nwith open('app.log') as f:\n    for line in f:\n        m = re.search(r'ERROR (\\w+)', line)\n        if m:\n            counts[m.group(1)] += 1\nfor kind, n in counts.most_common():\n    print(f'{kind}: {n}')"),
    S("Extend it",ul=["Write results to a CSV/JSON report","Filter by date range","Alert if a threshold is exceeded"]),
    S("The payoff",note=RW("A 15-line script like this replaces manual log scrolling — schedule it and it becomes a daily health report or an alert pipeline.")),],
   "Outline a script that counts how many times each ERROR type appears in a log.",
   [Q("Counting occurrences is easiest with…",["a list","collections.Counter","a tuple","a set"],1,"Counter tallies occurrences."),
    Q("most_common() returns items…",["randomly","ordered by frequency","alphabetically","reversed"],1,"Ordered from most to least frequent."),
    Q("The core automation pattern here is…",["read → extract → aggregate → report","delete logs","guess","reboot"],0,"Read, extract, aggregate, output.")]),
 ],
}
added=0; by={c["id"]:c for c in man["courses"]}
for cid,ls in NEW.items():
    if cid in by: by[cid]["lessons"].extend(ls); added+=len(ls)
MAN.write_text(json.dumps(man,ensure_ascii=False))
print("appended",added,"lessons; totals:",sum(len(c["lessons"]) for c in man["courses"]),"lessons,",sum(len(l["quiz"]) for c in man["courses"] for l in c["lessons"]),"quizzes")
