#!/usr/bin/env python3
import json, pathlib
OUT = pathlib.Path('/home/claude/it-academy/scripts/manifests/p29.json')
man = {"courses": []}
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
def C(area,id,slug,title,icon,order,module_id,diff,desc,lessons):
    return {"area":area,"id":id,"slug":slug,"title":title,"icon":icon,"order":order,"module_id":module_id,"difficulty":diff,"description":desc,"lessons":lessons}

ps = C("sc-ps","sc-powershell-scripting","sc-powershell-scripting","Scripting: PowerShell","⚡",1,"sc-ps-m1","beginner",
 "Learn PowerShell from the console to real automation — cmdlets, the object pipeline, scripts, and practical admin tasks.",[
  L("sc-ps-01","basics","PowerShell Basics",20,55,
   "PowerShell is a shell and scripting language built on .NET. Commands are cmdlets in a consistent Verb-Noun form.",
   [S("Where it runs",p="Windows PowerShell (5.1) ships with Windows; PowerShell 7+ (cross-platform) is a separate install. Run it in the console or VS Code."),
    S("Cmdlets: Verb-Noun",code="Get-Process\nGet-Service\nGet-Command *service*   # discover commands\nGet-Help Get-Process -Examples  # learn any command"),
    S("Discoverability",note={"kind":"tip","text":"Get-Command finds cmdlets; Get-Help explains them. You rarely need to memorize — you explore."})],
   "Write the command to find help (with examples) for Get-Service.",
   [Q("PowerShell commands follow the form…",["Noun-Verb","Verb-Noun","just verbs","random"],1,"Cmdlets are Verb-Noun, e.g. Get-Process."),
    Q("Which discovers available commands?",["Get-Help","Get-Command","Write-Host","Exit"],1,"Get-Command lists/searches cmdlets."),
    Q("To see usage examples for a cmdlet use…",["Get-Help -Examples","Get-Member","Clear-Host","Get-Date"],0,"Get-Help <cmd> -Examples shows usage.")]),
  L("sc-ps-02","objects-pipeline","Objects & the Pipeline",22,60,
   "PowerShell's superpower: cmdlets pass .NET objects (not text) down the pipeline, so you can filter and shape data precisely.",
   [S("Everything is objects",p="Get-Process returns process objects with properties (Name, CPU, Id). Pipe them to other cmdlets to refine."),
    S("The core trio",code="Get-Process | Where-Object CPU -gt 100      # filter\nGet-Process | Select-Object Name, CPU        # pick columns\nGet-Process | Sort-Object CPU -Descending    # order"),
    S("Inspect objects",note={"kind":"tip","text":"Pipe to Get-Member to see an object's properties and methods: Get-Process | Get-Member."})],
   "Write a pipeline that lists the top 5 processes by CPU, showing only Name and CPU.",
   [Q("The pipeline passes what between cmdlets?",["Plain text","Objects","Files","Bytes"],1,"PowerShell pipes rich objects."),
    Q("Which filters objects by a condition?",["Select-Object","Where-Object","Sort-Object","Format-Table"],1,"Where-Object filters by condition."),
    Q("To see an object's properties/methods, pipe to…",["Get-Help","Get-Member","Get-Command","Out-Null"],1,"Get-Member reveals the object's members.")]),
  L("sc-ps-03","variables-data","Variables, Operators & Data",20,55,
   "Store and compare data with variables, arrays, and hashtables.",
   [S("Variables & types",code="$name = 'Ada'\n$count = 42\n$items = @('a','b','c')       # array\n$user = @{ Name='Ada'; Age=36 } # hashtable"),
    S("Comparison operators",ul=[{"b":"-eq / -ne","t":"equal / not equal"},{"b":"-gt / -lt / -ge / -le","t":"greater/less"},{"b":"-like / -match","t":"wildcard / regex"}],note={"kind":"warn","text":"PowerShell uses -eq, not == (== is not a PowerShell operator)."}),
    S("Access",p="$items[0] is 'a'; $user.Name is 'Ada'. Use $items.Count for length.")],
   "Declare a hashtable for a server (name + IP) and access the IP.",
   [Q("Equality in PowerShell is written…",["==","-eq","=","eq"],1,"-eq tests equality (= assigns)."),
    Q("An array literal uses…",["{ }","@( )","[ ]","< >"],1,"@( ) creates an array."),
    Q("A key/value collection is a…",["array","hashtable","string","tuple"],1,"@{} is a hashtable.")]),
  L("sc-ps-04","flow-loops","Flow Control & Loops",20,55,
   "Make decisions and repeat work with conditionals and loops.",
   [S("Conditionals",code="if ($n -gt 10) { 'big' }\nelseif ($n -eq 10) { 'ten' }\nelse { 'small' }\n\nswitch ($status) { 'ok' {'good'} default {'unknown'} }"),
    S("Loops",code="foreach ($s in Get-Service) { $s.Name }\nfor ($i=0; $i -lt 5; $i++) { $i }\nGet-Process | ForEach-Object { $_.Name }"),
    S("The pipeline variable",note={"kind":"tip","text":"$_ (or $PSItem) is the current object inside Where-Object/ForEach-Object."})],
   "Write a foreach loop that prints the name of every stopped service.",
   [Q("Inside ForEach-Object, the current item is…",["$it","$_","$this","$item"],1,"$_ (or $PSItem) is the current object."),
    Q("Which handles multiple discrete cases cleanly?",["for","switch","while","break"],1,"switch matches multiple cases."),
    Q("foreach ($x in $coll) iterates…",["once","over each element","backwards only","never"],1,"It runs the block per element.")]),
  L("sc-ps-05","functions-scripts","Functions & Scripts",22,60,
   "Package reusable logic into functions and save scripts as .ps1 files.",
   [S("Functions",code="function Get-DiskFreeGB {\n  param([string]$Drive = 'C')\n  (Get-PSDrive $Drive).Free / 1GB\n}\nGet-DiskFreeGB -Drive C"),
    S("Scripts (.ps1)",p="Save commands in a .ps1 file and run it. Parameters via param() at the top make scripts reusable."),
    S("Execution policy",note={"kind":"warn","text":"Scripts may be blocked by execution policy. Set-ExecutionPolicy RemoteSigned (admin) allows local scripts; understand the security trade-off."})],
   "Write a function with a parameter that returns free space for a given drive.",
   [Q("Function parameters are declared with…",["args()","param()","def","input()"],1,"param() defines function parameters."),
    Q("PowerShell script files use the extension…",["-.sh","-.ps1","-.py","-.bat"],1,".ps1 is a PowerShell script."),
    Q("Scripts won't run due to…",["Low RAM","Execution policy","No mouse","DNS"],1,"Execution policy can block scripts.")]),
  L("sc-ps-06","automation","Practical Automation",22,65,
   "Put it together: query the system, filter, and export — the essence of admin automation.",
   [S("Common tasks",code="# Top 5 CPU consumers to CSV\nGet-Process | Sort-Object CPU -Descending |\n  Select-Object -First 5 Name, CPU |\n  Export-Csv top.csv -NoTypeInformation\n\n# Stopped services\nGet-Service | Where-Object Status -eq 'Stopped'"),
    S("Files & scheduling",ul=["Get-ChildItem (ls) to enumerate files","Export-Csv / ConvertTo-Json for output","Schedule scripts with Task Scheduler for recurring automation"]),
    S("Mindset",note={"kind":"tip","text":"Explore with Get-Command/Get-Member, build a one-liner, then save it as a script."})],
   "Write a one-liner that exports all stopped services to a CSV file.",
   [Q("Export objects to CSV with…",["Write-Host","Export-Csv","Out-Null","Format-Table"],1,"Export-Csv writes objects to CSV."),
    Q("Recurring automation on Windows uses…",["Task Scheduler","Paint","Notepad","DNS"],0,"Task Scheduler runs scripts on a schedule."),
    Q("Select-Object -First 5 returns…",["last 5","first 5 objects","all","none"],1,"It takes the first 5 objects.")]),
 ])

