import type { LessonContent } from '../model';

export const camcLessons: Record<string, LessonContent> = {
  "ca-mc-01": {
    "intro": "Laptops and phones have their own components, connectors, and sync/security needs.",
    "sections": [
      {
        "h": "Laptop specifics",
        "ul": [
          {
            "b": "SODIMM RAM, M.2 storage",
            "t": "— smaller modules."
          },
          {
            "b": "Display types:",
            "t": "IPS, OLED; digitizer for touch."
          },
          {
            "b": "Function keys",
            "t": "toggle Wi-Fi, brightness, external display."
          }
        ]
      },
      {
        "h": "Connectivity & sync",
        "ul": [
          "Bluetooth for peripherals",
          "Hotspot/tethering shares cellular",
          "Sync to cloud (contacts, photos) across devices"
        ]
      },
      {
        "h": "Mobile security",
        "note": {
          "kind": "tip",
          "text": "Screen lock, biometrics, remote wipe, and encryption protect lost devices."
        }
      }
    ],
    "practice": "Name two components that differ physically between a laptop and a desktop."
  },
  "ca-mc-02": {
    "intro": "One physical machine runs multiple virtual machines via a hypervisor — foundational to modern IT.",
    "sections": [
      {
        "h": "Hypervisors",
        "ul": [
          {
            "b": "Type 1 (bare-metal):",
            "t": "runs on hardware (ESXi, Hyper-V) — servers."
          },
          {
            "b": "Type 2 (hosted):",
            "t": "runs on an OS (VirtualBox, VMware Workstation) — desktops."
          }
        ]
      },
      {
        "h": "Why virtualize",
        "ul": [
          "Consolidate servers",
          "Isolate/sandbox testing",
          "Snapshots for quick rollback"
        ]
      },
      {
        "h": "Requirements",
        "note": {
          "kind": "info",
          "text": "Need CPU virtualization (Intel VT-x/AMD-V) enabled in BIOS, plus enough RAM/CPU for each VM."
        }
      }
    ],
    "practice": "Give an example of a Type 1 and a Type 2 hypervisor."
  },
  "ca-mc-03": {
    "intro": "Cloud delivers computing over the internet. A+ expects the service and deployment models.",
    "sections": [
      {
        "h": "Service models",
        "ul": [
          {
            "b": "IaaS:",
            "t": "VMs/storage (you manage the OS up)."
          },
          {
            "b": "PaaS:",
            "t": "a platform to deploy apps."
          },
          {
            "b": "SaaS:",
            "t": "finished apps (M365, Gmail)."
          }
        ]
      },
      {
        "h": "Deployment models",
        "ul": [
          {
            "b": "Public:",
            "t": "shared provider (AWS/Azure)."
          },
          {
            "b": "Private:",
            "t": "dedicated."
          },
          {
            "b": "Hybrid:",
            "t": "mix."
          }
        ]
      },
      {
        "h": "Cloud traits",
        "note": {
          "kind": "info",
          "text": "On-demand, elastic (scale up/down), measured/pay-as-you-go, accessible anywhere."
        }
      }
    ],
    "practice": "Classify Microsoft 365, an Azure VM, and a managed app platform as SaaS/IaaS/PaaS."
  },
  "ca-mc-04": {
    "intro": "Connecting mobile devices and configuring email — frequent help-desk tasks.",
    "sections": [
      {
        "h": "Connectivity",
        "ul": [
          {
            "b": "Bluetooth:",
            "t": "pair, enter PIN, test."
          },
          {
            "b": "Hotspot/tethering",
            "t": "shares cellular."
          },
          {
            "b": "Airplane mode",
            "t": "toggles radios."
          }
        ]
      },
      {
        "h": "Email setup",
        "ul": [
          {
            "b": "IMAP (143/993):",
            "t": "syncs across devices."
          },
          {
            "b": "POP3 (110/995):",
            "t": "downloads, single device."
          },
          {
            "b": "Exchange/ActiveSync",
            "t": "— corporate, full sync."
          }
        ],
        "note": {
          "kind": "tip",
          "text": "Use IMAP/Exchange for multi-device sync; secure ports (993/995) use TLS."
        }
      },
      {
        "h": "Steps",
        "p": [
          "Verify server names/ports, credentials, and TLS. For corporate mail, the device may need to accept an MDM/security policy."
        ]
      }
    ],
    "practice": "A user wants email on phone and laptop kept in sync — IMAP or POP3, and which secure port?"
  },
  "ca-mc-05": {
    "intro": "Keeping mobile data synced and secure across the fleet.",
    "sections": [
      {
        "h": "Synchronization",
        "ul": [
          "Cloud sync (contacts, photos, files)",
          "Sync to desktop or over Wi-Fi",
          "Watch data-cap and battery impact"
        ]
      },
      {
        "h": "Mobile security",
        "ul": [
          {
            "b": "Screen lock + biometrics",
            "t": ""
          },
          {
            "b": "Remote wipe/locate",
            "t": "for lost devices."
          },
          {
            "b": "MDM:",
            "t": "enforces policy, app control."
          }
        ]
      },
      {
        "h": "Corporate",
        "note": {
          "kind": "info",
          "text": "BYOD often uses containerization to separate work and personal data."
        }
      }
    ],
    "practice": "List three controls that protect a lost corporate phone."
  },
  "ca-mc-06": {
    "intro": "Laptop-specific components and field-replaceable parts.",
    "sections": [
      {
        "h": "Replaceable parts",
        "ul": [
          "Battery (Li-ion), RAM (SODIMM), storage (M.2/2.5\")",
          "Keyboard, screen, Wi-Fi card"
        ]
      },
      {
        "h": "Special features",
        "ul": [
          "Function-key toggles (display, wireless, brightness)",
          "Docking stations / port replicators"
        ]
      },
      {
        "h": "Handling",
        "note": {
          "kind": "warn",
          "text": "Power off and remove the battery (if removable) before internal work; use ESD protection."
        }
      }
    ],
    "practice": "Name three field-replaceable laptop parts."
  },
  "ca-mc-07": {
    "intro": "Go deeper on cloud service/deployment models and their traits.",
    "sections": [
      {
        "h": "Shared responsibility",
        "ul": [
          "IaaS: you manage OS↑; provider manages hardware",
          "PaaS: you manage app/data; provider manages runtime",
          "SaaS: provider manages nearly everything"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: The shared-responsibility model decides who patches what — assuming the cloud provider secures your SaaS data is a common, costly mistake."
        }
      },
      {
        "h": "Traits",
        "ul": [
          "On-demand self-service",
          "Rapid elasticity",
          "Measured (pay-per-use)",
          "Broad network access"
        ]
      },
      {
        "h": "Deployment",
        "p": [
          "Public, private, hybrid, community — trade control vs cost/scale."
        ]
      }
    ],
    "practice": "Under IaaS, who patches the guest OS — you or the provider?"
  }
};
