import type { LessonContent } from '../model';

export const hdtier1winLessons: Record<string, LessonContent> = {
  "hd-t1-01": {
    "intro": "A repeatable approach to common Windows problems.",
    "sections": [
      {
        "h": "Method",
        "ul": [
          "Reproduce, check recent changes, isolate",
          "Safe Mode to rule out drivers/startup",
          "Event Viewer for clues"
        ]
      },
      {
        "h": "Common issues",
        "ul": [
          "Slow PC → startup apps, disk, malware",
          "App crash → update/reinstall",
          "Boot issues → Startup Repair"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: Booting into Safe Mode first tells you instantly whether it's a driver/startup problem or something deeper — it saves hours of guessing."
        }
      },
      {
        "h": "Tools",
        "p": [
          "Task Manager, Resource Monitor, Reliability History, Event Viewer."
        ]
      }
    ],
    "practice": "List three first checks for a 'slow computer' ticket."
  },
  "hd-t1-02": {
    "intro": "Diagnose hardware and driver issues the Tier-1 way.",
    "sections": [
      {
        "h": "Device Manager",
        "ul": [
          "Yellow ! = driver/hardware problem",
          "Update/rollback/reinstall drivers",
          "Show hidden devices for ghosts"
        ]
      },
      {
        "h": "Drivers",
        "ul": [
          "Get drivers from the vendor/OEM",
          "Roll back a bad driver update",
          "Match the exact model"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: A device that worked yesterday and fails after an update is almost always a driver — roll it back before deeper troubleshooting."
        }
      },
      {
        "h": "Isolate",
        "p": [
          "Test the device on another PC / another port to split device vs machine."
        ]
      }
    ],
    "practice": "A webcam stopped working after updates — what's your first move?"
  },
  "hd-t1-03": {
    "intro": "Keep systems patched and fix update failures.",
    "sections": [
      {
        "h": "Why patch",
        "p": [
          "Updates close security holes and fix bugs — a core security control."
        ]
      },
      {
        "h": "Update failures",
        "ul": [
          "Check disk space + connectivity",
          "Run the Update troubleshooter",
          "Reset Windows Update components if stuck"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: Unpatched machines are the top target for malware — 'we'll update later' is how ransomware gets in."
        }
      },
      {
        "h": "Control",
        "p": [
          "In business, updates are often managed (WSUS/Intune) — know it's centralized."
        ]
      }
    ],
    "practice": "An update keeps failing at install — list two things to check."
  },
  "hd-t1-04": {
    "intro": "Connect to machines remotely to support and administer.",
    "sections": [
      {
        "h": "RDP basics",
        "ul": [
          "Enable Remote Desktop; it uses port 3389",
          "Requires permission + network reachability",
          "Only expose over VPN, never open to the internet"
        ]
      },
      {
        "h": "Alternatives",
        "ul": [
          "Remote-assist tools for user consent sessions",
          "SSH for Linux hosts"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: Exposing RDP (3389) directly to the internet is a classic breach vector — always tunnel it through a VPN."
        }
      },
      {
        "h": "Troubleshoot",
        "p": [
          "Can't connect? Check the service, firewall, IP/name, and permissions."
        ]
      }
    ],
    "practice": "Why should RDP never be exposed directly to the internet?"
  },
  "hd-t1-05": {
    "intro": "Resolve the access tickets that fill a Tier-1 queue.",
    "sections": [
      {
        "h": "NTFS vs Share",
        "ul": [
          "NTFS: granular, local + network",
          "Share: network only",
          "Most restrictive of the two wins"
        ]
      },
      {
        "h": "Groups",
        "ul": [
          "Assign access via groups, not individuals",
          "'Access denied' → check group membership",
          "Least privilege"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: The fastest fix for most access tickets is adding the user to the right security group — resist granting one-off permissions that no one can audit later."
        }
      },
      {
        "h": "Inheritance",
        "p": [
          "Broken inheritance causes surprise denials — check the folder's effective permissions."
        ]
      }
    ],
    "practice": "When Share and NTFS permissions differ, which applies?"
  }
};
