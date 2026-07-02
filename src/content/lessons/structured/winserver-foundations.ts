import type { LessonContent } from '../model';

export const winserverfoundationsLessons: Record<string, LessonContent> = {
  "ws-fnd-01": {
    "intro": "Choosing the right edition and licensing model — and installing cleanly — sets the foundation for everything else.",
    "sections": [
      {
        "h": "Editions",
        "ul": [
          {
            "b": "Standard:",
            "t": "most workloads; limited virtualization rights."
          },
          {
            "b": "Datacenter:",
            "t": "highly virtualized/software-defined datacentres; unlimited VM rights."
          }
        ]
      },
      {
        "h": "Licensing",
        "p": [
          "Windows Server is licensed per physical core (with a minimum), plus Client Access Licenses (CALs) for users or devices that connect."
        ]
      },
      {
        "h": "Installation",
        "note": {
          "kind": "info",
          "text": "Plan disk layout (separate OS and data), set a strong local admin password, and patch immediately after install."
        }
      }
    ],
    "practice": "Decide which edition fits a host that will run 12 VMs, and explain the licensing implication in one sentence."
  },
  "ws-fnd-02": {
    "intro": "Windows Server installs in two flavours. The headless Server Core is smaller and more secure but changes how you manage it.",
    "sections": [
      {
        "h": "The difference",
        "ul": [
          {
            "b": "Desktop Experience:",
            "t": "full GUI; easiest to learn."
          },
          {
            "b": "Server Core:",
            "t": "no desktop GUI — smaller footprint, fewer updates, smaller attack surface."
          }
        ]
      },
      {
        "h": "Managing Server Core",
        "p": [
          "Configure locally with sconfig and PowerShell; manage remotely with Windows Admin Center, RSAT, or remoting."
        ],
        "code": "sconfig      # menu-driven local setup on Server Core"
      },
      {
        "h": "When to choose it",
        "note": {
          "kind": "tip",
          "text": "Prefer Server Core for infrastructure roles (DC, DNS, Hyper-V) to reduce patching and exposure."
        }
      }
    ],
    "practice": "List two roles you'd run on Server Core and how you would manage them without a local GUI."
  },
  "ws-fnd-03": {
    "intro": "Every new server needs the same first steps before it does its job — identity, network, and domain membership.",
    "sections": [
      {
        "h": "First steps",
        "ul": [
          "Set a meaningful computer name",
          "Assign a static IP, subnet, gateway, and DNS",
          "Set time zone and confirm time sync",
          "Join the domain (for member servers)"
        ]
      },
      {
        "h": "Then add roles",
        "p": [
          "Only after the basics are right do you install the role(s) the server exists for — keeping it minimal."
        ],
        "code": "Rename-Computer -NewName SRV-DNS-01 -Restart\nAdd-Computer -DomainName corp.example.com -Restart"
      },
      {
        "h": "Why static IP",
        "note": {
          "kind": "warn",
          "text": "Infrastructure servers (DC, DNS, DHCP) must use static IPs — a changing address breaks the services that depend on them."
        }
      }
    ],
    "practice": "Configure a lab member server: set its name, a static IP with the DC as DNS, and join it to the domain."
  },
  "ws-fnd-04": {
    "intro": "Modern Windows Server is managed centrally. Two tools cover almost everything from one place.",
    "sections": [
      {
        "h": "Server Manager",
        "p": [
          "Manages local and remote servers grouped into pools — add roles, view events, and monitor status across many servers."
        ]
      },
      {
        "h": "Windows Admin Center (WAC)",
        "p": [
          "A browser-based tool that manages servers, clusters, and even Server Core through a modern UI — increasingly the default."
        ]
      },
      {
        "h": "Remote by default",
        "note": {
          "kind": "tip",
          "text": "Manage servers remotely from a workstation with RSAT/WAC rather than logging on to each console — safer and faster."
        }
      }
    ],
    "practice": "Add a second lab server to Server Manager (or WAC) and manage it remotely without signing in to its console."
  },
  "ws-fnd-05": {
    "intro": "A server's purpose is defined by its roles. Adding only what's needed keeps it fast and secure.",
    "sections": [
      {
        "h": "Roles vs features",
        "ul": [
          {
            "b": "Role:",
            "t": "a primary function (AD DS, DNS, DHCP, Web Server)."
          },
          {
            "b": "Feature:",
            "t": "a supporting capability (e.g. .NET, failover clustering, BitLocker)."
          }
        ]
      },
      {
        "h": "Install cleanly",
        "code": "Install-WindowsFeature DNS,DHCP -IncludeManagementTools\nGet-WindowsFeature | Where-Object Installed"
      },
      {
        "h": "Minimalism",
        "note": {
          "kind": "info",
          "text": "Every extra role is more to patch and secure — install the minimum and remove what you no longer use."
        }
      }
    ],
    "practice": "List the installed roles on a lab server with PowerShell and remove one feature you don't need."
  },
  "ws-fnd-06": {
    "intro": "Building servers one by one doesn't scale. Imaging and automation make deployments fast and identical.",
    "sections": [
      {
        "h": "Standardised images",
        "p": [
          "Prepare a reference install, generalise it with Sysprep (removing unique SIDs), and capture it as an image to deploy repeatedly."
        ]
      },
      {
        "h": "Automating setup",
        "ul": [
          {
            "b": "Answer files (unattend.xml):",
            "t": "drive an unattended install."
          },
          {
            "b": "WDS/MDT:",
            "t": "network-based OS deployment."
          },
          {
            "b": "Templates:",
            "t": "clone VMs from a golden image in virtualised environments."
          }
        ]
      },
      {
        "h": "Consistency",
        "note": {
          "kind": "tip",
          "text": "Identical builds mean predictable behaviour and easier troubleshooting — avoid hand-built snowflakes."
        }
      }
    ],
    "practice": "Outline how you'd deploy 20 identical servers: reference image, Sysprep, and the tool you'd use to push it."
  }
};
