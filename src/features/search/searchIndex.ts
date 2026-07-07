import { curriculum } from '@/content/curriculum';
import { courseHref, lessonHref } from '@/features/curriculum/selectors';
import { structuredLessons } from '@/content/lessons/structured';
import { GLOSSARY_DATA } from '@/data/glossary';

export type SearchType = 'course' | 'lesson' | 'glossary' | 'page';

export interface SearchItem {
  type: SearchType;
  label: string;
  desc: string;
  icon: string;
  href: string | null;
  /** Lowercased haystack for matching (never shown). */
  _hay: string;
}

/** Flatten a structured lesson body into searchable text. */
function lessonBodyText(id: string): string {
  const c = structuredLessons[id];
  if (!c) return '';
  const parts: string[] = [c.intro];
  for (const s of c.sections) {
    parts.push(s.h);
    if (s.p) parts.push(...s.p);
    if (s.ul) for (const b of s.ul) parts.push(typeof b === 'string' ? b : `${b.b} ${b.t}`);
  }
  if (c.practice) parts.push(c.practice);
  return parts.join(' ');
}

/** Key app destinations (current routes). */
const PAGES: Omit<SearchItem, '_hay'>[] = [
  { type: 'page', label: 'Academy', desc: 'Browse all courses and lessons', icon: '🎓', href: '/learn' },
  { type: 'page', label: 'My Progress', desc: 'XP, levels, badges, streak', icon: '📊', href: '/dashboard' },
  { type: 'page', label: 'Virtual Help Desk', desc: 'Practice real support tickets', icon: '🎧', href: '/simulator' },
  { type: 'page', label: 'Labs', desc: 'Hands-on simulated terminals', icon: '🧪', href: '/labs' },
  { type: 'page', label: 'Review', desc: 'Spaced-repetition review of passed lessons', icon: '🔁', href: '/review' },
  { type: 'page', label: 'Interview Prep', desc: 'Common IT interview questions', icon: '💬', href: '/interview' },
  { type: 'page', label: 'Career Analytics', desc: 'Job-readiness score & gaps', icon: '📈', href: '/analytics' },
  { type: 'page', label: 'Certificates', desc: 'Earned certificates & verification', icon: '🏆', href: '/certificates' },
  { type: 'page', label: 'Documentation Practice', desc: 'Write & self-assess IT docs', icon: '📝', href: '/practice' },
  { type: 'page', label: 'Glossary', desc: 'IT terms defined', icon: '📖', href: '/glossary' },
];

function buildIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  const courseById = new Map(curriculum.courses.map((c) => [c.id, c]));

  for (const course of curriculum.courses) {
    items.push({
      type: 'course',
      label: course.title,
      desc: course.description,
      icon: course.icon,
      href: courseHref(course),
      _hay: `${course.title} ${course.description} ${course.track} ${course.difficulty}`.toLowerCase(),
    });
  }

  for (const lesson of curriculum.lessons) {
    const course = courseById.get(lesson.courseId);
    if (!course) continue;
    const body = lessonBodyText(lesson.id);
    items.push({
      type: 'lesson',
      label: lesson.title,
      desc: course.title,
      icon: course.icon,
      href: lessonHref(course, lesson),
      _hay: `${lesson.title} ${course.title} ${course.track} ${lesson.difficulty} ${body}`.toLowerCase(),
    });
  }

  for (const g of GLOSSARY_DATA) {
    items.push({
      type: 'glossary',
      label: g.term,
      desc: g.def.length > 90 ? g.def.slice(0, 90) + '…' : g.def,
      icon: '📖',
      href: `/glossary?term=${encodeURIComponent(g.term)}`,
      _hay: `${g.term} ${g.def} ${g.category ?? ''}`.toLowerCase(),
    });
  }

  for (const p of PAGES) items.push({ ...p, _hay: `${p.label} ${p.desc}`.toLowerCase() });

  return items;
}

// Built once at module load (curriculum is static).
const INDEX = buildIndex();

const TYPE_WEIGHT: Record<SearchType, number> = { lesson: 3, course: 4, page: 2, glossary: 1 };

/** AND-matching tokenized scorer. Title hits rank above body hits. */
export function searchItems(query: string, limit = 10): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);

  const scored: { it: SearchItem; score: number }[] = [];
  for (const it of INDEX) {
    if (!tokens.every((t) => it._hay.includes(t))) continue; // AND semantics
    const label = it.label.toLowerCase();
    let score = TYPE_WEIGHT[it.type];
    if (label === q) score += 200;
    else if (label.startsWith(q)) score += 90;
    else if (label.includes(q)) score += 55;
    for (const t of tokens) {
      if (label.includes(t)) score += 25;
      else score += 6; // matched via body/desc
    }
    scored.push({ it, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.it);
}

/** Shown when the query is empty (quick links). */
export function defaultItems(): SearchItem[] {
  return INDEX.filter((i) => i.type === 'page').slice(0, 8);
}

export function indexSize(): number {
  return INDEX.length;
}
