# Deployment checklist (P14)

Production go-live for TierZero. Order matters.

## 1. Database — apply migrations
Apply **`supabase/migrations/0001` → `0020`** in order to the live project.
They are written to be re-runnable (idempotent policies, `create or replace`),
but apply in sequence on a fresh project.

Verify after:
- `select count(*) from curriculum_lessons;` → 86
- `select count(*) from quiz_questions;` → 258
- `select count(*) from scenarios;` → 4
- `select count(*) from labs;` → 1
- `select count(*) from doc_exercises;` → 3

## 2. Auth
- Enable the Google provider.
- Set **Redirect URLs**: `http://localhost:5173/auth/callback` (dev) and
  `https://<your-domain>/auth/callback` (prod).
- Confirm email settings / templates as desired.

## 3. AI grading (optional — `grade-doc`)
Documentation practice runs in **regular mode** without this; deploy to enable AI.
```bash
supabase functions deploy grade-doc
supabase secrets set AI_API_KEY=<free-tier key> \
  AI_BASE_URL=https://api.groq.com/openai/v1 \
  AI_MODEL=llama-3.1-8b-instant \
  DOC_DAILY_CAP=10 \
  ALLOWED_ORIGIN=https://<your-domain>
```
`SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` are injected
automatically — do not set them. See `supabase/functions/grade-doc/README.md`.

## 4. Frontend build
Set env (in the host's dashboard, not committed):
```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable/anon key>
```
Build:
```bash
npm ci
npm run build      # outputs dist/
```
Deploy `dist/` to any static host (Netlify, Cloudflare Pages, Vercel, S3+CDN).
SPA routing: ensure a catch-all rewrite to `/index.html`.

## 5. Security headers
- `public/_headers` ships baseline headers (works on Netlify / Cloudflare Pages).
- Other hosts: set the equivalent (`X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy`, HSTS).
- **CSP (recommended, test first):** after verifying login + data load, add:
  `default-src 'self'; connect-src 'self' https://*.supabase.co; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self' data:; frame-ancestors 'none'`.
  Adjust `connect-src` if Supabase Realtime (wss) is later enabled.

## 6. Post-deploy smoke test
- Sign in with Google → profile row created, lands authenticated.
- Complete a lesson → XP persists; refresh shows it.
- Pass a quiz → lesson unlocks / XP updates.
- Resolve a Help Desk ticket and finish a lab → XP updates.
- Complete the Help Desk track → claim a certificate → open `/verify/<code>`.
- `/practice`: with AI configured → score returns; without → regular mode.
- `/analytics` shows a readiness score.

## 7. Known follow-ups (non-blocking)
- Run `supabase gen types typescript --project-id <id>` and drop the temporary
  RPC casts (`as never` / `as unknown`).
- Author more labs/scenarios/doc exercises (pure content).
- Retire unused legacy redirect pages + the localStorage `useProgress` hook.
