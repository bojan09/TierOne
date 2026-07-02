import type { LessonContent } from '../model';

export const winservermonitoringLessons: Record<string, LessonContent> = {
  "ws-mon-01": {
    "intro": "The Windows event logs are the first place to look when something goes wrong — and a source of proactive warnings.",
    "sections": [
      {
        "h": "Log basics",
        "ul": [
          {
            "b": "Windows Logs:",
            "t": "System, Application, Security, Setup."
          },
          {
            "b": "Levels:",
            "t": "Information, Warning, Error, Critical."
          }
        ]
      },
      {
        "h": "Work smarter",
        "p": [
          "Custom Views filter across logs for exactly the events you care about; event forwarding centralises logs from many servers."
        ]
      },
      {
        "h": "Correlate",
        "note": {
          "kind": "tip",
          "text": "Note the exact time and Event ID of a failure, then look for related events just before it across logs."
        }
      }
    ],
    "practice": "Create a Custom View on a lab server showing only Errors and Criticals from the System and Application logs in the last 24 hours."
  },
  "ws-mon-02": {
    "intro": "Performance Monitor turns 'the server feels slow' into measured evidence — and a baseline tells you what normal looks like.",
    "sections": [
      {
        "h": "Counters",
        "p": [
          "Track CPU, memory, disk, and network counters live, or over time with Data Collector Sets."
        ]
      },
      {
        "h": "The four usual suspects",
        "ul": [
          {
            "b": "CPU:",
            "t": "sustained high % Processor Time."
          },
          {
            "b": "Memory:",
            "t": "low available MB, high paging."
          },
          {
            "b": "Disk:",
            "t": "long queue lengths / high latency."
          },
          {
            "b": "Network:",
            "t": "saturation or errors."
          }
        ]
      },
      {
        "h": "Baseline first",
        "note": {
          "kind": "tip",
          "text": "Capture a baseline when the server is healthy — you can only spot 'abnormal' if you know 'normal'."
        }
      }
    ],
    "practice": "Create a Data Collector Set capturing CPU, memory, and disk counters on a lab server for a few minutes and review the report."
  },
  "ws-mon-03": {
    "intro": "Many 'server down' issues are really a stopped service or a failed startup. Knowing these controls resolves them quickly.",
    "sections": [
      {
        "h": "Services",
        "ul": [
          {
            "b": "Startup type:",
            "t": "Automatic, Automatic (Delayed), Manual, Disabled."
          },
          {
            "b": "Recovery:",
            "t": "configure a service to restart automatically on failure."
          }
        ]
      },
      {
        "h": "Processes & resources",
        "p": [
          "Task Manager and Resource Monitor show which process is consuming CPU, memory, disk, or network right now."
        ]
      },
      {
        "h": "Dependencies",
        "note": {
          "kind": "info",
          "text": "A service that won't start often has a failed dependency — check the dependency tab and the System log."
        }
      }
    ],
    "practice": "Find a stopped Automatic service on a lab server, set its recovery to restart on failure, and start it."
  },
  "ws-mon-04": {
    "intro": "A repeatable method beats guessing. It gets you to root cause faster and avoids making things worse.",
    "sections": [
      {
        "h": "A systematic approach",
        "ul": [
          "Identify the problem and its scope (who/what/when)",
          "Establish a theory of probable cause",
          "Test the theory — change one thing at a time",
          "Implement the fix and verify",
          "Document the cause and resolution"
        ]
      },
      {
        "h": "Isolate",
        "p": [
          "Narrow the problem: one server or many? one user or all? recent change? Logs and monitoring point at the layer at fault."
        ]
      },
      {
        "h": "Discipline",
        "note": {
          "kind": "warn",
          "text": "Change one variable at a time — changing several at once hides which fix actually worked."
        }
      }
    ],
    "practice": "Take a fictional 'users can't reach the file server' report and write out the five methodical steps you'd follow."
  },
  "ws-mon-05": {
    "intro": "A handful of failure patterns cover most incidents. Recognising them speeds resolution.",
    "sections": [
      {
        "h": "Frequent culprits",
        "ul": [
          {
            "b": "Won't boot:",
            "t": "failed update, disk, or boot configuration — use recovery/last known good."
          },
          {
            "b": "Disk full:",
            "t": "logs, updates, or shadow copies filling a volume."
          },
          {
            "b": "Resource exhaustion:",
            "t": "a runaway process or under-sized VM."
          },
          {
            "b": "Service failure:",
            "t": "dependency or permission problem after a change."
          }
        ]
      },
      {
        "h": "Time & auth issues",
        "p": [
          "On domain members, big clock drift breaks Kerberos, causing logon and access failures — check time sync first for 'random' auth errors."
        ]
      },
      {
        "h": "Prevent recurrence",
        "note": {
          "kind": "tip",
          "text": "After fixing, add monitoring/alerting for that condition so it's caught early next time."
        }
      }
    ],
    "practice": "For a server that suddenly can't authenticate domain users, list the first three things you'd check and why."
  }
};
