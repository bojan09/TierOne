import type { LessonContent } from '../model';

export const winservergpLessons: Record<string, LessonContent> = {
  "ws-gp-01": {
    "intro": "Group Policy centrally configures users and computers. Knowing how a GPO is built and stored explains how settings actually reach a machine.",
    "sections": [
      {
        "h": "What a GPO contains",
        "ul": [
          {
            "b": "Computer configuration:",
            "t": "applies to the machine at startup and refresh."
          },
          {
            "b": "User configuration:",
            "t": "applies to the user at logon and refresh."
          }
        ]
      },
      {
        "h": "Where GPOs live",
        "ul": [
          {
            "b": "Group Policy Container (GPC):",
            "t": "the object in AD (metadata, version)."
          },
          {
            "b": "Group Policy Template (GPT):",
            "t": "the files in SYSVOL (the actual settings)."
          }
        ]
      },
      {
        "h": "Linking",
        "p": [
          "A GPO takes effect only when linked to a site, domain, or OU. One GPO can be linked in multiple places; edits apply everywhere it's linked."
        ]
      },
      {
        "h": "Refresh",
        "note": {
          "kind": "info",
          "text": "Policy applies at startup/logon and refreshes roughly every 90 minutes (with a random offset) — or immediately with gpupdate."
        }
      }
    ],
    "practice": "In the Group Policy Management Console, create a GPO, note its GUID, and find the matching folder under \\\\domain\\SYSVOL. Link it to a test OU."
  },
  "ws-gp-02": {
    "intro": "When multiple GPOs apply, the order they process determines who wins. This is the single most important thing to understand for predictable results.",
    "sections": [
      {
        "h": "LSDOU order",
        "p": [
          "GPOs process Local, then Site, then Domain, then OU (deepest last). Later wins, so the OU closest to the object generally takes precedence on conflicting settings."
        ]
      },
      {
        "h": "Changing the outcome",
        "ul": [
          {
            "b": "Link order:",
            "t": "among GPOs on one container, lower link order number wins."
          },
          {
            "b": "Enforced:",
            "t": "forces a GPO to win and prevents it being blocked."
          },
          {
            "b": "Block Inheritance:",
            "t": "stops inherited GPOs at an OU (Enforced overrides this)."
          }
        ]
      },
      {
        "h": "Security filtering",
        "p": [
          "A GPO applies only to users/computers with Read and Apply permissions — use security filtering to target specific groups."
        ]
      },
      {
        "h": "Loopback",
        "note": {
          "kind": "info",
          "text": "Loopback processing applies user settings based on the computer's location — common for kiosks and shared machines."
        }
      }
    ],
    "practice": "Create two GPOs with a conflicting setting, link both to an OU, and use link order + Enforced to control which one wins. Verify with gpresult."
  },
  "ws-gp-03": {
    "intro": "Group Policy's most common job is enforcing security baselines. These settings harden every machine consistently.",
    "sections": [
      {
        "h": "Account and password policy",
        "p": [
          "Set at the domain level: minimum password length, complexity, lockout threshold, and duration. In modern AD, fine-grained password policies can target specific groups."
        ]
      },
      {
        "h": "User rights & audit",
        "ul": [
          {
            "b": "User rights assignment:",
            "t": "who can log on locally, as a service, etc."
          },
          {
            "b": "Audit policy:",
            "t": "what security events are logged (logons, object access)."
          }
        ]
      },
      {
        "h": "Administrative templates",
        "p": [
          "Thousands of registry-backed settings (ADMX files) control Windows and app behaviour — from screen lock timeouts to disabling features."
        ]
      },
      {
        "h": "Baselines",
        "note": {
          "kind": "tip",
          "text": "Start from Microsoft's Security Baselines rather than hand-building policy — then tailor."
        }
      }
    ],
    "practice": "Create a GPO that enforces a screen-lock timeout and an audit policy for logon events; link it to a test OU and confirm it applies."
  },
  "ws-gp-04": {
    "intro": "Group Policy Preferences (GPP) configure things that aren't strict 'policy' — like mapped drives, printers, and registry keys — with powerful targeting.",
    "sections": [
      {
        "h": "What preferences do",
        "ul": [
          "Map network drives",
          "Deploy printers",
          "Set registry values and environment variables",
          "Create shortcuts and files"
        ]
      },
      {
        "h": "Policy vs preference",
        "p": [
          "Policies are enforced and re-applied; preferences set an initial state a user can often change. Preferences are ideal for defaults."
        ]
      },
      {
        "h": "Item-level targeting",
        "p": [
          "Each preference can be filtered by OS, group membership, IP range, and more — so one GPO can apply different settings to different targets."
        ]
      },
      {
        "h": "Caution",
        "note": {
          "kind": "warn",
          "text": "Never store passwords in GPP — historically they were recoverable. Microsoft removed that capability for good reason."
        }
      }
    ],
    "practice": "Create a GPP that maps a network drive only for members of a specific security group using item-level targeting."
  },
  "ws-gp-05": {
    "intro": "Group Policy can redirect user folders to the network and install software automatically — two classic enterprise capabilities.",
    "sections": [
      {
        "h": "Folder redirection",
        "p": [
          "Redirect Documents, Desktop, and other known folders to a network share so data is centralised, backed up, and follows the user between machines."
        ]
      },
      {
        "h": "Software deployment",
        "ul": [
          {
            "b": "Assigned to computers:",
            "t": "installs at startup for all users of the machine."
          },
          {
            "b": "Assigned/published to users:",
            "t": "installs at logon or on demand."
          }
        ]
      },
      {
        "h": "Packaging",
        "p": [
          "GPSI deploys Windows Installer (.msi) packages. For anything more complex, most organisations now use dedicated tools (Intune, Configuration Manager)."
        ]
      },
      {
        "h": "Reality check",
        "note": {
          "kind": "info",
          "text": "Folder redirection pairs well with Offline Files so users keep working when the share is unavailable."
        }
      }
    ],
    "practice": "Configure folder redirection for Documents to a share for a test OU, and note how you would assign an .msi to computers via GPO."
  },
  "ws-gp-06": {
    "intro": "When a policy 'isn't applying,' a short set of tools tells you exactly what happened and why.",
    "sections": [
      {
        "h": "The core tools",
        "ul": [
          {
            "b": "gpupdate /force:",
            "t": "reapply policy immediately."
          },
          {
            "b": "gpresult /h report.html:",
            "t": "a Resultant Set of Policy report showing what applied and what was filtered."
          }
        ]
      },
      {
        "h": "Common causes",
        "ul": [
          "The GPO isn't linked to the right OU",
          "Security filtering excludes the object",
          "Block Inheritance or precedence is overriding it",
          "SYSVOL/replication problems"
        ]
      },
      {
        "h": "Replication and SYSVOL",
        "p": [
          "If DCs disagree, clients may get old settings. Check SYSVOL replication (DFSR) and AD replication with repadmin."
        ]
      },
      {
        "h": "Slow links & loopback",
        "note": {
          "kind": "info",
          "text": "Some settings are skipped over slow links, and loopback can explain 'wrong' user settings on shared machines."
        }
      }
    ],
    "practice": "Run gpresult /h on a test machine, identify one GPO that was filtered out and why, then fix the cause and re-verify."
  }
};
