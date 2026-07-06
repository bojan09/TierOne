import type { LessonContent, Bullet } from './model';

function BulletItem({ item }: { item: Bullet }) {
  if (typeof item === 'string') return <li>{item}</li>;
  return (
    <li>
      <strong>{item.b}</strong> {item.t}
    </li>
  );
}

const NOTE_CLASS: Record<'tip' | 'warn' | 'info', string> = {
  tip: 'border-accent-green/30 bg-accent-green/5 text-accent-green',
  warn: 'border-accent-amber/30 bg-accent-amber/5 text-accent-amber',
  info: 'border-accent-cyan/30 bg-accent-cyan/5 text-accent-cyan',
};
const NOTE_LABEL: Record<'tip' | 'warn' | 'info', string> = {
  tip: 'Tip',
  warn: 'Watch out',
  info: 'Note',
};

/** Renders a LessonContent object into the same semantic markup (section/h2/p/ul)
 *  the hand-written lesson bodies use, so it inherits `.lesson-content` styling. */
export default function StructuredLesson({ content }: { content: LessonContent }) {
  return (
    <>
      <section>
        <p>{content.intro}</p>
      </section>

      {content.sections.map((s, i) => (
        <section key={i}>
          <h2>{s.h}</h2>
          {s.p?.map((para, j) => (
            <p key={j}>{para}</p>
          ))}
          {s.ul && s.ul.length > 0 && (
            <ul>
              {s.ul.map((b, j) => (
                <BulletItem key={j} item={b} />
              ))}
            </ul>
          )}
          {s.code && (
            <pre className="rounded-xl border border-surface-700 bg-[#0b0f17] p-4 overflow-x-auto text-[13px] font-mono text-slate-200 my-4">
              <code>{s.code}</code>
            </pre>
          )}
          {s.svg && (
            <figure className="my-5">
              <div
                className="rounded-xl border border-surface-700 bg-[#0b0f17] p-4 overflow-x-auto [&_svg]:mx-auto [&_svg]:block [&_svg]:max-w-full [&_svg]:h-auto"
                dangerouslySetInnerHTML={{ __html: s.svg }}
              />
              {s.caption && (
                <figcaption className="text-center text-xs text-slate-500 mt-2">{s.caption}</figcaption>
              )}
            </figure>
          )}
          {s.note && (
            <div className={`rounded-xl border px-4 py-3 my-4 ${NOTE_CLASS[s.note.kind]}`}>
              <span className="text-[10px] font-bold uppercase tracking-widest block mb-1">
                {NOTE_LABEL[s.note.kind]}
              </span>
              <span className="text-slate-300 text-sm">{s.note.text}</span>
            </div>
          )}
        </section>
      ))}

      {content.practice && (
        <section>
          <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 px-4 py-4 my-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-300 block mb-1">
              🧪 Try it yourself
            </span>
            <p className="text-slate-200 text-sm !mt-0">{content.practice}</p>
          </div>
        </section>
      )}
    </>
  );
}
