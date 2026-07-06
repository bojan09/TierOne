import type { LessonContent } from '../model';

export const netfundamentalsLessons: Record<string, LessonContent> = {
  "nw-fund-01": {
    "intro": "A network is two or more devices connected to share data and resources. Everything else in networking builds on a few basic shapes and roles.",
    "sections": [
      {
        "h": "Network scope",
        "ul": [
          {
            "b": "LAN:",
            "t": "a local area network — one site (office, home)."
          },
          {
            "b": "WAN:",
            "t": "a wide area network spanning sites/cities (the internet is the biggest WAN)."
          },
          {
            "b": "MAN / PAN:",
            "t": "metropolitan and personal (Bluetooth) scales."
          }
        ]
      },
      {
        "h": "Roles",
        "ul": [
          {
            "b": "Client:",
            "t": "requests services."
          },
          {
            "b": "Server:",
            "t": "provides them."
          },
          {
            "b": "Peer-to-peer:",
            "t": "devices act as both."
          }
        ]
      },
      {
        "h": "Topologies",
        "p": [
          "Physical/logical layouts — star (switch-centred, the modern default), mesh (many redundant links), bus and ring (legacy). Star dominates because a single failed cable affects only one device."
        ]
      }
    ],
    "practice": "Sketch your home or office as a network: identify the LAN, what connects it to the WAN, and which devices are clients vs servers."
  },
  "nw-fund-02": {
    "intro": "The OSI model breaks networking into seven layers. It's the shared language technicians use to describe where a problem lives.",
    "sections": [
      {
        "h": "The seven layers",
        "svg": "<svg viewBox=\"0 0 440 296\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"ui-sans-serif,system-ui\" font-size=\"13\"><text x=\"8\" y=\"0\" fill=\"#64748b\" font-size=\"11\"></text><rect x=\"8\" y=\"8\" width=\"300\" height=\"32\" rx=\"6\" fill=\"#1e293b\" stroke=\"#475569\"/><text x=\"24\" y=\"29\" fill=\"#818cf8\" font-weight=\"700\">7</text><text x=\"52\" y=\"29\" fill=\"#e2e8f0\">Application</text><text x=\"330\" y=\"29\" fill=\"#94a3b8\">Data</text><rect x=\"8\" y=\"46\" width=\"300\" height=\"32\" rx=\"6\" fill=\"#1e293b\" stroke=\"#475569\"/><text x=\"24\" y=\"67\" fill=\"#818cf8\" font-weight=\"700\">6</text><text x=\"52\" y=\"67\" fill=\"#e2e8f0\">Presentation</text><text x=\"330\" y=\"67\" fill=\"#94a3b8\">Data</text><rect x=\"8\" y=\"84\" width=\"300\" height=\"32\" rx=\"6\" fill=\"#1e293b\" stroke=\"#475569\"/><text x=\"24\" y=\"105\" fill=\"#818cf8\" font-weight=\"700\">5</text><text x=\"52\" y=\"105\" fill=\"#e2e8f0\">Session</text><text x=\"330\" y=\"105\" fill=\"#94a3b8\">Data</text><rect x=\"8\" y=\"122\" width=\"300\" height=\"32\" rx=\"6\" fill=\"#1e293b\" stroke=\"#475569\"/><text x=\"24\" y=\"143\" fill=\"#818cf8\" font-weight=\"700\">4</text><text x=\"52\" y=\"143\" fill=\"#e2e8f0\">Transport</text><text x=\"330\" y=\"143\" fill=\"#94a3b8\">Segment</text><rect x=\"8\" y=\"160\" width=\"300\" height=\"32\" rx=\"6\" fill=\"#1e293b\" stroke=\"#475569\"/><text x=\"24\" y=\"181\" fill=\"#818cf8\" font-weight=\"700\">3</text><text x=\"52\" y=\"181\" fill=\"#e2e8f0\">Network</text><text x=\"330\" y=\"181\" fill=\"#94a3b8\">Packet</text><rect x=\"8\" y=\"198\" width=\"300\" height=\"32\" rx=\"6\" fill=\"#1e293b\" stroke=\"#475569\"/><text x=\"24\" y=\"219\" fill=\"#818cf8\" font-weight=\"700\">2</text><text x=\"52\" y=\"219\" fill=\"#e2e8f0\">Data Link</text><text x=\"330\" y=\"219\" fill=\"#94a3b8\">Frame</text><rect x=\"8\" y=\"236\" width=\"300\" height=\"32\" rx=\"6\" fill=\"#1e293b\" stroke=\"#475569\"/><text x=\"24\" y=\"257\" fill=\"#818cf8\" font-weight=\"700\">1</text><text x=\"52\" y=\"257\" fill=\"#e2e8f0\">Physical</text><text x=\"330\" y=\"257\" fill=\"#94a3b8\">Bits</text><text x=\"330\" y=\"292\" fill=\"#64748b\" font-size=\"10\">PDU</text></svg>",
        "caption": "The OSI model: seven layers and the data unit (PDU) at each."
      },
      {
        "h": "What each layer does",
        "ul": [
          {
            "b": "7 Application / 6 Presentation / 5 Session:",
            "t": "the app-facing layers (HTTP, TLS, sessions)."
          },
          {
            "b": "4 Transport:",
            "t": "end-to-end delivery (TCP/UDP), ports, segments."
          },
          {
            "b": "3 Network:",
            "t": "logical addressing and routing (IP), packets."
          },
          {
            "b": "2 Data Link:",
            "t": "local delivery, MAC addresses, frames (switches)."
          },
          {
            "b": "1 Physical:",
            "t": "cables, signals, bits."
          }
        ]
      },
      {
        "h": "Why it matters",
        "note": {
          "kind": "tip",
          "text": "Troubleshoot layer by layer: is it physical (cable/link), addressing (IP), or application? Naming the layer focuses the fix."
        }
      }
    ],
    "practice": "For a 'can't reach the website' problem, list one thing you'd check at layers 1, 3, and 7."
  },
  "nw-fund-03": {
    "intro": "The practical model the internet actually runs on is TCP/IP. Encapsulation is how your data gets wrapped for delivery and unwrapped on arrival.",
    "sections": [
      {
        "h": "The TCP/IP model",
        "p": [
          "Four layers — Application, Transport, Internet, and Network Access — map onto the OSI layers but reflect how real protocols are built."
        ]
      },
      {
        "h": "Encapsulation",
        "svg": "<svg viewBox=\"0 0 560 220\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"ui-sans-serif,system-ui\"><rect x=\"8\" y=\"10\" width=\"200\" height=\"34\" rx=\"4\" fill=\"#334155\" stroke=\"#475569\"/><text x=\"108.0\" y=\"32\" fill=\"#e2e8f0\" font-size=\"12\" text-anchor=\"middle\">Data</text><text x=\"218\" y=\"32\" fill=\"#94a3b8\" font-size=\"12\">Data</text><rect x=\"8\" y=\"60\" width=\"70\" height=\"34\" rx=\"4\" fill=\"#3730a3\" stroke=\"#475569\"/><text x=\"43.0\" y=\"82\" fill=\"#e2e8f0\" font-size=\"12\" text-anchor=\"middle\">TCP</text><rect x=\"80\" y=\"60\" width=\"180\" height=\"34\" rx=\"4\" fill=\"#334155\" stroke=\"#475569\"/><text x=\"170.0\" y=\"82\" fill=\"#e2e8f0\" font-size=\"12\" text-anchor=\"middle\">Data</text><text x=\"270\" y=\"82\" fill=\"#94a3b8\" font-size=\"12\">Segment</text><rect x=\"8\" y=\"110\" width=\"60\" height=\"34\" rx=\"4\" fill=\"#166534\" stroke=\"#475569\"/><text x=\"38.0\" y=\"132\" fill=\"#e2e8f0\" font-size=\"12\" text-anchor=\"middle\">IP</text><rect x=\"70\" y=\"110\" width=\"70\" height=\"34\" rx=\"4\" fill=\"#3730a3\" stroke=\"#475569\"/><text x=\"105.0\" y=\"132\" fill=\"#e2e8f0\" font-size=\"12\" text-anchor=\"middle\">TCP</text><rect x=\"142\" y=\"110\" width=\"180\" height=\"34\" rx=\"4\" fill=\"#334155\" stroke=\"#475569\"/><text x=\"232.0\" y=\"132\" fill=\"#e2e8f0\" font-size=\"12\" text-anchor=\"middle\">Data</text><text x=\"332\" y=\"132\" fill=\"#94a3b8\" font-size=\"12\">Packet</text><rect x=\"8\" y=\"160\" width=\"56\" height=\"34\" rx=\"4\" fill=\"#7c2d12\" stroke=\"#475569\"/><text x=\"36.0\" y=\"182\" fill=\"#e2e8f0\" font-size=\"12\" text-anchor=\"middle\">Eth</text><rect x=\"66\" y=\"160\" width=\"60\" height=\"34\" rx=\"4\" fill=\"#166534\" stroke=\"#475569\"/><text x=\"96.0\" y=\"182\" fill=\"#e2e8f0\" font-size=\"12\" text-anchor=\"middle\">IP</text><rect x=\"128\" y=\"160\" width=\"70\" height=\"34\" rx=\"4\" fill=\"#3730a3\" stroke=\"#475569\"/><text x=\"163.0\" y=\"182\" fill=\"#e2e8f0\" font-size=\"12\" text-anchor=\"middle\">TCP</text><rect x=\"200\" y=\"160\" width=\"150\" height=\"34\" rx=\"4\" fill=\"#334155\" stroke=\"#475569\"/><text x=\"275.0\" y=\"182\" fill=\"#e2e8f0\" font-size=\"12\" text-anchor=\"middle\">Data</text><rect x=\"352\" y=\"160\" width=\"44\" height=\"34\" rx=\"4\" fill=\"#7c2d12\" stroke=\"#475569\"/><text x=\"374.0\" y=\"182\" fill=\"#e2e8f0\" font-size=\"12\" text-anchor=\"middle\">FCS</text><text x=\"406\" y=\"182\" fill=\"#94a3b8\" font-size=\"12\">Frame</text></svg>",
        "caption": "Each layer adds its own header (and the frame adds a trailer) as data moves down the stack."
      },
      {
        "h": "How it flows",
        "p": [
          "Going down the stack, each layer adds a header; the receiver reverses the process (de-encapsulation) going back up. Routers read the IP header; switches read the frame header."
        ]
      }
    ],
    "practice": "Explain in one sentence what a router reads to forward traffic versus what a switch reads."
  },
  "nw-fund-04": {
    "intro": "Protocols are the rules; ports are the numbered doors that let one host run many services at once.",
    "sections": [
      {
        "h": "TCP vs UDP",
        "ul": [
          {
            "b": "TCP:",
            "t": "connection-oriented, reliable, ordered (web, email, file transfer)."
          },
          {
            "b": "UDP:",
            "t": "connectionless, fast, best-effort (DNS queries, VoIP, streaming)."
          }
        ]
      },
      {
        "h": "Common ports",
        "ul": [
          {
            "b": "80 / 443:",
            "t": "HTTP / HTTPS."
          },
          {
            "b": "22 / 3389:",
            "t": "SSH / RDP."
          },
          {
            "b": "25 / 587 / 993:",
            "t": "SMTP / submission / IMAPS."
          },
          {
            "b": "53:",
            "t": "DNS (UDP and TCP)."
          },
          {
            "b": "67-68:",
            "t": "DHCP."
          }
        ]
      },
      {
        "h": "Port ranges",
        "note": {
          "kind": "info",
          "text": "0-1023 are well-known, 1024-49151 registered, 49152-65535 dynamic/ephemeral (used by clients)."
        }
      }
    ],
    "practice": "List the protocol and transport (TCP/UDP) for: loading a secure website, a DNS lookup, and a remote desktop session."
  },
  "nw-fund-05": {
    "intro": "The physical layer still matters — the wrong cable or a bad run causes 'mystery' problems no software fix can solve.",
    "sections": [
      {
        "h": "Copper (twisted pair)",
        "ul": [
          {
            "b": "Cat5e / Cat6 / Cat6a:",
            "t": "1 Gbps up to 10 Gbps over limited distances (~100 m max run)."
          },
          {
            "b": "Straight-through vs crossover:",
            "t": "most modern gear auto-detects (Auto-MDIX), but know the difference."
          }
        ]
      },
      {
        "h": "Fiber",
        "ul": [
          {
            "b": "Single-mode:",
            "t": "long distance (campus/WAN)."
          },
          {
            "b": "Multi-mode:",
            "t": "shorter runs, cheaper optics."
          }
        ]
      },
      {
        "h": "Choosing media",
        "note": {
          "kind": "tip",
          "text": "Copper for the desk, fiber for distance and backbones or where electrical interference is a problem."
        }
      }
    ],
    "practice": "For a 300-metre link between two buildings, decide copper vs fiber and justify it in one line."
  }
};
