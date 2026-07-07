import type { LessonContent } from '../model';

export const scpsLessons: Record<string, LessonContent> = {
  "sc-ps-01": {
    "intro": "PowerShell is a shell and scripting language built on .NET. Commands are cmdlets in a consistent Verb-Noun form.",
    "sections": [
      {
        "h": "Where it runs",
        "p": [
          "Windows PowerShell (5.1) ships with Windows; PowerShell 7+ (cross-platform) is a separate install. Run it in the console or VS Code."
        ]
      },
      {
        "h": "Cmdlets: Verb-Noun",
        "code": "Get-Process\nGet-Service\nGet-Command *service*   # discover commands\nGet-Help Get-Process -Examples  # learn any command"
      },
      {
        "h": "Discoverability",
        "note": {
          "kind": "tip",
          "text": "Get-Command finds cmdlets; Get-Help explains them. You rarely need to memorize — you explore."
        }
      }
    ],
    "practice": "Write the command to find help (with examples) for Get-Service."
  },
  "sc-ps-02": {
    "intro": "PowerShell's superpower: cmdlets pass .NET objects (not text) down the pipeline, so you can filter and shape data precisely.",
    "sections": [
      {
        "h": "Everything is objects",
        "p": [
          "Get-Process returns process objects with properties (Name, CPU, Id). Pipe them to other cmdlets to refine."
        ]
      },
      {
        "h": "The core trio",
        "code": "Get-Process | Where-Object CPU -gt 100      # filter\nGet-Process | Select-Object Name, CPU        # pick columns\nGet-Process | Sort-Object CPU -Descending    # order"
      },
      {
        "h": "Inspect objects",
        "note": {
          "kind": "tip",
          "text": "Pipe to Get-Member to see an object's properties and methods: Get-Process | Get-Member."
        }
      }
    ],
    "practice": "Write a pipeline that lists the top 5 processes by CPU, showing only Name and CPU."
  },
  "sc-ps-03": {
    "intro": "Store and compare data with variables, arrays, and hashtables.",
    "sections": [
      {
        "h": "Variables & types",
        "code": "$name = 'Ada'\n$count = 42\n$items = @('a','b','c')       # array\n$user = @{ Name='Ada'; Age=36 } # hashtable"
      },
      {
        "h": "Comparison operators",
        "ul": [
          {
            "b": "-eq / -ne",
            "t": "equal / not equal"
          },
          {
            "b": "-gt / -lt / -ge / -le",
            "t": "greater/less"
          },
          {
            "b": "-like / -match",
            "t": "wildcard / regex"
          }
        ],
        "note": {
          "kind": "warn",
          "text": "PowerShell uses -eq, not == (== is not a PowerShell operator)."
        }
      },
      {
        "h": "Access",
        "p": [
          "$items[0] is 'a'; $user.Name is 'Ada'. Use $items.Count for length."
        ]
      }
    ],
    "practice": "Declare a hashtable for a server (name + IP) and access the IP."
  },
  "sc-ps-04": {
    "intro": "Make decisions and repeat work with conditionals and loops.",
    "sections": [
      {
        "h": "Conditionals",
        "code": "if ($n -gt 10) { 'big' }\nelseif ($n -eq 10) { 'ten' }\nelse { 'small' }\n\nswitch ($status) { 'ok' {'good'} default {'unknown'} }"
      },
      {
        "h": "Loops",
        "code": "foreach ($s in Get-Service) { $s.Name }\nfor ($i=0; $i -lt 5; $i++) { $i }\nGet-Process | ForEach-Object { $_.Name }"
      },
      {
        "h": "The pipeline variable",
        "note": {
          "kind": "tip",
          "text": "$_ (or $PSItem) is the current object inside Where-Object/ForEach-Object."
        }
      }
    ],
    "practice": "Write a foreach loop that prints the name of every stopped service."
  },
  "sc-ps-05": {
    "intro": "Package reusable logic into functions and save scripts as .ps1 files.",
    "sections": [
      {
        "h": "Functions",
        "code": "function Get-DiskFreeGB {\n  param([string]$Drive = 'C')\n  (Get-PSDrive $Drive).Free / 1GB\n}\nGet-DiskFreeGB -Drive C"
      },
      {
        "h": "Scripts (.ps1)",
        "p": [
          "Save commands in a .ps1 file and run it. Parameters via param() at the top make scripts reusable."
        ]
      },
      {
        "h": "Execution policy",
        "note": {
          "kind": "warn",
          "text": "Scripts may be blocked by execution policy. Set-ExecutionPolicy RemoteSigned (admin) allows local scripts; understand the security trade-off."
        }
      }
    ],
    "practice": "Write a function with a parameter that returns free space for a given drive."
  },
  "sc-ps-06": {
    "intro": "Put it together: query the system, filter, and export — the essence of admin automation.",
    "sections": [
      {
        "h": "Common tasks",
        "code": "# Top 5 CPU consumers to CSV\nGet-Process | Sort-Object CPU -Descending |\n  Select-Object -First 5 Name, CPU |\n  Export-Csv top.csv -NoTypeInformation\n\n# Stopped services\nGet-Service | Where-Object Status -eq 'Stopped'"
      },
      {
        "h": "Files & scheduling",
        "ul": [
          "Get-ChildItem (ls) to enumerate files",
          "Export-Csv / ConvertTo-Json for output",
          "Schedule scripts with Task Scheduler for recurring automation"
        ]
      },
      {
        "h": "Mindset",
        "note": {
          "kind": "tip",
          "text": "Explore with Get-Command/Get-Member, build a one-liner, then save it as a script."
        }
      }
    ],
    "practice": "Write a one-liner that exports all stopped services to a CSV file."
  }
};
