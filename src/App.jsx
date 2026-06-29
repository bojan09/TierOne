import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Eager shell + first-paint page.
import Layout from './layout/Layout.jsx';
import Home from './pages/Home.jsx';
import Placeholder from './shared/ui/Placeholder.jsx';

// Data-driven Academy (spine-driven, lazy bodies).
import LearnHome from './features/curriculum/LearnHome.tsx';
import CourseView from './features/curriculum/CourseView.tsx';
import LessonView from './features/lessons/LessonView.tsx';

// Auth.
import RequireAuth from './features/auth/RequireAuth.tsx';
import LoginPage from './features/auth/LoginPage.tsx';
import AuthCallback from './features/auth/AuthCallback.tsx';

// Lazily-loaded legacy route manifest (replaces ~110 hand-wired routes).
import { pageRoutes, lessonRoutes, placeholderRoutes } from './app/routes.jsx';

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

        {/* 404 */}
        <Route path="*" element={<Placeholder title="Page not found" />} />
      </Route>
    </Routes>
  );
}
