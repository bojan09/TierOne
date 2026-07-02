import type { LessonContent } from '../model';

export const winserveradLessons: Record<string, LessonContent> = {
  "ws-ad-01": {
    "intro": "Active Directory Domain Services (AD DS) is the identity backbone of a Windows network — it stores objects (users, computers, groups) and authenticates and authorises access across the domain.",
    "sections": [
      {
        "h": "The logical building blocks",
        "ul": [
          {
            "b": "Forest:",
            "t": "the top-level security boundary that contains one or more domains sharing a schema and global catalog."
          },
          {
            "b": "Domain:",
            "t": "an administrative and replication boundary for objects and policy."
          },
          {
            "b": "Schema:",
            "t": "the blueprint defining every object class and attribute — one schema per forest."
          },
          {
            "b": "Global catalog:",
            "t": "a partial, forest-wide index that speeds searches and logons."
          }
        ]
      },
      {
        "h": "Domain controllers",
        "p": [
          "A domain controller (DC) is a server running the AD DS role that holds a writable copy of the domain database (NTDS.dit) and authenticates users. Best practice is at least two DCs per domain for redundancy."
        ]
      },
      {
        "h": "Installing AD DS",
        "p": [
          "You add the AD DS role, then promote the server to a domain controller (creating a new forest, new domain, or additional DC)."
        ],
        "code": "Install-WindowsFeature AD-Domain-Services -IncludeManagementTools\nInstall-ADDSForest -DomainName corp.example.com -InstallDns"
      },
      {
        "h": "Where the data lives",
        "ul": [
          {
            "b": "NTDS.dit:",
            "t": "the AD database file on each DC."
          },
          {
            "b": "SYSVOL:",
            "t": "a replicated share holding scripts and Group Policy files."
          }
        ],
        "note": {
          "kind": "tip",
          "text": "Promoting the first DC in a new domain also typically installs DNS — AD depends on DNS to locate services via SRV records."
        }
      }
    ],
    "practice": "In a lab, install the AD DS role and promote a server to the first domain controller of a new forest 'lab.local'. Confirm DNS was installed and the SYSVOL share exists."
  },
  "ws-ad-02": {
    "intro": "Larger organisations structure Active Directory into multiple domains, trees, and forests. Understanding these relationships is key to designing and supporting an enterprise directory.",
    "sections": [
      {
        "h": "Trees and namespaces",
        "p": [
          "A tree is one or more domains sharing a contiguous DNS namespace (e.g. corp.example.com and sales.corp.example.com). A forest can hold multiple trees with different namespaces, all trusting each other automatically."
        ]
      },
      {
        "h": "Functional levels",
        "p": [
          "Domain and forest functional levels determine which AD features are available and set a minimum DC operating system. Raise them only once all DCs meet the requirement — it cannot be easily reversed."
        ]
      },
      {
        "h": "Why multiple domains?",
        "ul": [
          "Separate administrative or password policies (historically)",
          "Replication control across slow WAN links",
          "Regulatory or organisational separation"
        ],
        "note": {
          "kind": "info",
          "text": "Modern designs favour a single domain with OUs for delegation, rather than many domains — simpler and cheaper to run."
        }
      },
      {
        "h": "Trust within a forest",
        "p": [
          "All domains in a forest trust each other through automatic, transitive, two-way trusts, so a user in one domain can be granted access to resources in another."
        ]
      }
    ],
    "practice": "Diagram your organisation (or a fictional one) as a forest: name the forest root domain, any child domains, and note the functional level you would target."
  },
  "ws-ad-03": {
    "intro": "Organizational Units (OUs) are containers that structure a domain for management — they are where you apply Group Policy and delegate administrative control.",
    "sections": [
      {
        "h": "OUs vs containers",
        "p": [
          "Unlike the default containers (like Users), OUs can have Group Policy linked to them and support delegation. Design OUs around how you administer objects, not just the org chart."
        ]
      },
      {
        "h": "Delegation of control",
        "p": [
          "The Delegation of Control Wizard grants specific rights (e.g. reset passwords, create users) over an OU to a group — enabling least-privilege administration without handing out Domain Admin."
        ]
      },
      {
        "h": "Inheritance",
        "ul": [
          {
            "b": "Permissions and GPOs flow down",
            "t": "the OU hierarchy by default."
          },
          {
            "b": "Block inheritance",
            "t": "stops inherited GPOs at an OU (use sparingly)."
          }
        ]
      },
      {
        "h": "Design tips",
        "ul": [
          "Keep the structure shallow and logical",
          "Separate users, computers, and service accounts",
          "Name OUs consistently"
        ],
        "note": {
          "kind": "warn",
          "text": "You can't apply Group Policy to a default container — put objects into OUs to manage them with GPOs."
        }
      }
    ],
    "practice": "Create an OU structure for a small company (e.g. OUs for Staff, Workstations, Servers, ServiceAccounts) and delegate 'reset password' rights on the Staff OU to a Helpdesk group."
  },
  "ws-ad-04": {
    "intro": "Groups are how you grant access at scale. Choosing the right group type and scope — and following a consistent nesting strategy — keeps permissions manageable.",
    "sections": [
      {
        "h": "Group types",
        "ul": [
          {
            "b": "Security groups:",
            "t": "grant access to resources (used in permissions)."
          },
          {
            "b": "Distribution groups:",
            "t": "email lists only, no security use."
          }
        ]
      },
      {
        "h": "Group scopes",
        "ul": [
          {
            "b": "Domain Local:",
            "t": "used to assign permissions to resources in its own domain."
          },
          {
            "b": "Global:",
            "t": "groups users from its own domain by role."
          },
          {
            "b": "Universal:",
            "t": "spans domains across the forest (stored in the global catalog)."
          }
        ]
      },
      {
        "h": "The AGDLP strategy",
        "p": [
          "Best practice: put Accounts into Global groups, Global groups into Domain Local groups, and assign Permissions to the Domain Local group (A-G-DL-P). It keeps access clean and auditable."
        ]
      },
      {
        "h": "Least privilege",
        "note": {
          "kind": "tip",
          "text": "Grant access through groups, never to individual users — it scales and is far easier to audit and revoke."
        }
      }
    ],
    "practice": "Design access to a shared folder using AGDLP: create a Global group for a role (e.g. 'GG_Sales'), a Domain Local group for the resource (e.g. 'DL_SalesShare_Modify'), nest one in the other, and assign the folder permission to the Domain Local group."
  },
  "ws-ad-05": {
    "intro": "Most AD operations are multi-master, but five Flexible Single Master Operations (FSMO) roles must be held by exactly one DC each to avoid conflicts.",
    "sections": [
      {
        "h": "The five roles",
        "ul": [
          {
            "b": "Schema Master (forest):",
            "t": "the only DC that can change the schema."
          },
          {
            "b": "Domain Naming Master (forest):",
            "t": "adds/removes domains in the forest."
          },
          {
            "b": "RID Master (domain):",
            "t": "hands out pools of relative IDs so SIDs stay unique."
          },
          {
            "b": "PDC Emulator (domain):",
            "t": "time source, password changes, account lockout, and GPO editing point."
          },
          {
            "b": "Infrastructure Master (domain):",
            "t": "maintains cross-domain object references."
          }
        ]
      },
      {
        "h": "Placement",
        "p": [
          "Two forest-wide roles (Schema, Domain Naming) sit on one DC in the forest root. The three domain roles exist once per domain. The PDC Emulator is the most impactful — keep it on a reliable DC."
        ]
      },
      {
        "h": "Transfer vs seize",
        "ul": [
          {
            "b": "Transfer:",
            "t": "gracefully move a role when both DCs are online (preferred)."
          },
          {
            "b": "Seize:",
            "t": "force-assign a role when the holder is permanently dead — never bring the old holder back afterward."
          }
        ],
        "note": {
          "kind": "warn",
          "text": "Seizing a role from a DC that later returns causes serious corruption. Only seize when the original is gone for good."
        }
      }
    ],
    "practice": "List which DC holds each FSMO role in a lab (netdom query fsmo), then practice transferring the PDC Emulator role to another DC and back."
  },
  "ws-ad-06": {
    "intro": "Active Directory replicates changes between all domain controllers. Sites and subnets tell AD about your physical network so it can replicate and direct clients efficiently.",
    "sections": [
      {
        "h": "Sites and subnets",
        "p": [
          "A site represents a well-connected physical location; you associate IP subnets with sites so clients authenticate against a nearby DC and replication respects WAN links."
        ]
      },
      {
        "h": "Intra-site vs inter-site",
        "ul": [
          {
            "b": "Intra-site:",
            "t": "fast, uncompressed, change-notification based (near real-time)."
          },
          {
            "b": "Inter-site:",
            "t": "scheduled and compressed over site links to save bandwidth."
          }
        ]
      },
      {
        "h": "How the topology is built",
        "p": [
          "The Knowledge Consistency Checker (KCC) automatically builds and maintains the replication topology, creating connection objects between DCs."
        ]
      },
      {
        "h": "Multi-master replication",
        "note": {
          "kind": "info",
          "text": "Every writable DC accepts changes and replicates them out; conflicts are resolved by version numbers and timestamps."
        }
      }
    ],
    "practice": "Create a second site and a site link in a lab, associate a subnet with it, and use repadmin /replsummary to review replication health."
  },
  "ws-ad-07": {
    "intro": "Trusts let users in one domain or forest access resources in another. Knowing the trust types and their direction and transitivity is essential for cross-organisation access.",
    "sections": [
      {
        "h": "Direction and transitivity",
        "ul": [
          {
            "b": "Direction:",
            "t": "one-way or two-way (who can access whom)."
          },
          {
            "b": "Transitivity:",
            "t": "transitive trusts extend to trusted-by-the-trusted domains; non-transitive don't."
          }
        ]
      },
      {
        "h": "Trust types",
        "ul": [
          {
            "b": "Parent-child / tree-root:",
            "t": "automatic, transitive, within a forest."
          },
          {
            "b": "External:",
            "t": "non-transitive trust to a single domain in another forest."
          },
          {
            "b": "Forest:",
            "t": "trust between two whole forests (transitive across them)."
          },
          {
            "b": "Shortcut:",
            "t": "speeds authentication between two domains deep in a forest."
          },
          {
            "b": "Realm:",
            "t": "to a non-Windows Kerberos realm."
          }
        ]
      },
      {
        "h": "Practical use",
        "p": [
          "Forest trusts are common in mergers, letting users in Forest A access resources in Forest B while each keeps its own administration."
        ]
      }
    ],
    "practice": "In a lab (or on paper), decide which trust type you'd use to let a partner company's forest access one of your file servers, and note its direction and transitivity."
  },
  "ws-ad-08": {
    "intro": "A healthy directory needs monitoring, backup, and occasional cleanup. These are the tools and tasks that keep AD reliable.",
    "sections": [
      {
        "h": "Health checks",
        "ul": [
          {
            "b": "dcdiag:",
            "t": "runs a battery of DC health tests."
          },
          {
            "b": "repadmin:",
            "t": "reports and troubleshoots replication."
          }
        ]
      },
      {
        "h": "Backup and recovery",
        "p": [
          "Back up System State on DCs. To recover deleted objects, enable the AD Recycle Bin; for authoritative restores, boot into Directory Services Restore Mode (DSRM) and use ntdsutil."
        ]
      },
      {
        "h": "Database maintenance",
        "ul": [
          {
            "b": "ntdsutil:",
            "t": "offline defrag, metadata cleanup, and snapshots."
          },
          {
            "b": "Metadata cleanup:",
            "t": "removes remnants of a DC that was not demoted cleanly."
          }
        ]
      },
      {
        "h": "Time and monitoring",
        "note": {
          "kind": "tip",
          "text": "Keep time in sync (the PDC Emulator is the root source) — Kerberos fails if clocks drift more than a few minutes."
        }
      }
    ],
    "practice": "Run dcdiag and repadmin /replsummary against a lab DC, then enable the AD Recycle Bin and recover a test user you deleted."
  }
};
