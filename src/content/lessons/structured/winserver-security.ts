import type { LessonContent } from '../model';

export const winserversecurityLessons: Record<string, LessonContent> = {
  "ws-sec-01": {
    "intro": "Server security starts with a model, not a tool. Least privilege and administrative tiering limit how far any single compromise can spread.",
    "sections": [
      {
        "h": "Core principles",
        "ul": [
          {
            "b": "Least privilege:",
            "t": "grant only the access each account needs."
          },
          {
            "b": "Reduce attack surface:",
            "t": "remove roles, features, and services you don't use."
          },
          {
            "b": "Defence in depth:",
            "t": "layered controls so one failure isn't fatal."
          }
        ]
      },
      {
        "h": "Tiered administration",
        "p": [
          "Separate admin credentials into tiers (domain controllers, servers, workstations) and never use a high-tier credential on a lower-tier machine — this stops credential theft from cascading to Domain Admin."
        ]
      },
      {
        "h": "Privileged access",
        "note": {
          "kind": "tip",
          "text": "Use dedicated admin accounts and Privileged Access Workstations; keep Domain Admins tiny and rarely used."
        }
      }
    ],
    "practice": "Map your admin accounts to tiers and identify one place where a Tier-0 (DC) credential is being used on a lower tier — then plan to fix it."
  },
  "ws-sec-02": {
    "intro": "A shared local Administrator password across machines is a gift to attackers. LAPS fixes it.",
    "sections": [
      {
        "h": "The problem",
        "p": [
          "If every machine has the same local admin password, compromising one exposes them all (a lateral-movement dream)."
        ]
      },
      {
        "h": "How LAPS helps",
        "p": [
          "Windows LAPS sets a unique, random local admin password per machine, rotates it automatically, and stores it securely in Active Directory (or Entra ID) where only authorised admins can read it."
        ]
      },
      {
        "h": "Result",
        "note": {
          "kind": "tip",
          "text": "LAPS is one of the highest-impact, lowest-cost hardening steps you can deploy."
        }
      }
    ],
    "practice": "Explain how LAPS would change an incident where one workstation's local admin password is stolen."
  },
  "ws-sec-03": {
    "intro": "Every Windows Server ships with capable built-in protection — antimalware and a host firewall — that should be configured, not disabled.",
    "sections": [
      {
        "h": "Microsoft Defender Antivirus",
        "p": [
          "Real-time protection built into the OS; on servers it integrates with Defender for Endpoint for EDR. Keep definitions current and avoid broad exclusions."
        ]
      },
      {
        "h": "Defender Firewall",
        "ul": [
          {
            "b": "Profiles:",
            "t": "Domain, Private, Public — different rules per network type."
          },
          {
            "b": "Rules:",
            "t": "inbound and outbound, by port, program, or service."
          }
        ]
      },
      {
        "h": "Stance",
        "note": {
          "kind": "tip",
          "text": "Default-deny inbound and allow only required ports — manage rules centrally with Group Policy."
        }
      }
    ],
    "practice": "Create an inbound firewall rule allowing only a specific app/port on a lab server and confirm other inbound traffic is blocked."
  },
  "ws-sec-04": {
    "intro": "Two protections that defend data at rest and credentials in memory — important for servers in less-controlled locations.",
    "sections": [
      {
        "h": "BitLocker",
        "p": [
          "Full-volume encryption that renders a stolen disk unreadable without the key. Uses a TPM to protect keys; recovery keys should be escrowed in AD."
        ]
      },
      {
        "h": "Credential Guard",
        "p": [
          "Uses virtualization-based security to isolate secrets (like NTLM hashes and Kerberos tickets) so malware can't scrape them from memory — countering pass-the-hash."
        ]
      },
      {
        "h": "Where it matters",
        "note": {
          "kind": "info",
          "text": "BitLocker is especially important for branch-office servers and anything physically exposed."
        }
      }
    ],
    "practice": "On a lab server with a TPM, enable BitLocker on a data volume and confirm the recovery key is backed up to AD."
  },
  "ws-sec-05": {
    "intro": "Unpatched servers are the most common way in. A disciplined update process closes known vulnerabilities before they're exploited.",
    "sections": [
      {
        "h": "Why patch",
        "p": [
          "Most breaches exploit known, already-patched vulnerabilities. Timely patching is the highest-value routine security work."
        ]
      },
      {
        "h": "Managing updates",
        "ul": [
          {
            "b": "WSUS:",
            "t": "approve and distribute Microsoft updates internally."
          },
          {
            "b": "Cloud/modern:",
            "t": "Windows Update for Business, Intune, or Configuration Manager."
          }
        ]
      },
      {
        "h": "Process",
        "note": {
          "kind": "tip",
          "text": "Test in a ring first, schedule maintenance windows, and track compliance — patching without reporting is guesswork."
        }
      }
    ],
    "practice": "Outline a monthly patch cycle for a lab: test ring, approval, maintenance window, and how you'd verify compliance."
  },
  "ws-sec-06": {
    "intro": "You can't detect what you don't log. Auditing produces the evidence for detection, investigation, and compliance.",
    "sections": [
      {
        "h": "Advanced audit policy",
        "p": [
          "Configure via Group Policy to log the events that matter — logons, account management, object access, privilege use — without drowning in noise."
        ]
      },
      {
        "h": "Where events go",
        "ul": [
          {
            "b": "Security log:",
            "t": "audit events on each server."
          },
          {
            "b": "Central collection:",
            "t": "forward to a SIEM or Windows Event Forwarding for correlation."
          }
        ]
      },
      {
        "h": "Key events",
        "note": {
          "kind": "info",
          "text": "Failed logons, new admin group members, and cleared logs are high-signal events worth alerting on."
        }
      }
    ],
    "practice": "Enable auditing for account-management events on a lab DC, add a user to a privileged group, and find the corresponding Security log event."
  },
  "ws-sec-07": {
    "intro": "Hardening is the sum of many small removals and settings. Baselines make it consistent and repeatable.",
    "sections": [
      {
        "h": "Reduce what's exposed",
        "ul": [
          "Install only required roles/features",
          "Disable legacy protocols (e.g. SMBv1)",
          "Enable SMB signing",
          "Turn off unused services"
        ]
      },
      {
        "h": "Protect authentication",
        "ul": [
          {
            "b": "LSA protection:",
            "t": "guards the process holding credentials."
          },
          {
            "b": "Disable NTLM where possible;",
            "t": "prefer Kerberos."
          }
        ]
      },
      {
        "h": "Use baselines",
        "note": {
          "kind": "tip",
          "text": "Apply Microsoft Security Baselines (via the Security Compliance Toolkit) as GPOs, then tailor — far better than hand-rolling."
        }
      }
    ],
    "practice": "Confirm SMBv1 is removed and SMB signing is enabled on a lab server, and note two other services you could safely disable."
  }
};
