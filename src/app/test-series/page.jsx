import TestSeriesClient from './TestSeriesClient';

export const metadata = {
  title: 'Free Mock Tests & Test Series Online 2026 - WeeklyNaukri',
  description: 'Practice free full-length mock tests and sectional speed sheets for SSC CGL, RRB NTPC, Banking, and other Sarkari exams. Check detailed analysis & solutions.',
  alternates: {
    canonical: '/test-series',
  },
  openGraph: {
    title: 'Free Mock Tests & Test Series Online 2026 - WeeklyNaukri',
    description: 'Practice free full-length mock tests and sectional speed sheets for SSC CGL, RRB NTPC, Banking, and other Sarkari exams. Check detailed analysis & solutions.',
    url: '/test-series',
    type: 'website',
  },
};

export default function TestSeriesPage() {
  return <TestSeriesClient />;
}
