# grade-doc — deploy & configure

AI-graded documentation practice. The provider key stays server-side (a Supabase
secret) and never ships to the browser. Provider-agnostic: any **OpenAI-compatible**
chat endpoint works, so you can use a free tier.

## 1. Pick a free provider and get a key
Any of these expose an OpenAI-compatible endpoint on a free tier:

| Provider | AI_BASE_URL | Example AI_MODEL |
|---|---|---|
| **Groq** (fast, generous free tier) | `https://api.groq.com/openai/v1` | `llama-3.1-8b-instant` |
| **Google Gemini** (OpenAI-compat) | `https://generativelanguage.googleapis.com/v1beta/openai` | `gemini-2.0-flash` |
| **OpenRouter** (has free models) | `https://openrouter.ai/api/v1` | a `:free` model id |

Free tiers have rate limits and can change — the daily cap below keeps usage bounded.

## 2. Set secrets
```bash
supabase secrets set AI_API_KEY=your_free_key
supabase secrets set AI_BASE_URL=https://api.groq.com/openai/v1
supabase secrets set AI_MODEL=llama-3.1-8b-instant
supabase secrets set DOC_DAILY_CAP=10   # optional, default 10
```
`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are injected
automatically — do not set them.

## 3. Deploy
```bash
supabase functions deploy grade-doc
```

## Behavior
- **No `AI_API_KEY` set** → the function returns `{ configured:false }` and the app
  automatically uses **regular mode**: the learner self-checks against the rubric and
  compares with the model answer (no score, no AI). So the feature is useful even
  before you deploy this.
- **Configured** → returns `{ score, feedback, criteria_results }`, stores the
  submission, and enforces the per-user daily cap (HTTP 429 when exceeded).

## Notes
- Input is capped at 4000 characters.
- Submissions are stored under the user's id (RLS: users read only their own).
- This function can't be validated in the build sandbox (Deno + external network);
  test it against your deployed project.
