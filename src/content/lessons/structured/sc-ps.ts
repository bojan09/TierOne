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
  },
  "sc-ps-07": {
    "intro": "Production scripts must fail safely. Handle errors, control their behavior, and debug when things break.",
    "sections": [
      {
        "h": "try / catch / finally",
        "code": "try {\n  Get-Content missing.txt -ErrorAction Stop\n} catch {\n  Write-Warning \"Failed: $($_.Exception.Message)\"\n} finally {\n  'cleanup runs always'\n}"
      },
      {
        "h": "Error control",
        "ul": [
          {
            "b": "-ErrorAction Stop",
            "t": "makes a non-terminating error catchable"
          },
          {
            "b": "$Error[0]",
            "t": "the most recent error"
          },
          {
            "b": "-ErrorVariable e",
            "t": "capture without stopping"
          }
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: Cmdlet errors are non-terminating by default — without -ErrorAction Stop your catch block never runs and a broken script keeps going."
        }
      },
      {
        "h": "Debugging",
        "p": [
          "Set-PSBreakpoint or the VS Code debugger; Write-Verbose with -Verbose for traceable output."
        ]
      }
    ],
    "practice": "Wrap a file read in try/catch so a missing file logs a warning instead of crashing."
  },
  "sc-ps-08": {
    "intro": "Run commands on remote machines and extend PowerShell with modules from the Gallery.",
    "sections": [
      {
        "h": "Remoting",
        "code": "Invoke-Command -ComputerName SRV01 -ScriptBlock { Get-Service }\n$s = New-PSSession -ComputerName SRV01\nInvoke-Command -Session $s -ScriptBlock { $env:COMPUTERNAME }"
      },
      {
        "h": "Modules",
        "code": "Get-Module -ListAvailable\nImport-Module ActiveDirectory\nInstall-Module -Name Pester   # from PSGallery"
      },
      {
        "h": "Why it matters",
        "note": {
          "kind": "info",
          "text": "In the real world: Admins rarely log into servers one by one — Invoke-Command runs a fix across dozens of machines at once, and modules (like ActiveDirectory) are how real admin tasks get automated."
        }
      }
    ],
    "practice": "Write a command that runs Get-Service on a remote server named SRV01."
  },
  "sc-ps-09": {
    "intro": "Combine parameters, pipeline input, and logging into a script you'd actually run in production.",
    "sections": [
      {
        "h": "A parameterized, logged script",
        "code": "param([Parameter(Mandatory)][string]$UserName)\n\n$log = \"C:\\logs\\offboard.log\"\nfunction Write-Log($m){ \"$(Get-Date -f s) $m\" | Add-Content $log }\n\ntry {\n  Write-Log \"Disabling $UserName\"\n  # Disable-ADAccount -Identity $UserName -ErrorAction Stop\n  Write-Log \"Done\"\n} catch { Write-Log \"ERROR: $($_.Exception.Message)\" }"
      },
      {
        "h": "Good script hygiene",
        "ul": [
          "Mandatory params + validation",
          "Log actions with timestamps",
          "-WhatIf support for safe dry-runs",
          "Idempotent where possible"
        ]
      },
      {
        "h": "Scheduling",
        "note": {
          "kind": "info",
          "text": "In the real world: This is how routine ops actually run: a parameterized script + Task Scheduler handles nightly cleanups, user offboarding, and report generation without anyone touching a console."
        }
      }
    ],
    "practice": "Sketch a script with a mandatory -UserName parameter that logs each action with a timestamp."
  }
};
