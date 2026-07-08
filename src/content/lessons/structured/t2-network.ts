import type { LessonContent } from '../model';

export const t2networkLessons: Record<string, LessonContent> = {
  "t2-net-01": {
    "intro": "Most 'no internet' tickets come down to addressing or DNS on the client. A quick sequence isolates it.",
    "sections": [
      {
        "h": "Check addressing",
        "ul": [
          {
            "b": "169.254.x.x (APIPA):",
            "t": "no DHCP lease — check adapter, cable, or DHCP."
          },
          {
            "b": "Correct IP but no internet:",
            "t": "test the gateway, then a public IP, then a name."
          }
        ]
      },
      {
        "h": "DNS on the client",
        "code": "ipconfig /all        # see IP, gateway, DNS\nipconfig /flushdns   # clear a stale DNS cache\nnslookup example.com # confirm resolution"
      },
      {
        "h": "Reset path",
        "note": {
          "kind": "tip",
          "text": "ipconfig /release then /renew re-requests a lease; flushing DNS fixes stale-record issues."
        }
      }
    ],
    "practice": "Walk through the exact commands you'd run for 'I can ping 8.8.8.8 but websites won't load'."
  },
  "t2-net-02": {
    "intro": "Remote workers depend on VPN. When it fails, a few checks cover most cases.",
    "sections": [
      {
        "h": "Connection failures",
        "ul": [
          "Verify credentials/MFA and that the account isn't locked",
          "Confirm internet works before the VPN connects",
          "Check the client is current and the profile/config is correct"
        ]
      },
      {
        "h": "Connected but can't reach resources",
        "p": [
          "Often DNS or routing: is the VPN pushing the right DNS and routes? Split tunneling sends only some traffic through the VPN."
        ]
      },
      {
        "h": "Escalate when",
        "note": {
          "kind": "info",
          "text": "Gateway-side outages or certificate/policy problems are beyond the client — gather the error and escalate with details."
        }
      }
    ],
    "practice": "A user connects to VPN but can't reach the file server. Name two likely causes and how you'd check them."
  },
  "t2-net-03": {
    "intro": "Networked printers generate steady tickets. Knowing the moving parts makes them quick.",
    "sections": [
      {
        "h": "How network printing works",
        "ul": [
          "The printer has an IP; the PC prints via a queue/driver to that IP or a print server",
          "A print server centralises queues and drivers for many users"
        ]
      },
      {
        "h": "Common fixes",
        "ul": [
          {
            "b": "Stuck queue:",
            "t": "clear jobs / restart the Print Spooler service."
          },
          {
            "b": "Wrong/old driver:",
            "t": "reinstall the correct model driver."
          },
          {
            "b": "Printer offline:",
            "t": "check power, network/IP, and connectivity (ping it)."
          }
        ]
      },
      {
        "h": "On a server",
        "note": {
          "kind": "warn",
          "text": "Restarting the Print Spooler clears all queued jobs on that machine — warn users first."
        }
      }
    ],
    "practice": "A shared printer shows 'offline' for everyone. List the checks you'd run from the print server outward."
  },
  "t2-net-04": {
    "intro": "Remote workers depend on VPN — a top Tier-2 category.",
    "sections": [
      {
        "h": "Can't connect",
        "ul": [
          "Wrong creds/MFA, expired cert, client version",
          "ISP/firewall blocking the VPN port",
          "Confirm the user has internet first"
        ]
      },
      {
        "h": "Connected but no access",
        "ul": [
          "Split tunnel vs full tunnel routing",
          "DNS not resolving internal names",
          "Firewall rules on the resource"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: 'VPN connects but I can't reach the file server' is usually DNS or routing, not the VPN itself — test by IP vs name to split the problem."
        }
      },
      {
        "h": "Method",
        "p": [
          "Internet → VPN tunnel up → internal DNS → resource. Test each hop."
        ]
      }
    ],
    "practice": "A user's VPN connects but internal sites won't load — what do you test to isolate it?"
  },
  "t2-net-05": {
    "intro": "So many 'internet down' tickets are actually DNS.",
    "sections": [
      {
        "h": "Diagnose",
        "code": "nslookup intranet.corp   # does it resolve?\nipconfig /displaydns     # cache\nipconfig /flushdns       # clear stale records\nping 8.8.8.8 vs ping name # IP works, name fails = DNS"
      },
      {
        "h": "Causes",
        "ul": [
          "Wrong DNS server set on the client",
          "Stale cached record after a change",
          "Internal vs external DNS split"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: If ping to 8.8.8.8 works but names fail, it's DNS every time — flush the cache and verify the client's DNS server before escalating."
        }
      },
      {
        "h": "Fix",
        "p": [
          "Correct DNS server (DHCP or static), flush cache, verify with nslookup."
        ]
      }
    ],
    "practice": "Ping to 8.8.8.8 succeeds but no site loads — name the cause and two commands to confirm/fix."
  }
};
