import type { LessonContent } from '../model';

export const winserverhypervLessons: Record<string, LessonContent> = {
  "ws-hv-01": {
    "intro": "Hyper-V is Microsoft's type 1 (bare-metal) hypervisor built into Windows Server. It lets one physical host run many isolated virtual machines.",
    "sections": [
      {
        "h": "Type 1 vs type 2",
        "p": [
          "A type 1 hypervisor runs directly on the hardware (efficient, used in production); a type 2 runs on top of an OS (like desktop VM apps). Hyper-V is type 1."
        ]
      },
      {
        "h": "Requirements",
        "ul": [
          "A 64-bit CPU with virtualization (Intel VT-x/AMD-V) and SLAT",
          "Virtualization enabled in firmware/BIOS",
          "Enough RAM and disk for the guests"
        ]
      },
      {
        "h": "Installing the role",
        "note": {
          "kind": "info",
          "text": "After the role installs, manage hosts with Hyper-V Manager, Windows Admin Center, or PowerShell."
        },
        "code": "Install-WindowsFeature Hyper-V -IncludeManagementTools -Restart"
      }
    ],
    "practice": "Confirm a lab host supports virtualization, install the Hyper-V role, and open Hyper-V Manager."
  },
  "ws-hv-02": {
    "intro": "A virtual switch connects VMs to each other and to the physical network. Choosing the right type controls what a VM can reach.",
    "sections": [
      {
        "h": "Switch types",
        "ul": [
          {
            "b": "External:",
            "t": "binds to a physical NIC — VMs reach the LAN/internet."
          },
          {
            "b": "Internal:",
            "t": "VMs talk to each other and the host, not the physical network."
          },
          {
            "b": "Private:",
            "t": "VMs talk only to each other."
          }
        ]
      },
      {
        "h": "VLANs and teaming",
        "p": [
          "You can tag VM traffic with VLAN IDs, and use Switch Embedded Teaming (SET) to combine NICs for bandwidth and redundancy."
        ]
      },
      {
        "h": "Design",
        "note": {
          "kind": "tip",
          "text": "Isolate management, VM, storage, and live-migration traffic — mixing them causes contention."
        }
      }
    ],
    "practice": "Create an external and a private virtual switch, attach two VMs to the private switch, and confirm they can reach each other but not the LAN."
  },
  "ws-hv-03": {
    "intro": "A well-configured VM balances performance and portability. Generation and memory choices matter most.",
    "sections": [
      {
        "h": "Generation 1 vs 2",
        "ul": [
          {
            "b": "Gen 1:",
            "t": "legacy BIOS boot, broad OS compatibility."
          },
          {
            "b": "Gen 2:",
            "t": "UEFI, Secure Boot, faster boot — use for modern 64-bit guests."
          }
        ]
      },
      {
        "h": "Memory",
        "ul": [
          {
            "b": "Static:",
            "t": "a fixed amount assigned to the VM."
          },
          {
            "b": "Dynamic:",
            "t": "grows/shrinks between a min and max as the guest needs — improves density."
          }
        ]
      },
      {
        "h": "Integration services",
        "note": {
          "kind": "info",
          "text": "Integration services/components give the guest better performance, time sync, and clean shutdown — keep them updated."
        }
      }
    ],
    "practice": "Create a Generation 2 VM with dynamic memory (e.g. 1–4 GB), install a guest OS, and verify integration services are running."
  },
  "ws-hv-04": {
    "intro": "Virtual disks are files on the host. The format and type affect performance, space, and flexibility.",
    "sections": [
      {
        "h": "VHD vs VHDX",
        "p": [
          "Prefer VHDX: up to 64 TB, better resilience to power loss, and larger block sizes. VHD is legacy (2 TB limit)."
        ]
      },
      {
        "h": "Disk types",
        "ul": [
          {
            "b": "Fixed:",
            "t": "full size allocated up front — best performance."
          },
          {
            "b": "Dynamic:",
            "t": "grows as data is written — space-efficient, slight overhead."
          },
          {
            "b": "Differencing:",
            "t": "stores only changes from a parent disk."
          }
        ]
      },
      {
        "h": "Pass-through",
        "note": {
          "kind": "warn",
          "text": "Pass-through disks give a VM a whole physical disk (fast) but lose portability and checkpoint support — rarely needed today."
        }
      }
    ],
    "practice": "Create a dynamic VHDX, attach it to a VM, add data, and observe the file growing on the host."
  },
  "ws-hv-05": {
    "intro": "Checkpoints capture a VM's state so you can roll back — invaluable for testing, risky in production if misused.",
    "sections": [
      {
        "h": "Checkpoint types",
        "ul": [
          {
            "b": "Production:",
            "t": "uses VSS for an application-consistent, supported snapshot (default)."
          },
          {
            "b": "Standard:",
            "t": "captures memory state too — handy in labs, not for production apps."
          }
        ]
      },
      {
        "h": "Export / import",
        "p": [
          "Export copies a VM (and its disks) for backup or moving to another host; import brings it back or registers it elsewhere."
        ]
      },
      {
        "h": "Caution",
        "note": {
          "kind": "warn",
          "text": "Checkpoints are not backups and shouldn't be left long-term — growing differencing files hurt performance and can fill the disk."
        }
      }
    ],
    "practice": "Take a production checkpoint of a lab VM, make a change, then apply the checkpoint to roll back."
  },
  "ws-hv-06": {
    "intro": "For availability and disaster recovery, Hyper-V can move running VMs between hosts and replicate them to another site.",
    "sections": [
      {
        "h": "Live migration",
        "p": [
          "Moves a running VM to another host with no downtime — used for maintenance and load balancing. Shared-nothing live migration even moves the storage too."
        ]
      },
      {
        "h": "Failover clustering",
        "p": [
          "Clustered Hyper-V hosts restart VMs automatically on a surviving node if a host fails — true high availability."
        ]
      },
      {
        "h": "Hyper-V Replica",
        "note": {
          "kind": "info",
          "text": "Replica asynchronously copies a VM to another host/site for DR; you fail over if the primary is lost — with some data-loss window."
        }
      }
    ],
    "practice": "Describe (or lab) how you'd move a running VM to another host with live migration, and when you'd use Hyper-V Replica instead."
  }
};
