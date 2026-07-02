import type { LessonContent } from '../model';

export const winserverdnsLessons: Record<string, LessonContent> = {
  "ws-dns-01": {
    "intro": "DNS resolves names to addresses and locates services. On Windows Server, you host authoritative zones that answer for your namespace.",
    "sections": [
      {
        "h": "Zone types",
        "ul": [
          {
            "b": "Forward lookup:",
            "t": "name → IP (the common case)."
          },
          {
            "b": "Reverse lookup:",
            "t": "IP → name (PTR records)."
          }
        ]
      },
      {
        "h": "Primary, secondary & AD-integrated",
        "ul": [
          {
            "b": "Primary:",
            "t": "the writable master copy."
          },
          {
            "b": "Secondary:",
            "t": "a read-only copy via zone transfer."
          },
          {
            "b": "AD-integrated:",
            "t": "stored in AD, multi-master, replicated with the directory — the recommended choice on DCs."
          }
        ]
      },
      {
        "h": "Why AD-integrated wins",
        "p": [
          "AD-integrated zones give fault tolerance (every DC can answer and update), secure dynamic updates, and replication for free."
        ],
        "note": {
          "kind": "tip",
          "text": "Secure dynamic updates (AD-integrated only) stop rogue clients from registering or hijacking records."
        }
      }
    ],
    "practice": "Create a forward and a reverse lookup zone on a lab DC as AD-integrated, and enable secure dynamic updates."
  },
  "ws-dns-02": {
    "intro": "Each record type answers a different question. Recognising them is essential for both configuration and troubleshooting.",
    "sections": [
      {
        "h": "The records you'll use most",
        "ul": [
          {
            "b": "A / AAAA:",
            "t": "host name to IPv4 / IPv6 address."
          },
          {
            "b": "CNAME:",
            "t": "an alias to another name."
          },
          {
            "b": "MX:",
            "t": "mail server for a domain."
          },
          {
            "b": "PTR:",
            "t": "reverse (IP to name)."
          },
          {
            "b": "SRV:",
            "t": "locates services — how clients find domain controllers."
          },
          {
            "b": "NS / SOA:",
            "t": "delegation and zone authority/parameters."
          },
          {
            "b": "TXT:",
            "t": "free text — SPF, DKIM, verification."
          }
        ]
      },
      {
        "h": "SRV and Active Directory",
        "note": {
          "kind": "info",
          "text": "AD publishes SRV records so clients can find DCs, global catalog, and Kerberos — which is why broken DNS breaks logons."
        }
      }
    ],
    "practice": "In a lab, create an A record and a CNAME alias, then use nslookup to resolve both and inspect the SRV records under _msdcs."
  },
  "ws-dns-03": {
    "intro": "When your server can't answer a query itself, forwarding controls where it goes next — key for performance and hybrid/partner setups.",
    "sections": [
      {
        "h": "Resolving the unknown",
        "ul": [
          {
            "b": "Forwarder:",
            "t": "send all unresolved queries to a specific upstream DNS (e.g. your ISP or a public resolver)."
          },
          {
            "b": "Conditional forwarder:",
            "t": "send queries for a specific domain to a specific server (e.g. a partner's DNS)."
          },
          {
            "b": "Root hints:",
            "t": "the fallback list of root servers used if no forwarder is set."
          }
        ]
      },
      {
        "h": "Recursion",
        "p": [
          "A recursive resolver chases a query all the way to an answer on the client's behalf. Disable recursion on internet-facing authoritative servers to reduce abuse."
        ]
      },
      {
        "h": "Use case",
        "note": {
          "kind": "tip",
          "text": "Conditional forwarders are the clean way to resolve names across a forest trust or to a partner without full zone transfers."
        }
      }
    ],
    "practice": "Configure a conditional forwarder for a fictitious partner domain 'partner.local' pointing at its DNS server IP."
  },
  "ws-dns-04": {
    "intro": "DNS is a prime target and a common source of stale-record problems. These features keep it trustworthy and tidy.",
    "sections": [
      {
        "h": "DNSSEC",
        "p": [
          "DNSSEC signs zones so resolvers can verify answers haven't been tampered with, protecting against cache poisoning."
        ]
      },
      {
        "h": "Aging & scavenging",
        "p": [
          "Dynamic records can go stale. Aging timestamps them and scavenging removes ones no longer refreshed — preventing name/IP mismatches."
        ]
      },
      {
        "h": "Other protections",
        "ul": [
          {
            "b": "Cache locking:",
            "t": "prevents cached entries being overwritten early."
          },
          {
            "b": "Response Rate Limiting:",
            "t": "mitigates amplification attacks."
          },
          {
            "b": "Secure updates:",
            "t": "only authenticated clients register records."
          }
        ],
        "note": {
          "kind": "warn",
          "text": "Enable scavenging carefully and consistently — misconfigured scavenging can delete records that are still in use."
        }
      }
    ],
    "practice": "Enable aging/scavenging on a lab zone and describe what DNSSEC protects against in your own words."
  },
  "ws-dhcp-01": {
    "intro": "DHCP hands out IP configuration automatically. A scope defines the addresses and options a server leases to a subnet.",
    "sections": [
      {
        "h": "The DORA lease",
        "p": [
          "Clients get an address through Discover, Offer, Request, Acknowledge (DORA), then hold it for the lease duration."
        ]
      },
      {
        "h": "Scope building blocks",
        "ul": [
          {
            "b": "Address range:",
            "t": "the pool of leasable IPs."
          },
          {
            "b": "Exclusions:",
            "t": "addresses inside the range to skip (e.g. static devices)."
          },
          {
            "b": "Reservations:",
            "t": "a fixed IP tied to a MAC address."
          },
          {
            "b": "Options:",
            "t": "gateway (003), DNS (006), domain (015), and more."
          }
        ]
      },
      {
        "h": "Lease duration",
        "note": {
          "kind": "info",
          "text": "Shorter leases suit changeable networks (guest Wi-Fi); longer leases reduce traffic on stable ones."
        }
      }
    ],
    "practice": "Create a DHCP scope for a lab subnet with an exclusion range and a reservation, and set the gateway and DNS options."
  },
  "ws-dhcp-02": {
    "intro": "If DHCP goes down, clients eventually can't get addresses. Windows Server offers built-in ways to keep it running.",
    "sections": [
      {
        "h": "DHCP failover",
        "ul": [
          {
            "b": "Load balancing:",
            "t": "two servers share the scope actively."
          },
          {
            "b": "Hot standby:",
            "t": "one serves; the partner takes over on failure."
          }
        ]
      },
      {
        "h": "Older approaches",
        "ul": [
          {
            "b": "Split scope:",
            "t": "two servers each own part of the range (e.g. 80/20)."
          },
          {
            "b": "Superscope:",
            "t": "groups multiple scopes on one physical network."
          }
        ]
      },
      {
        "h": "Reaching remote subnets",
        "p": [
          "Since DHCP uses broadcasts, a DHCP relay agent (IP helper on the router/switch) forwards requests from subnets without a local DHCP server."
        ],
        "note": {
          "kind": "tip",
          "text": "DHCP failover (built into modern Windows Server) is preferred over manual split-scope — it syncs leases automatically."
        }
      }
    ],
    "practice": "In a lab with two DHCP servers, configure DHCP failover in hot-standby mode for a scope and simulate a failover."
  },
  "ws-dhcp-03": {
    "intro": "A few checks resolve most DHCP problems — from clients with no address to duplicate IPs.",
    "sections": [
      {
        "h": "Authorization",
        "p": [
          "In a domain, a DHCP server must be authorized in AD before it will hand out leases — a safeguard against rogue servers."
        ]
      },
      {
        "h": "Common problems",
        "ul": [
          {
            "b": "169.254.x.x (APIPA):",
            "t": "the client got no lease — check server, scope exhaustion, or relay."
          },
          {
            "b": "Duplicate IP:",
            "t": "a static device inside the pool without an exclusion."
          },
          {
            "b": "Scope full:",
            "t": "expand the range or shorten leases."
          }
        ]
      },
      {
        "h": "Tools",
        "note": {
          "kind": "info",
          "text": "Review the DHCP console's Address Leases and the server's audit logging to see who got what and when."
        }
      }
    ],
    "practice": "On a lab client run ipconfig and interpret the result; then intentionally exhaust a tiny scope and observe a client falling back to APIPA."
  }
};
