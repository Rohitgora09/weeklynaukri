import { fetchSarkariResultData } from '../../lib/scraper';
import ResultsClient from './ResultsClient';

export const revalidate = 0;

export const metadata = {
  title: 'Sarkari Result 2026: Govt Exam Results — WeeklyNaukri',
  description: 'Check latest Sarkari Result 2026. Download scorecards, merit lists, and cut-off marks for SSC, UPSC, Railway, and Bank exams at WeeklyNaukri.com.',
  alternates: {
    canonical: '/results',
  },
  openGraph: {
    title: 'Sarkari Result 2026: Govt Exam Results — WeeklyNaukri',
    description: 'Check latest Sarkari Result 2026. Download scorecards, merit lists, and cut-off marks for SSC, UPSC, Railway, and Bank exams at WeeklyNaukri.com.',
    url: '/results',
    type: 'website',
  },
};

export default async function ResultsPage() {
  let results = [];

  try {
    const data = await fetchSarkariResultData(false);
    results = data.results || [];
  } catch (err) {
    console.error("Results Page server fetch error:", err.message);
  }

  return (
    <ResultsClient initialResults={results} />
  );
}
