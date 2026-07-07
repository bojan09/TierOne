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
  }
};
