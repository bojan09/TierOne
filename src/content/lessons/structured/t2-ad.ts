import type { LessonContent } from '../model';

export const t2adLessons: Record<string, LessonContent> = {
  "t2-ad-01": {
    "intro": "Most Tier 2 AD work is account lifecycle: creating, moving, disabling, and organising users in the right place.",
    "sections": [
      {
        "h": "Account lifecycle",
        "ul": [
          "Create with correct attributes (name, UPN, department)",
          "Move users between OUs as roles change",
          "Disable (don't delete) when someone leaves — preserves history and access references"
        ]
      },
      {
        "h": "Organizational Units",
        "p": [
          "OUs group objects for management and Group Policy. Placing a user in the right OU determines which policies and access they inherit."
        ]
      },
      {
        "h": "Tools",
        "note": {
          "kind": "info",
          "text": "Active Directory Users and Computers (ADUC) is the everyday GUI; PowerShell (Get-ADUser, New-ADUser) scales the same tasks."
        }
      }
    ],
    "practice": "Outline the steps to onboard a new hire's account and place them in the correct OU for their department."
  },
  "t2-ad-02": {
    "intro": "Access problems usually come down to group membership. Fixing them means understanding how groups grant rights.",
    "sections": [
      {
        "h": "Groups grant access",
        "p": [
          "Permissions are assigned to groups; users get access by being members. To grant or remove access, change group membership — not per-user permissions."
        ]
      },
      {
        "h": "Troubleshooting access",
        "ul": [
          "Confirm the user is in the right group",
          "Remember group changes apply at next logon (or token refresh)",
          "Check for a Deny that overrides Allow"
        ]
      },
      {
        "h": "Escalate when",
        "note": {
          "kind": "tip",
          "text": "If access still fails after correct membership, the resource's permissions or a GPO may be involved — gather details and escalate."
        }
      }
    ],
    "practice": "A user can't open a shared folder their teammates can. List the first three things you'd check."
  },
  "t2-ad-03": {
    "intro": "Password resets and account lockouts are the bread and butter of support — do them correctly and securely.",
    "sections": [
      {
        "h": "Reset vs unlock",
        "ul": [
          {
            "b": "Unlock:",
            "t": "the account is locked from failed attempts — unlock it."
          },
          {
            "b": "Reset:",
            "t": "set a new password (require change at next logon)."
          }
        ]
      },
      {
        "h": "Verify identity first",
        "p": [
          "Always confirm you're talking to the real user (per your verification policy) before resetting — password resets are a classic social-engineering target."
        ]
      },
      {
        "h": "Repeat lockouts",
        "note": {
          "kind": "warn",
          "text": "Recurring lockouts often come from a stale password cached on a phone, mapped drive, or service — find the source, don't just keep unlocking."
        }
      }
    ],
    "practice": "A user is locked out for the third time today. Explain what you'd investigate beyond simply unlocking them."
  },
  "t2-ad-04": {
    "intro": "You don't have to author policy, but Tier 2 must recognise when Group Policy is the cause and do first-line checks.",
    "sections": [
      {
        "h": "What GPO does",
        "p": [
          "Group Policy centrally enforces settings (drive maps, security, restrictions) on users and computers based on their OU. A 'weird setting I can't change' is often a GPO."
        ]
      },
      {
        "h": "First-line checks",
        "ul": [
          {
            "b": "gpupdate /force",
            "t": "— reapply policy."
          },
          {
            "b": "gpresult /r or /h report.html",
            "t": "— see which GPOs applied to the user/PC."
          }
        ]
      },
      {
        "h": "When to escalate",
        "note": {
          "kind": "info",
          "text": "If a policy is misapplied or missing, capture the gpresult output and escalate to the team that manages GPOs — don't edit domain policy from the help desk."
        }
      }
    ],
    "practice": "A user says a mapped drive vanished. Show the two commands you'd run to check whether Group Policy is responsible."
  }
};
