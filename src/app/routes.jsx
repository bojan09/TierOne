// AUTO-GENERATED route manifest (P2.2).
//
// Replaces ~110 hand-wired <Route> lines + static imports in App.jsx with a
// data-driven, lazily-loaded table so every page is its own bundle chunk.
//
// These legacy lesson pages still render their own chrome; they are superseded
// by the spine-driven /learn routes as content migrates in P5, at which point
// the lessonRoutes array shrinks to empty and this file is removed.
import { lazy } from 'react';

// Shared lazy chunk — served for both the bare index and the per-model route.
const ITModels = lazy(() => import('../pages/ITModels.jsx'));

// Utility + course-index pages.
export const pageRoutes = [
  { path: 'dashboard', Component: lazy(() => import('../pages/Dashboard.jsx')) },
  { path: 'glossary', Component: lazy(() => import('../pages/Glossary.jsx')) },
  { path: 'certificate', Component: lazy(() => import('../pages/Certificate.jsx')) },
  { path: 'search', Component: lazy(() => import('../pages/SearchResults.jsx')) },
  { path: 'cheatsheets', Component: lazy(() => import('../pages/CheatSheets.jsx')) },
  { path: 'it-models', Component: ITModels },
  { path: 'it-models/:model', Component: ITModels },
  { path: 'port-lookup', Component: lazy(() => import('../pages/PortLookup.jsx')) },
  { path: 'vmware-setup', Component: lazy(() => import('../pages/VmwareSetup.jsx')) },
];

// Legacy lesson + placeholder routes retired in P5.5 — all lessons now live
// under /learn (spine-driven). Course-index URLs redirect (see App.jsx).
export const lessonRoutes = [];

export const placeholderRoutes = [];

export const legacyCourseRedirects = ['cybersecurity', 'linux', 'networking', 'powershell', 'python', 'troubleshooting', 'unix', 'windows', 'windows-server-2025'];
