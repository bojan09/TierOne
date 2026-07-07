import type { LessonContent } from '../model';

export const casecLessons: Record<string, LessonContent> = {
  "ca-sec-01": {
    "intro": "Recognize the threats A+ techs defend against and how malware spreads.",
    "sections": [
      {
        "h": "Malware types",
        "ul": [
          {
            "b": "Virus/worm:",
            "t": "self-replicating."
          },
          {
            "b": "Trojan:",
            "t": "disguised as legit."
          },
          {
            "b": "Ransomware:",
            "t": "encrypts for payment."
          },
          {
            "b": "Spyware/keylogger:",
            "t": "steals info."
          }
        ]
      },
      {
        "h": "Social engineering",
        "ul": [
          {
            "b": "Phishing:",
            "t": "fake emails/links."
          },
          {
            "b": "Tailgating, shoulder surfing",
            "t": "— physical."
          },
          {
            "b": "Pretexting",
            "t": "— a fabricated scenario."
          }
        ],
        "note": {
          "kind": "warn",
          "text": "The human is the most common attack vector — train users."
        }
      },
      {
        "h": "Response",
        "p": [
          "Isolate the machine, identify/quarantine, remediate (scan/clean or reimage), educate the user."
        ]
      }
    ],
    "practice": "Match: encrypts files for payment; disguised as legitimate software; fake email to steal credentials."
  },
  "ca-sec-02": {
    "intro": "Everyday hardening: authentication, least privilege, and safe configuration.",
    "sections": [
      {
        "h": "Authentication",
        "ul": [
          {
            "b": "Strong passwords + MFA",
            "t": "— the biggest wins."
          },
          {
            "b": "Least privilege",
            "t": "— users get only what they need."
          },
          {
            "b": "Account lockout",
            "t": "— slows brute force."
          }
        ]
      },
      {
        "h": "System hardening",
        "ul": [
          "Patch/update promptly",
          "Antivirus/anti-malware",
          "Disable unused services/ports",
          "Firewall on"
        ]
      },
      {
        "h": "Data handling",
        "note": {
          "kind": "tip",
          "text": "Encrypt sensitive data (BitLocker), back up (3-2-1), and wipe drives before disposal."
        }
      }
    ],
    "practice": "Name the single highest-impact account-security control and one hardening step."
  },
  "ca-sec-03": {
    "intro": "Security isn't only digital — physical access and proper disposal matter.",
    "sections": [
      {
        "h": "Physical controls",
        "ul": [
          "Locks, badge access, mantraps",
          "Cable locks for laptops",
          "Screen privacy filters"
        ]
      },
      {
        "h": "Data destruction",
        "ul": [
          {
            "b": "Wipe:",
            "t": "overwrite (reusable)."
          },
          {
            "b": "Degauss/shred:",
            "t": "physical destruction."
          },
          {
            "b": "Certificate of destruction",
            "t": "for compliance."
          }
        ]
      },
      {
        "h": "Backups",
        "note": {
          "kind": "info",
          "text": "3-2-1: three copies, two media types, one offsite. Test restores."
        }
      }
    ],
    "practice": "Give a physical control and a compliant data-destruction method."
  },
  "ca-sec-04": {
    "intro": "Securing Wi-Fi and the authentication concepts A+ expects.",
    "sections": [
      {
        "h": "Wireless security",
        "ul": [
          {
            "b": "WPA3 > WPA2-AES",
            "t": "; avoid WEP/TKIP."
          },
          {
            "b": "Enterprise (802.1X/RADIUS)",
            "t": "vs personal (PSK)."
          }
        ]
      },
      {
        "h": "Authentication concepts",
        "ul": [
          {
            "b": "MFA:",
            "t": "something you know/have/are."
          },
          {
            "b": "SSO:",
            "t": "one login, many apps."
          },
          {
            "b": "AAA:",
            "t": "authentication, authorization, accounting."
          }
        ]
      },
      {
        "h": "Best practice",
        "note": {
          "kind": "warn",
          "text": "Change default SSID/admin password; use a strong passphrase or enterprise auth."
        }
      }
    ],
    "practice": "Differentiate WPA2-Personal (PSK) from WPA2-Enterprise (RADIUS)."
  },
  "ca-sec-05": {
    "intro": "CompTIA's structured 7-step malware removal procedure — tested in order.",
    "sections": [
      {
        "h": "The 7 steps",
        "ul": [
          "1. Investigate & verify symptoms",
          "2. Quarantine the system",
          "3. Disable System Restore (Windows)",
          "4. Remediate — update tools, scan & remove",
          "5. Schedule scans & run updates",
          "6. Re-enable System Restore & create a restore point",
          "7. Educate the end user"
        ],
        "note": {
          "kind": "tip",
          "text": "Disable System Restore BEFORE cleaning so malware isn't preserved in restore points."
        }
      },
      {
        "h": "Why the order",
        "p": [
          "Quarantine stops spread; disabling restore prevents reinfection from snapshots; education prevents recurrence."
        ]
      },
      {
        "h": "If cleaning fails",
        "p": [
          "Reimage from a known-good image and restore data from clean backups."
        ]
      }
    ],
    "practice": "Why do you disable System Restore before remediation, and re-enable it after?"
  },
  "ca-sec-06": {
    "intro": "The attacks that target people and networks.",
    "sections": [
      {
        "h": "Social engineering",
        "ul": [
          {
            "b": "Phishing / spear phishing / whaling",
            "t": ""
          },
          {
            "b": "Vishing (voice), smishing (SMS)",
            "t": ""
          },
          {
            "b": "Tailgating, shoulder surfing, dumpster diving",
            "t": ""
          }
        ]
      },
      {
        "h": "Network attacks",
        "ul": [
          {
            "b": "DoS/DDoS:",
            "t": "overwhelm a service."
          },
          {
            "b": "MITM:",
            "t": "intercept traffic."
          },
          {
            "b": "Zero-day:",
            "t": "unknown vulnerability."
          }
        ]
      },
      {
        "h": "Defense",
        "note": {
          "kind": "tip",
          "text": "User training + MFA + patching defeat most of these."
        }
      }
    ],
    "practice": "Match: fake call, fake SMS, targeting executives — to vishing, smishing, whaling."
  }
};
