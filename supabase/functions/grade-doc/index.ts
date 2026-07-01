/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
// grade-doc — AI-graded documentation practice (Supabase Edge Function, Deno).
//
// The provider API key lives ONLY here, as a Supabase secret — never in the
// client bundle. Provider-agnostic: point it at any OpenAI-compatible chat
// endpoint (Groq, Google Gemini's OpenAI-compatible API, OpenRouter, etc.).
//
// Required secrets (set via `supabase secrets set`):
//   AI_API_KEY   — your free-tier provider key
//   AI_BASE_URL  — e.g. https://api.groq.com/openai/v1
//   AI_MODEL     — e.g. llama-3.1-8b-instant
// Optional:
//   DOC_DAILY_CAP — max AI gradings per user per day (default 10)
//
// If AI_API_KEY is unset, this returns { configured:false } and the client
// falls back to "regular" mode (rubric self-check + model answer, no AI).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') ?? '*';
const cors = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Vary': 'Origin',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const ANON = Deno.env.get('SUPABASE_ANON_KEY')!;
  const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const AI_API_KEY = Deno.env.get('AI_API_KEY');
  const AI_BASE_URL = Deno.env.get('AI_BASE_URL') ?? 'https://api.groq.com/openai/v1';
  const AI_MODEL = Deno.env.get('AI_MODEL') ?? 'llama-3.1-8b-instant';
  const DAILY_CAP = parseInt(Deno.env.get('DOC_DAILY_CAP') ?? '10', 10);

  // No key configured → tell the client to use regular (non-AI) mode.
  if (!AI_API_KEY) return json({ configured: false });

  // ── Authenticate the caller ──
  const authHeader = req.headers.get('Authorization') ?? '';
  const authClient = createClient(SUPABASE_URL, ANON, { global: { headers: { Authorization: authHeader } } });
  const { data: userData, error: userErr } = await authClient.auth.getUser();
  if (userErr || !userData?.user) return json({ error: 'unauthorized' }, 401);
  const uid = userData.user.id;

  // ── Parse + validate input ──
  let body: { exercise_id?: string; content?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'bad_request' }, 400);
  }
  const exerciseId = (body.exercise_id ?? '').trim();
  const content = (body.content ?? '').trim();
  if (!exerciseId || !content) return json({ error: 'missing_fields' }, 400);
  if (content.length > 4000) return json({ error: 'too_long', max: 4000 }, 400);

  const admin = createClient(SUPABASE_URL, SERVICE);

  // ── Daily rate cap ──
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const { count } = await admin
    .from('doc_submissions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', uid)
    .eq('graded_by', 'ai')
    .gte('created_at', startOfDay.toISOString());
  if ((count ?? 0) >= DAILY_CAP) return json({ configured: true, rate_limited: true, cap: DAILY_CAP });

  // ── Load the exercise ──
  const { data: ex, error: exErr } = await admin
    .from('doc_exercises')
    .select('title, prompt, context, criteria, model_answer')
    .eq('id', exerciseId)
    .maybeSingle();
  if (exErr || !ex) return json({ error: 'unknown_exercise' }, 404);

  const criteria: string[] = Array.isArray(ex.criteria) ? ex.criteria : [];

  // ── Build the grading prompt ──
  const system =
    'You are a strict but fair IT documentation grader for trainee help-desk technicians. ' +
    'Grade the trainee submission against EACH rubric criterion. Be concise and constructive. ' +
    'Respond with ONLY valid minified JSON, no markdown fences, in exactly this shape: ' +
    '{"score": <integer 0-100>, "feedback": "<2-3 sentences>", "criteria": [{"label": "<criterion text>", "met": <true|false>, "note": "<short note>"}]}';
  const user =
    `SCENARIO CONTEXT:\n${ex.context}\n\nTASK:\n${ex.prompt}\n\n` +
    `RUBRIC CRITERIA:\n${criteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\n` +
    `TRAINEE SUBMISSION:\n"""${content}"""`;

  // ── Call the AI provider (OpenAI-compatible) ──
  let aiText = '';
  try {
    const resp = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${AI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: AI_MODEL,
        temperature: 0.2,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
    });
    if (!resp.ok) {
      const t = await resp.text();
      console.error('provider error', resp.status, t);
      return json({ configured: true, error: 'grading_unavailable' });
    }
    const data = await resp.json();
    aiText = data?.choices?.[0]?.message?.content ?? '';
  } catch (e) {
    console.error('provider fetch failed', e);
    return json({ configured: true, error: 'grading_unavailable' });
  }

  // ── Parse the model's JSON defensively ──
  let parsed: { score?: number; feedback?: string; criteria?: Array<{ label: string; met: boolean; note?: string }> };
  try {
    const cleaned = aiText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    parsed = JSON.parse(cleaned.slice(start, end + 1));
  } catch (e) {
    console.error('parse failed', e, aiText);
    return json({ configured: true, error: 'grading_unavailable' });
  }

  const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score ?? 0))));
  const feedback = String(parsed.feedback ?? '').slice(0, 1200);
  const critResults = Array.isArray(parsed.criteria) ? parsed.criteria.slice(0, 12) : [];

  // ── Persist ──
  await admin.from('doc_submissions').insert({
    user_id: uid,
    exercise_id: exerciseId,
    content,
    score,
    feedback,
    criteria_results: critResults,
    graded_by: 'ai',
  });

  return json({ configured: true, score, feedback, criteria_results: critResults });
});
