import type { LessonContent } from '../model';

export const canetLessons: Record<string, LessonContent> = {
  "ca-net-01": {
    "intro": "How devices find and talk to each other: IP addresses, ports, and the common protocols A+ expects you to recall.",
    "sections": [
      {
        "h": "Addressing",
        "ul": [
          {
            "b": "IPv4:",
            "t": "four octets, e.g. 192.168.1.10."
          },
          {
            "b": "Private ranges:",
            "t": "10.x, 172.16–31.x, 192.168.x (home/office)."
          },
          {
            "b": "DHCP/DNS:",
            "t": "DHCP assigns IPs; DNS resolves names to IPs."
          }
        ]
      },
      {
        "h": "Common ports",
        "ul": [
          "HTTP 80 / HTTPS 443",
          "DNS 53",
          "DHCP 67/68",
          "SSH 22 / RDP 3389",
          "SMTP 25 / IMAP 143 / POP3 110"
        ],
        "note": {
          "kind": "tip",
          "text": "A+ expects these port numbers from memory."
        }
      },
      {
        "h": "TCP vs UDP",
        "p": [
          "TCP is reliable/ordered (web, email); UDP is fast/connectionless (streaming, DNS queries)."
        ]
      }
    ],
    "practice": "Write the port numbers for HTTPS, DNS, SSH, and RDP."
  },
  "ca-net-02": {
    "intro": "Copper and fiber carry the network. Know the categories, connectors, and when to use each.",
    "sections": [
      {
        "h": "Copper (twisted pair)",
        "ul": [
          {
            "b": "Cat 5e:",
            "t": "1 Gbps."
          },
          {
            "b": "Cat 6/6a:",
            "t": "up to 10 Gbps (6a longer runs)."
          },
          {
            "b": "Connector:",
            "t": "RJ-45."
          }
        ]
      },
      {
        "h": "Fiber",
        "ul": [
          {
            "b": "Single-mode:",
            "t": "long distance."
          },
          {
            "b": "Multi-mode:",
            "t": "shorter runs, cheaper."
          },
          {
            "b": "Immune to EMI",
            "t": "— good near interference."
          }
        ]
      },
      {
        "h": "Coax & other",
        "p": [
          "Coaxial (RG-6) for cable internet/TV. Know max copper run ~100 m before signal loss."
        ]
      }
    ],
    "practice": "Which cable category would you choose for a 10 Gbps run, and what connector does it use?"
  },
  "ca-net-03": {
    "intro": "Setting up and securing a small-office/home network — the everyday tech task A+ centers on.",
    "sections": [
      {
        "h": "Wi-Fi standards",
        "ul": [
          {
            "b": "802.11n/ac/ax:",
            "t": "ax (Wi-Fi 6) is newest/fastest."
          },
          {
            "b": "Bands:",
            "t": "2.4 GHz (range) vs 5 GHz (speed)."
          }
        ]
      },
      {
        "h": "Securing the network",
        "ul": [
          {
            "b": "WPA2/WPA3:",
            "t": "use WPA3 or WPA2-AES; never WEP."
          },
          {
            "b": "Change defaults:",
            "t": "admin password + SSID."
          },
          {
            "b": "Guest network:",
            "t": "isolate visitors."
          }
        ],
        "note": {
          "kind": "warn",
          "text": "WEP is broken — never use it."
        }
      },
      {
        "h": "SOHO setup",
        "p": [
          "A combo router does routing, switching, Wi-Fi, DHCP, and NAT. Port forwarding exposes an internal service; enable a firewall."
        ]
      }
    ],
    "practice": "List three steps to secure a new home router."
  },
  "ca-net-04": {
    "intro": "The boxes that build a network — know what each does.",
    "sections": [
      {
        "h": "Core devices",
        "ul": [
          {
            "b": "Switch:",
            "t": "connects LAN devices (MAC-based)."
          },
          {
            "b": "Router:",
            "t": "connects networks, routes by IP."
          },
          {
            "b": "Access point:",
            "t": "adds Wi-Fi."
          },
          {
            "b": "Firewall:",
            "t": "filters traffic."
          },
          {
            "b": "Modem:",
            "t": "ISP↔digital signal."
          }
        ]
      },
      {
        "h": "Extras",
        "ul": [
          "PoE delivers power over Ethernet (APs, cameras)",
          "A combo SOHO router bundles router+switch+AP+firewall"
        ]
      },
      {
        "h": "When to use",
        "note": {
          "kind": "info",
          "text": "Out of ports? Add a switch. Need Wi-Fi? Add an AP. Segment/secure? Firewall/VLAN."
        }
      }
    ],
    "practice": "Name the device that routes between networks vs the one that connects devices on the same LAN."
  },
  "ca-net-05": {
    "intro": "The services that make IP networks usable.",
    "sections": [
      {
        "h": "Core services",
        "ul": [
          {
            "b": "DNS:",
            "t": "names → IPs."
          },
          {
            "b": "DHCP:",
            "t": "auto IP assignment."
          },
          {
            "b": "NAT:",
            "t": "many private IPs share one public IP."
          }
        ]
      },
      {
        "h": "Segmentation & remote",
        "ul": [
          {
            "b": "VLAN:",
            "t": "logical network separation on a switch."
          },
          {
            "b": "VPN:",
            "t": "encrypted tunnel over the internet."
          }
        ]
      },
      {
        "h": "Addressing recap",
        "note": {
          "kind": "tip",
          "text": "APIPA (169.254.x) = no DHCP. Loopback = 127.0.0.1."
        }
      }
    ],
    "practice": "Explain what NAT does and why home networks rely on it."
  },
  "ca-net-06": {
    "intro": "How sites and homes connect to the internet.",
    "sections": [
      {
        "h": "Wired",
        "ul": [
          {
            "b": "Fiber:",
            "t": "fastest, symmetrical."
          },
          {
            "b": "Cable:",
            "t": "coax, shared."
          },
          {
            "b": "DSL:",
            "t": "phone line, distance-limited."
          }
        ]
      },
      {
        "h": "Wireless/other",
        "ul": [
          {
            "b": "Cellular:",
            "t": "4G/5G, mobile."
          },
          {
            "b": "Satellite:",
            "t": "remote areas, higher latency."
          },
          {
            "b": "Fixed wireless",
            "t": "— line-of-sight."
          }
        ]
      },
      {
        "h": "Choosing",
        "note": {
          "kind": "info",
          "text": "Fiber where available; satellite/cellular for remote sites where wired isn't feasible."
        }
      }
    ],
    "practice": "Which connection type has the highest latency, and which is fastest/symmetrical?"
  },
  "ca-net-07": {
    "intro": "A+ expects well-known ports and their protocols from memory.",
    "sections": [
      {
        "h": "Must-know ports",
        "ul": [
          "20/21 FTP · 22 SSH/SFTP · 23 Telnet",
          "25 SMTP · 53 DNS · 67/68 DHCP",
          "80 HTTP · 443 HTTPS · 110 POP3 · 143 IMAP",
          "389 LDAP · 3389 RDP · 445 SMB"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: Firewall and connectivity tickets constantly come down to a blocked port — knowing 443 vs 3389 vs 445 on sight saves real time."
        }
      },
      {
        "h": "TCP vs UDP",
        "p": [
          "TCP reliable/ordered (web, email, RDP); UDP fast/connectionless (DNS queries, streaming, VoIP)."
        ]
      },
      {
        "h": "Secure vs insecure",
        "p": [
          "Prefer HTTPS/SSH/SFTP over HTTP/Telnet/FTP."
        ]
      }
    ],
    "practice": "Write the ports for HTTPS, RDP, SMB, and DNS."
  }
};
