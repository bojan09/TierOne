import type { LessonContent } from '../model';

export const t2windowsLessons: Record<string, LessonContent> = {
  "t2-win-01": {
    "intro": "When Windows won't start, knowing the boot sequence tells you which stage failed and which tool fixes it.",
    "sections": [
      {
        "h": "The boot sequence",
        "svg": "<svg viewBox=\"0 0 620 96\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"ui-sans-serif,system-ui\"><defs><marker id=\"a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L7,3 L0,6\" fill=\"#818cf8\"/></marker></defs><rect x=\"8\" y=\"30\" width=\"104\" height=\"42\" rx=\"7\" fill=\"#1e293b\" stroke=\"#475569\"/><text x=\"60.0\" y=\"55\" fill=\"#e2e8f0\" font-size=\"11\" text-anchor=\"middle\">Power / POST</text><line x1=\"112\" y1=\"51\" x2=\"130\" y2=\"51\" stroke=\"#818cf8\" stroke-width=\"2\" marker-end=\"url(#a)\"/><rect x=\"130\" y=\"30\" width=\"104\" height=\"42\" rx=\"7\" fill=\"#1e293b\" stroke=\"#475569\"/><text x=\"182.0\" y=\"55\" fill=\"#e2e8f0\" font-size=\"11\" text-anchor=\"middle\">Bootloader (BCD)</text><line x1=\"234\" y1=\"51\" x2=\"252\" y2=\"51\" stroke=\"#818cf8\" stroke-width=\"2\" marker-end=\"url(#a)\"/><rect x=\"252\" y=\"30\" width=\"104\" height=\"42\" rx=\"7\" fill=\"#1e293b\" stroke=\"#475569\"/><text x=\"304.0\" y=\"55\" fill=\"#e2e8f0\" font-size=\"11\" text-anchor=\"middle\">Kernel + drivers</text><line x1=\"356\" y1=\"51\" x2=\"374\" y2=\"51\" stroke=\"#818cf8\" stroke-width=\"2\" marker-end=\"url(#a)\"/><rect x=\"374\" y=\"30\" width=\"104\" height=\"42\" rx=\"7\" fill=\"#1e293b\" stroke=\"#475569\"/><text x=\"426.0\" y=\"55\" fill=\"#e2e8f0\" font-size=\"11\" text-anchor=\"middle\">Services</text><line x1=\"478\" y1=\"51\" x2=\"496\" y2=\"51\" stroke=\"#818cf8\" stroke-width=\"2\" marker-end=\"url(#a)\"/><rect x=\"496\" y=\"30\" width=\"104\" height=\"42\" rx=\"7\" fill=\"#1e293b\" stroke=\"#475569\"/><text x=\"548.0\" y=\"55\" fill=\"#e2e8f0\" font-size=\"11\" text-anchor=\"middle\">Sign-in</text><text x=\"8\" y=\"90\" fill=\"#64748b\" font-size=\"10\">Know the stage a failure occurs in to target the fix.</text></svg>",
        "caption": "Windows boot stages — identify where it fails to target the fix."
      },
      {
        "h": "Where it breaks",
        "ul": [
          {
            "b": "POST/firmware:",
            "t": "no display, beeps — hardware or boot device order."
          },
          {
            "b": "Bootloader (BCD):",
            "t": "'no boot device' / BCD errors — repair with WinRE."
          },
          {
            "b": "Kernel/drivers:",
            "t": "stuck logo or reboot loop — often a bad driver/update."
          }
        ]
      },
      {
        "h": "First tools",
        "ul": [
          {
            "b": "Startup Repair",
            "t": "(in WinRE) fixes many boot/BCD issues automatically."
          },
          {
            "b": "bootrec",
            "t": "rebuilds boot configuration from the command prompt."
          }
        ],
        "note": {
          "kind": "tip",
          "text": "Three failed boots normally drops Windows into the Recovery Environment (WinRE) automatically."
        }
      }
    ],
    "practice": "Describe which tool you'd reach for if a PC shows a 'Boot Device Not Found' message versus a spinning-logo reboot loop."
  },
  "t2-win-02": {
    "intro": "A blue screen (BSOD) isn't random — the stop code and crash dump point at the cause.",
    "sections": [
      {
        "h": "Read the stop code",
        "p": [
          "The stop code (e.g. DRIVER_IRQL_NOT_LESS_OR_EQUAL, PAGE_FAULT_IN_NONPAGED_AREA) and any named driver file are your first clues — search the exact code."
        ]
      },
      {
        "h": "Evidence to gather",
        "ul": [
          {
            "b": "Reliability Monitor:",
            "t": "a timeline of crashes and what changed."
          },
          {
            "b": "Minidumps:",
            "t": "C:\\Windows\\Minidump — analysable for the faulting driver."
          },
          {
            "b": "Recent changes:",
            "t": "new hardware, driver, or update just before it started."
          }
        ]
      },
      {
        "h": "Common causes",
        "note": {
          "kind": "info",
          "text": "Faulty RAM, storage errors, and bad/mismatched drivers cause most BSODs — test memory and roll back recent drivers."
        }
      }
    ],
    "practice": "For a PC that started blue-screening after a graphics driver update, outline your first two diagnostic steps."
  },
  "t2-win-03": {
    "intro": "Safe Mode and WinRE let you fix a system that can't boot normally by loading a minimal environment.",
    "sections": [
      {
        "h": "Safe Mode",
        "p": [
          "Boots with only essential drivers/services — if the problem disappears, a third-party driver or startup item is the cause. Use it to uninstall a bad driver or run cleanup."
        ]
      },
      {
        "h": "Windows Recovery Environment",
        "ul": [
          {
            "b": "Startup Repair, Command Prompt, System Restore",
            "t": "— all launch from WinRE."
          },
          {
            "b": "Startup Settings",
            "t": "— enable Safe Mode and other boot options."
          }
        ]
      },
      {
        "h": "Getting there",
        "note": {
          "kind": "tip",
          "text": "Hold Shift and click Restart, or interrupt boot three times, to reach the Advanced Startup / recovery options."
        }
      }
    ],
    "practice": "A laptop boots fine in Safe Mode but crashes normally — state what that tells you and your next step."
  },
  "t2-win-04": {
    "intro": "When configuration breaks, these tools roll Windows back — and the registry is where much of that configuration lives.",
    "sections": [
      {
        "h": "System Restore",
        "p": [
          "Reverts system files, drivers, and registry to an earlier restore point without touching personal files — ideal after a bad update or install."
        ]
      },
      {
        "h": "Reset this PC",
        "ul": [
          {
            "b": "Keep my files:",
            "t": "reinstalls Windows, keeps documents (removes apps)."
          },
          {
            "b": "Remove everything:",
            "t": "a clean wipe for reassignment."
          }
        ]
      },
      {
        "h": "The registry",
        "note": {
          "kind": "warn",
          "text": "The registry stores system/app settings in hives (HKLM, HKCU). Back up a key before editing (File → Export) — a wrong change can break Windows."
        }
      }
    ],
    "practice": "Choose the right tool for: a bad update broke the system, versus preparing a laptop for a new employee."
  },
  "t2-win-05": {
    "intro": "For repeated builds and unrecoverable machines, reimaging restores a known-good standard image fast.",
    "sections": [
      {
        "h": "Why images",
        "p": [
          "A standard image gives every machine the same OS, apps, and settings — faster than rebuilding by hand and consistent to support."
        ]
      },
      {
        "h": "Before you wipe",
        "ul": [
          "Back up user data (profiles, local files)",
          "Note apps, printers, and mapped drives to restore",
          "Confirm drivers for the model are available"
        ]
      },
      {
        "h": "After imaging",
        "note": {
          "kind": "tip",
          "text": "Rejoin the domain, restore data, reinstall role-specific apps, and verify updates — then hand back."
        }
      }
    ],
    "practice": "List the pre-reimage checklist you'd run so a user loses nothing when their machine is reimaged."
  }
};
