import { Link } from 'react-router-dom'

/**
 * TierOne brandmark — a single source of truth used by the Navbar, mobile
 * drawer, and Footer.
 *
 * The glyph is a terminal prompt — a chevron ">" and a cursor block — reading
 * as command-line/IT tooling rather than a generic progress-bar icon, on the
 * aurora gradient tile. The wordmark's "One" uses a theme-aware brand tint
 * (`.logo-zero`) that stays WCAG-AA legible on both dark and light
 * backgrounds.
 */
export default function Logo({ size = 'md' }) {
  const tile = size === 'lg' ? 'w-10 h-10' : 'w-9 h-9'
  const text = size === 'lg' ? 'text-base' : 'text-[15px]'
  return (
    <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0" aria-label="TierOne — home">
      <span className={`relative ${tile} rounded-xl overflow-hidden shadow-glow-sm
                        transition-transform duration-200 group-hover:scale-105`}>
        <span
          className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(135deg,#6d5cf5 0%,#8b5cf6 55%,#22d3ee 135%)' }}
        />
        <svg viewBox="0 0 32 32" className="relative w-full h-full" fill="none" aria-hidden="true">
          <path d="M9.5 9.5 L18 16 L9.5 22.5" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="19" y="19.6" width="7.5" height="3.4" rx="1.2" fill="#fff" fillOpacity="0.92" />
        </svg>
      </span>
      <span className={`font-bold text-white ${text} tracking-tight leading-none`}>
        Tier<span className="logo-zero">One</span>
      </span>
    </Link>
  )
}
