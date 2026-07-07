# Content Pipeline

Large curriculum expansions (P18+) are **generated**, not hand-written per lesson. A JSON
manifest is the source of truth; a Python emitter turns it into typed spine data, structured
lesson content, and idempotent seed migrations.

## Files
- `scripts/manifests/<phase>.json` — the content (courses → lessons → sections + quiz). Source of truth.
- `scripts/emit_content.py` — emits everything for a phase (repo-relative, idempotent).
- `scripts/validate_content.py` — validates manifests (ids, fields, quiz shape, collisions) before emitting.
- `scripts/new_phase.py` — scaffolds a new phase (manifest + config + marker snippet).
- `src/content/lessons/model.ts` / `StructuredLesson.tsx` — the data model + renderer.
- `src/content/lessons/structured/*` — generated content maps (do not edit by hand).

## What the emitter produces (per phase)
1. `src/content/lessons/structured/<area>.ts` — one content map per course (regenerated).
2. `src/content/lessons/structured/index.ts` — aggregates **all** area files (phase-agnostic).
3. A generated region between `// <PHASE>-GENERATED-START/END` markers in the track spine
   (`helpdesk.ts` or `sysadmin.ts`) — the `addCourse(...)` calls.
4. Two seed migrations: `..._lessons.sql` (curriculum_lessons) and `..._quizzes.sql`
   (lesson_quizzes + quiz_questions). Both idempotent.

Scenarios and labs are authored as separate hand-written idempotent migrations (they use
different schemas); see the P18/P19/P20 `..._scenarios_*` / `..._labs_*` migrations for the pattern.

## Manifest shape
```jsonc
{ "courses": [ {
  "area": "net-routing", "id": "nw-routing", "slug": "nw-routing",
  "title": "Routing", "description": "...", "icon": "🧭", "order": 10,
  "module_id": "nw-rt-m1",
  "module_slug": "routing", "module_title": "Routing",   // helpdesk track only (5-arg addCourse)
  "difficulty": "advanced",                                // optional: beginner|intermediate|advanced
  "lessons": [ {
    "id": "nw-rt-01", "slug": "routing-concepts", "title": "Routing Concepts",
    "minutes": 24, "xp": 85,
    "content": { "intro": "...", "sections": [ { "h": "...", "p": ["..."], "ul": ["...", {"b":"Bold:","t":"text"}], "code": "...", "svg": "<svg…>", "caption": "...", "note": {"kind":"tip","text":"..."} } ], "practice": "..." },
    "quiz": [ { "p": "prompt", "o": ["a","b","c","d"], "ci": 1, "ex": "explanation" } ]
  } ]
} ] }
```

## Adding a phase
```bash
python scripts/new_phase.py p23 sysadmin      # scaffold manifest + print config/marker
# ...author courses into scripts/manifests/p23.json, add the printed config + marker...
python scripts/validate_content.py p23        # catch id collisions / bad quiz indexes / missing fields
python scripts/emit_content.py p23            # generate content, spine region, seeds
npm run typecheck && npm run lint && npm run build
# validate seeds on Postgres, then commit
```

## Rules
- **Never edit** `structured/*` or the generated spine region by hand — re-run the emitter.
- **id prefixes are namespaced per phase** (`ws-`, `nw-`, `t2-`, …) and must be globally unique — the validator enforces this.
- **sort_base is per phase** (P18 = 2000, P19 = 3000, P20 = 4000, …) so `curriculum_lessons.sort_order` never collides.
- Emitting is idempotent: re-running reproduces byte-identical output and re-seedable SQL.
