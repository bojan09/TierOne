import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchItems } from '@/features/search/searchIndex'

const TYPE_BADGE = {
  lesson: 'bg-brand-500/10 text-brand-400',
  course: 'bg-accent-cyan/10 text-accent-cyan',
  page: 'bg-surface-700 text-slate-400',
  glossary: 'bg-accent-purple/10 text-accent-purple',
}

export default function SearchResults() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const results = useMemo(() => (q.trim() ? searchItems(q, 50) : []), [q])

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-4">Search</h1>

      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-surface-700 bg-surface-800/50 mb-6">
        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          autoFocus
          value={q}
          onChange={(e) => setParams(e.target.value ? { q: e.target.value } : {}, { replace: true })}
          placeholder="Search lessons, courses, topics, glossary…"
          className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 outline-none"
        />
      </div>

      {q.trim() === '' ? (
        <p className="text-slate-500 text-sm">Type to search across every course, lesson, and term.</p>
      ) : results.length === 0 ? (
        <p className="text-slate-500 text-sm">
          No results for “<span className="text-slate-300">{q}</span>”.
        </p>
      ) : (
        <>
          <p className="text-xs text-slate-500 mb-3">{results.length} result{results.length === 1 ? '' : 's'}</p>
          <ul className="space-y-2">
            {results.map((item, i) => {
              const content = (
                <>
                  <span className="text-lg w-6 text-center flex-shrink-0">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{item.label}</div>
                    {item.desc && <div className="text-xs text-slate-500 truncate mt-0.5">{item.desc}</div>}
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded flex-shrink-0 ${TYPE_BADGE[item.type]}`}>
                    {item.type}
                  </span>
                </>
              )
              const cls =
                'flex items-center gap-3 px-4 py-3 rounded-xl border border-surface-800 bg-surface-800/40 hover:border-surface-600 transition-colors'
              return (
                <li key={item.label + i}>
                  {item.href ? (
                    <Link to={item.href} className={cls}>
                      {content}
                    </Link>
                  ) : (
                    <div className={cls}>{content}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
