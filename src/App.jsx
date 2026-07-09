import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Eager shell + first-paint page.
import Layout from './layout/Layout.jsx';
import Home from './pages/Home.jsx';
import Placeholder from './shared/ui/Placeholder.jsx';

// Data-driven Academy (spine-driven, lazy bodies).

// Auth.
import RequireAuth from './features/auth/RequireAuth.tsx';
import LoginPage from './features/auth/LoginPage.tsx';
import AuthCallback from './features/auth/AuthCallback.tsx';

// Lazily-loaded legacy route manifest (replaces ~110 hand-wired routes).
import { pageRoutes, lessonRoutes, placeholderRoutes, legacyCourseRedirects } from './app/routes.jsx';

// Code-split feature routes (Suspense boundary lives in Layout).
const LearnHome = React.lazy(() => import('./features/curriculum/LearnHome.tsx'));
const LearnLayout = React.lazy(() => import('./features/curriculum/LearnLayout.tsx'));
const Onboarding = React.lazy(() => import('./features/onboarding/Onboarding.tsx'));
const Review = React.lazy(() => import('./features/review/Review.tsx'));
const Exam = React.lazy(() => import('./features/exam/Exam.tsx'));
const CourseView = React.lazy(() => import('./features/curriculum/CourseView.tsx'));
const LessonView = React.lazy(() => import('./features/lessons/LessonView.tsx'));
const SimulatorHome = React.lazy(() => import('./features/scenario/SimulatorHome.tsx'));
const ScenarioPlayer = React.lazy(() => import('./features/scenario/ScenarioPlayer.tsx'));
const LabsHome = React.lazy(() => import('./features/labs/LabsHome.tsx'));
const LabPlayer = React.lazy(() => import('./features/labs/LabPlayer.tsx'));
const InterviewPrep = React.lazy(() => import('./features/interview/InterviewPrep.tsx'));
const Analytics = React.lazy(() => import('./features/analytics/Analytics.tsx'));
const Certificates = React.lazy(() => import('./features/certificates/Certificates.tsx'));
const DocPractice = React.lazy(() => import('./features/docs/DocPractice.tsx'));
const VerifyCertificate = React.lazy(() => import('./features/certificates/VerifyCertificate.tsx'));

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
        <Route path="verify/:code" element={<VerifyCertificate />} />

        {/* Data-driven Academy — requires authentication */}
        <Route element={<RequireAuth />}>
          <Route path="welcome" element={<Onboarding />} />
          <Route path="review" element={<Review />} />
          <Route path="exam" element={<Exam />} />
          <Route path="learn" element={<LearnLayout />}>
            <Route index element={<LearnHome />} />
            <Route path=":courseSlug" element={<CourseView />} />
            <Route path=":courseSlug/:lessonSlug" element={<LessonView />} />
          </Route>
          <Route path="simulator" element={<SimulatorHome />} />
          <Route path="simulator/:slug" element={<ScenarioPlayer />} />
          <Route path="labs" element={<LabsHome />} />
          <Route path="labs/:slug" element={<LabPlayer />} />
          <Route path="interview" element={<InterviewPrep />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="practice" element={<DocPractice />} />
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
