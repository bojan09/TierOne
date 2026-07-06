import type { LessonContent } from '../model';

export const nettroubleshootingLessons: Record<string, LessonContent> = {
  "nw-tsh-01": {
    "intro": "A handful of command-line tools diagnose the vast majority of network issues. Know what each proves.",
    "sections": [
      {
        "h": "The core toolkit",
        "ul": [
          {
            "b": "ping:",
            "t": "is the host reachable? (layer 3 connectivity)."
          },
          {
            "b": "traceroute / tracert:",
            "t": "where along the path does it break?"
          },
          {
            "b": "nslookup / dig:",
            "t": "is DNS resolving correctly?"
          },
          {
            "b": "ipconfig / ifconfig / ip:",
            "t": "my own address, gateway, DNS."
          },
          {
            "b": "arp / netstat:",
            "t": "local MAC mappings and active connections/ports."
          }
        ]
      },
      {
        "h": "Read the result",
        "note": {
          "kind": "tip",
          "text": "ping the gateway, then a public IP, then a name: that quickly isolates local vs routing vs DNS problems."
        }
      }
    ],
    "practice": "Run ping to your gateway and to 8.8.8.8, then nslookup a website — note which layer each result confirms."
  },
  "nw-tsh-02": {
    "intro": "A structured method beats random changes — it finds root cause faster and avoids new problems.",
    "sections": [
      {
        "h": "Work the layers",
        "p": [
          "Use the OSI model as a checklist — bottom-up (cable/link → IP → DNS → app) or top-down. Confirm each layer before moving on."
        ]
      },
      {
        "h": "The steps",
        "ul": [
          "Identify the problem and its scope (one user or many? what changed?)",
          "Form a theory, then test it — one change at a time",
          "Fix, verify, and document the cause"
        ]
      },
      {
        "h": "Isolate",
        "note": {
          "kind": "warn",
          "text": "Change one variable at a time. Changing several at once hides which change actually fixed it."
        }
      }
    ],
    "practice": "Take 'a user can't reach the shared drive' and write the layer-by-layer checks you'd run in order."
  },
  "nw-tsh-03": {
    "intro": "When higher-level tools aren't enough, a packet capture shows exactly what's on the wire.",
    "sections": [
      {
        "h": "Capturing",
        "p": [
          "Tools like Wireshark capture frames on an interface. Use capture/display filters (e.g. by IP, port, or protocol) to cut through the noise."
        ]
      },
      {
        "h": "What you can see",
        "svg": "<svg viewBox=\"0 0 500 220\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"ui-sans-serif,system-ui\" font-size=\"12\"><text x=\"90\" y=\"20\" fill=\"#e2e8f0\" text-anchor=\"middle\">Client</text><text x=\"410\" y=\"20\" fill=\"#e2e8f0\" text-anchor=\"middle\">Server</text><line x1=\"90\" y1=\"30\" x2=\"90\" y2=\"200\" stroke=\"#475569\"/><line x1=\"410\" y1=\"30\" x2=\"410\" y2=\"200\" stroke=\"#475569\"/><defs><marker id=\"ah\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L7,3 L0,6\" fill=\"#818cf8\"/></marker></defs><line x1=\"90\" y1=\"60\" x2=\"405\" y2=\"60\" stroke=\"#818cf8\" stroke-width=\"2\" marker-end=\"url(#ah)\"/><text x=\"250\" y=\"52\" fill=\"#a5b4fc\" text-anchor=\"middle\">SYN</text><line x1=\"410\" y1=\"110\" x2=\"95\" y2=\"110\" stroke=\"#22c55e\" stroke-width=\"2\" marker-end=\"url(#ah)\"/><text x=\"250\" y=\"102\" fill=\"#86efac\" text-anchor=\"middle\">SYN-ACK</text><line x1=\"90\" y1=\"160\" x2=\"405\" y2=\"160\" stroke=\"#818cf8\" stroke-width=\"2\" marker-end=\"url(#ah)\"/><text x=\"250\" y=\"152\" fill=\"#a5b4fc\" text-anchor=\"middle\">ACK</text><text x=\"250\" y=\"192\" fill=\"#64748b\" text-anchor=\"middle\">connection established</text></svg>",
        "caption": "A TCP three-way handshake as seen in a capture: SYN → SYN-ACK → ACK."
      },
      {
        "h": "Common uses",
        "note": {
          "kind": "info",
          "text": "Confirm a handshake completes, spot retransmissions/resets, verify DNS/DHCP exchanges, or prove where a conversation stops."
        }
      }
    ],
    "practice": "Describe what you'd expect to see in a capture if a TCP connection is being refused by the server."
  },
  "nw-tsh-04": {
    "intro": "You can't fix what you can't see. Monitoring turns reactive firefighting into proactive operations.",
    "sections": [
      {
        "h": "The pillars",
        "ul": [
          {
            "b": "SNMP:",
            "t": "poll device health (CPU, interfaces, errors)."
          },
          {
            "b": "NetFlow / sFlow:",
            "t": "who's talking to whom and how much (traffic patterns)."
          },
          {
            "b": "Syslog:",
            "t": "centralised device event logs."
          }
        ]
      },
      {
        "h": "Baselines & alerts",
        "p": [
          "Capture what 'normal' looks like, then alert on deviations — link saturation, error spikes, a device going quiet."
        ]
      },
      {
        "h": "Value",
        "note": {
          "kind": "tip",
          "text": "Good monitoring catches capacity and failure trends before users notice — and shortens outages when they happen."
        }
      }
    ],
    "practice": "Pick one metric from SNMP, NetFlow, and syslog you'd alert on, and say what problem each would catch early."
  }
};
