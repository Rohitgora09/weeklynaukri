import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

const Home = React.lazy(() => import('./pages/Home'));
const JobDetails = React.lazy(() => import('./pages/JobDetails'));
const Contact = React.lazy(() => import('./pages/Contact'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Referrals = React.lazy(() => import('./pages/Referrals'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const AboutUs = React.lazy(() => import('./pages/AboutUs'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

// Page View Tracker Component
function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pathname: location.pathname,
          referrer: document.referrer || 'direct',
          screenWidth: window.innerWidth,
          userAgent: navigator.userAgent
        })
      }).catch(err => console.warn("Analytics hit skipped:", err.message));
    } catch (e) {
      console.warn("Analytics tracker error:", e);
    }
  }, [location.pathname]);

  return null;
}

export default function App() {
  // Pre-seed local storage default credentials description on load to aid testing
  useEffect(() => {
    if (!localStorage.getItem('users_seeded_notice')) {
      console.log("WeeklyNaukri: Admin pre-seeded on backend: admin@weeklynaukri.com / admin123");
      localStorage.setItem('users_seeded_notice', 'true');
    }
  }, []);

  return (
    <Router>
      <AnalyticsTracker />
      <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>}>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/referrals" element={<Referrals />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
