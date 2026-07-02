import type { LessonContent } from '../model';

export const winserverremoteLessons: Record<string, LessonContent> = {
  "ws-ras-01": {
    "intro": "Solid host networking underpins every server role — addressing, name resolution, and resilient NICs.",
    "sections": [
      {
        "h": "Addressing",
        "ul": [
          "Static IP, subnet mask, gateway on infrastructure servers",
          "Point DNS at internal domain controllers",
          "Verify with ipconfig /all and Test-NetConnection"
        ]
      },
      {
        "h": "NIC teaming",
        "p": [
          "Combine multiple NICs for bandwidth and failover so a single cable or port failure doesn't take the server offline."
        ]
      },
      {
        "h": "Verify",
        "note": {
          "kind": "tip",
          "text": "Test-NetConnection checks reachability and a specific port — great for confirming a service is listening."
        },
        "code": "Test-NetConnection -ComputerName dc01 -Port 389"
      }
    ],
    "practice": "Configure a static IP and test connectivity to a DC's LDAP port with Test-NetConnection."
  },
  "ws-ras-02": {
    "intro": "The Routing and Remote Access role (RRAS) turns Windows Server into a VPN gateway and router for remote users and sites.",
    "sections": [
      {
        "h": "VPN types",
        "ul": [
          {
            "b": "Client (remote access):",
            "t": "individual users tunnel in from anywhere."
          },
          {
            "b": "Site-to-site:",
            "t": "connects whole networks (e.g. branch to HQ)."
          }
        ]
      },
      {
        "h": "Protocols",
        "p": [
          "Common tunnels include IKEv2 and SSTP (firewall-friendly over 443). Choose based on client support and network constraints."
        ]
      },
      {
        "h": "Reality",
        "note": {
          "kind": "info",
          "text": "RRAS works, but many organisations pair it with NPS/RADIUS for policy and use Always On VPN for a modern client experience."
        }
      }
    ],
    "practice": "Describe whether you'd use a client VPN or site-to-site VPN to connect a small branch office, and why."
  },
  "ws-ras-03": {
    "intro": "Network Policy Server (NPS) is Microsoft's RADIUS implementation — central authentication and authorisation for network access.",
    "sections": [
      {
        "h": "What NPS does",
        "p": [
          "NPS authenticates and authorises connection requests (VPN, wireless, wired 802.1X) against AD, applying network policies."
        ]
      },
      {
        "h": "RADIUS role",
        "ul": [
          {
            "b": "Authentication:",
            "t": "is this user/device allowed?"
          },
          {
            "b": "Authorisation:",
            "t": "what conditions apply (time, group, health)?"
          },
          {
            "b": "Accounting:",
            "t": "logging of access."
          }
        ]
      },
      {
        "h": "Common use",
        "note": {
          "kind": "info",
          "text": "Wi-Fi with WPA2/3-Enterprise typically uses NPS as the RADIUS server so users authenticate with their AD credentials."
        }
      }
    ],
    "practice": "Explain how NPS would let staff connect to secure Wi-Fi using their domain accounts."
  },
  "ws-ras-04": {
    "intro": "Always On VPN is Microsoft's modern replacement for DirectAccess — seamless, policy-driven remote connectivity.",
    "sections": [
      {
        "h": "What's different",
        "p": [
          "The VPN connects automatically and transparently whenever the device has internet, so managed devices are always reachable and compliant — no user action needed."
        ]
      },
      {
        "h": "Built on standards",
        "ul": [
          "Uses IKEv2/SSTP tunnels",
          "Deployed and configured via Intune/MDM or scripts",
          "Integrates with NPS for policy and conditional access"
        ]
      },
      {
        "h": "Direction of travel",
        "note": {
          "kind": "info",
          "text": "DirectAccess is legacy; new deployments should use Always On VPN or cloud-native access (e.g. Entra-based)."
        }
      }
    ],
    "practice": "List two advantages of Always On VPN over asking users to manually start a VPN client."
  },
  "ws-ras-05": {
    "intro": "Remote Desktop Services (RDS) delivers desktops and apps from the server to users anywhere — a core remote-work capability.",
    "sections": [
      {
        "h": "RDS roles",
        "ul": [
          {
            "b": "Session Host:",
            "t": "runs the sessions/apps users connect to."
          },
          {
            "b": "Connection Broker:",
            "t": "distributes and reconnects sessions."
          },
          {
            "b": "RD Gateway:",
            "t": "secure access over HTTPS from the internet."
          },
          {
            "b": "Web Access:",
            "t": "a portal to published apps."
          }
        ]
      },
      {
        "h": "Licensing",
        "p": [
          "RDS needs RD CALs (per user or device) in addition to Windows Server CALs, managed by the RD Licensing role."
        ]
      },
      {
        "h": "Security",
        "note": {
          "kind": "warn",
          "text": "Never expose RDP directly to the internet — front it with RD Gateway (443) and MFA."
        }
      }
    ],
    "practice": "Sketch the RDS roles you'd deploy to publish an app to remote users securely, including how they reach it from outside."
  }
};
