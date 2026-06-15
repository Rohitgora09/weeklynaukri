import { fetchSarkariResultData } from '../../lib/scraper';
import { answerKeys } from '../../data/jobs';
import AnswerKeysClient from './AnswerKeysClient';

export const revalidate = 0;

export const metadata = {
  title: 'Answer Key 2026: Latest Sarkari Answer Keys — WeeklyNaukri',
  description: 'Check and download official answer keys for SSC, UPSC, Railway, and State government exams. Raise objections and verify your answers at WeeklyNaukri.com.',
  alternates: {
    canonical: '/answer-keys',
  },
  openGraph: {
    title: 'Answer Key 2026: Latest Sarkari Answer Keys — WeeklyNaukri',
    description: 'Check and download official answer keys for SSC, UPSC, Railway, and State government exams. Raise objections and verify your answers at WeeklyNaukri.com.',
    url: '/answer-keys',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Answer Key 2026 — WeeklyNaukri' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Answer Key 2026: Latest Sarkari Answer Keys — WeeklyNaukri',
    description: 'Check and download official answer keys for SSC, UPSC, Railway, and State government exams. Raise objections and verify your answers at WeeklyNaukri.com.',
    images: ['/og-image.png'],
  },
};

export default async function AnswerKeysPage() {
  let scraperData = { latestJobs: [], admitCards: [], results: [] };

  try {
    scraperData = await fetchSarkariResultData(false);
  } catch (err) {
    console.error("Answer Keys Page server fetch error:", err.message);
  }

  return (
    <AnswerKeysClient
      initialJobs={scraperData}
      answerKeys={answerKeys}
    />
  );
}
