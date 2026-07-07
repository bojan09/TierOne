import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import CommandPalette from '../components/CommandPalette.jsx'
import ResumeBanner from '../components/ResumeBanner.jsx'
import XPToast from '../components/XPToast.jsx'
import SkipLink from '../components/SkipLink.jsx'

export default function Layout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { session, profile, loading } = useAuth()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const mainRef = useRef(null)

  // First-run: send signed-in, not-yet-onboarded users to /welcome.
  useEffect(() => {
    if (loading) return
    const exempt =
      pathname.startsWith('/welcome') ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/auth')
    if (session && profile && !profile.onboardedAt && !exempt) {
      navigate('/welcome', { replace: true })
    }
  }, [session, profile, loading, pathname, navigate])

  // Scroll to top on route change
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    // A11y: move keyboard/SR focus to the new page's main content.
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  // Keyboard shortcut: Ctrl/Cmd+K opens command palette
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(v => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-surface-950">
      {/* Accessibility: skip-to-content for keyboard users */}
      <SkipLink />

      <Navbar onOpenSearch={() => setPaletteOpen(true)} />
      <ResumeBanner />

      {/* id="main-content" is the target for the skip link */}
      <main id="main-content" ref={mainRef} tabIndex={-1} className="flex-1 page-enter outline-none">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[60vh] text-slate-500">
              <div className="animate-pulse">Loading…</div>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      <Footer />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <XPToast />
    </div>
  )
}
