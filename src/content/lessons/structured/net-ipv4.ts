import type { LessonContent } from '../model';

export const netipv4Lessons: Record<string, LessonContent> = {
  "nw-ip-01": {
    "intro": "An IPv4 address is 32 bits written as four decimal octets. Every address splits into a network part and a host part.",
    "sections": [
      {
        "h": "Anatomy",
        "ul": [
          "32 bits = four 8-bit octets (0-255), e.g. 192.168.1.10",
          "A subnet mask marks which bits are network vs host",
          "Network address = all host bits 0; broadcast = all host bits 1"
        ]
      },
      {
        "h": "Private ranges (RFC 1918)",
        "ul": [
          {
            "b": "10.0.0.0/8",
            "t": "— large networks."
          },
          {
            "b": "172.16.0.0/12",
            "t": "— medium."
          },
          {
            "b": "192.168.0.0/16",
            "t": "— home/small office."
          }
        ]
      },
      {
        "h": "Public vs private",
        "note": {
          "kind": "info",
          "text": "Private addresses aren't routable on the internet; NAT translates them to a public address at the edge."
        }
      }
    ],
    "practice": "Identify whether these are public or private: 10.4.5.6, 8.8.8.8, 172.20.1.1, 192.168.0.50."
  },
  "nw-ip-02": {
    "intro": "The subnet mask (and its CIDR shorthand) is what actually divides an address into network and host. Read it fluently and subnetting becomes easy.",
    "sections": [
      {
        "h": "Mask and prefix",
        "svg": "<svg viewBox=\"0 0 600 100\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"ui-sans-serif,system-ui\"><text x=\"8\" y=\"24\" fill=\"#e2e8f0\" font-size=\"13\">192.168.10.0 /27  →  mask 255.255.255.224</text><rect x=\"8\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"26\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"44\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"62\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"80\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"98\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"116\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"134\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"166\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"184\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"202\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"220\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"238\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"256\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"274\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"292\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"324\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"342\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"360\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"378\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"396\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"414\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"432\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"450\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"482\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"500\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"518\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#4f46e5\" stroke=\"#0b0f17\"/><rect x=\"536\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#d97706\" stroke=\"#0b0f17\"/><rect x=\"554\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#d97706\" stroke=\"#0b0f17\"/><rect x=\"572\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#d97706\" stroke=\"#0b0f17\"/><rect x=\"590\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#d97706\" stroke=\"#0b0f17\"/><rect x=\"608\" y=\"40\" width=\"15\" height=\"15\" rx=\"2\" fill=\"#d97706\" stroke=\"#0b0f17\"/><text x=\"157.0\" y=\"53\" fill=\"#64748b\" font-size=\"14\">.</text><text x=\"315.0\" y=\"53\" fill=\"#64748b\" font-size=\"14\">.</text><text x=\"473.0\" y=\"53\" fill=\"#64748b\" font-size=\"14\">.</text><rect x=\"8\" y=\"70\" width=\"14\" height=\"14\" rx=\"2\" fill=\"#4f46e5\"/><text x=\"28\" y=\"82\" fill=\"#cbd5e1\" font-size=\"12\">network bits (27)</text><rect x=\"170\" y=\"70\" width=\"14\" height=\"14\" rx=\"2\" fill=\"#d97706\"/><text x=\"190\" y=\"82\" fill=\"#cbd5e1\" font-size=\"12\">host bits (5)</text></svg>",
        "caption": "A /27 prefix: 27 network bits and 5 host bits → mask 255.255.255.224."
      },
      {
        "h": "CIDR shorthand",
        "ul": [
          {
            "b": "/24 = 255.255.255.0",
            "t": "— 256 addresses, 254 hosts."
          },
          {
            "b": "/25 = 255.255.255.128",
            "t": "— 128 addresses, 126 hosts."
          },
          {
            "b": "/26 = .192",
            "t": "— 64 / 62."
          },
          {
            "b": "/27 = .224",
            "t": "— 32 / 30."
          },
          {
            "b": "/30 = .252",
            "t": "— 4 / 2 (point-to-point links)."
          }
        ]
      },
      {
        "h": "Hosts formula",
        "note": {
          "kind": "tip",
          "text": "Usable hosts = 2^(host bits) − 2 (subtracting network and broadcast). A /27 has 2^5−2 = 30 hosts."
        }
      }
    ],
    "practice": "Without a calculator, give the mask and usable host count for /26 and /28."
  },
  "nw-ip-03": {
    "intro": "Subnetting borrows host bits to create multiple smaller networks — the core skill for segmenting and sizing networks.",
    "sections": [
      {
        "h": "The trade-off",
        "p": [
          "Every bit you borrow doubles the number of subnets and halves the hosts per subnet. Design around the larger of 'subnets needed' or 'hosts per subnet needed'."
        ]
      },
      {
        "h": "Block size (the fast method)",
        "ul": [
          "Block size = 256 − mask octet (e.g. /27 → 256−224 = 32)",
          "Subnets start at multiples of the block: 0, 32, 64, 96 …",
          "The network an address belongs to is the block it falls into"
        ]
      },
      {
        "h": "Worked example",
        "p": [
          "192.168.10.37 /27: block size 32 → networks at .0, .32, .64… .37 falls in the .32 block, so network = 192.168.10.32, broadcast = .63, usable .33–.62."
        ],
        "note": {
          "kind": "info",
          "text": "This block-size method lets you subnet in your head — no binary conversion required for most questions."
        }
      }
    ],
    "practice": "For 10.20.30.100/26, work out the network address, broadcast, and usable host range by hand, then check it."
  },
  "nw-ip-04": {
    "intro": "Speed comes from reps. This lesson drills the repeatable method you can apply to any address.",
    "sections": [
      {
        "h": "The five-step method",
        "ul": [
          "1. From the prefix, find host bits and the mask octet",
          "2. Block size = 256 − mask octet",
          "3. List subnet boundaries (multiples of block size)",
          "4. Your address's network = the boundary it falls in; broadcast = next boundary − 1",
          "5. Usable range = network+1 to broadcast−1"
        ]
      },
      {
        "h": "Try these",
        "p": [
          "172.16.5.200/28 → network 172.16.5.192, broadcast .207, hosts .193–.206. 10.0.5.130/25 → network 10.0.5.128, broadcast .255, hosts .129–.254."
        ]
      },
      {
        "h": "Sanity check",
        "note": {
          "kind": "tip",
          "text": "Network and broadcast are never usable host addresses — if you assign one to a host, connectivity breaks."
        }
      }
    ],
    "practice": "Solve three of your own: pick random addresses with /26, /28, and /30 and compute network, broadcast, and host range."
  },
  "nw-ip-05": {
    "intro": "Real networks have subnets of different sizes. VLSM lets you fit the mask to each subnet's need instead of wasting addresses.",
    "sections": [
      {
        "h": "Why VLSM",
        "p": [
          "A fixed mask wastes space — a point-to-point link doesn't need 254 hosts. VLSM assigns the right-sized subnet to each requirement."
        ]
      },
      {
        "h": "The method",
        "ul": [
          "Sort requirements largest-to-smallest by host count",
          "Assign each the smallest subnet that fits (round up to a power of two)",
          "Carve them from the address space in order, without overlap"
        ]
      },
      {
        "h": "Example",
        "note": {
          "kind": "info",
          "text": "From 192.168.1.0/24: a 100-host LAN takes a /25, a 50-host LAN a /26 from the remainder, and point-to-point links take /30s — no overlap, minimal waste."
        }
      }
    ],
    "practice": "Given 192.168.1.0/24 and needs of 100, 50, 25, and two 2-host links, allocate subnets with VLSM (no overlaps)."
  },
  "nw-ip-06": {
    "intro": "A good addressing plan is documented, leaves room to grow, and encodes meaning so humans can read the network.",
    "sections": [
      {
        "h": "Design principles",
        "ul": [
          "Reserve blocks per site/VLAN/purpose (e.g. servers, users, voice)",
          "Leave headroom for growth — don't allocate to the last address",
          "Keep it summarisable so routing stays simple"
        ]
      },
      {
        "h": "Make it readable",
        "p": [
          "Encode meaning: e.g. 10.<site>.<vlan>.<host>. Consistency turns an IP into information."
        ]
      },
      {
        "h": "Document it",
        "note": {
          "kind": "warn",
          "text": "An undocumented scheme becomes unmanageable fast. Maintain IPAM/records of every subnet's purpose and range."
        }
      }
    ],
    "practice": "Draft an addressing scheme for a two-site company with users, servers, and voice VLANs, leaving room to double in size."
  }
};
