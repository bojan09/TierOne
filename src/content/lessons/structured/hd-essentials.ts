import type { LessonContent } from '../model';

export const hdessentialsLessons: Record<string, LessonContent> = {
  "hd-ess-01": {
    "intro": "What Tier-1 support really is, and what good looks like on day one.",
    "sections": [
      {
        "h": "The role",
        "p": [
          "Help desk is the first line of IT support: you receive issues, triage them, resolve what you can, and escalate the rest — while keeping users informed."
        ]
      },
      {
        "h": "Tiers",
        "ul": [
          {
            "b": "Tier 0",
            "t": "self-service / KB"
          },
          {
            "b": "Tier 1",
            "t": "first human contact, common fixes"
          },
          {
            "b": "Tier 2/3",
            "t": "deeper/specialist"
          }
        ]
      },
      {
        "h": "What good looks like",
        "note": {
          "kind": "info",
          "text": "In the real world: Employers hire for attitude and communication as much as technical skill — a calm, clear tech who documents well beats a silent genius on the phones."
        }
      }
    ],
    "practice": "In your own words, describe the difference between Tier 1 and Tier 2."
  },
  "hd-ess-02": {
    "intro": "How you talk to users determines their experience as much as the fix does.",
    "sections": [
      {
        "h": "Core habits",
        "ul": [
          "Listen fully, then confirm the problem back",
          "Avoid jargon; explain in the user's terms",
          "Set expectations (what you'll do, how long)"
        ]
      },
      {
        "h": "Difficult calls",
        "ul": [
          "Stay calm; acknowledge frustration",
          "Focus on the next action, not blame",
          "Follow up when you promise to"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: A user whose issue takes a day but who is kept informed is happier than one fixed in an hour with silence — communication is the product."
        }
      },
      {
        "h": "Tone",
        "p": [
          "Be warm, concise, and confident. Written tickets: clear subject, plain steps, no jargon."
        ]
      }
    ],
    "practice": "Rewrite 'PEBKAC, rebooted, closed' as a professional ticket note."
  },
  "hd-ess-03": {
    "intro": "Trust is the currency of IT — handle access and data responsibly.",
    "sections": [
      {
        "h": "Conduct",
        "ul": [
          "Reliability, punctuality, follow-through",
          "Own mistakes; don't hide them",
          "Respect user privacy and data"
        ]
      },
      {
        "h": "Access ethics",
        "ul": [
          "Use admin access only for the task at hand",
          "Never snoop; least privilege applies to you too",
          "Follow data-handling policy"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: Techs have powerful access — the fastest way to lose a job (and references) is misusing it. Professionalism protects users and you."
        }
      },
      {
        "h": "Boundaries",
        "p": [
          "Know when to say 'I'll find out' rather than guessing, and when to escalate a security concern."
        ]
      }
    ],
    "practice": "Name two ways a tech demonstrates trustworthiness with elevated access."
  },
  "hd-ess-04": {
    "intro": "Good notes turn one fix into a repeatable solution for the whole team.",
    "sections": [
      {
        "h": "Ticket documentation",
        "ul": [
          "What was reported, what you found, what you did",
          "Clear enough for the next tech to continue",
          "Timestamps and affected users"
        ]
      },
      {
        "h": "Knowledge base",
        "ul": [
          "Write KB articles for recurring issues",
          "Title by symptom users search for",
          "Keep steps current"
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: A well-written KB article you author once can resolve the same issue hundreds of times via self-service — the highest-leverage thing a Tier-1 tech does."
        }
      },
      {
        "h": "Why it matters",
        "p": [
          "Documentation shortens future tickets, enables escalation, and proves your work."
        ]
      }
    ],
    "practice": "Outline the sections of a good KB article for 'Outlook won't open'."
  },
  "hd-ess-05": {
    "intro": "How a ticket flows and how to decide what to work first.",
    "sections": [
      {
        "h": "Lifecycle",
        "ul": [
          "New → Assigned → In Progress → Resolved → Closed",
          "Keep status current; add notes at each step"
        ]
      },
      {
        "h": "Priority = impact × urgency",
        "ul": [
          {
            "b": "Impact",
            "t": "how many / how critical"
          },
          {
            "b": "Urgency",
            "t": "how time-sensitive"
          },
          {
            "b": "P1",
            "t": "outage; P4: minor request"
          }
        ],
        "note": {
          "kind": "info",
          "text": "In the real world: A single exec's laptop vs a whole floor's network down — prioritization keeps you working the highest-impact issue instead of first-in-first-out."
        }
      },
      {
        "h": "SLAs",
        "p": [
          "Service Level Agreements set response/resolution targets by priority — meet them and communicate."
        ]
      }
    ],
    "practice": "Given a company-wide email outage and one user's font issue, assign priorities and justify."
  }
};
