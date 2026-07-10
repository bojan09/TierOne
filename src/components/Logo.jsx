import { Link } from 'react-router-dom'

/**
 * TierZero brandmark — a single source of truth used by the Navbar, mobile
 * drawer, and Footer.
 *
 * The glyph is three ascending "tiers" (progression / levelling up) crowned by a
 * ring — the "zero" node you start from — on the aurora gradient tile. The
 * wordmark's "Zero" uses a theme-aware brand tint (`.logo-zero`) that stays
 * WCAG-AA legible on both dark and light backgrounds.
 */
export default function Logo({ size = 'md' }) {
  const tile = size === 'lg' ? 'w-10 h-10' : 'w-9 h-9'
  const text = size === 'lg' ? 'text-base' : 'text-[15px]'
  return (
    <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0" aria-label="TierZero — home">
      <span className={`relative ${tile} rounded-xl overflow-hidden shadow-glow-sm
                        transition-transform duration-200 group-hover:scale-105`}>
        <span
          className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(135deg,#6d5cf5 0%,#8b5cf6 55%,#22d3ee 135%)' }}
        />
        <svg viewBox="0 0 32 32" className="relative w-full h-full" fill="none" aria-hidden="true">
          <rect x="6"  y="18" width="4.5" height="8"  rx="1.6" fill="#fff" fillOpacity="0.8" />
          <rect x="13.75" y="13" width="4.5" height="13" rx="1.6" fill="#fff" fillOpacity="0.9" />
          <rect x="21.5" y="7.5" width="4.5" height="18.5" rx="1.6" fill="#fff" />
          <circle cx="23.75" cy="7" r="3" fill="#160f36" />
          <circle cx="23.75" cy="7" r="3" stroke="#fff" strokeWidth="1.7" />
        </svg>
      </span>
      <span className={`font-bold text-white ${text} tracking-tight leading-none`}>
        Tier<span className="logo-zero">Zero</span>
      </span>
    </Link>
  )
}
