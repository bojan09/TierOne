import type { LessonContent } from '../model';

export const netwirelessLessons: Record<string, LessonContent> = {
  "nw-wifi-01": {
    "intro": "Wi-Fi performance depends on the standard and the radio band. Knowing them explains speed and coverage trade-offs.",
    "sections": [
      {
        "h": "Standards",
        "ul": [
          {
            "b": "802.11n (Wi-Fi 4):",
            "t": "2.4 & 5 GHz."
          },
          {
            "b": "802.11ac (Wi-Fi 5):",
            "t": "5 GHz, faster."
          },
          {
            "b": "802.11ax (Wi-Fi 6/6E):",
            "t": "efficiency in dense areas, adds 6 GHz."
          }
        ]
      },
      {
        "h": "Bands",
        "ul": [
          {
            "b": "2.4 GHz:",
            "t": "longer range, more interference, fewer non-overlapping channels (1, 6, 11)."
          },
          {
            "b": "5 GHz:",
            "t": "faster, shorter range, many channels."
          },
          {
            "b": "6 GHz:",
            "t": "newest, lots of clean spectrum (Wi-Fi 6E)."
          }
        ]
      },
      {
        "h": "Channels",
        "note": {
          "kind": "tip",
          "text": "On 2.4 GHz stick to channels 1, 6, and 11 to avoid overlap — the most common cause of home Wi-Fi interference."
        }
      }
    ],
    "practice": "Check which band and channel your Wi-Fi uses and whether neighbours are overlapping your 2.4 GHz channel."
  },
  "nw-wifi-02": {
    "intro": "Wireless is a shared medium anyone nearby can hear, so encryption and authentication are essential.",
    "sections": [
      {
        "h": "Encryption standards",
        "ul": [
          {
            "b": "WPA2:",
            "t": "still common; AES encryption."
          },
          {
            "b": "WPA3:",
            "t": "current standard, stronger protection against offline attacks."
          },
          {
            "b": "Avoid WEP/WPA(1):",
            "t": "broken — never use."
          }
        ]
      },
      {
        "h": "Authentication modes",
        "ul": [
          {
            "b": "Personal (PSK):",
            "t": "a shared passphrase — simple, fine for home/small sites."
          },
          {
            "b": "Enterprise (802.1X):",
            "t": "per-user credentials via RADIUS — the business standard."
          }
        ]
      },
      {
        "h": "Guest networks",
        "note": {
          "kind": "tip",
          "text": "Isolate guest Wi-Fi from the internal network (its own VLAN) and enable client isolation."
        }
      }
    ],
    "practice": "Recommend the encryption and auth mode for (a) a home network and (b) a company office, and justify each."
  },
  "nw-wifi-03": {
    "intro": "Good Wi-Fi is engineered, not guessed. Coverage, interference, and capacity all need planning.",
    "sections": [
      {
        "h": "Design basics",
        "ul": [
          "Survey for coverage and place APs to overlap slightly",
          "Plan channels to avoid co-channel interference",
          "Size for device density, not just area"
        ]
      },
      {
        "h": "Common problems",
        "ul": [
          {
            "b": "Interference:",
            "t": "other APs, microwaves, Bluetooth (2.4 GHz)."
          },
          {
            "b": "Weak signal / dead zones:",
            "t": "distance, walls, materials."
          },
          {
            "b": "Roaming issues:",
            "t": "clients sticking to a far AP."
          }
        ]
      },
      {
        "h": "Controllers",
        "note": {
          "kind": "info",
          "text": "In business networks, a wireless controller (or cloud) manages many APs centrally for consistent config, channel planning, and roaming."
        }
      }
    ],
    "practice": "For a two-floor office with weak coverage in corners, list three things you'd check or change."
  }
};
