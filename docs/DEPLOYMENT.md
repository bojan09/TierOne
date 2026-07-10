# Deployment checklist

Production go-live for TierZero. Order matters.

> The exact migration count grows every content phase — **apply every file under
> `supabase/migrations/` in filename order** (`0001_...` through the highest
> number present), not a hardcoded range. As of this doc's last edit that's
> through `0057`; check `ls supabase/migrations/ | tail -1` for the current tip.

## 1. Database — apply migrations
Apply every migration in `supabase/migrations/`, in filename order, to the live
project. They are written to be re-runnable (idempotent policies,
`create or replace`, `on conflict do update`), but apply in sequence on a fresh
project.

Verify after: no errors during apply, and spot-check a few row counts make sense
for your project (`select count(*) from curriculum_lessons;`,
`quiz_questions`, `scenarios`, `labs`, `doc_exercises`) — exact numbers aren't
pinned here since they grow with every curriculum phase; see `memory.md` for
the current curriculum footprint.

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
