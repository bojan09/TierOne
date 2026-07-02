import type { LessonContent } from '../model';

export const winserverbackupLessons: Record<string, LessonContent> = {
  "ws-bk-01": {
    "intro": "Backups are the last line of defence against failure, mistakes, and ransomware. A sound strategy balances how much you can lose against cost.",
    "sections": [
      {
        "h": "Backup types",
        "ul": [
          {
            "b": "Full:",
            "t": "everything; simplest restore, largest."
          },
          {
            "b": "Incremental:",
            "t": "changes since the last backup; small, but restore needs the full + all increments."
          },
          {
            "b": "Differential:",
            "t": "changes since the last full; restore needs full + latest differential."
          }
        ]
      },
      {
        "h": "The 3-2-1 rule",
        "p": [
          "Three copies, on two media types, one offsite — so no single event takes everything."
        ]
      },
      {
        "h": "Recovery objectives",
        "note": {
          "kind": "info",
          "text": "RPO (how much data you can lose) and RTO (how fast you must recover) drive the whole design."
        }
      }
    ],
    "practice": "For a lab file server, choose a backup schedule (full + differential vs incremental) and justify it using RPO/RTO."
  },
  "ws-bk-02": {
    "intro": "Windows Server Backup (WSB) is the built-in tool for protecting a server, its System State, and full bare-metal images.",
    "sections": [
      {
        "h": "What to back up",
        "ul": [
          {
            "b": "Files/volumes:",
            "t": "data protection."
          },
          {
            "b": "System State:",
            "t": "the config needed to rebuild roles like AD."
          },
          {
            "b": "Bare-metal recovery:",
            "t": "a full image to rebuild the whole server."
          }
        ]
      },
      {
        "h": "Scheduling",
        "p": [
          "WSB can run scheduled backups to a dedicated disk or network share; keep multiple restore points."
        ],
        "note": {
          "kind": "tip",
          "text": "On a domain controller, System State includes Active Directory — back it up regularly."
        }
      }
    ],
    "practice": "Install Windows Server Backup on a lab server and configure a scheduled bare-metal + System State backup."
  },
  "ws-bk-03": {
    "intro": "Backups are only proven by restores. Different failures call for different recovery methods.",
    "sections": [
      {
        "h": "Common restores",
        "ul": [
          {
            "b": "File/folder:",
            "t": "recover individual data from a backup or shadow copy."
          },
          {
            "b": "System State:",
            "t": "repair a broken server configuration."
          },
          {
            "b": "Bare-metal:",
            "t": "rebuild a dead server from an image."
          }
        ]
      },
      {
        "h": "Authoritative AD restore",
        "p": [
          "To bring back deleted AD objects across the domain, boot into Directory Services Restore Mode (DSRM) and mark objects authoritative — or use the AD Recycle Bin for simple cases."
        ]
      },
      {
        "h": "Test restores",
        "note": {
          "kind": "warn",
          "text": "An untested backup isn't a backup. Schedule periodic test restores to prove your recovery works."
        }
      }
    ],
    "practice": "Perform a file restore from a lab backup, and describe when you'd use an authoritative AD restore instead of the Recycle Bin."
  },
  "ws-bk-04": {
    "intro": "Failover clustering groups servers so that if one node fails, another takes over the workload automatically — the foundation of high availability.",
    "sections": [
      {
        "h": "How it works",
        "p": [
          "Multiple nodes share access to storage and present clustered roles (file servers, Hyper-V VMs, SQL). If a node fails, its roles restart on a surviving node."
        ]
      },
      {
        "h": "Quorum",
        "p": [
          "Quorum decides how many nodes must be available to keep the cluster running, preventing 'split-brain'. A witness (disk or cloud) helps small clusters vote."
        ]
      },
      {
        "h": "Requirements",
        "note": {
          "kind": "info",
          "text": "Nodes need shared storage (e.g. iSCSI or Storage Spaces Direct) and reliable networking between them."
        }
      }
    ],
    "practice": "Describe the nodes, shared storage, and quorum witness you'd use to make a lab file server highly available."
  },
  "ws-bk-05": {
    "intro": "High availability handles a failed node; disaster recovery handles a lost site. Planning turns a catastrophe into a procedure.",
    "sections": [
      {
        "h": "Set the targets",
        "p": [
          "Agree RPO and RTO per service with the business — they justify the spend and shape the design."
        ]
      },
      {
        "h": "The plan",
        "ul": [
          "Offsite/second-site copies (replication or backups)",
          "A documented, tested runbook for failover",
          "Clear roles and communication during an event"
        ]
      },
      {
        "h": "Test it",
        "note": {
          "kind": "tip",
          "text": "Run DR drills. A plan that has never been exercised will fail when you need it most."
        }
      }
    ],
    "practice": "Draft a one-page DR runbook for a critical lab service: RPO/RTO, where the copy lives, failover steps, and how you'd test it."
  }
};
