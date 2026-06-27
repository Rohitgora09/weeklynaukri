import { fetchSarkariResultData } from '../../lib/scraper';
import StateJobsClient from '../../components/pages/StateJobsClient';

export const revalidate = 900; // Cache for 15 minutes

export const metadata = {
  title: 'Jharkhand Govt Jobs 2026 – JPSC, JSSC Vacancies | WeeklyNaukri',
  description: 'Apply for latest Jharkhand government job notifications 2026. Get JPSC, JSSC, and Jharkhand Police vacancies at WeeklyNaukri.',
  alternates: {
    canonical: '/jharkhand-govt-jobs-2026',
  },
  openGraph: {
    title: 'Jharkhand Govt Jobs 2026 – JPSC, JSSC Vacancies | WeeklyNaukri',
    description: 'Apply for latest Jharkhand government job notifications 2026. Get JPSC, JSSC, and Jharkhand Police vacancies at WeeklyNaukri.',
    url: '/jharkhand-govt-jobs-2026',
    type: 'website',
  },
};

const jharkhandKeywords = [
  'jharkhand', 'jpsc', 'jssc', 'ranchi', 'jamshedpur',
  'jharkhand police', 'jtet'
];

function isJharkhandJob(job) {
  const text = `${job.title} ${job.org || ''} ${job.company || ''}`.toLowerCase();
  return jharkhandKeywords.some(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b|${keyword}`, 'i');
    return regex.test(text);
  });
}

export default async function JharkhandGovtJobsPage() {
  let filteredJobs = { latestJobs: [], admitCards: [], results: [] };

  try {
    const data = await fetchSarkariResultData(false);

    filteredJobs = {
      latestJobs: (data.latestJobs || []).filter(isJharkhandJob),
      admitCards: (data.admitCards || []).filter(isJharkhandJob),
      results: (data.results || []).filter(isJharkhandJob)
    };
  } catch (err) {
    console.error("Jharkhand Govt Jobs Page server fetch error:", err.message);
  }

  return (
    <StateJobsClient
      initialJobs={filteredJobs}
      stateName="Jharkhand"
      stateShort="JPSC"
      year="2026"
      colorScheme={{
        primary: 'bg-sky-600',
        gradient: 'from-sky-900 to-blue-950',
        accent: 'text-sky-600',
        bg: 'from-sky-50/50',
        ring: 'focus:ring-sky-100 focus:border-sky-500',
        tagBg: 'bg-sky-50',
        tagText: 'text-sky-700',
      }}
      boards={[
        { name: 'JPSC (Public Service Commission)', status: 'Active', statusColor: 'green' },
        { name: 'JSSC (Staff Selection Commission)', status: 'Active', statusColor: 'green' },
        { name: 'Jharkhand Police Department', status: 'Active', statusColor: 'green' },
        { name: 'JAC Board (Academic Council)', status: 'Upcoming', statusColor: 'orange' },
      ]}
      highlights={[
        'Covers JPSC Civil Service and Combined Civil Service exam notifications.',
        'JSSC CGL, Inter-level, and Excise Constable recruitment updates.',
        'Jharkhand Police Constable and Sub-Inspector vacancy alerts.',
      ]}
      heroDescription="Find the latest government job vacancies, exam schedules, admit cards, and results for Jharkhand recruitment boards — all in one place."
    />
  );
}
