# content/

Hybrid content model (see docs/ARCHITECTURE.md):
- `lessons/`    — lesson bodies as lazy-loaded code modules (MDX/JSX), keyed by slug
- `curriculum/` — the typed curriculum spine (source of truth, seeded to Supabase)
- `quizzes/`    — structured quiz data
- `scenarios/`  — virtual help desk scenario definitions (P7)
