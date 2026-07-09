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
  },
  "sc-ps-10": {
    "intro": "Bulk file work is the bread and butter of scripting — enumerate, filter, and act on files at scale.",
    "sections": [
      {
        "h": "Enumerate & filter",
        "code": "Get-ChildItem C:\\logs -Recurse -Filter *.log\nGet-ChildItem | Where-Object Length -gt 1MB\nGet-ChildItem -Directory   # folders only"
      },
      {
        "h": "Act on files",
        "code": "Copy-Item a.txt D:\\backup\\\nMove-Item *.tmp C:\\temp\\\nRemove-Item old.log\nNew-Item -ItemType Directory -Path C:\\reports"
      },
      {
        "h": "Clean-up pattern",
        "code": "# delete logs older than 30 days\nGet-ChildItem C:\\logs -Recurse -File |\n  Where-Object LastWriteTime -lt (Get-Date).AddDays(-30) |\n  Remove-Item -Force",
        "note": {
          "kind": "info",
          "text": "In the real world: Automated log/temp cleanup on a schedule is one of the first scripts every admin writes — it reclaims disk before it becomes an outage."
        }
      }
    ],
    "practice": "Write a pipeline that deletes .tmp files older than 7 days under C:\\temp."
  },
  "sc-ps-11": {
    "intro": "Query and control Windows services and running processes — core troubleshooting automation.",
    "sections": [
      {
        "h": "Services",
        "code": "Get-Service | Where-Object Status -eq 'Stopped'\nStart-Service Spooler\nRestart-Service Spooler\nSet-Service Spooler -StartupType Automatic"
      },
      {
        "h": "Processes",
        "code": "Get-Process | Sort-Object CPU -Descending | Select-Object -First 5\nStop-Process -Name notepad -Force"
      },
      {
        "h": "Health check",
        "note": {
          "kind": "info",
          "text": "In the real world: A script that finds auto-start services which are stopped and restarts them keeps critical apps (print, backup agents) alive without a human noticing they fell over."
        }
      }
    ],
    "practice": "Write a command to find all stopped services set to start automatically."
  },
  "sc-ps-12": {
    "intro": "Read the Windows event log and registry programmatically for diagnostics and configuration.",
    "sections": [
      {
        "h": "Event logs",
        "code": "Get-WinEvent -LogName System -MaxEvents 20\nGet-WinEvent -FilterHashtable @{LogName='System'; Level=2}  # errors\nGet-EventLog -LogName Application -EntryType Error -Newest 10"
      },
      {
        "h": "Registry",
        "code": "Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion'\nSet-ItemProperty 'HKCU:\\Software\\MyApp' -Name Mode -Value 'fast'\nNew-Item 'HKCU:\\Software\\MyApp'",
        "note": {
          "kind": "info",
          "text": "In the real world: Pulling the last N System errors into a daily email means you spot a failing disk or driver before users report it."
        }
      }
    ],
    "practice": "Write a command to pull the 10 most recent System error events."
  },
  "sc-ps-13": {
    "intro": "Test connectivity and inspect network config without leaving the shell.",
    "sections": [
      {
        "h": "Connectivity",
        "code": "Test-Connection google.com -Count 2   # ping\nTest-NetConnection -ComputerName srv01 -Port 443\nResolve-DnsName example.com"
      },
      {
        "h": "Config",
        "code": "Get-NetIPAddress\nGet-NetAdapter\nGet-DnsClientServerAddress"
      },
      {
        "h": "Bulk reachability",
        "note": {
          "kind": "info",
          "text": "In the real world: Test-NetConnection to a port (not just ping) tells you if a service is actually reachable through the firewall — the real question behind most 'is the server up?' tickets."
        }
      }
    ],
    "practice": "Write a command to test whether port 443 is open on host srv01."
  },
  "sc-ps-14": {
    "intro": "Automate the user lifecycle in Active Directory — the highest-value admin automation.",
    "sections": [
      {
        "h": "Query users",
        "code": "Import-Module ActiveDirectory\nGet-ADUser -Filter \"Enabled -eq 'True'\" -Properties LastLogonDate\nSearch-ADAccount -LockedOut\nSearch-ADAccount -AccountInactive -TimeSpan 90.00:00:00"
      },
      {
        "h": "Manage",
        "code": "New-ADUser -Name 'Ada Byte' -SamAccountName abyte -Enabled $true\nSet-ADUser abyte -Department 'IT'\nAdd-ADGroupMember 'Helpdesk' -Members abyte\nDisable-ADAccount abyte"
      },
      {
        "h": "Lifecycle",
        "note": {
          "kind": "info",
          "text": "In the real world: Onboarding and offboarding are almost entirely scriptable — New-ADUser + group adds on hire, Disable-ADAccount + group removal on exit. This is a top interview talking point."
        }
      }
    ],
    "practice": "Write a command to find AD accounts inactive for 90+ days."
  },
  "sc-ps-15": {
    "intro": "Run scripts on a schedule and query deep system info via CIM/WMI.",
    "sections": [
      {
        "h": "Scheduled tasks",
        "code": "$a = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-File C:\\s\\report.ps1'\n$t = New-ScheduledTaskTrigger -Daily -At 6am\nRegister-ScheduledTask -TaskName 'DailyReport' -Action $a -Trigger $t"
      },
      {
        "h": "CIM/WMI",
        "code": "Get-CimInstance Win32_LogicalDisk | Select DeviceID, FreeSpace, Size\nGet-CimInstance Win32_OperatingSystem\nGet-CimInstance Win32_ComputerSystem"
      },
      {
        "h": "Why CIM",
        "note": {
          "kind": "info",
          "text": "In the real world: Get-CimInstance surfaces hardware/OS details (disk space, uptime, model) that power inventory and monitoring scripts across a whole fleet."
        }
      }
    ],
    "practice": "Write a CIM query that reports free space on each logical disk."
  },
  "sc-ps-16": {
    "intro": "Read and write the data formats every integration and report uses.",
    "sections": [
      {
        "h": "CSV",
        "code": "Import-Csv users.csv | ForEach-Object { $_.Email }\nGet-Process | Export-Csv procs.csv -NoTypeInformation"
      },
      {
        "h": "JSON",
        "code": "$data = Get-Content config.json | ConvertFrom-Json\n$data.servers\n@{name='srv01'} | ConvertTo-Json"
      },
      {
        "h": "XML",
        "code": "[xml]$doc = Get-Content data.xml\n$doc.root.item",
        "note": {
          "kind": "info",
          "text": "In the real world: Import-Csv drives bulk operations — feed a spreadsheet of new hires into New-ADUser and you've onboarded 50 people in one run."
        }
      }
    ],
    "practice": "Write a line that reads users.csv and outputs each Email field."
  },
  "sc-ps-17": {
    "intro": "Combine everything into a real deliverable: a scheduled system health report.",
    "sections": [
      {
        "h": "The brief",
        "p": [
          "Build a script that gathers disk space, stopped auto-start services, and recent system errors, then writes a timestamped report and (optionally) emails it — scheduled daily."
        ]
      },
      {
        "h": "Skeleton",
        "code": "$report = @()\n$report += Get-CimInstance Win32_LogicalDisk |\n  Select DeviceID, @{n='FreeGB';e={[math]::Round($_.FreeSpace/1GB,1)}}\n$stopped = Get-Service | Where-Object {$_.StartType -eq 'Automatic' -and $_.Status -eq 'Stopped'}\n$errors  = Get-WinEvent -FilterHashtable @{LogName='System';Level=2} -MaxEvents 10\n$report | Export-Csv \"C:\\reports\\health_$(Get-Date -f yyyyMMdd).csv\" -NoTypeInformation"
      },
      {
        "h": "Finish it",
        "ul": [
          "Wrap in try/catch + logging",
          "Register-ScheduledTask to run daily",
          "Optionally Send-MailMessage the summary"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: This single script is portfolio-worthy — it demonstrates CIM, filtering, error handling, exporting, and scheduling: exactly what a junior admin role expects."
        }
      }
    ],
    "practice": "Outline the three data sources your health report gathers and where it writes them."
  },
  "sc-ps-18": {
    "intro": "Talk to web services directly from the shell — the glue between tools.",
    "sections": [
      {
        "h": "GET & POST",
        "code": "$r = Invoke-RestMethod https://api.example.com/servers `\n     -Headers @{ Authorization = 'Bearer TOKEN' }\n$r.servers\nInvoke-RestMethod https://api.example.com/tickets -Method Post `\n  -Body (@{title='Disk full'} | ConvertTo-Json) -ContentType 'application/json'"
      },
      {
        "h": "Why Invoke-RestMethod",
        "p": [
          "It parses JSON responses into objects automatically (vs Invoke-WebRequest which returns raw)."
        ]
      },
      {
        "h": "Automate integrations",
        "note": {
          "kind": "info",
          "text": "In the real world: A few lines of Invoke-RestMethod can open tickets, post Teams/Slack alerts, or pull cloud inventory — turning manual portal clicking into a scheduled job."
        }
      }
    ],
    "practice": "Write a GET call with a bearer token that returns parsed objects."
  },
  "sc-ps-19": {
    "intro": "Turn raw log files into answers with pattern matching and grouping.",
    "sections": [
      {
        "h": "Search text",
        "code": "Select-String -Path C:\\logs\\*.log -Pattern 'ERROR'\nSelect-String app.log -Pattern 'user (\\w+) failed' -AllMatches"
      },
      {
        "h": "Aggregate",
        "code": "Select-String app.log -Pattern 'ERROR (\\w+)' |\n  ForEach-Object { $_.Matches.Groups[1].Value } |\n  Group-Object | Sort-Object Count -Descending"
      },
      {
        "h": "Report",
        "note": {
          "kind": "info",
          "text": "In the real world: Grouping errors by type across a day's logs turns a wall of text into a ranked 'top failures' list — the fastest way to know what to fix first."
        }
      }
    ],
    "practice": "Write a command that counts occurrences of each ERROR type in a log."
  },
  "sc-ps-20": {
    "intro": "Watch thresholds and alert before small problems become outages.",
    "sections": [
      {
        "h": "Threshold check",
        "code": "$disk = Get-CimInstance Win32_LogicalDisk -Filter \"DeviceID='C:'\"\n$freePct = [math]::Round($disk.FreeSpace / $disk.Size * 100, 1)\nif ($freePct -lt 10) { Write-Warning \"Low disk: $freePct%\" }"
      },
      {
        "h": "Repeatable checks",
        "ul": [
          "Disk free %, CPU load, service status, ping to key hosts",
          "Emit a warning / send an alert when a threshold is crossed"
        ]
      },
      {
        "h": "Alerting",
        "note": {
          "kind": "info",
          "text": "In the real world: A scheduled monitor that emails when disk < 10% or a service is down buys you hours of lead time — the difference between a calm fix and a 2am outage."
        }
      }
    ],
    "practice": "Write a check that warns when C: free space drops below 10%."
  },
  "sc-ps-21": {
    "intro": "Script reliable, dated, self-pruning backups.",
    "sections": [
      {
        "h": "Timestamped copy",
        "code": "$stamp = Get-Date -Format yyyyMMdd\nCopy-Item C:\\data\\* \"D:\\backup\\$stamp\\\" -Recurse -Force"
      },
      {
        "h": "Compress + retention",
        "code": "Compress-Archive C:\\data \"D:\\backup\\data_$stamp.zip\"\n# keep 14 days\nGet-ChildItem D:\\backup\\*.zip |\n  Where-Object LastWriteTime -lt (Get-Date).AddDays(-14) |\n  Remove-Item"
      },
      {
        "h": "3-2-1",
        "note": {
          "kind": "info",
          "text": "In the real world: A backup script that dates archives and prunes old ones enforces retention automatically — pair it with an offsite copy to satisfy the 3-2-1 rule."
        }
      }
    ],
    "practice": "Write a snippet that zips a folder with today's date in the filename."
  },
  "sc-ps-22": {
    "intro": "Report on and document Group Policy at scale.",
    "sections": [
      {
        "h": "GPO cmdlets",
        "code": "Import-Module GroupPolicy\nGet-GPO -All | Select DisplayName, ModificationTime\nGet-GPOReport -Name 'Default Domain Policy' -ReportType Html -Path gpo.html"
      },
      {
        "h": "Result on a client",
        "code": "gpresult /r          # applied policies\ngpresult /h rsop.html"
      },
      {
        "h": "Documentation",
        "note": {
          "kind": "info",
          "text": "In the real world: Get-GPOReport exports every policy to HTML — instant, auditable documentation that would take hours to compile by hand before a change or audit."
        }
      }
    ],
    "practice": "Write a command to export a full HTML report of a named GPO."
  },
  "sc-ps-23": {
    "intro": "A grab-bag of diagnostic one-liners and safe-run habits.",
    "sections": [
      {
        "h": "Fast diagnostics",
        "code": "Get-Service | Where Status -eq 'Stopped' -and StartType -eq 'Automatic'\nGet-CimInstance Win32_OperatingSystem | Select LastBootUpTime\nGet-WinEvent -FilterHashtable @{LogName='System';Level=1,2} -MaxEvents 20"
      },
      {
        "h": "Safe habits",
        "ul": [
          "Use -WhatIf to preview destructive actions",
          "Use -Verbose for traceable output",
          "Test on one machine before a fleet"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: -WhatIf has saved countless admins from a bad Remove-Item across production — always dry-run destructive automation first."
        }
      }
    ],
    "practice": "Name two switches that make a script safer to run."
  },
  "sc-ps-24": {
    "intro": "Package your functions into a shareable module.",
    "sections": [
      {
        "h": "From script to module",
        "code": "# MyTools.psm1\nfunction Get-DiskFreeGB {\n  param([Parameter(Mandatory)][string]$Drive)\n  [math]::Round((Get-PSDrive $Drive).Free/1GB,1)\n}\nExport-ModuleMember -Function Get-DiskFreeGB"
      },
      {
        "h": "Use it",
        "code": "Import-Module .\\MyTools.psm1\nGet-DiskFreeGB -Drive C"
      },
      {
        "h": "Why modules",
        "note": {
          "kind": "info",
          "text": "In the real world: Turning your best one-off functions into a shared module means the whole team runs the same vetted tools instead of copy-pasting snippets — the mark of a maturing automation practice."
        }
      }
    ],
    "practice": "Write a .psm1 that exports a single function."
  },
  "sc-ps-25": {
    "intro": "The definitive project: bulk-onboard users from a CSV, end to end.",
    "sections": [
      {
        "h": "The brief",
        "p": [
          "Read a CSV of new hires, create each AD user, add them to department groups, create a home folder, and write a result report — with error handling."
        ]
      },
      {
        "h": "Skeleton",
        "code": "Import-Csv newhires.csv | ForEach-Object {\n  try {\n    New-ADUser -Name $_.Name -SamAccountName $_.User -Department $_.Dept -Enabled $true -ErrorAction Stop\n    Add-ADGroupMember $_.Dept -Members $_.User\n    New-Item \"\\\\srv\\home\\$($_.User)\" -ItemType Directory -Force\n    [pscustomobject]@{ User=$_.User; Status='OK' }\n  } catch {\n    [pscustomobject]@{ User=$_.User; Status=\"ERR: $($_.Exception.Message)\" }\n  }\n} | Export-Csv onboard_result.csv -NoTypeInformation"
      },
      {
        "h": "Ship it",
        "ul": [
          "Validate CSV columns first",
          "Log every action",
          "Schedule or run on demand"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: This capstone mirrors a genuine HR-to-IT onboarding pipeline — being able to describe and build it is exactly what lands a junior sysadmin role."
        }
      }
    ],
    "practice": "List the four actions your onboarding script performs per CSV row."
  }
};
