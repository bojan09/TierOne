import type { LessonContent } from '../model';

export const netswitchingLessons: Record<string, LessonContent> = {
  "nw-sw-01": {
    "intro": "Switches forward Ethernet frames using MAC addresses. Understanding this layer-2 behaviour explains most LAN issues.",
    "sections": [
      {
        "h": "MAC addresses",
        "p": [
          "A 48-bit hardware address burned into each NIC (e.g. 00:1A:2B:3C:4D:5E). Switches learn which MAC lives on which port and build a MAC address table."
        ]
      },
      {
        "h": "How a switch forwards",
        "ul": [
          "Known destination MAC → forward out that one port",
          "Unknown/broadcast → flood out all ports (except the source)",
          "Learns source MACs to fill its table"
        ]
      },
      {
        "h": "ARP",
        "note": {
          "kind": "info",
          "text": "ARP maps a known IP to its MAC on the local network — the glue between layer 3 addressing and layer 2 delivery."
        }
      }
    ],
    "practice": "On a device, view the ARP table (arp -a) and identify the MAC of your default gateway."
  },
  "nw-sw-02": {
    "intro": "VLANs split one physical switch into multiple logical networks — the foundation of segmentation.",
    "sections": [
      {
        "h": "What a VLAN does",
        "p": [
          "Each VLAN is its own broadcast domain. Devices in different VLANs can't talk without a router, even on the same switch — great for isolating departments, voice, and guests."
        ]
      },
      {
        "h": "Access ports",
        "p": [
          "An access port belongs to a single VLAN and connects an end device (PC, printer, phone)."
        ]
      },
      {
        "h": "Illustration",
        "svg": "<svg viewBox=\"0 0 560 220\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"ui-sans-serif,system-ui\" font-size=\"12\"><rect x=\"60\" y=\"90\" width=\"120\" height=\"40\" rx=\"6\" fill=\"#1e293b\" stroke=\"#475569\"/><text x=\"120\" y=\"115\" fill=\"#e2e8f0\" text-anchor=\"middle\">Switch A</text><rect x=\"380\" y=\"90\" width=\"120\" height=\"40\" rx=\"6\" fill=\"#1e293b\" stroke=\"#475569\"/><text x=\"440\" y=\"115\" fill=\"#e2e8f0\" text-anchor=\"middle\">Switch B</text><line x1=\"180\" y1=\"110\" x2=\"380\" y2=\"110\" stroke=\"#818cf8\" stroke-width=\"3\"/><text x=\"280\" y=\"102\" fill=\"#a5b4fc\" text-anchor=\"middle\">802.1Q trunk</text><text x=\"280\" y=\"126\" fill=\"#64748b\" text-anchor=\"middle\">carries VLAN 10 + 20</text><circle cx=\"40\" cy=\"70\" r=\"10\" fill=\"#2563eb\"/><line x1=\"50\" y1=\"74\" x2=\"70\" y2=\"100\" stroke=\"#2563eb\"/><circle cx=\"520\" cy=\"70\" r=\"10\" fill=\"#2563eb\"/><line x1=\"510\" y1=\"74\" x2=\"490\" y2=\"100\" stroke=\"#2563eb\"/><text x=\"40\" y=\"50\" fill=\"#93c5fd\" text-anchor=\"middle\">VLAN 10</text><text x=\"520\" y=\"50\" fill=\"#93c5fd\" text-anchor=\"middle\">VLAN 10</text><circle cx=\"40\" cy=\"160\" r=\"10\" fill=\"#16a34a\"/><line x1=\"50\" y1=\"156\" x2=\"70\" y2=\"122\" stroke=\"#16a34a\"/><circle cx=\"520\" cy=\"160\" r=\"10\" fill=\"#16a34a\"/><line x1=\"510\" y1=\"156\" x2=\"490\" y2=\"122\" stroke=\"#16a34a\"/><text x=\"40\" y=\"188\" fill=\"#86efac\" text-anchor=\"middle\">VLAN 20</text><text x=\"520\" y=\"188\" fill=\"#86efac\" text-anchor=\"middle\">VLAN 20</text></svg>",
        "caption": "Access ports place devices into VLAN 10 or 20; a trunk carries both VLANs between switches."
      },
      {
        "h": "Benefits",
        "note": {
          "kind": "tip",
          "text": "VLANs improve security and performance by containing broadcasts and separating traffic — without extra hardware."
        }
      }
    ],
    "practice": "Design a VLAN plan for an office with staff, guests, and IP phones, and state why each is separated."
  },
  "nw-sw-03": {
    "intro": "A trunk carries many VLANs over one link between switches (or to a router), using tags to keep them separate.",
    "sections": [
      {
        "h": "802.1Q tagging",
        "p": [
          "The trunk inserts a VLAN tag into each frame so the far end knows which VLAN it belongs to. This lets a single cable carry dozens of VLANs."
        ]
      },
      {
        "h": "The native VLAN",
        "p": [
          "One VLAN on a trunk is 'native' and sent untagged. Match it on both ends and avoid using VLAN 1 for it as a hardening step."
        ]
      },
      {
        "h": "Where trunks go",
        "note": {
          "kind": "info",
          "text": "Switch-to-switch links, switch-to-router (router-on-a-stick), and switch-to-hypervisor uplinks are all trunks."
        }
      }
    ],
    "practice": "Explain what tag a frame for VLAN 20 carries across a trunk, and what happens to native-VLAN frames."
  },
  "nw-sw-04": {
    "intro": "Redundant switch links can create loops that melt a network. Spanning Tree prevents them automatically.",
    "sections": [
      {
        "h": "The loop problem",
        "p": [
          "Layer-2 loops have no TTL, so broadcasts circulate forever — a 'broadcast storm' that saturates the LAN."
        ]
      },
      {
        "h": "How STP helps",
        "p": [
          "STP elects a root bridge and blocks redundant paths, leaving one loop-free active path. If a link fails, a blocked path is unblocked to restore connectivity."
        ]
      },
      {
        "h": "Modern STP",
        "note": {
          "kind": "tip",
          "text": "Rapid STP (RSTP) converges in seconds. Use PortFast on access ports and BPDU Guard to protect the topology."
        }
      }
    ],
    "practice": "Describe what happens without STP when you connect two switches with two cables, and how STP prevents it."
  },
  "nw-sw-05": {
    "intro": "The access layer is where users (and attackers) plug in. A few switch features close common gaps.",
    "sections": [
      {
        "h": "Port security",
        "p": [
          "Limit which/how many MAC addresses a port accepts, and shut or restrict the port on violation — stopping rogue hubs and MAC flooding."
        ]
      },
      {
        "h": "More hardening",
        "ul": [
          {
            "b": "Disable unused ports",
            "t": "and put them in an unused VLAN."
          },
          {
            "b": "DHCP snooping",
            "t": "blocks rogue DHCP servers."
          },
          {
            "b": "Dynamic ARP Inspection",
            "t": "stops ARP spoofing."
          }
        ]
      },
      {
        "h": "Management",
        "note": {
          "kind": "warn",
          "text": "Never leave default credentials or unencrypted management (Telnet) — use SSH and change defaults."
        }
      }
    ],
    "practice": "List three switch-hardening steps you'd apply to an office access switch and the threat each addresses."
  }
};
