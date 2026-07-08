import type { LessonContent } from '../model';

export const t2itilLessons: Record<string, LessonContent> = {
  "t2-itil-01": {
    "intro": "ITIL gives support a shared vocabulary. Three terms cover most of what you'll do — and confusing them causes chaos.",
    "sections": [
      {
        "h": "The three",
        "ul": [
          {
            "b": "Incident:",
            "t": "restore service now (the printer is down — fix it)."
          },
          {
            "b": "Problem:",
            "t": "find and remove the root cause of repeated incidents."
          },
          {
            "b": "Change:",
            "t": "a controlled modification to prevent or fix issues (with approval)."
          }
        ]
      },
      {
        "h": "Why separate them",
        "p": [
          "Incidents restore service fast; problems stop them recurring; changes are made safely with review. Treating a risky change like a quick fix is how outages happen."
        ]
      },
      {
        "h": "In practice",
        "note": {
          "kind": "info",
          "text": "Log every incident, link repeats to a problem record, and route infrastructure modifications through change control."
        }
      }
    ],
    "practice": "Classify each as incident, problem, or change: 'email is down now', 'email drops every Monday', 'upgrade the mail connector next week'."
  },
  "t2-itil-02": {
    "intro": "Not every ticket is equal. Priority and SLAs decide order, and escalation gets the right help without dropping ownership.",
    "sections": [
      {
        "h": "Setting priority",
        "p": [
          "Priority = impact (how many/how critical) × urgency (how time-sensitive). A single-user cosmetic issue is low; a site-wide outage is top priority."
        ]
      },
      {
        "h": "SLAs",
        "p": [
          "A Service Level Agreement sets target response/resolution times per priority. Meeting SLAs is how the desk is measured."
        ]
      },
      {
        "h": "Escalation path",
        "svg": "<svg viewBox=\"0 0 560 210\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"ui-sans-serif,system-ui\"><defs><marker id=\"a\" markerWidth=\"8\" markerHeight=\"8\" refX=\"7\" refY=\"3\" orient=\"auto\"><path d=\"M0,0 L7,3 L0,6\" fill=\"#818cf8\"/></marker></defs><rect x=\"120\" y=\"14\" width=\"320\" height=\"46\" rx=\"8\" fill=\"#1e293b\" stroke=\"#818cf8\"/><text x=\"280\" y=\"34\" fill=\"#e2e8f0\" font-size=\"13\" text-anchor=\"middle\">Tier 1</text><text x=\"280\" y=\"52\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\">first contact, common fixes</text><line x1=\"280\" y1=\"60\" x2=\"280\" y2=\"78\" stroke=\"#818cf8\" stroke-width=\"2\" marker-end=\"url(#a)\"/><rect x=\"120\" y=\"78\" width=\"320\" height=\"46\" rx=\"8\" fill=\"#312e81\" stroke=\"#818cf8\"/><text x=\"280\" y=\"98\" fill=\"#e2e8f0\" font-size=\"13\" text-anchor=\"middle\">Tier 2</text><text x=\"280\" y=\"116\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\">deeper diagnosis, AD/M365</text><line x1=\"280\" y1=\"124\" x2=\"280\" y2=\"142\" stroke=\"#818cf8\" stroke-width=\"2\" marker-end=\"url(#a)\"/><rect x=\"120\" y=\"142\" width=\"320\" height=\"46\" rx=\"8\" fill=\"#4c1d95\" stroke=\"#818cf8\"/><text x=\"280\" y=\"162\" fill=\"#e2e8f0\" font-size=\"13\" text-anchor=\"middle\">Tier 3 / Vendor</text><text x=\"280\" y=\"180\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\">engineering, root cause</text><text x=\"470\" y=\"40\" fill=\"#64748b\" font-size=\"11\">escalate</text><text x=\"470\" y=\"60\" fill=\"#64748b\" font-size=\"11\">up only</text><text x=\"470\" y=\"104\" fill=\"#64748b\" font-size=\"11\">when</text><text x=\"470\" y=\"124\" fill=\"#64748b\" font-size=\"11\">needed</text></svg>",
        "caption": "Escalate up a tier only when needed — and keep ownership until it's resolved."
      },
      {
        "h": "Own it",
        "note": {
          "kind": "tip",
          "text": "Escalating doesn't mean walking away — hand off with full notes and follow the ticket to closure."
        }
      }
    ],
    "practice": "Assign a priority to: one user's font looks wrong vs the whole office can't log in. Justify each."
  },
  "t2-itil-03": {
    "intro": "Good notes and knowledge articles multiply your value — they speed resolution, enable handoffs, and prevent repeat work.",
    "sections": [
      {
        "h": "Ticket notes",
        "p": [
          "Record the symptom, what you checked, what you changed, and the outcome — enough that a colleague could pick it up cold."
        ]
      },
      {
        "h": "Knowledge base",
        "ul": [
          "Write a KB article for issues that recur",
          "Keep steps clear and current",
          "Link tickets to the article you used"
        ]
      },
      {
        "h": "Remote support etiquette",
        "note": {
          "kind": "tip",
          "text": "When remoting onto a user's machine, explain what you're doing, get consent, and respect their privacy — trust is part of support."
        }
      }
    ],
    "practice": "Write two-sentence ticket notes for a password reset you completed, good enough for a colleague to understand cold."
  },
  "t2-itil-04": {
    "intro": "A good escalation saves hours. A bad one bounces back.",
    "sections": [
      {
        "h": "What to include",
        "ul": [
          "Clear summary + impact/urgency",
          "Steps already tried and results",
          "Exact errors, timestamps, affected users",
          "What you need from the next tier"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: Tier-3 and vendors triage by quality — a ticket with repro steps, errors, and what you've ruled out gets worked immediately; a one-line 'it's broken' sits in the queue."
        }
      },
      {
        "h": "Impact vs urgency",
        "p": [
          "Impact = how many/how critical; urgency = how fast it's needed. Together set priority."
        ]
      },
      {
        "h": "Don't",
        "p": [
          "Don't escalate without triage, and don't strip context — the next tier shouldn't restart from zero."
        ]
      }
    ],
    "practice": "List four things every escalation should contain."
  },
  "t2-itil-05": {
    "intro": "Beyond incidents: the ITIL practices that prevent repeat tickets.",
    "sections": [
      {
        "h": "Incident vs problem",
        "ul": [
          {
            "b": "Incident",
            "t": "restore service now"
          },
          {
            "b": "Problem",
            "t": "find/fix the root cause so it stops recurring"
          }
        ]
      },
      {
        "h": "Change management",
        "ul": [
          "Changes are reviewed/approved (CAB) to reduce risk",
          "Standard vs normal vs emergency changes",
          "Always have a rollback plan"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: Recurring incidents (same outage weekly) should become a 'problem' record — chasing the same ticket over and over without root-cause analysis is how teams stay underwater."
        }
      },
      {
        "h": "Why it matters",
        "p": [
          "Problem management turns firefighting into prevention; change management stops self-inflicted outages."
        ]
      }
    ],
    "practice": "Explain the difference between an incident and a problem in ITIL terms."
  }
};
