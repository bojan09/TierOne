import type { LessonContent } from '../model';

export const winserverstorageLessons: Record<string, LessonContent> = {
  "ws-fs-01": {
    "intro": "File access is governed by two permission layers. Knowing how they combine prevents both lockouts and over-sharing.",
    "sections": [
      {
        "h": "Two layers",
        "ul": [
          {
            "b": "Share permissions:",
            "t": "apply only over the network to the shared folder."
          },
          {
            "b": "NTFS permissions:",
            "t": "apply locally and over the network, at file and folder level."
          }
        ]
      },
      {
        "h": "How they combine",
        "p": [
          "Over the network the effective permission is the most restrictive of the share and NTFS results. Best practice: set Share to a broad level and control access precisely with NTFS."
        ]
      },
      {
        "h": "Inheritance & effective access",
        "ul": [
          "NTFS permissions inherit down the folder tree by default",
          "Use the Effective Access tab to see a user's real result",
          "Prefer group-based permissions over per-user"
        ],
        "note": {
          "kind": "warn",
          "text": "Deny overrides Allow. An accidental Deny on a group a user belongs to will block them even if another group allows it."
        }
      }
    ],
    "practice": "Create a share where Everyone has Full Control at the share level but NTFS grants a specific group Modify — then use Effective Access to verify a user's real permission."
  },
  "ws-fs-02": {
    "intro": "Distributed File System (DFS) unifies scattered shares behind one path and keeps copies in sync across servers.",
    "sections": [
      {
        "h": "DFS Namespaces (DFS-N)",
        "p": [
          "Presents multiple physical shares under a single logical path like \\\\corp\\files, so users have one place to go even if data moves or lives on many servers."
        ]
      },
      {
        "h": "DFS Replication (DFS-R)",
        "p": [
          "Keeps folder targets synchronised between servers using efficient, block-level replication — used for redundancy and branch-office data."
        ]
      },
      {
        "h": "Together",
        "note": {
          "kind": "tip",
          "text": "DFS-N + DFS-R gives users a stable path with a nearby, replicated copy — resilient to a single server outage."
        }
      }
    ],
    "practice": "Create a DFS namespace \\\\lab\\files with two folder targets, then set up DFS replication between them and confirm a test file syncs."
  },
  "ws-fs-03": {
    "intro": "FSRM adds governance to file servers — limiting consumption, blocking unwanted file types, and reporting on usage.",
    "sections": [
      {
        "h": "What FSRM does",
        "ul": [
          {
            "b": "Quotas:",
            "t": "limit space on a folder or volume, with soft (warn) or hard (enforce) limits."
          },
          {
            "b": "File screening:",
            "t": "block or warn on specific file types (e.g. .mp3, .exe)."
          },
          {
            "b": "Storage reports:",
            "t": "find large, duplicate, or old files."
          }
        ]
      },
      {
        "h": "Soft vs hard",
        "note": {
          "kind": "info",
          "text": "Soft quotas notify without blocking (good for monitoring); hard quotas prevent writes past the limit."
        }
      }
    ],
    "practice": "Apply a 5 GB hard quota to a lab folder and a file screen that blocks executable files, then test both."
  },
  "ws-fs-04": {
    "intro": "Storage Spaces pools physical disks into flexible virtual volumes with software resiliency — no hardware RAID controller required.",
    "sections": [
      {
        "h": "Pools and spaces",
        "p": [
          "You add physical disks to a storage pool, then carve out virtual disks (spaces) with a chosen resiliency and size."
        ]
      },
      {
        "h": "Resiliency types",
        "ul": [
          {
            "b": "Simple:",
            "t": "striped, no redundancy (fast, risky)."
          },
          {
            "b": "Mirror:",
            "t": "two/three-way copies survive disk loss."
          },
          {
            "b": "Parity:",
            "t": "space-efficient redundancy (like RAID-5), slower writes."
          }
        ]
      },
      {
        "h": "Tiering & thin provisioning",
        "note": {
          "kind": "tip",
          "text": "Tiering keeps hot data on SSDs and cold data on HDDs; thin provisioning allocates space on demand — but monitor real usage."
        }
      }
    ],
    "practice": "In a lab with several disks, create a storage pool and a two-way mirror virtual disk, then format and share it."
  },
  "ws-fs-05": {
    "intro": "iSCSI presents block storage over the network, letting servers use centralised storage as if it were a local disk — the basis for clustering.",
    "sections": [
      {
        "h": "Targets and initiators",
        "ul": [
          {
            "b": "iSCSI target:",
            "t": "the server offering the storage (a LUN)."
          },
          {
            "b": "iSCSI initiator:",
            "t": "the client that connects and sees a new disk."
          }
        ]
      },
      {
        "h": "Why it matters",
        "p": [
          "Shared block storage is what lets multiple nodes access the same disk — a requirement for failover clustering."
        ],
        "note": {
          "kind": "info",
          "text": "iSCSI runs over standard Ethernet; isolate it on its own network/VLAN for performance and security."
        }
      }
    ],
    "practice": "Create an iSCSI target with a virtual disk on one lab server and connect to it from another using the iSCSI Initiator."
  },
  "ws-fs-06": {
    "intro": "Two features that quietly save space and save users from themselves: data deduplication and Volume Shadow Copies.",
    "sections": [
      {
        "h": "Data deduplication",
        "p": [
          "Dedup stores duplicate chunks once, reclaiming large amounts of space on file servers and VDI/backup volumes — often 50%+."
        ]
      },
      {
        "h": "Shadow Copies (VSS)",
        "p": [
          "Volume Shadow Copies capture point-in-time versions of files on a share, so users can restore a previous version themselves via the Previous Versions tab."
        ]
      },
      {
        "h": "Not a backup",
        "note": {
          "kind": "warn",
          "text": "Shadow copies live on the same volume — they help with accidental edits/deletes but are not a substitute for real backups."
        }
      }
    ],
    "practice": "Enable Shadow Copies on a lab volume, edit and save a file, then restore the earlier version from the Previous Versions tab."
  }
};
