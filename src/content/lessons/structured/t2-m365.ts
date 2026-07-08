import type { LessonContent } from '../model';

export const t2m365Lessons: Record<string, LessonContent> = {
  "t2-m365-01": {
    "intro": "The Microsoft 365 admin center is where you manage users, licenses, and services. Tier 2 lives here daily.",
    "sections": [
      {
        "h": "What you manage",
        "ul": [
          "Users: create, reset passwords, assign licenses, block sign-in",
          "Groups: Microsoft 365 groups, distribution lists, security groups",
          "Services: Exchange, SharePoint, Teams settings and health"
        ]
      },
      {
        "h": "Admin roles",
        "p": [
          "Least privilege applies: assign specific roles (e.g. Helpdesk Admin, User Admin) rather than Global Admin. Global Admin is powerful and should be rare."
        ]
      },
      {
        "h": "Service health",
        "note": {
          "kind": "tip",
          "text": "Before deep-diving a 'everything's down' ticket, check the Service health dashboard — the issue may be a Microsoft-side incident."
        }
      }
    ],
    "practice": "In the admin center (or from memory), list where you'd go to reset a password, assign a license, and check if Outlook is down for everyone."
  },
  "t2-m365-02": {
    "intro": "Licensing decides which apps and features a user gets. Assigning the right plan — and spotting the wrong one — is a common Tier 2 task.",
    "sections": [
      {
        "h": "Common business plans",
        "ul": [
          {
            "b": "Business Basic:",
            "t": "web/mobile apps + Exchange, Teams, SharePoint (no desktop Office)."
          },
          {
            "b": "Business Standard:",
            "t": "adds the desktop Office (Microsoft 365) apps."
          },
          {
            "b": "Business Premium:",
            "t": "Standard + advanced security and device management (Intune)."
          },
          {
            "b": "Apps for Business:",
            "t": "the Office apps only, without the services."
          }
        ]
      },
      {
        "h": "Enterprise plans",
        "ul": [
          {
            "b": "E3:",
            "t": "enterprise apps + services and core security/compliance."
          },
          {
            "b": "E5:",
            "t": "E3 plus advanced security, analytics, and voice."
          }
        ]
      },
      {
        "h": "Symptoms of the wrong license",
        "note": {
          "kind": "info",
          "text": "'Outlook won't activate' or 'no desktop apps' is often a Basic/Apps license where the user needs Standard/E3 — check and reassign."
        }
      }
    ],
    "practice": "A user on Business Basic says the Outlook desktop app won't activate. Explain the likely cause and fix."
  },
  "t2-m365-03": {
    "intro": "Email is the highest-volume M365 support area. These are the mailbox concepts Tier 2 handles.",
    "sections": [
      {
        "h": "Mailbox types",
        "ul": [
          {
            "b": "User mailbox:",
            "t": "a person's mailbox."
          },
          {
            "b": "Shared mailbox:",
            "t": "a no-license mailbox several users access (e.g. support@)."
          },
          {
            "b": "Distribution list:",
            "t": "delivers to a group of recipients."
          }
        ]
      },
      {
        "h": "Common tasks",
        "ul": [
          "Grant access/Send As to a shared mailbox",
          "Add an alias (extra address) to a mailbox",
          "Release a message from quarantine"
        ]
      },
      {
        "h": "Mail flow issues",
        "note": {
          "kind": "info",
          "text": "For 'I didn't get an email', check quarantine, the recipient address, and message trace before assuming a server problem."
        }
      }
    ],
    "practice": "A team needs everyone to send from support@company.com. Describe the mailbox type and access you'd set up."
  },
  "t2-m365-04": {
    "intro": "Microsoft 365 identity runs on Entra ID. Multi-factor authentication and conditional access are core to securing it — and to the tickets you'll see.",
    "sections": [
      {
        "h": "Entra ID (Azure AD)",
        "p": [
          "The cloud identity behind M365 — accounts, sign-in, and access policies live here. It may sync from on-prem AD (hybrid identity)."
        ]
      },
      {
        "h": "MFA & SSPR",
        "ul": [
          {
            "b": "MFA:",
            "t": "a second factor (app/code) beyond the password — the biggest single security win."
          },
          {
            "b": "Self-service password reset (SSPR):",
            "t": "lets users reset their own password after verifying."
          }
        ]
      },
      {
        "h": "Conditional Access",
        "note": {
          "kind": "info",
          "text": "Conditional Access allows/blocks sign-ins based on conditions (location, device, risk). A blocked login may be policy working as intended — check before 'fixing' it."
        }
      }
    ],
    "practice": "A user is prompted for MFA from a new country and blocked. Explain what could be happening before you change anything."
  },
  "t2-m365-05": {
    "intro": "Beyond email, Tier 2 supports collaboration and managed devices. Here's the lay of the land.",
    "sections": [
      {
        "h": "Teams & SharePoint/OneDrive",
        "ul": [
          {
            "b": "Teams:",
            "t": "chat/meetings; issues are often audio/video devices or membership."
          },
          {
            "b": "SharePoint/OneDrive:",
            "t": "file storage and sharing; issues are often permissions or sync."
          }
        ]
      },
      {
        "h": "Sharing & permissions",
        "p": [
          "Most 'I can't open this file' tickets are sharing/permission problems — confirm who owns it and how it was shared."
        ]
      },
      {
        "h": "Intune (MDM) intro",
        "note": {
          "kind": "info",
          "text": "Intune manages and secures devices — enrollment, compliance policies, and app deployment. Enrollment/compliance is a growing Tier 2 area."
        }
      }
    ],
    "practice": "A user can't edit a shared SharePoint document. List the first two things you'd verify."
  },
  "t2-m365-06": {
    "intro": "Email delivery issues are core M365 admin work.",
    "sections": [
      {
        "h": "Diagnose delivery",
        "ul": [
          "Message trace (admin center) — where did it stop?",
          "Check quarantine / spam policies",
          "Verify the recipient exists / not blocked"
        ]
      },
      {
        "h": "Mail flow concepts",
        "ul": [
          {
            "b": "Connectors",
            "t": "route mail to/from external systems"
          },
          {
            "b": "SPF/DKIM/DMARC",
            "t": "anti-spoofing — misconfig causes rejects"
          },
          {
            "b": "Transport rules",
            "t": "org-wide mail handling"
          }
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: When external mail 'disappears', a message trace tells you in seconds whether it was quarantined, rejected by SPF, or never arrived — always start there."
        }
      },
      {
        "h": "NDRs",
        "p": [
          "Read the non-delivery report code (e.g. 550 5.4.1) — it names the cause."
        ]
      }
    ],
    "practice": "A user says an external email never arrived — what's your first diagnostic tool?"
  },
  "t2-m365-07": {
    "intro": "Support the collaboration stack most orgs live in.",
    "sections": [
      {
        "h": "Teams",
        "ul": [
          "Teams sit on a SharePoint site + M365 group",
          "Common issues: cache (clear Teams cache), permissions, guest access"
        ]
      },
      {
        "h": "SharePoint/OneDrive",
        "ul": [
          "Permissions inherit from the site; broken inheritance causes access issues",
          "Sync issues → reset OneDrive, check storage quota"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: Most 'I can't open the file' tickets are permissions inheritance or a stale OneDrive sync — check access first, then clear the cache; reimaging is almost never the answer."
        }
      },
      {
        "h": "Licensing",
        "p": [
          "Features depend on the assigned license — verify before deep troubleshooting."
        ]
      }
    ],
    "practice": "A user can't access a Teams file others can — what two things do you check?"
  }
};
