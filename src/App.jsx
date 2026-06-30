import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Eager shell + first-paint page.
import Layout from './layout/Layout.jsx';
import Home from './pages/Home.jsx';
import Placeholder from './shared/ui/Placeholder.jsx';

// Data-driven Academy (spine-driven, lazy bodies).
import LearnHome from './features/curriculum/LearnHome.tsx';
import CourseView from './features/curriculum/CourseView.tsx';
import LessonView from './features/lessons/LessonView.tsx';
import SimulatorHome from './features/scenario/SimulatorHome.tsx';
import ScenarioPlayer from './features/scenario/ScenarioPlayer.tsx';
import LabsHome from './features/labs/LabsHome.tsx';
import LabPlayer from './features/labs/LabPlayer.tsx';

// Auth.
import RequireAuth from './features/auth/RequireAuth.tsx';
import LoginPage from './features/auth/LoginPage.tsx';
import AuthCallback from './features/auth/AuthCallback.tsx';

// Lazily-loaded legacy route manifest (replaces ~110 hand-wired routes).
import { pageRoutes, lessonRoutes, placeholderRoutes, legacyCourseRedirects } from './app/routes.jsx';

/**
 * All non-shell routes are lazily code-split. The single <Suspense> boundary
 * lives in Layout, around <Outlet />.
 *
 * Route specificity in React Router v6 ranks static segments above dynamic
 * (`:lesson`) ones, so the placeholder routes never shadow real lesson routes
 * regardless of array order.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        {/* Auth */}
        <Route path="login" element={<LoginPage />} />
        <Route path="auth/callback" element={<AuthCallback />} />

        {/* Data-driven Academy — requires authentication */}
        <Route element={<RequireAuth />}>
          <Route path="learn" element={<LearnHome />} />
          <Route path="learn/:courseSlug" element={<CourseView />} />
          <Route path="learn/:courseSlug/:lessonSlug" element={<LessonView />} />
          <Route path="simulator" element={<SimulatorHome />} />
          <Route path="simulator/:slug" element={<ScenarioPlayer />} />
          <Route path="labs" element={<LabsHome />} />
          <Route path="labs/:slug" element={<LabPlayer />} />
        </Route>

        {/* Utility + course-index pages */}
        {pageRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

        {/* Legacy lesson pages (URLs preserved; superseded by /learn in P5) */}
        {lessonRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

        {/* Section "coming soon" placeholders */}
        {placeholderRoutes.map(({ path, title }) => (
          <Route key={path} path={path} element={<Placeholder title={title} />} />
        ))}

        {/* Legacy course-index URLs → spine Academy */}
        {legacyCourseRedirects.map((key) => (
          <Route key={key} path={key} element={<Navigate to={`/learn/${key}`} replace />} />
        ))}

        {/* 404 */}
        <Route path="*" element={<Placeholder title="Page not found" />} />
      </Route>
    </Routes>
  );
}
