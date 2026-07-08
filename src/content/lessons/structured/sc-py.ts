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
  }
};
