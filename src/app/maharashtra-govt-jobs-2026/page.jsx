import { fetchSarkariResultData } from '../../lib/scraper';
import StateJobsClient from '../../components/pages/StateJobsClient';

export const revalidate = 900; // Cache for 15 minutes

export const metadata = {
  title: 'Maharashtra Govt Jobs 2026 – MPSC, Mumbai, Pune Vacancies | WeeklyNaukri',
  description: 'Apply for latest Maharashtra government job notifications 2026. Get MPSC, Mumbai, Pune, and Maharashtra Police vacancies at WeeklyNaukri.',
  alternates: {
    canonical: '/maharashtra-govt-jobs-2026',
  },
  openGraph: {
    title: 'Maharashtra Govt Jobs 2026 – MPSC, Mumbai, Pune Vacancies | WeeklyNaukri',
    description: 'Apply for latest Maharashtra government job notifications 2026. Get MPSC, Mumbai, Pune, and Maharashtra Police vacancies at WeeklyNaukri.',
    url: '/maharashtra-govt-jobs-2026',
    type: 'website',
  },
};

const maharashtraKeywords = [
  'maharashtra', 'mpsc', 'mumbai', 'pune', 'nagpur',
  'thane', 'maha govt', 'maharashtra police'
];

function isMaharashtraJob(job) {
  const text = `${job.title} ${job.org || ''} ${job.company || ''}`.toLowerCase();
  return maharashtraKeywords.some(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b|${keyword}`, 'i');
    return regex.test(text);
  });
}

export default async function MaharashtraGovtJobsPage() {
  let filteredJobs = { latestJobs: [], admitCards: [], results: [] };

  try {
    const data = await fetchSarkariResultData(false);

    filteredJobs = {
      latestJobs: (data.latestJobs || []).filter(isMaharashtraJob),
      admitCards: (data.admitCards || []).filter(isMaharashtraJob),
      results: (data.results || []).filter(isMaharashtraJob)
    };
  } catch (err) {
    console.error("Maharashtra Govt Jobs Page server fetch error:", err.message);
  }

  return (
    <StateJobsClient
      initialJobs={filteredJobs}
      stateName="Maharashtra"
      stateShort="MPSC"
      year="2026"
      colorScheme={{
        primary: 'bg-orange-600',
        gradient: 'from-orange-900 to-red-950',
        accent: 'text-orange-600',
        bg: 'from-orange-50/50',
        ring: 'focus:ring-orange-100 focus:border-orange-500',
        tagBg: 'bg-orange-50',
        tagText: 'text-orange-700',
      }}
      boards={[
        { name: 'MPSC (Public Service Commission)', status: 'Active', statusColor: 'green' },
        { name: 'Maharashtra Police Department', status: 'Active', statusColor: 'green' },
        { name: 'Mumbai Municipal Corporation', status: 'Active', statusColor: 'blue' },
        { name: 'Maha Revenue Department', status: 'Upcoming', statusColor: 'orange' },
      ]}
      highlights={[
        'Covers MPSC State Service and Engineering Service exam notifications.',
        'Mumbai Municipal Corporation and Pune civic body recruitment updates.',
        'Maharashtra Police Constable and Sub-Inspector vacancy alerts.',
      ]}
      heroDescription="Find the latest government job vacancies, exam schedules, admit cards, and results for Maharashtra recruitment boards — all in one place."
    />
  );
}
