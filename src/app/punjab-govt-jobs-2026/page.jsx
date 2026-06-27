import { fetchSarkariResultData } from '../../lib/scraper';
import StateJobsClient from '../../components/pages/StateJobsClient';

export const revalidate = 900; // Cache for 15 minutes

export const metadata = {
  title: 'Punjab Govt Jobs 2026 – PPSC, PSSSB Vacancies | WeeklyNaukri',
  description: 'Apply for latest Punjab government job notifications 2026. Get PPSC, PSSSB, and Punjab Police vacancies at WeeklyNaukri.',
  alternates: {
    canonical: '/punjab-govt-jobs-2026',
  },
  openGraph: {
    title: 'Punjab Govt Jobs 2026 – PPSC, PSSSB Vacancies | WeeklyNaukri',
    description: 'Apply for latest Punjab government job notifications 2026. Get PPSC, PSSSB, and Punjab Police vacancies at WeeklyNaukri.',
    url: '/punjab-govt-jobs-2026',
    type: 'website',
  },
};

const punjabKeywords = [
  'punjab', 'ppsc', 'psssb', 'ludhiana', 'amritsar',
  'jalandhar', 'punjab police', 'ptet'
];

function isPunjabJob(job) {
  const text = `${job.title} ${job.org || ''} ${job.company || ''}`.toLowerCase();
  return punjabKeywords.some(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b|${keyword}`, 'i');
    return regex.test(text);
  });
}

export default async function PunjabGovtJobsPage() {
  let filteredJobs = { latestJobs: [], admitCards: [], results: [] };

  try {
    const data = await fetchSarkariResultData(false);

    filteredJobs = {
      latestJobs: (data.latestJobs || []).filter(isPunjabJob),
      admitCards: (data.admitCards || []).filter(isPunjabJob),
      results: (data.results || []).filter(isPunjabJob)
    };
  } catch (err) {
    console.error("Punjab Govt Jobs Page server fetch error:", err.message);
  }

  return (
    <StateJobsClient
      initialJobs={filteredJobs}
      stateName="Punjab"
      stateShort="PPSC"
      year="2026"
      colorScheme={{
        primary: 'bg-violet-600',
        gradient: 'from-violet-900 to-purple-950',
        accent: 'text-violet-600',
        bg: 'from-violet-50/50',
        ring: 'focus:ring-violet-100 focus:border-violet-500',
        tagBg: 'bg-violet-50',
        tagText: 'text-violet-700',
      }}
      boards={[
        { name: 'PPSC (Public Service Commission)', status: 'Active', statusColor: 'green' },
        { name: 'PSSSB (Subordinate Services Selection)', status: 'Active', statusColor: 'green' },
        { name: 'Punjab Police Department', status: 'Active', statusColor: 'green' },
        { name: 'PSEB (School Education Board)', status: 'Upcoming', statusColor: 'orange' },
      ]}
      highlights={[
        'Covers PPSC Civil Service and Judicial Service exam notifications.',
        'PSSSB Clerk, Patwari, and Technical recruitment updates.',
        'Punjab Police Constable and Sub-Inspector vacancy alerts.',
      ]}
      heroDescription="Find the latest government job vacancies, exam schedules, admit cards, and results for Punjab recruitment boards — all in one place."
    />
  );
}
