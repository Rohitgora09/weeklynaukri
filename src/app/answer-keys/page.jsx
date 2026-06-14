import { fetchSarkariResultData } from '../../lib/scraper';
import { answerKeys } from '../../data/jobs';
import AnswerKeysClient from './AnswerKeysClient';

export const revalidate = 0;

export const metadata = {
  title: 'Answer Key 2026: Latest Sarkari Exam Answer Keys — WeeklyNaukri',
  description: 'Check and download official answer keys for SSC, UPSC, Railway, and State government exams. Raise objections and verify your answers at WeeklyNaukri.com.',
  keywords: [
    'Answer Key',
    'Answer Key 2026',
    'Sarkari Exam Answer Key',
    'SSC Answer Key',
    'UPSC Answer Key',
    'Objection Link'
  ],
  alternates: {
    canonical: '/answer-keys',
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
