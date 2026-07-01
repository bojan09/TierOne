# Security model & audit (P14)

TierZero is **server-authoritative**: the client is never trusted for progress,
scoring, or XP. This document records the security model and the P14 audit result.

## Principles enforced

1. **Default-deny everywhere.** Every table has RLS enabled and `revoke all …
   from anon, authenticated`, then grants back only the minimum. Audited: all 18
   tables pass.
2. **Users see only their own rows.** `lesson_progress`, `quiz_attempts`,
   `scenario_attempts`, `lab_attempts`, `certificates`, `doc_submissions`, and
   `user_stats` are `select`-own via `user_id = auth.uid()`.
3. **Answer keys never reach the client.** `quiz_questions.correct_index` and
   `scenario_options.is_correct/points/feedback` have **no table-level client
   grant**. They are served without answers by `SECURITY DEFINER` RPCs
   (`get_lesson_quiz`, `get_scenario`) and graded server-side (`submit_quiz`,
   `submit_scenario`).
4. **XP is computed server-side only.** `_recompute_user_stats(uid)` is the sole
   authority (lessons + quizzes + scenarios + labs). `user_stats` is read-only to
   clients; there is no client write path to XP or level.
5. **Privilege escalation blocked.** `profiles` grants `update (display_name,
   track)` only — clients cannot change `role`.
6. **`SECURITY DEFINER` functions pin `set search_path = public`.** Audited: all
   15 definer functions comply (prevents search-path hijacking).
7. **Least-privilege anon.** Only `verify_certificate` is anon-executable (public
   certificate verification by code); everything else requires an authenticated
   session.

## Secrets

- The Supabase publishable/anon key is the only key in the client, by design.
- The AI provider key lives **only** as a Supabase secret used by the `grade-doc`
  Edge Function — never in the bundle. `.env` and `.env.example` are gitignored and
  excluded from every release ZIP.

## Rate limiting & abuse

- `grade-doc` enforces a per-user **daily cap** (`DOC_DAILY_CAP`, default 10) and a
  4000-char input limit; app-level failures degrade to non-AI "regular" mode.
- Quiz/scenario/lab submissions are idempotent in effect (best result / one-time
  bonus), so replay cannot inflate XP.

## Edge Function CORS

`grade-doc` honours an `ALLOWED_ORIGIN` secret (default `*`). Set it to your
production origin to restrict cross-origin calls.

## Audit result

Automated audit over `supabase/migrations/*` on the P14 pass: **no gaps** —
RLS + default-deny on every table, no answer-key leaks, all definer functions
pin `search_path`, anon surface limited to certificate verification.
