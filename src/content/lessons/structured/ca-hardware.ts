import type { LessonContent } from '../model';

export const cahardwareLessons: Record<string, LessonContent> = {
  "ca-hw-01": {
    "intro": "The CPU executes instructions; the motherboard connects everything. A+ expects you to identify sockets, chipsets, and form factors.",
    "sections": [
      {
        "h": "The CPU",
        "ul": [
          {
            "b": "Cores/threads:",
            "t": "parallel work; more cores help multitasking."
          },
          {
            "b": "Clock speed (GHz):",
            "t": "cycles per second."
          },
          {
            "b": "Cache:",
            "t": "fast on-die memory (L1/L2/L3)."
          },
          {
            "b": "Sockets:",
            "t": "Intel LGA vs AMD AM4/AM5 — CPU must match the socket."
          }
        ]
      },
      {
        "h": "The motherboard",
        "ul": [
          {
            "b": "Form factors:",
            "t": "ATX, microATX, Mini-ITX (size/expansion trade-off)."
          },
          {
            "b": "Chipset:",
            "t": "controls I/O between CPU, RAM, and buses."
          },
          {
            "b": "Expansion:",
            "t": "PCIe slots (x16 for GPUs, x1 for cards)."
          }
        ],
        "note": {
          "kind": "tip",
          "text": "Match CPU socket, RAM type, and form factor to the case/PSU before buying."
        }
      },
      {
        "h": "Cooling",
        "p": [
          "CPUs need cooling — heatsink + fan (air) or liquid. Apply thermal paste between CPU and heatsink; overheating causes throttling and shutdowns."
        ]
      }
    ],
    "practice": "List the three things that must be compatible between a CPU and a motherboard."
  },
  "ca-hw-02": {
    "intro": "RAM holds data the CPU is actively using; storage keeps it long-term. Know the types and their speeds.",
    "sections": [
      {
        "h": "RAM",
        "ul": [
          {
            "b": "DDR generations:",
            "t": "DDR3/DDR4/DDR5 — not interchangeable (different notches)."
          },
          {
            "b": "DIMM vs SODIMM:",
            "t": "desktop vs laptop modules."
          },
          {
            "b": "Channels:",
            "t": "dual-channel (matched pairs) boosts bandwidth."
          }
        ]
      },
      {
        "h": "Storage",
        "ul": [
          {
            "b": "HDD:",
            "t": "spinning platters, cheap capacity, slower."
          },
          {
            "b": "SSD (SATA):",
            "t": "no moving parts, much faster."
          },
          {
            "b": "NVMe (M.2):",
            "t": "SSD over PCIe — fastest common storage."
          }
        ],
        "note": {
          "kind": "info",
          "text": "RAM is volatile (lost on power off); storage is non-volatile."
        }
      },
      {
        "h": "Interfaces",
        "p": [
          "SATA connects HDDs/SSDs (data + power cables). M.2 slots take NVMe or SATA modules directly on the board."
        ]
      }
    ],
    "practice": "Rank HDD, SATA SSD, and NVMe SSD from slowest to fastest."
  },
  "ca-hw-03": {
    "intro": "The PSU powers everything; ports and connectors link peripherals. A+ tests connector identification.",
    "sections": [
      {
        "h": "Power supply (PSU)",
        "ul": [
          {
            "b": "Wattage:",
            "t": "must exceed total system draw (GPU-heavy builds need more)."
          },
          {
            "b": "Rails/connectors:",
            "t": "24-pin board, CPU 8-pin, PCIe for GPU, SATA for drives."
          },
          {
            "b": "Efficiency:",
            "t": "80 PLUS ratings."
          }
        ],
        "note": {
          "kind": "warn",
          "text": "Never open a PSU — capacitors can hold a dangerous charge even unplugged."
        }
      },
      {
        "h": "Common ports",
        "ul": [
          {
            "b": "Video:",
            "t": "HDMI, DisplayPort, VGA (legacy), DVI."
          },
          {
            "b": "USB:",
            "t": "USB-A, USB-C; USB 3.x is faster (often blue)."
          },
          {
            "b": "Network:",
            "t": "RJ-45 (Ethernet)."
          }
        ]
      },
      {
        "h": "Peripherals",
        "p": [
          "Know input (keyboard, mouse, scanner) vs output (monitor, printer) and how they connect (USB, Bluetooth, wireless dongles)."
        ]
      }
    ],
    "practice": "Name the PSU connector used for the motherboard, the CPU, and a GPU."
  },
  "ca-hw-04": {
    "intro": "Monitors and graphics: display technologies, resolutions, and the video connectors A+ tests.",
    "sections": [
      {
        "h": "Display types",
        "ul": [
          {
            "b": "LCD (LED-backlit):",
            "t": "most common; IPS = better color/angles, TN = faster/cheaper."
          },
          {
            "b": "OLED:",
            "t": "per-pixel light, deep blacks."
          },
          {
            "b": "Projectors:",
            "t": "lumens = brightness."
          }
        ]
      },
      {
        "h": "Resolution & specs",
        "ul": [
          "Resolution (1080p, 1440p, 4K), refresh rate (Hz), aspect ratio",
          "Response time matters for gaming"
        ]
      },
      {
        "h": "Video connectors",
        "note": {
          "kind": "tip",
          "text": "HDMI and DisplayPort carry audio+video; VGA/DVI are legacy (DVI can be digital)."
        }
      }
    ],
    "practice": "Match IPS, TN, and OLED to: best color, fastest response, deepest blacks."
  },
  "ca-hw-05": {
    "intro": "Printer types and the laser imaging process — a classic A+ topic tested in detail.",
    "sections": [
      {
        "h": "Printer types",
        "ul": [
          {
            "b": "Laser:",
            "t": "toner + fusing; fast, sharp text."
          },
          {
            "b": "Inkjet:",
            "t": "liquid ink; good photos."
          },
          {
            "b": "Thermal:",
            "t": "heat-sensitive paper (receipts)."
          },
          {
            "b": "Impact:",
            "t": "multipart forms."
          },
          {
            "b": "3D:",
            "t": "filament/resin."
          }
        ]
      },
      {
        "h": "Laser imaging — 7 steps",
        "ul": [
          "Processing → Charging → Exposing → Developing → Transferring → Fusing → Cleaning"
        ],
        "note": {
          "kind": "tip",
          "text": "Memorize the order; questions ask 'what happens after exposing?' (developing)."
        }
      },
      {
        "h": "Maintenance",
        "p": [
          "Laser: replace toner, use a maintenance kit. Inkjet: clean/align heads. Keep firmware updated."
        ]
      }
    ],
    "practice": "List the seven steps of the laser printing process in order."
  },
  "ca-hw-06": {
    "intro": "Purpose-built PCs and redundant storage arrays.",
    "sections": [
      {
        "h": "Custom builds",
        "ul": [
          {
            "b": "Workstation:",
            "t": "more CPU/RAM/GPU (CAD, virtualization)."
          },
          {
            "b": "NAS:",
            "t": "storage + RAID."
          },
          {
            "b": "Thin client:",
            "t": "minimal, connects to server."
          }
        ]
      },
      {
        "h": "RAID levels",
        "ul": [
          {
            "b": "RAID 0:",
            "t": "stripe — speed, no redundancy."
          },
          {
            "b": "RAID 1:",
            "t": "mirror — redundancy."
          },
          {
            "b": "RAID 5:",
            "t": "stripe + parity (3+ disks)."
          },
          {
            "b": "RAID 10:",
            "t": "mirror + stripe."
          }
        ],
        "note": {
          "kind": "warn",
          "text": "RAID is not a backup — it protects against disk failure, not deletion/ransomware."
        }
      },
      {
        "h": "Choosing",
        "p": [
          "RAID 1 for simple redundancy; RAID 5 balances capacity and protection; RAID 10 for performance + redundancy."
        ]
      }
    ],
    "practice": "Which RAID gives redundancy with only two disks, and which needs at least three?"
  }
};
