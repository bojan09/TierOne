import type { LessonContent } from '../model';

export const netsecurityLessons: Record<string, LessonContent> = {
  "nw-sec-01": {
    "intro": "Firewalls and access control lists decide what traffic is allowed where — the network's front door.",
    "sections": [
      {
        "h": "Stateful firewalls",
        "p": [
          "A stateful firewall tracks connections and allows return traffic automatically, blocking anything not part of an allowed session. It's the standard perimeter and inter-zone control."
        ]
      },
      {
        "h": "Access control lists",
        "ul": [
          "Permit/deny rules matched by source, destination, port, protocol",
          "Order matters — first match wins",
          "End with an implicit deny"
        ]
      },
      {
        "h": "Design",
        "note": {
          "kind": "tip",
          "text": "Default-deny, then explicitly allow what's needed. Group interfaces into zones (inside, outside, DMZ) and control traffic between them."
        }
      }
    ],
    "practice": "Write, in plain rules, an ACL that allows web traffic to a server but blocks everything else to it."
  },
  "nw-sec-02": {
    "intro": "VPNs create encrypted tunnels across untrusted networks so remote users and sites connect securely.",
    "sections": [
      {
        "h": "VPN types",
        "ul": [
          {
            "b": "Site-to-site:",
            "t": "connects whole networks (branch ↔ HQ)."
          },
          {
            "b": "Remote access:",
            "t": "individual users tunnel in."
          }
        ]
      },
      {
        "h": "IPsec",
        "ul": [
          {
            "b": "Tunnel mode:",
            "t": "encrypts the whole packet (site-to-site)."
          },
          {
            "b": "Transport mode:",
            "t": "encrypts the payload only."
          },
          {
            "b": "Provides:",
            "t": "confidentiality, integrity, and authentication."
          }
        ]
      },
      {
        "h": "Alternatives",
        "note": {
          "kind": "info",
          "text": "SSL/TLS VPNs (over 443) are firewall-friendly for remote users; IPsec is common for site-to-site."
        }
      }
    ],
    "practice": "Decide site-to-site vs remote-access VPN for (a) linking two offices and (b) home workers, and why."
  },
  "nw-sec-03": {
    "intro": "Flat networks let one compromise reach everything. Segmentation and zero-trust limit the blast radius.",
    "sections": [
      {
        "h": "Segmentation",
        "p": [
          "Divide the network into zones (users, servers, IoT, guest) with controlled traffic between them, so a breach in one can't freely reach others. VLANs + firewall/ACLs implement it."
        ]
      },
      {
        "h": "DMZ",
        "p": [
          "A demilitarised zone hosts internet-facing services in a separate segment, isolated from the internal network."
        ]
      },
      {
        "h": "Zero trust",
        "note": {
          "kind": "info",
          "text": "Zero trust assumes no implicit trust by location — verify identity and authorise every access, and microsegment east-west traffic."
        }
      }
    ],
    "practice": "Propose three segments for a small business and the traffic you'd allow between them."
  },
  "nw-sec-04": {
    "intro": "Two services quietly make networks usable: DHCP hands out addressing, and DNS resolves names. Here they are from the network's point of view.",
    "sections": [
      {
        "h": "DHCP flow",
        "p": [
          "A client broadcasts for configuration and a DHCP server leases an IP, mask, gateway, and DNS. A DHCP relay forwards these broadcasts across subnets to a central server."
        ]
      },
      {
        "h": "DNS resolution",
        "p": [
          "A resolver walks from root → TLD → authoritative servers (or uses a cache/forwarder) to turn a name into an IP. Caching makes repeat lookups fast."
        ]
      },
      {
        "h": "Security basics",
        "note": {
          "kind": "warn",
          "text": "Rogue DHCP servers and DNS spoofing are real risks — DHCP snooping and trusted resolvers (and DNSSEC where possible) mitigate them."
        }
      }
    ],
    "practice": "Trace what a laptop receives from DHCP when it joins, and the steps to resolve a brand-new domain name."
  }
};
