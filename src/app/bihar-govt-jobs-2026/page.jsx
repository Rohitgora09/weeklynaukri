import { fetchSarkariResultData } from '../../lib/scraper';
import StateJobsClient from '../../components/pages/StateJobsClient';

export const revalidate = 900; // Cache for 15 minutes

export const metadata = {
  title: 'Bihar Govt Jobs 2026 – BPSC, BSSC, BCECE Vacancies | WeeklyNaukri',
  description: 'Apply for latest Bihar government job notifications 2026. Get BPSC, BSSC, BCECE, and Bihar Police vacancies at WeeklyNaukri.',
  alternates: {
    canonical: '/bihar-govt-jobs-2026',
  },
  openGraph: {
    title: 'Bihar Govt Jobs 2026 – BPSC, BSSC, BCECE Vacancies | WeeklyNaukri',
    description: 'Apply for latest Bihar government job notifications 2026. Get BPSC, BSSC, BCECE, and Bihar Police vacancies at WeeklyNaukri.',
    url: '/bihar-govt-jobs-2026',
    type: 'website',
  },
};

const biharKeywords = [
  'bihar', 'bpsc', 'bssc', 'bcece', 'patna',
  'bihar police', 'stet', 'btet'
];

function isBiharJob(job) {
  const text = `${job.title} ${job.org || ''} ${job.company || ''}`.toLowerCase();
  return biharKeywords.some(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b|${keyword}`, 'i');
    return regex.test(text);
  });
}

export default async function BiharGovtJobsPage() {
  let filteredJobs = { latestJobs: [], admitCards: [], results: [] };

  try {
    const data = await fetchSarkariResultData(false);

    filteredJobs = {
      latestJobs: (data.latestJobs || []).filter(isBiharJob),
      admitCards: (data.admitCards || []).filter(isBiharJob),
      results: (data.results || []).filter(isBiharJob)
    };
  } catch (err) {
    console.error("Bihar Govt Jobs Page server fetch error:", err.message);
  }

  return (
    <StateJobsClient
      initialJobs={filteredJobs}
      stateName="Bihar"
      stateShort="BPSC"
      year="2026"
      colorScheme={{
        primary: 'bg-green-600',
        gradient: 'from-green-900 to-emerald-950',
        accent: 'text-green-600',
        bg: 'from-green-50/50',
        ring: 'focus:ring-green-100 focus:border-green-500',
        tagBg: 'bg-green-50',
        tagText: 'text-green-700',
      }}
      boards={[
        { name: 'BPSC (Public Service Commission)', status: 'Active', statusColor: 'green' },
        { name: 'BSSC (Staff Selection Commission)', status: 'Active', statusColor: 'green' },
        { name: 'BCECE (Combined Entrance)', status: 'Active', statusColor: 'blue' },
        { name: 'Bihar Police Department', status: 'Active', statusColor: 'green' },
      ]}
      highlights={[
        'Covers BPSC Civil Service and Judicial Service exam notifications.',
        'BSSC Inter-level and Graduate-level recruitment updates.',
        'Bihar Police Constable, SI, and Fireman vacancy alerts.',
      ]}
      heroDescription="Find the latest government job vacancies, exam schedules, admit cards, and results for Bihar recruitment boards — all in one place."
    />
  );
}
