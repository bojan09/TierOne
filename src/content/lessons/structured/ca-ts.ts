import type { LessonContent } from '../model';

export const catsLessons: Record<string, LessonContent> = {
  "ca-ts-01": {
    "intro": "A+ teaches a repeatable 6-step method — memorize the order.",
    "sections": [
      {
        "h": "The 6 steps",
        "ul": [
          "1. Identify the problem",
          "2. Establish a theory (probable cause)",
          "3. Test the theory",
          "4. Establish a plan and implement",
          "5. Verify full functionality (+ preventive measures)",
          "6. Document findings, actions, outcomes"
        ],
        "note": {
          "kind": "tip",
          "text": "Always back up before making changes, and change one thing at a time."
        }
      },
      {
        "h": "Good habits",
        "p": [
          "Ask what changed, reproduce the issue, and check the simple things first (power, cables, connectivity)."
        ]
      },
      {
        "h": "Escalate",
        "p": [
          "If it's beyond your scope or time, escalate with your notes — don't sit on a blocker."
        ]
      }
    ],
    "practice": "List the six troubleshooting steps in order from memory."
  },
  "ca-ts-02": {
    "intro": "Recognize the symptoms of frequent hardware failures.",
    "sections": [
      {
        "h": "Symptoms → causes",
        "ul": [
          {
            "b": "No power/POST:",
            "t": "PSU, power, RAM seating."
          },
          {
            "b": "Random shutdowns:",
            "t": "overheating, failing PSU."
          },
          {
            "b": "BSOD:",
            "t": "driver/RAM/storage."
          },
          {
            "b": "Clicking drive:",
            "t": "failing HDD — back up now."
          }
        ]
      },
      {
        "h": "Overheating",
        "p": [
          "Dust buildup, failed fans, or dried thermal paste cause throttling/shutdowns — clean and reapply paste."
        ]
      },
      {
        "h": "Display/peripherals",
        "note": {
          "kind": "info",
          "text": "No display: reseat GPU/RAM, check cable/input. Dead USB: try another port, check Device Manager."
        }
      }
    ],
    "practice": "A PC shuts down randomly under load — list two likely hardware causes."
  },
  "ca-ts-03": {
    "intro": "The everyday software problems A+ techs resolve.",
    "sections": [
      {
        "h": "OS symptoms",
        "ul": [
          {
            "b": "Slow performance:",
            "t": "startup apps, malware, low disk/RAM."
          },
          {
            "b": "App crashes:",
            "t": "update/reinstall, check compatibility."
          },
          {
            "b": "Boot issues:",
            "t": "Startup Repair, safe mode."
          }
        ]
      },
      {
        "h": "Malware signs",
        "ul": [
          "Pop-ups, redirects, unknown processes, slowdowns → scan and clean/reimage"
        ]
      },
      {
        "h": "Method",
        "note": {
          "kind": "tip",
          "text": "Reproduce, check recent changes, update, and apply the same 6-step method."
        }
      }
    ],
    "practice": "A user reports a slow PC — list three things you'd check first."
  },
  "ca-ts-04": {
    "intro": "Diagnose connectivity like a tech using the standard tools.",
    "sections": [
      {
        "h": "Symptoms",
        "ul": [
          {
            "b": "No connectivity:",
            "t": "cable/adapter, DHCP (APIPA), gateway."
          },
          {
            "b": "Slow:",
            "t": "congestion, Wi-Fi signal, duplex."
          },
          {
            "b": "Intermittent:",
            "t": "interference, failing hardware."
          }
        ]
      },
      {
        "h": "Tools",
        "code": "ipconfig /all      # addressing/DNS\nping <host>        # reachability\ntracert <host>     # path/hops\nnslookup <name>    # DNS"
      },
      {
        "h": "Method",
        "note": {
          "kind": "tip",
          "text": "Test gateway → public IP → name. If IP works but names fail, it's DNS."
        }
      }
    ],
    "practice": "A user can ping 8.8.8.8 but no websites load — what's the likely cause and fix?"
  },
  "ca-ts-05": {
    "intro": "Resolve the most common printing problems.",
    "sections": [
      {
        "h": "Symptoms → fixes",
        "ul": [
          {
            "b": "No print:",
            "t": "offline, queue stuck, connectivity — restart spooler."
          },
          {
            "b": "Streaks/faded (laser):",
            "t": "toner low, dirty drum."
          },
          {
            "b": "Paper jams:",
            "t": "rollers, wrong paper, debris."
          }
        ]
      },
      {
        "h": "Print spooler",
        "p": [
          "A stuck queue blocks all jobs — restart the Print Spooler service (clears queued jobs; warn users)."
        ]
      },
      {
        "h": "Connectivity",
        "note": {
          "kind": "info",
          "text": "Network printer offline for everyone → check the printer's power/network/IP, not one PC."
        }
      }
    ],
    "practice": "A shared printer shows offline for everyone — where do you look first?"
  },
  "ca-ts-06": {
    "intro": "Common mobile and security-symptom fixes.",
    "sections": [
      {
        "h": "Mobile issues",
        "ul": [
          {
            "b": "Poor battery:",
            "t": "background apps, old battery, brightness."
          },
          {
            "b": "No connectivity:",
            "t": "airplane mode, re-pair, reset network."
          },
          {
            "b": "Slow/overheating:",
            "t": "close apps, update, check storage."
          }
        ]
      },
      {
        "h": "Security symptoms",
        "ul": [
          "Pop-ups/redirects, high data use, unknown apps → scan for malware",
          "Fake security alerts → don't click; remove the app"
        ]
      },
      {
        "h": "Method",
        "note": {
          "kind": "tip",
          "text": "Reproduce, check recent installs/changes, update, then apply the 6-step method."
        }
      }
    ],
    "practice": "A phone suddenly has high data use and pop-ups — what do you suspect and do?"
  }
};
