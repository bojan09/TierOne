import type { LessonContent } from '../model';

export const caosLessons: Record<string, LessonContent> = {
  "ca-os-01": {
    "intro": "Know the major operating systems and how they're installed and organized.",
    "sections": [
      {
        "h": "Major OSes",
        "ul": [
          {
            "b": "Windows:",
            "t": "most common desktop; editions (Home/Pro)."
          },
          {
            "b": "macOS:",
            "t": "Apple hardware."
          },
          {
            "b": "Linux:",
            "t": "open-source; many distros."
          },
          {
            "b": "Mobile:",
            "t": "Android, iOS."
          }
        ]
      },
      {
        "h": "Install types",
        "ul": [
          {
            "b": "Clean install",
            "t": "wipes and installs fresh."
          },
          {
            "b": "Upgrade",
            "t": "keeps files/apps."
          },
          {
            "b": "Image/deployment",
            "t": "clone a standard build."
          }
        ]
      },
      {
        "h": "File systems",
        "note": {
          "kind": "info",
          "text": "Windows uses NTFS (permissions, journaling); exFAT/FAT32 for removable media; Linux uses ext4."
        }
      }
    ],
    "practice": "When would you choose a clean install over an in-place upgrade?"
  },
  "ca-os-02": {
    "intro": "The Windows tools A+ techs use daily to configure and manage a system.",
    "sections": [
      {
        "h": "Key tools",
        "ul": [
          {
            "b": "Control Panel / Settings",
            "t": "— system config."
          },
          {
            "b": "Task Manager",
            "t": "— processes, startup, performance."
          },
          {
            "b": "Device Manager",
            "t": "— drivers/hardware."
          },
          {
            "b": "Disk Management",
            "t": "— partitions/volumes."
          }
        ]
      },
      {
        "h": "User & system",
        "ul": [
          "User accounts & UAC (elevation)",
          "Services (services.msc)",
          "Event Viewer for logs"
        ]
      },
      {
        "h": "Updates",
        "note": {
          "kind": "tip",
          "text": "Keep Windows Update current; drivers via Device Manager or vendor."
        }
      }
    ],
    "practice": "Which tool would you open to disable a startup program, and which to update a driver?"
  },
  "ca-os-03": {
    "intro": "A+ expects core commands in Windows (and awareness of Linux equivalents).",
    "sections": [
      {
        "h": "Windows CLI",
        "code": "dir            # list files\ncd folder      # change directory\nipconfig /all  # network config\nping host      # test connectivity\nsfc /scannow   # repair system files\nchkdsk /f      # check disk"
      },
      {
        "h": "Networking checks",
        "ul": [
          "ipconfig / ping / tracert / nslookup",
          "netstat for connections"
        ]
      },
      {
        "h": "Linux equivalents",
        "note": {
          "kind": "info",
          "text": "ls, cd, ifconfig/ip, ping, cat — transferable concepts."
        }
      }
    ],
    "practice": "Write the Windows commands to view IP config and to repair system files."
  },
  "ca-os-04": {
    "intro": "A+ covers Windows plus core macOS and Linux awareness.",
    "sections": [
      {
        "h": "macOS",
        "ul": [
          "Finder, Spotlight, Mission Control",
          "Time Machine backups",
          "Disk Utility, Keychain"
        ]
      },
      {
        "h": "Linux",
        "ul": [
          {
            "b": "Distros:",
            "t": "Ubuntu, Fedora, etc."
          },
          {
            "b": "Shell + package managers",
            "t": "(apt, yum/dnf)."
          }
        ]
      },
      {
        "h": "Common Linux commands",
        "code": "ls / cd / pwd     # navigate\nsudo <cmd>        # elevate\napt install pkg   # install (Debian/Ubuntu)\nchmod / chown     # permissions\nps / top          # processes"
      }
    ],
    "practice": "Give the macOS backup tool and a Debian/Ubuntu package-install command."
  },
  "ca-os-05": {
    "intro": "Configuring and sharing on a Windows network.",
    "sections": [
      {
        "h": "IP configuration",
        "ul": [
          "DHCP (automatic) vs static IP",
          "ipconfig to view/renew",
          "Network profiles: Private vs Public"
        ]
      },
      {
        "h": "Sharing",
        "ul": [
          "File/printer sharing, mapped drives (net use)",
          "Share vs NTFS permissions (most restrictive wins)"
        ]
      },
      {
        "h": "Remote",
        "note": {
          "kind": "tip",
          "text": "Enable Remote Desktop only when needed; it uses port 3389."
        }
      }
    ],
    "practice": "When combining Share and NTFS permissions, which effective permission applies?"
  },
  "ca-os-06": {
    "intro": "Local accounts, groups, and permission models.",
    "sections": [
      {
        "h": "Accounts & groups",
        "ul": [
          "Standard vs Administrator",
          "Groups simplify permission assignment",
          "UAC prompts for elevation"
        ]
      },
      {
        "h": "Permissions",
        "ul": [
          {
            "b": "NTFS:",
            "t": "granular, local + network."
          },
          {
            "b": "Share:",
            "t": "network only."
          },
          {
            "b": "Principle of least privilege",
            "t": ""
          }
        ]
      },
      {
        "h": "Hardening",
        "note": {
          "kind": "tip",
          "text": "Rename/disable default admin, enforce strong passwords + lockout, keep patched."
        }
      }
    ],
    "practice": "Explain least privilege and how groups make it easier to apply."
  }
};