py = C("sc-py","sc-python-scripting","sc-python-scripting","Scripting: Python","🐍",2,"sc-py-m1","beginner",
 "Learn Python for IT: from syntax and data structures to files, errors, and real automation scripts.",[
  L("sc-py-01","basics","Python Basics",20,55,
   "Python is a readable, general-purpose language. Run it interactively or as .py files.",
   [S("Running Python",code="python --version      # check version\npython script.py      # run a file\n# interactive REPL:\n>>> print('Hello')\nHello"),
    S("Variables & printing",code="name = 'Ada'\ncount = 42\nprint(f'{name} has {count} items')   # f-string"),
    S("Style",note={"kind":"tip","text":"Python uses indentation (not braces) to define blocks — be consistent (4 spaces)."})],
   "Write a line that prints a name and count using an f-string.",
   [Q("Python blocks are defined by…",["Braces { }","Indentation","Semicolons","Parentheses"],1,"Indentation defines blocks in Python."),
    Q("An f-string is written…",["f'{x}'","$x","%x","{{x}}"],0,"f'...{var}...' interpolates values."),
    Q("Run a script file with…",["run script","python script.py","exec()","./python"],1,"python script.py executes the file.")]),
  L("sc-py-02","data-structures","Data Types & Structures",22,60,
   "Python's built-in types and collections cover most needs.",
   [S("Scalars",ul=[{"b":"str, int, float, bool","t":""},{"b":"None","t":"= absence of value"}]),
    S("Collections",code="fruits = ['apple', 'pear']      # list (ordered, mutable)\npoint = (3, 4)                  # tuple (immutable)\nuser = {'name': 'Ada', 'age': 36}  # dict (key/value)\nunique = {1, 2, 3}              # set (unique)"),
    S("Access",note={"kind":"tip","text":"fruits[0] → 'apple'; user['name'] → 'Ada'; len(fruits) → length."})],
   "Create a dict for a server (name + ip) and print the ip.",
   [Q("Which is an immutable sequence?",["list","tuple","dict","set"],1,"Tuples are immutable."),
    Q("Key/value pairs are stored in a…",["list","dict","tuple","set"],1,"dict holds key/value pairs."),
    Q("len(x) returns…",["the type","the length/count","the first item","None"],1,"len() gives the number of items.")]),
  L("sc-py-03","control-flow","Control Flow & Loops",20,55,
   "Branch and repeat with if/elif/else and loops.",
   [S("Conditionals",code="if n > 10:\n    print('big')\nelif n == 10:\n    print('ten')\nelse:\n    print('small')"),
    S("Loops",code="for fruit in fruits:\n    print(fruit)\n\nfor i in range(5):   # 0..4\n    print(i)\n\nwhile n > 0:\n    n -= 1"),
    S("Control",note={"kind":"tip","text":"break exits a loop; continue skips to the next iteration."})],
   "Write a for loop that prints numbers 0 through 4.",
   [Q("range(5) produces…",["1..5","0..4","0..5","5 only"],1,"range(5) is 0,1,2,3,4."),
    Q("Equality in Python is…",["-eq","==","=","eq"],1,"== tests equality (= assigns)."),
    Q("To skip to the next loop iteration use…",["break","continue","pass","exit"],1,"continue skips to the next iteration.")]),
  L("sc-py-04","functions-modules","Functions & Modules",22,60,
   "Reuse code with functions and tap the ecosystem with modules.",
   [S("Functions",code="def disk_free_gb(path='/'):\n    import shutil\n    return shutil.disk_usage(path).free / 1e9\n\nprint(disk_free_gb())"),
    S("Modules & pip",code="import os, json          # standard library\nfrom datetime import date\n# third-party:\npip install requests"),
    S("Reuse",note={"kind":"info","text":"The standard library (os, sys, json, re, datetime) covers a lot before you need pip packages."})],
   "Define a function with a default parameter that returns a value.",
   [Q("A function is defined with…",["function","def","func","sub"],1,"def defines a function."),
    Q("Third-party packages are installed with…",["import","pip install","download","apt"],1,"pip install adds packages."),
    Q("Which is part of Python's standard library?",["requests","json","numpy","flask"],1,"json ships with Python; requests is third-party.")]),
  L("sc-py-05","files-errors","Files & Error Handling",22,60,
   "Read/write files safely and handle errors gracefully.",
   [S("Files",code="with open('log.txt') as f:      # auto-closes\n    for line in f:\n        print(line.strip())\n\nwith open('out.txt', 'w') as f:\n    f.write('done')"),
    S("Errors",code="try:\n    n = int(value)\nexcept ValueError:\n    print('not a number')\nfinally:\n    print('always runs')"),
    S("Why 'with'",note={"kind":"tip","text":"The with statement closes the file automatically, even on error."})],
   "Write a try/except that converts input to int and handles a bad value.",
   [Q("The safe way to open files is…",["open() then hope","with open(...) as f","file()","read()"],1,"with auto-closes the file."),
    Q("Handle a runtime error with…",["if/else","try/except","switch","assert only"],1,"try/except handles exceptions."),
    Q("Opening with mode 'w'…",["reads","writes (truncates)","appends","fails"],1,"'w' opens for writing, truncating.")]),
  L("sc-py-06","automation","IT Automation with Python",22,65,
   "Automate real tasks: run commands, parse data, and call APIs.",
   [S("System tasks",code="import os, subprocess\nos.listdir('.')                     # list files\nsubprocess.run(['ping', '-c', '1', 'example.com'])"),
    S("Parsing & APIs",code="import json, requests\nr = requests.get('https://api.example.com/status')\ndata = r.json()\nprint(data['state'])"),
    S("Automation mindset",note={"kind":"tip","text":"Read input (files/args/APIs) → transform → output (file/report). Small scripts compound into big time savings."})],
   "Outline a script that reads a log file and counts lines containing 'ERROR'.",
   [Q("Run an external command from Python with…",["os.open","subprocess.run","print","import"],1,"subprocess.run executes commands."),
    Q("Parse a JSON API response with…",["r.text only","r.json()","r.bytes","r.raw"],1,"response.json() parses JSON."),
    Q("A good automation pattern is…",["random edits","read → transform → output","delete files","guess"],1,"Input → transform → output is the core pattern.")]),
 ])

for c in (ps, py):
    man["courses"].append(c)
OUT.write_text(json.dumps(man, ensure_ascii=False))
print("p29:", len(man["courses"]), "courses,", sum(len(c["lessons"]) for c in man["courses"]), "lessons,",
      sum(len(l["quiz"]) for c in man["courses"] for l in c["lessons"]), "quizzes")
