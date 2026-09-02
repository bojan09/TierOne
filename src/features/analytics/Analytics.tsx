import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { curriculum } from '@/content/curriculum';
import { useAcademyProgress } from '@/features/progress/useAcademyProgress';
import { useAuth } from '@/features/auth/useAuth';
import { TRACK_META, DEFAULT_TRACK_META, TRACK_ORDER } from '@/features/curriculum/trackMeta';
import { fetchAnalytics, type AnalyticsData } from './api';

function readinessLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Interview ready', color: 'text-accent-green' };
  if (score >= 67) return { label: 'Nearly job-ready', color: 'text-accent-cyan' };
  if (score >= 34) return { label: 'Building skills', color: 'text-accent-amber' };
  return { label: 'Getting started', color: 'text-slate-400' };
}

export default function Analytics() {
  const { completedSet, quizStats } = useAcademyProgress();
  const { profile } = useAuth();
  // Falls back to 'helpdesk' only if a profile hasn't loaded yet (never
  // actually null once onboarded — Onboarding always sets a track).
  const track = profile?.track ?? 'helpdesk';
  const trackMeta = TRACK_META[track] ?? DEFAULT_TRACK_META;
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    let active = true;
    void fetchAnalytics().then((d) => {
      if (active) setData(d);
    });
    return () => {
      active = false;
    };
  }, []);

  const m = useMemo(() => {
    // Was hardcoded to the 'helpdesk' track — a SysAdmin/CompTIA A+/Scripting
    // learner's readiness score would sit at 0% forever and "recommended
    // next step" would point at an unrelated Help Desk lesson, regardless of
    // their actual progress. Now scoped to whichever track the user chose.
    const trackLessons = curriculum.lessons.filter((l) => l.track === track);
    const trackDone = trackLessons.filter((l) => completedSet.has(l.id)).length;
    const trackQuizIds = new Set(trackLessons.filter((l) => l.hasQuiz).map((l) => l.id));
    const trackQuizPassed = quizStats.passedIds.filter((id) => trackQuizIds.has(id)).length;

    const lessonPct = trackLessons.length ? trackDone / trackLessons.length : 0;
    const quizPct = trackQuizIds.size ? trackQuizPassed / trackQuizIds.size : 0;
    const scenPct = data && data.scenariosTotal ? data.scenariosPassed / data.scenariosTotal : 0;
    const labPct = data && data.labsTotal ? data.labsCompleted / data.labsTotal : 0;

    const score = Math.round(100 * (0.4 * lessonPct + 0.3 * quizPct + 0.2 * scenPct + 0.1 * labPct));
    return {
      trackLessons, trackDone, trackQuizIds, trackQuizPassed,
      lessonPct, quizPct, scenPct, labPct, score,
      components: [
        { label: `${trackMeta.label} lessons`, got: trackDone, total: trackLessons.length, weight: 40 },
        { label: `${trackMeta.label} quizzes passed`, got: trackQuizPassed, total: trackQuizIds.size, weight: 30 },
        { label: 'Tickets resolved', got: data?.scenariosPassed ?? 0, total: data?.scenariosTotal ?? 0, weight: 20 },
        { label: 'Labs completed', got: data?.labsCompleted ?? 0, total: data?.labsTotal ?? 0, weight: 10 },
      ],
    };
  }, [completedSet, quizStats, data, track, trackMeta.label]);

  const rl = readinessLabel(m.score);
  const maxAct = Math.max(1, ...(data?.activity.map((a) => a.count) ?? [1]));

  // next recommended step
  const nextLesson = m.trackLessons.find((l) => !completedSet.has(l.id));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-brand-300 bg-brand-500/10 border border-brand-500/30 rounded-full px-2.5 py-0.5 mb-4">
        Career Readiness
      </span>
      <h1 className="text-3xl font-black text-white tracking-tight mb-6">Your employability snapshot</h1>

      {/* Score + components */}
      <div className="grid md:grid-cols-[auto_1fr] gap-6 mb-8">
        <div className="rounded-2xl border border-surface-700 bg-surface-800/40 p-6 flex flex-col items-center justify-center text-center min-w-[12rem]">
          <div className="text-5xl font-black text-white font-mono">{m.score}</div>
          <div className="text-xs text-slate-500 mt-1">/ 100</div>
          <div className={`text-sm font-bold mt-2 ${rl.color}`}>{rl.label}</div>
        </div>
        <div className="rounded-2xl border border-surface-700 bg-surface-800/40 p-6 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">How it's calculated</p>
          {m.components.map((c) => {
            const pct = c.total ? Math.round((c.got / c.total) * 100) : 0;
            return (
              <div key={c.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-300">{c.label} <span className="text-slate-400">· {c.weight}%</span></span>
                  <span className="font-mono text-slate-400">{c.got}/{c.total}</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-700 overflow-hidden">
                  <div className="h-full bg-brand-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity */}
      <div className="rounded-2xl border border-surface-700 bg-surface-800/40 p-6 mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Activity · last 14 days</p>
        {!data ? (
          <p className="text-slate-500 text-sm">Loading…</p>
        ) : (
          <div className="flex items-end gap-1.5 h-24">
            {data.activity.map((a) => (
              <div key={a.date} className="flex-1 flex flex-col items-center justify-end h-full" title={`${a.date}: ${a.count}`}>
                <div
                  className={`w-full rounded-t ${a.count ? 'bg-brand-500' : 'bg-surface-700'}`}
                  style={{ height: `${Math.max(6, (a.count / maxAct) * 100)}%` }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skills coverage */}
      <div className="rounded-2xl border border-surface-700 bg-surface-800/40 p-6 mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Skills coverage by course</p>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
          {curriculum.courses
            .slice()
            .sort((a, b) =>
              a.track === b.track
                ? a.order - b.order
                : TRACK_ORDER.indexOf(a.track) - TRACK_ORDER.indexOf(b.track),
            )
            .map((c) => {
              const ls = curriculum.lessons.filter((l) => l.courseId === c.id);
              const done = ls.filter((l) => completedSet.has(l.id)).length;
              const pct = ls.length ? Math.round((done / ls.length) * 100) : 0;
              return (
                <div key={c.id}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300 truncate">{c.icon} {c.title}</span>
                    <span className="font-mono text-slate-500">{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-700 overflow-hidden">
                    <div
                      className="h-full"
                      style={{ width: `${pct}%`, backgroundColor: (TRACK_META[c.track] ?? DEFAULT_TRACK_META).color }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Next step */}
      {nextLesson && (
        <div className="rounded-2xl border border-brand-500/30 bg-brand-500/5 p-5 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-300 mb-1">Recommended next step</p>
            <p className="text-white font-semibold">{nextLesson.title}</p>
          </div>
          <Link
            to={`/learn/${curriculum.courses.find((c) => c.id === nextLesson.courseId)?.slug}/${nextLesson.slug}`}
            className="btn-primary text-sm"
          >
            Continue →
          </Link>
        </div>
      )}
    </div>
  );
}
