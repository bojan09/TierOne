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
  }
};
