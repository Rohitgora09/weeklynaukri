import { fetchSarkariResultData } from '../../lib/scraper';
import ResultsClient from './ResultsClient';

export const revalidate = 0;

export const metadata = {
  title: 'Sarkari Result 2026: Latest Government Exam Results — WeeklyNaukri',
  description: 'Check latest Sarkari Result 2026. Download scorecard, merit list, and cut-off marks for SSC, UPSC, Railway, Bank, and State government exams at WeeklyNaukri.com.',
  keywords: [
    'Sarkari Result',
    'Sarkari Result 2026',
    'Government Exam Result',
    'SSC Result',
    'UPSC Result',
    'Railway Result',
    'Naukri Result'
  ],
  alternates: {
    canonical: '/results',
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
