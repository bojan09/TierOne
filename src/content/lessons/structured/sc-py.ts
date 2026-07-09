import type { LessonContent } from '../model';

export const scpyLessons: Record<string, LessonContent> = {
  "sc-py-01": {
    "intro": "Python is a readable, general-purpose language. Run it interactively or as .py files.",
    "sections": [
      {
        "h": "Running Python",
        "code": "python --version      # check version\npython script.py      # run a file\n# interactive REPL:\n>>> print('Hello')\nHello"
      },
      {
        "h": "Variables & printing",
        "code": "name = 'Ada'\ncount = 42\nprint(f'{name} has {count} items')   # f-string"
      },
      {
        "h": "Style",
        "note": {
          "kind": "tip",
          "text": "Python uses indentation (not braces) to define blocks — be consistent (4 spaces)."
        }
      }
    ],
    "practice": "Write a line that prints a name and count using an f-string."
  },
  "sc-py-02": {
    "intro": "Python's built-in types and collections cover most needs.",
    "sections": [
      {
        "h": "Scalars",
        "ul": [
          {
            "b": "str, int, float, bool",
            "t": ""
          },
          {
            "b": "None",
            "t": "= absence of value"
          }
        ]
      },
      {
        "h": "Collections",
        "code": "fruits = ['apple', 'pear']      # list (ordered, mutable)\npoint = (3, 4)                  # tuple (immutable)\nuser = {'name': 'Ada', 'age': 36}  # dict (key/value)\nunique = {1, 2, 3}              # set (unique)"
      },
      {
        "h": "Access",
        "note": {
          "kind": "tip",
          "text": "fruits[0] → 'apple'; user['name'] → 'Ada'; len(fruits) → length."
        }
      }
    ],
    "practice": "Create a dict for a server (name + ip) and print the ip."
  },
  "sc-py-03": {
    "intro": "Branch and repeat with if/elif/else and loops.",
    "sections": [
      {
        "h": "Conditionals",
        "code": "if n > 10:\n    print('big')\nelif n == 10:\n    print('ten')\nelse:\n    print('small')"
      },
      {
        "h": "Loops",
        "code": "for fruit in fruits:\n    print(fruit)\n\nfor i in range(5):   # 0..4\n    print(i)\n\nwhile n > 0:\n    n -= 1"
      },
      {
        "h": "Control",
        "note": {
          "kind": "tip",
          "text": "break exits a loop; continue skips to the next iteration."
        }
      }
    ],
    "practice": "Write a for loop that prints numbers 0 through 4."
  },
  "sc-py-04": {
    "intro": "Reuse code with functions and tap the ecosystem with modules.",
    "sections": [
      {
        "h": "Functions",
        "code": "def disk_free_gb(path='/'):\n    import shutil\n    return shutil.disk_usage(path).free / 1e9\n\nprint(disk_free_gb())"
      },
      {
        "h": "Modules & pip",
        "code": "import os, json          # standard library\nfrom datetime import date\n# third-party:\npip install requests"
      },
      {
        "h": "Reuse",
        "note": {
          "kind": "info",
          "text": "The standard library (os, sys, json, re, datetime) covers a lot before you need pip packages."
        }
      }
    ],
    "practice": "Define a function with a default parameter that returns a value."
  },
  "sc-py-05": {
    "intro": "Read/write files safely and handle errors gracefully.",
    "sections": [
      {
        "h": "Files",
        "code": "with open('log.txt') as f:      # auto-closes\n    for line in f:\n        print(line.strip())\n\nwith open('out.txt', 'w') as f:\n    f.write('done')"
      },
      {
        "h": "Errors",
        "code": "try:\n    n = int(value)\nexcept ValueError:\n    print('not a number')\nfinally:\n    print('always runs')"
      },
      {
        "h": "Why 'with'",
        "note": {
          "kind": "tip",
          "text": "The with statement closes the file automatically, even on error."
        }
      }
    ],
    "practice": "Write a try/except that converts input to int and handles a bad value."
  },
  "sc-py-06": {
    "intro": "Automate real tasks: run commands, parse data, and call APIs.",
    "sections": [
      {
        "h": "System tasks",
        "code": "import os, subprocess\nos.listdir('.')                     # list files\nsubprocess.run(['ping', '-c', '1', 'example.com'])"
      },
      {
        "h": "Parsing & APIs",
        "code": "import json, requests\nr = requests.get('https://api.example.com/status')\ndata = r.json()\nprint(data['state'])"
      },
      {
        "h": "Automation mindset",
        "note": {
          "kind": "tip",
          "text": "Read input (files/args/APIs) → transform → output (file/report). Small scripts compound into big time savings."
        }
      }
    ],
    "practice": "Outline a script that reads a log file and counts lines containing 'ERROR'."
  },
  "sc-py-07": {
    "intro": "Regex extracts structure from text — indispensable for parsing logs, configs, and output.",
    "sections": [
      {
        "h": "The re module",
        "code": "import re\nre.search(r'\\d+', 'abc123')      # first match object\nre.findall(r'\\d+', 'a1 b2 c3')     # ['1','2','3']\nm = re.search(r'(\\w+)@(\\w+)', 'ada@corp')\nm.group(1)                         # 'ada'"
      },
      {
        "h": "Common patterns",
        "ul": [
          {
            "b": "\\d",
            "t": "digit"
          },
          {
            "b": "\\w",
            "t": "word char"
          },
          {
            "b": "\\s",
            "t": "whitespace"
          },
          {
            "b": "+ * ?",
            "t": "quantifiers"
          },
          {
            "b": "( )",
            "t": "capture group"
          }
        ]
      },
      {
        "h": "Where it pays off",
        "note": {
          "kind": "info",
          "text": "In the real world: Extracting IPs, timestamps, or error codes from thousands of log lines is a regex one-liner — this is the single most reused skill in IT scripting."
        }
      }
    ],
    "practice": "Write a findall that pulls every number out of a string."
  },
  "sc-py-08": {
    "intro": "Most automation talks to web APIs. Use requests to fetch and send JSON.",
    "sections": [
      {
        "h": "GET and JSON",
        "code": "import requests\nr = requests.get('https://api.example.com/servers',\n                 headers={'Authorization': 'Bearer TOKEN'})\nr.raise_for_status()\ndata = r.json()"
      },
      {
        "h": "POST",
        "code": "requests.post(url, json={'name': 'srv01'}, headers=headers)"
      },
      {
        "h": "Status codes",
        "ul": [
          {
            "b": "200",
            "t": "OK"
          },
          {
            "b": "401/403",
            "t": "auth problem"
          },
          {
            "b": "404",
            "t": "not found"
          },
          {
            "b": "429",
            "t": "rate limited"
          },
          {
            "b": "5xx",
            "t": "server error"
          }
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: Cloud and monitoring tools (Azure, ticketing, Slack) all expose REST APIs — a short Python script can pull inventory, open tickets, or post alerts automatically."
        }
      }
    ],
    "practice": "Write a GET request with a bearer token that parses the JSON response."
  },
  "sc-py-09": {
    "intro": "Tie it together: read a log, extract with regex, aggregate, and write a report.",
    "sections": [
      {
        "h": "Count errors by type",
        "code": "import re, collections\ncounts = collections.Counter()\nwith open('app.log') as f:\n    for line in f:\n        m = re.search(r'ERROR (\\w+)', line)\n        if m:\n            counts[m.group(1)] += 1\nfor kind, n in counts.most_common():\n    print(f'{kind}: {n}')"
      },
      {
        "h": "Extend it",
        "ul": [
          "Write results to a CSV/JSON report",
          "Filter by date range",
          "Alert if a threshold is exceeded"
        ]
      },
      {
        "h": "The payoff",
        "note": {
          "kind": "info",
          "text": "In the real world: A 15-line script like this replaces manual log scrolling — schedule it and it becomes a daily health report or an alert pipeline."
        }
      }
    ],
    "practice": "Outline a script that counts how many times each ERROR type appears in a log."
  },
  "sc-py-10": {
    "intro": "Lists are the workhorse collection; comprehensions make transforming them concise.",
    "sections": [
      {
        "h": "List basics",
        "code": "hosts = ['srv01','srv02','srv03']\nhosts.append('srv04')\nhosts[0]            # 'srv01'\nhosts[-1]           # last\nlen(hosts)"
      },
      {
        "h": "Comprehensions",
        "code": "up = [h.upper() for h in hosts]\nweb = [h for h in hosts if h.startswith('srv')]\nports = [(h, 443) for h in hosts]"
      },
      {
        "h": "Why it matters",
        "note": {
          "kind": "info",
          "text": "In the real world: Comprehensions replace loop boilerplate — building a list of unreachable hosts or failed logins becomes a single readable line."
        }
      }
    ],
    "practice": "Write a comprehension that keeps only hostnames starting with 'db'."
  },
  "sc-py-11": {
    "intro": "Key/value lookups and unique collections — essential for structured data.",
    "sections": [
      {
        "h": "Dictionaries",
        "code": "user = {'name':'Ada','dept':'IT'}\nuser['dept']             # 'IT'\nuser.get('phone','n/a')  # safe default\nfor k,v in user.items(): print(k,v)"
      },
      {
        "h": "Sets",
        "code": "a = {1,2,3}; b = {3,4}\na & b   # intersection {3}\na | b   # union\na - b   # difference"
      },
      {
        "h": "Use cases",
        "note": {
          "kind": "info",
          "text": "In the real world: Dicts model records (a user, a server) and sets dedupe fast — e.g. comparing 'accounts in AD' vs 'accounts in HR' is one set difference."
        }
      }
    ],
    "practice": "Given two sets of usernames, write the expression for accounts in AD but not HR."
  },
  "sc-py-12": {
    "intro": "CSV is the universal exchange format for IT data — read and write it cleanly.",
    "sections": [
      {
        "h": "Read",
        "code": "import csv\nwith open('users.csv', newline='') as f:\n    for row in csv.DictReader(f):\n        print(row['email'])"
      },
      {
        "h": "Write",
        "code": "with open('out.csv','w',newline='') as f:\n    w = csv.DictWriter(f, fieldnames=['host','status'])\n    w.writeheader()\n    w.writerow({'host':'srv01','status':'up'})"
      },
      {
        "h": "Bulk ops",
        "note": {
          "kind": "info",
          "text": "In the real world: DictReader turns each row into a dict keyed by header — feed a CSV of new hires straight into an account-creation loop."
        }
      }
    ],
    "practice": "Write a loop that prints the 'email' column of every row in users.csv."
  },
  "sc-py-13": {
    "intro": "JSON is how APIs and config files speak — parse and produce it.",
    "sections": [
      {
        "h": "Parse & dump",
        "code": "import json\ndata = json.loads('{\"name\":\"srv01\"}')\ndata['name']\njson.dumps({'ok':True}, indent=2)"
      },
      {
        "h": "Files",
        "code": "with open('config.json') as f:\n    cfg = json.load(f)\nwith open('out.json','w') as f:\n    json.dump(cfg, f, indent=2)"
      },
      {
        "h": "APIs",
        "note": {
          "kind": "info",
          "text": "In the real world: Nearly every REST response is JSON — json handling is the bridge between an API call and a usable Python object."
        }
      }
    ],
    "practice": "Write code that loads config.json into a dict."
  },
  "sc-py-14": {
    "intro": "Legacy systems and some configs still use XML — parse it with the standard library.",
    "sections": [
      {
        "h": "Parse",
        "code": "import xml.etree.ElementTree as ET\ntree = ET.parse('data.xml')\nroot = tree.getroot()\nfor item in root.findall('item'):\n    print(item.get('id'), item.text)"
      },
      {
        "h": "From a string",
        "code": "root = ET.fromstring('<r><a>1</a></r>')\nroot.find('a').text   # '1'"
      },
      {
        "h": "When you meet it",
        "note": {
          "kind": "info",
          "text": "In the real world: Windows event exports, some monitoring feeds, and older APIs return XML — ElementTree extracts the fields you need without extra dependencies."
        }
      }
    ],
    "practice": "Write code that prints the text of every <item> element in data.xml."
  },
  "sc-py-15": {
    "intro": "Real APIs need auth, handle paging, and fail — write clients that cope.",
    "sections": [
      {
        "h": "Auth & errors",
        "code": "import requests\nr = requests.get(url, headers={'Authorization':f'Bearer {token}'}, timeout=10)\nr.raise_for_status()\ndata = r.json()"
      },
      {
        "h": "Pagination",
        "code": "results, page = [], 1\nwhile True:\n    r = requests.get(url, params={'page':page}).json()\n    results += r['items']\n    if not r.get('next'): break\n    page += 1"
      },
      {
        "h": "Resilience",
        "note": {
          "kind": "info",
          "text": "In the real world: Timeouts, raise_for_status, and retry/backoff separate a script that dies at 2am from one that logs the error and moves on — essential for unattended automation."
        }
      }
    ],
    "practice": "Write a paginated GET loop that stops when there's no 'next' page."
  },
  "sc-py-16": {
    "intro": "Run commands on remote Linux hosts from Python — core cross-platform admin.",
    "sections": [
      {
        "h": "Connect & run",
        "code": "import paramiko\nc = paramiko.SSHClient()\nc.set_missing_host_key_policy(paramiko.AutoAddPolicy())\nc.connect('host', username='admin', key_filename='~/.ssh/id_rsa')\nstdin, stdout, stderr = c.exec_command('df -h')\nprint(stdout.read().decode())\nc.close()"
      },
      {
        "h": "Best practices",
        "ul": [
          "Prefer key auth over passwords",
          "Set timeouts",
          "Close connections / use context managers"
        ]
      },
      {
        "h": "Fleet automation",
        "note": {
          "kind": "info",
          "text": "In the real world: Paramiko lets one script push a command or config to dozens of Linux servers — the Python equivalent of PowerShell remoting for the *nix side of the house."
        }
      }
    ],
    "practice": "Write the calls to connect via key auth and run 'uptime' on a remote host."
  },
  "sc-py-17": {
    "intro": "Check reachability and ports from Python for diagnostics and monitoring.",
    "sections": [
      {
        "h": "Port check",
        "code": "import socket\ndef port_open(host, port, t=2):\n    with socket.socket() as s:\n        s.settimeout(t)\n        return s.connect_ex((host, port)) == 0\nport_open('srv01', 443)"
      },
      {
        "h": "Ping via subprocess",
        "code": "import subprocess\nsubprocess.run(['ping','-c','1','host'], capture_output=True)"
      },
      {
        "h": "Sweeps",
        "note": {
          "kind": "info",
          "text": "In the real world: A short socket loop can scan a list of hosts/ports to confirm a service rollout — faster and more repeatable than manual telnet checks."
        }
      }
    ],
    "practice": "Write a function that returns True if a TCP port is open on a host."
  },
  "sc-py-18": {
    "intro": "Read live system metrics in Python and alert on thresholds.",
    "sections": [
      {
        "h": "Metrics",
        "code": "import psutil\npsutil.cpu_percent(interval=1)\npsutil.virtual_memory().percent\npsutil.disk_usage('/').percent"
      },
      {
        "h": "Threshold alert",
        "code": "if psutil.disk_usage('/').percent > 90:\n    print('ALERT: disk over 90%')"
      },
      {
        "h": "Cross-platform",
        "note": {
          "kind": "info",
          "text": "In the real world: psutil works on Windows and Linux, so one monitoring script covers a mixed fleet — schedule it and pipe alerts to email or a webhook."
        }
      }
    ],
    "practice": "Write a check that alerts when memory usage exceeds 85%."
  },
  "sc-py-19": {
    "intro": "Send reports and alerts programmatically with smtplib.",
    "sections": [
      {
        "h": "Send mail",
        "code": "import smtplib\nfrom email.message import EmailMessage\nm = EmailMessage()\nm['From']='bot@corp'; m['To']='it@corp'; m['Subject']='Disk alert'\nm.set_content('srv01 disk at 92%')\nwith smtplib.SMTP('smtp.corp', 587) as s:\n    s.starttls(); s.login('bot','pw'); s.send_message(m)"
      },
      {
        "h": "Attach a report",
        "p": [
          "Use m.add_attachment(...) to attach a CSV/HTML report generated by your script."
        ]
      },
      {
        "h": "Alerting loop",
        "note": {
          "kind": "info",
          "text": "In the real world: Wiring monitoring + email means the system tells you about problems — the shift from reactive ('users reported it') to proactive ('the script caught it first')."
        }
      }
    ],
    "practice": "Outline the steps to send an alert email with a CSV attachment."
  },
  "sc-py-20": {
    "intro": "Batch file operations with os, shutil, and pathlib.",
    "sections": [
      {
        "h": "pathlib",
        "code": "from pathlib import Path\nfor p in Path('logs').glob('*.log'):\n    print(p.name, p.stat().st_size)"
      },
      {
        "h": "Move / copy / delete",
        "code": "import shutil, os\nshutil.copy('a.txt','backup/')\nshutil.move('b.tmp','archive/')\nos.remove('old.log')"
      },
      {
        "h": "Batch rename",
        "code": "for i, p in enumerate(Path('.').glob('*.jpg')):\n    p.rename(f'img_{i:03}.jpg')",
        "note": {
          "kind": "info",
          "text": "In the real world: A 10-line pathlib script renames or sorts thousands of files consistently — the kind of tedious task that eats an afternoon by hand."
        }
      }
    ],
    "practice": "Write a loop that prints the size of every .log file in a folder."
  },
  "sc-py-21": {
    "intro": "Turn collected data into readable CSV and HTML reports.",
    "sections": [
      {
        "h": "CSV report",
        "code": "import csv\nrows = [{'host':'srv01','free':'12%'}]\nwith open('report.csv','w',newline='') as f:\n    w = csv.DictWriter(f, fieldnames=rows[0].keys()); w.writeheader(); w.writerows(rows)"
      },
      {
        "h": "Simple HTML",
        "code": "html = '<table>' + ''.join(\n  f\"<tr><td>{r['host']}</td><td>{r['free']}</td></tr>\" for r in rows) + '</table>'\nopen('report.html','w').write(html)"
      },
      {
        "h": "Deliver",
        "note": {
          "kind": "info",
          "text": "In the real world: Pair report generation with email or a shared folder and you've built an automated daily/weekly status report — a visible win that makes your work matter to managers."
        }
      }
    ],
    "practice": "Write code that writes a list of dicts to a CSV report with a header."
  },
  "sc-py-22": {
    "intro": "Create and update tickets via a REST API — connect monitoring to your ITSM.",
    "sections": [
      {
        "h": "Create a ticket",
        "code": "import requests\npayload = {'title':'Disk full on srv01','priority':'high'}\nr = requests.post(f'{base}/tickets', json=payload,\n                  headers={'Authorization':f'Bearer {token}'})\nticket_id = r.json()['id']"
      },
      {
        "h": "Update / comment",
        "code": "requests.patch(f'{base}/tickets/{ticket_id}', json={'status':'in_progress'})"
      },
      {
        "h": "Close the loop",
        "note": {
          "kind": "info",
          "text": "In the real world: When a monitor detects an issue and opens a ticket automatically — with the host, metric, and timestamp pre-filled — you turn noise into tracked, assignable work."
        }
      }
    ],
    "practice": "Outline how a monitoring alert would open a ticket via an API."
  },
  "sc-py-23": {
    "intro": "Practical scripts that remove repetitive help-desk toil.",
    "sections": [
      {
        "h": "Bulk actions from CSV",
        "code": "import csv\nfor row in csv.DictReader(open('resets.csv')):\n    # call your identity API / log the action\n    print('reset requested for', row['user'])"
      },
      {
        "h": "Common wins",
        "ul": [
          "Bulk password-reset requests / logging",
          "Stale-account report (last login > 90d)",
          "Auto-triage: tag tickets by keyword"
        ]
      },
      {
        "h": "Value",
        "note": {
          "kind": "info",
          "text": "In the real world: Automating even a 5-minute task done 30x/day frees hours weekly — help-desk automation is the clearest, fastest ROI you can demonstrate."
        }
      }
    ],
    "practice": "Describe a help-desk task you'd automate and the inputs/outputs."
  },
  "sc-py-24": {
    "intro": "A multi-step project: inventory a fleet and flag issues.",
    "sections": [
      {
        "h": "The brief",
        "p": [
          "Read a list of hosts, check each host's reachability and (via SSH) disk usage, and produce a report of hosts over 85% disk."
        ]
      },
      {
        "h": "Skeleton",
        "code": "import paramiko, csv\nresults = []\nfor host in open('hosts.txt').read().split():\n    try:\n        c = paramiko.SSHClient(); c.set_missing_host_key_policy(paramiko.AutoAddPolicy())\n        c.connect(host, username='admin', timeout=5)\n        out = c.exec_command('df -h / | tail -1')[1].read().decode()\n        results.append({'host':host, 'disk':out.split()[4]})\n        c.close()\n    except Exception as e:\n        results.append({'host':host, 'disk':f'ERR {e}'})"
      },
      {
        "h": "Finish",
        "ul": [
          "Write results to CSV",
          "Flag/alert hosts over threshold",
          "Handle unreachable hosts gracefully"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: A fleet inventory-and-flag script is a staple sysadmin deliverable — it shows you can combine remoting, error handling, and reporting."
        }
      }
    ],
    "practice": "List the three steps this fleet-check project performs per host."
  },
  "sc-py-25": {
    "intro": "Bring it together: a scheduled monitor that reports and alerts.",
    "sections": [
      {
        "h": "The brief",
        "p": [
          "Every run: gather CPU, memory, and disk via psutil; if any exceeds its threshold, send an email alert; always append a timestamped row to a CSV history."
        ]
      },
      {
        "h": "Skeleton",
        "code": "import psutil, csv, smtplib\nfrom datetime import datetime\nfrom email.message import EmailMessage\n\nm = {'time':datetime.now().isoformat(),\n     'cpu':psutil.cpu_percent(1),\n     'mem':psutil.virtual_memory().percent,\n     'disk':psutil.disk_usage('/').percent}\nwith open('health.csv','a',newline='') as f:\n    csv.DictWriter(f, fieldnames=m).writerow(m)\nif m['disk'] > 90 or m['mem'] > 90:\n    pass  # send_alert(m) via smtplib"
      },
      {
        "h": "Ship it",
        "ul": [
          "Wrap in try/except + logging",
          "Schedule (cron / Task Scheduler)",
          "Send email or webhook on threshold breach"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: This capstone is genuinely deployable — CPU/mem/disk monitoring with history and alerts is something small teams actually run in production."
        }
      }
    ],
    "practice": "Name the three metrics the monitor records and the alert condition."
  }
};
