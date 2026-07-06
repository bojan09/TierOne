import type { LessonContent } from '../model';

export const netipv6Lessons: Record<string, LessonContent> = {
  "nw-ip6-01": {
    "intro": "IPv4 ran out of addresses. IPv6 uses 128 bits — an effectively unlimited space — written in hexadecimal.",
    "sections": [
      {
        "h": "The format",
        "ul": [
          "128 bits shown as eight groups of four hex digits, separated by colons",
          "e.g. 2001:0db8:0000:0000:0000:ff00:0042:8329"
        ]
      },
      {
        "h": "Shortening rules",
        "ul": [
          {
            "b": "Drop leading zeros",
            "t": "in each group (00ff → ff)."
          },
          {
            "b": "Replace one run of all-zero groups with ::",
            "t": "(only once per address)."
          }
        ]
      },
      {
        "h": "Example",
        "note": {
          "kind": "info",
          "text": "2001:db8::ff00:42:8329 is the shortened form of the address above — far more manageable."
        }
      }
    ],
    "practice": "Shorten 2001:0db8:0000:0000:0000:0000:0000:0001 using the IPv6 rules."
  },
  "nw-ip6-02": {
    "intro": "IPv6 has several address scopes and can configure itself without DHCP.",
    "sections": [
      {
        "h": "Key address types",
        "ul": [
          {
            "b": "Global unicast (2000::/3):",
            "t": "internet-routable, like a public IPv4."
          },
          {
            "b": "Link-local (fe80::/10):",
            "t": "auto-assigned, valid on the local link only."
          },
          {
            "b": "Unique local (fc00::/7):",
            "t": "private, like RFC 1918."
          },
          {
            "b": "Multicast (ff00::/8):",
            "t": "one-to-many (IPv6 has no broadcast)."
          }
        ]
      },
      {
        "h": "Autoconfiguration",
        "p": [
          "SLAAC (Stateless Address Autoconfiguration) lets a host build its own address from a router-advertised prefix. DHCPv6 is available when you need central control."
        ]
      },
      {
        "h": "No broadcast",
        "note": {
          "kind": "tip",
          "text": "IPv6 replaces broadcast with multicast — more efficient. Every interface also gets a link-local fe80 address automatically."
        }
      }
    ],
    "practice": "On any device, find its IPv6 link-local (fe80) address and note which interface it's on."
  },
  "nw-ip6-03": {
    "intro": "The internet won't switch overnight, so IPv4 and IPv6 run side by side using a few coexistence techniques.",
    "sections": [
      {
        "h": "The main approaches",
        "ul": [
          {
            "b": "Dual-stack:",
            "t": "run IPv4 and IPv6 together (the preferred, simplest path)."
          },
          {
            "b": "Tunneling:",
            "t": "carry IPv6 across IPv4-only networks (6in4, etc.)."
          },
          {
            "b": "Translation (NAT64):",
            "t": "let IPv6-only hosts reach IPv4 services."
          }
        ]
      },
      {
        "h": "Reality",
        "note": {
          "kind": "info",
          "text": "Dual-stack is the dominant strategy: hosts prefer IPv6 when both are available and fall back to IPv4."
        }
      }
    ],
    "practice": "State which coexistence method you'd use to let a new IPv6-only network reach legacy IPv4-only servers."
  }
};
