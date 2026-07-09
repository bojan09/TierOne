import type { LessonContent } from '../model';

export const hdeverydayLessons: Record<string, LessonContent> = {
  "hd-eve-01": {
    "intro": "The single most common ticket — done securely.",
    "sections": [
      {
        "h": "Reset securely",
        "ul": [
          "Verify identity first (never skip)",
          "Reset, require change at next logon",
          "Never send a password over chat/email in the clear"
        ]
      },
      {
        "h": "MFA",
        "ul": [
          "Something you know + have/are",
          "Reset/re-enroll MFA when a device is lost",
          "Watch for MFA-fatigue social engineering"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: Attackers call the help desk pretending to be a user to get a reset — identity verification is your front-line security control, not a formality."
        }
      },
      {
        "h": "Self-service",
        "p": [
          "Encourage SSPR (self-service password reset) to cut volume."
        ]
      }
    ],
    "practice": "List the identity-verification steps before resetting a password."
  },
  "hd-eve-02": {
    "intro": "Printing breaks constantly — know the usual suspects.",
    "sections": [
      {
        "h": "Common fixes",
        "ul": [
          "Offline/queue stuck → restart Print Spooler",
          "Driver issues → reinstall correct driver",
          "Network printer down for all → check printer/IP"
        ]
      },
      {
        "h": "Isolate",
        "p": [
          "One user vs everyone? A shared outage is printer/network-side, not the PC."
        ]
      },
      {
        "h": "Consumables",
        "note": {
          "kind": "info",
          "text": "In the real world: Half of 'printer broken' tickets are toner, paper, or a stuck queue — check the simple things before deep troubleshooting."
        }
      }
    ],
    "practice": "A shared printer is offline for everyone — where do you look first?"
  },
  "hd-eve-03": {
    "intro": "Support remote workers and connect to their machines safely.",
    "sections": [
      {
        "h": "VPN issues",
        "ul": [
          "Confirm internet first",
          "Creds/MFA, client version, expired cert",
          "Connected but no access → DNS/routing"
        ]
      },
      {
        "h": "Remote support tools",
        "ul": [
          "Remote Desktop / remote-control tools",
          "Always get user consent; announce actions",
          "Don't leave sessions open"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: Test by IP vs name to split 'VPN down' from 'DNS down' — most 'VPN broken' tickets are actually name resolution."
        }
      },
      {
        "h": "Security",
        "p": [
          "Remote sessions are powerful — verify identity and follow policy."
        ]
      }
    ],
    "practice": "A user's VPN connects but internal sites fail — what do you test?"
  },
  "hd-eve-04": {
    "intro": "Diagnose the most common Outlook/mail complaints.",
    "sections": [
      {
        "h": "Can't send/receive",
        "ul": [
          "Check connectivity + account status",
          "Large mailbox / full quota",
          "Rebuild profile if corrupt"
        ]
      },
      {
        "h": "Missing mail",
        "ul": [
          "Check rules, junk/quarantine, and filters",
          "Use message trace (admin) for delivery"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: A message trace answers 'where did it go?' in seconds — quarantined, rejected, or never arrived — instead of guessing."
        }
      },
      {
        "h": "Mobile mail",
        "p": [
          "Verify server settings/ports and that the device accepted policy."
        ]
      }
    ],
    "practice": "A user says an external email never arrived — first diagnostic step?"
  },
  "hd-eve-05": {
    "intro": "Web-app problems often come down to a few browser basics.",
    "sections": [
      {
        "h": "Usual fixes",
        "ul": [
          "Clear cache/cookies for the site",
          "Try incognito / another browser to isolate",
          "Check extensions (disable to test)"
        ]
      },
      {
        "h": "Deeper",
        "ul": [
          "Certificate/date errors → check system clock",
          "Proxy/DNS issues → test another site",
          "Update the browser"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: 'The website is broken' is often a stale cache or a rogue extension — incognito mode instantly tells you which side the problem is on."
        }
      },
      {
        "h": "Escalate",
        "p": [
          "If it fails across browsers and machines, it's likely server-side — escalate."
        ]
      }
    ],
    "practice": "A web app fails in Chrome but works in incognito — likely cause?"
  }
};
