import type { LessonContent } from '../model';

export const winserverpowershellLessons: Record<string, LessonContent> = {
  "ws-ps-01": {
    "intro": "PowerShell is the automation engine of Windows Server. Everything you can do in the GUI you can script — faster, repeatably, and at scale.",
    "sections": [
      {
        "h": "Verb-Noun cmdlets",
        "p": [
          "Commands follow a Verb-Noun pattern (Get-Service, Restart-Computer, New-ADUser), which makes them discoverable and consistent."
        ]
      },
      {
        "h": "Discoverability",
        "code": "Get-Command *service*\nGet-Help Get-Service -Examples\nGet-Member       # inspect an object's properties/methods"
      },
      {
        "h": "Objects, not text",
        "note": {
          "kind": "info",
          "text": "PowerShell passes rich objects down the pipeline, so you can filter and act on real properties — not scrape text."
        }
      }
    ],
    "practice": "Use Get-Command, Get-Help, and Get-Member to explore the Get-Service cmdlet and list its properties."
  },
  "ws-ps-02": {
    "intro": "The pipeline is where PowerShell's power lives: select, filter, sort, and shape objects into exactly what you need.",
    "sections": [
      {
        "h": "Core pipeline cmdlets",
        "ul": [
          {
            "b": "Where-Object:",
            "t": "filter by a condition."
          },
          {
            "b": "Select-Object:",
            "t": "choose properties (columns)."
          },
          {
            "b": "Sort-Object:",
            "t": "order results."
          },
          {
            "b": "Measure-Object:",
            "t": "count/sum/average."
          }
        ]
      },
      {
        "h": "Example",
        "code": "Get-Service | Where-Object {$_.Status -eq 'Running'} |\n  Select-Object Name, StartType | Sort-Object Name"
      },
      {
        "h": "Format last",
        "note": {
          "kind": "warn",
          "text": "Format-Table/Format-List are for display only — put them at the very end, never mid-pipeline before more processing."
        }
      }
    ],
    "practice": "Write a one-liner that lists only stopped services, showing Name and StartType, sorted by name."
  },
  "ws-ps-03": {
    "intro": "Day-to-day server tasks map directly to cmdlets — roles, services, logs, and configuration.",
    "sections": [
      {
        "h": "Useful everyday cmdlets",
        "ul": [
          {
            "b": "Install-WindowsFeature / Get-WindowsFeature",
            "t": "— manage roles and features."
          },
          {
            "b": "Get-Service / Restart-Service",
            "t": "— control services."
          },
          {
            "b": "Get-WinEvent",
            "t": "— query event logs efficiently."
          },
          {
            "b": "Get-Disk / Get-Volume",
            "t": "— inspect storage."
          }
        ]
      },
      {
        "h": "Consistency wins",
        "p": [
          "A short script applies the same change to many servers identically — no missed checkboxes, and it's self-documenting."
        ],
        "code": "Install-WindowsFeature Web-Server -IncludeManagementTools"
      }
    ],
    "practice": "Use PowerShell to list installed roles on a lab server and query the last 20 System log errors with Get-WinEvent."
  },
  "ws-ps-04": {
    "intro": "Remoting runs commands on remote servers from one console — essential for managing fleets, including Server Core.",
    "sections": [
      {
        "h": "Running remotely",
        "code": "Invoke-Command -ComputerName SRV1,SRV2 -ScriptBlock { Get-Service DNS }\nEnter-PSSession -ComputerName SRV1     # interactive"
      },
      {
        "h": "Under the hood",
        "p": [
          "Remoting uses WinRM (enabled by Enable-PSRemoting). Persistent sessions (New-PSSession) let you reuse a connection for multiple commands."
        ]
      },
      {
        "h": "Security",
        "note": {
          "kind": "tip",
          "text": "Remoting is encrypted and authenticated; scope who can connect and prefer running against many servers in parallel with Invoke-Command."
        }
      }
    ],
    "practice": "Enable remoting in a lab, then use Invoke-Command to query a service on two servers at once."
  },
  "ws-ps-05": {
    "intro": "The real payoff is doing a hundred things at once — creating users from a spreadsheet, or applying a change across an OU.",
    "sections": [
      {
        "h": "Data-driven changes",
        "code": "Import-Csv .\\users.csv | ForEach-Object {\n  New-ADUser -Name $_.Name -SamAccountName $_.User -Enabled $true\n}"
      },
      {
        "h": "Building blocks",
        "ul": [
          {
            "b": "Loops:",
            "t": "ForEach-Object / foreach to repeat work."
          },
          {
            "b": "Variables & functions:",
            "t": "reuse logic."
          },
          {
            "b": "Error handling:",
            "t": "try/catch with -ErrorAction Stop."
          }
        ]
      },
      {
        "h": "Safety",
        "note": {
          "kind": "warn",
          "text": "Test with -WhatIf first — it shows what a command would change without doing it. Invaluable for bulk operations."
        }
      }
    ],
    "practice": "Write a script that reads a CSV of users and creates them in a test OU — run it first with -WhatIf."
  },
  "ws-ps-06": {
    "intro": "Automation finishes the job when it runs on a schedule, produces reports, and enforces desired state.",
    "sections": [
      {
        "h": "Scheduling",
        "p": [
          "Run scripts unattended with Task Scheduler or scheduled jobs — nightly reports, cleanup, health checks."
        ]
      },
      {
        "h": "Reporting",
        "code": "Get-Service | Where-Object Status -eq 'Stopped' |\n  Export-Csv stopped.csv -NoTypeInformation\n# or ConvertTo-Html for a report"
      },
      {
        "h": "Desired State Configuration",
        "note": {
          "kind": "info",
          "text": "DSC declares the state a server should be in and corrects drift automatically — configuration as code."
        }
      }
    ],
    "practice": "Create a scheduled task that exports stopped services to a CSV daily, and describe in one line what DSC would add."
  }
};
