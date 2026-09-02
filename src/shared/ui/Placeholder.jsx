import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Site-wide 404. Course/lesson-specific "coming soon" content used to render
 * here too, but every route that could pass a lesson-shaped title was
 * retired in P5.5 (all lessons live under /learn now) — this only ever
 * receives the catch-all "Page not found" title in practice.
 */
export default function Placeholder({ title }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
      <div className="text-6xl" aria-hidden="true">🔍</div>
      <h1 className="text-2xl font-bold text-white">{title || 'Page not found'}</h1>
      <p className="text-slate-400 text-sm max-w-sm">
        That page doesn't exist, or it's moved. Try the Academy, or head back home.
      </p>
      <div className="flex flex-wrap gap-3 justify-center mt-2">
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
        <Link to="/learn" className="btn-secondary">
          Browse the Academy
        </Link>
      </div>
    </div>
  );
}
