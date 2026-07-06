import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface Heading {
  id: string;
  text: string;
}

function slugify(text: string, used: Set<string>): string {
  const base =
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'section';
  let id = base;
  let n = 2;
  while (used.has(id)) id = `${base}-${n++}`;
  used.add(id);
  return id;
}

/** Scans the rendered lesson body for <h2>s, assigns stable ids, and tracks
 *  the heading currently in view. Works for both structured and legacy JSX
 *  lessons because it reads the DOM, not the source. */
function useHeadings(): { headings: Heading[]; activeId: string | null } {
  const { pathname } = useLocation();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const container = document.querySelector('.lesson-content');
    if (!container) return;

    const scan = () => {
      const used = new Set<string>();
      const hs = Array.from(container.querySelectorAll('h2'));
      const found: Heading[] = hs.map((el) => {
        const text = (el.textContent || '').trim();
        if (!el.id) el.id = slugify(text, used);
        else used.add(el.id);
        el.classList.add('scroll-mt-24');
        return { id: el.id, text };
      });
      setHeadings(found);
      return hs;
    };

    let hs = scan();
    // Lesson bodies are lazy-loaded (Suspense); re-scan until they appear.
    const mo = new MutationObserver(() => {
      hs = scan();
    });
    mo.observe(container, { childList: true, subtree: true });

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -70% 0px' },
    );
    hs.forEach((h) => io.observe(h));
    const reobserve = setTimeout(() => {
      document.querySelectorAll('.lesson-content h2').forEach((h) => io.observe(h));
    }, 300);

    return () => {
      mo.disconnect();
      io.disconnect();
      clearTimeout(reobserve);
    };
  }, [pathname]);

  return { headings, activeId };
}

function jumpTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Sidebar variant — sticky list, desktop. */
export function LessonTocSidebar() {
  const { headings, activeId } = useHeadings();
  if (headings.length < 2) return null;
  return (
    <div className="card p-4">
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3">
        On this page
      </p>
      <nav aria-label="Table of contents">
        <ul className="space-y-1.5">
          {headings.map((h) => (
            <li key={h.id}>
              <button
                onClick={() => jumpTo(h.id)}
                aria-current={activeId === h.id ? 'true' : undefined}
                className={`text-left text-xs leading-snug transition-colors w-full ${
                  activeId === h.id
                    ? 'text-brand-300 font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {h.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

/** Inline variant — collapsible, shown at the top of the body on mobile. */
export function LessonTocInline() {
  const { headings } = useHeadings();
  if (headings.length < 2) return null;
  return (
    <details className="card p-4 mb-8 lg:hidden">
      <summary className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest cursor-pointer select-none">
        On this page ({headings.length})
      </summary>
      <ul className="space-y-1.5 mt-3">
        {headings.map((h) => (
          <li key={h.id}>
            <button
              onClick={() => jumpTo(h.id)}
              className="text-left text-sm text-slate-300 hover:text-white transition-colors w-full"
            >
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}
