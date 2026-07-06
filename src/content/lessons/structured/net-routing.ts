import type { LessonContent } from '../model';

export const netroutingLessons: Record<string, LessonContent> = {
  "nw-rt-01": {
    "intro": "Routers connect different networks and choose the best path for each packet using a routing table.",
    "sections": [
      {
        "h": "The routing table",
        "ul": [
          "Each entry maps a destination network to a next hop / exit interface",
          "The router picks the most specific match (longest prefix match)",
          "A default route (0.0.0.0/0) catches everything else"
        ]
      },
      {
        "h": "How a packet moves",
        "p": [
          "Each router forwards to the next hop toward the destination network, hop by hop, until delivery — it only cares about the destination network, not the whole path."
        ]
      },
      {
        "h": "Default gateway",
        "note": {
          "kind": "info",
          "text": "A host sends off-subnet traffic to its default gateway (a router), which takes over the forwarding decision."
        }
      }
    ],
    "practice": "On a device, view the routing table (route print / ip route) and identify the default route and gateway."
  },
  "nw-rt-02": {
    "intro": "Static routes are manually configured paths — simple, predictable, and ideal for small or stub networks.",
    "sections": [
      {
        "h": "When to use",
        "ul": [
          "Small networks with few paths",
          "Stub networks (one way in/out)",
          "A default route to the internet edge"
        ]
      },
      {
        "h": "Trade-offs",
        "p": [
          "Static routes don't adapt automatically — if a link fails or the topology changes, you must update them by hand. They add no protocol overhead, though."
        ]
      },
      {
        "h": "Example",
        "code": "ip route 10.2.0.0 255.255.255.0 192.168.1.1   # reach 10.2.0.0/24 via next hop"
      }
    ],
    "practice": "Write the static route a branch router needs to reach 10.5.5.0/24 through next hop 10.0.0.2."
  },
  "nw-rt-03": {
    "intro": "Dynamic routing protocols let routers learn and adapt paths automatically — essential as networks grow.",
    "sections": [
      {
        "h": "Two families",
        "ul": [
          {
            "b": "Distance-vector (e.g. RIP):",
            "t": "share their whole table with neighbours; simple, slower to converge."
          },
          {
            "b": "Link-state (e.g. OSPF):",
            "t": "build a full map and compute best paths; faster, more scalable."
          }
        ]
      },
      {
        "h": "Key ideas",
        "ul": [
          {
            "b": "Metric:",
            "t": "how a protocol rates a path (hop count, bandwidth, cost)."
          },
          {
            "b": "Convergence:",
            "t": "how fast all routers agree after a change."
          }
        ]
      },
      {
        "h": "Common choices",
        "note": {
          "kind": "info",
          "text": "OSPF is the common interior link-state protocol; BGP runs between organisations and powers internet routing."
        }
      }
    ],
    "practice": "Explain in one line why a link-state protocol like OSPF converges faster than a basic distance-vector protocol."
  },
  "nw-rt-04": {
    "intro": "VLANs isolate traffic, so something must route between them. Two designs do the job.",
    "sections": [
      {
        "h": "Router-on-a-stick",
        "p": [
          "A single trunk to a router carries all VLANs; the router has a sub-interface per VLAN and routes between them. Simple, but the one link can bottleneck."
        ]
      },
      {
        "h": "Layer-3 switch (SVIs)",
        "p": [
          "A multilayer switch routes between VLANs internally using Switched Virtual Interfaces (SVIs) — faster and the usual enterprise choice."
        ]
      },
      {
        "h": "Either way",
        "note": {
          "kind": "tip",
          "text": "Each VLAN gets a gateway IP (the router sub-interface or the SVI) that its hosts use as their default gateway."
        }
      }
    ],
    "practice": "Decide router-on-a-stick vs a layer-3 switch for a 6-VLAN office and justify the choice."
  },
  "nw-rt-05": {
    "intro": "NAT lets many private hosts share public addresses — the reason IPv4 didn't run out sooner.",
    "sections": [
      {
        "h": "What NAT does",
        "p": [
          "Network Address Translation rewrites private source addresses to a public one at the network edge, and reverses it for return traffic."
        ]
      },
      {
        "h": "PAT (overload)",
        "svg": "<svg viewBox=\"0 0 580 200\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"ui-sans-serif,system-ui\" font-size=\"12\"><rect x=\"20\" y=\"40\" width=\"130\" height=\"30\" rx=\"5\" fill=\"#1e293b\" stroke=\"#475569\"/><text x=\"85\" y=\"60\" fill=\"#e2e8f0\" text-anchor=\"middle\">PC 192.168.1.10</text><rect x=\"20\" y=\"120\" width=\"130\" height=\"30\" rx=\"5\" fill=\"#1e293b\" stroke=\"#475569\"/><text x=\"85\" y=\"140\" fill=\"#e2e8f0\" text-anchor=\"middle\">PC 192.168.1.11</text><line x1=\"150\" y1=\"55\" x2=\"250\" y2=\"90\" stroke=\"#64748b\"/><line x1=\"150\" y1=\"135\" x2=\"250\" y2=\"100\" stroke=\"#64748b\"/><rect x=\"250\" y=\"75\" width=\"110\" height=\"44\" rx=\"8\" fill=\"#3730a3\" stroke=\"#818cf8\"/><text x=\"305\" y=\"93\" fill=\"#e2e8f0\" text-anchor=\"middle\">Router</text><text x=\"305\" y=\"110\" fill=\"#c7d2fe\" text-anchor=\"middle\">NAT / PAT</text><line x1=\"360\" y1=\"97\" x2=\"450\" y2=\"97\" stroke=\"#64748b\"/><rect x=\"450\" y=\"78\" width=\"110\" height=\"40\" rx=\"8\" fill=\"#0f172a\" stroke=\"#475569\"/><text x=\"505\" y=\"95\" fill=\"#e2e8f0\" text-anchor=\"middle\">Internet</text><text x=\"505\" y=\"111\" fill=\"#94a3b8\" text-anchor=\"middle\">203.0.113.5</text><text x=\"290\" y=\"150\" fill=\"#64748b\">many private IPs → one public IP (different ports)</text></svg>",
        "caption": "PAT maps many private IPs to one public IP, using port numbers to tell sessions apart."
      },
      {
        "h": "Why it matters",
        "note": {
          "kind": "info",
          "text": "Almost every home/office uses PAT: many internal devices behind a single public IP. It also hides internal addressing from the internet."
        }
      }
    ],
    "practice": "Describe how the router tells apart return traffic for two PCs that both browsed the web through one public IP."
  }
};
