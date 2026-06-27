import { fetchSarkariResultData } from '../../lib/scraper';
import StateJobsClient from '../../components/pages/StateJobsClient';

export const revalidate = 900; // Cache for 15 minutes

export const metadata = {
  title: 'Gujarat Govt Jobs 2026 – GPSC, GSSSB Vacancies | WeeklyNaukri',
  description: 'Apply for latest Gujarat government job notifications 2026. Get GPSC, GSSSB, and Gujarat Police vacancies at WeeklyNaukri.',
  alternates: {
    canonical: '/gujarat-govt-jobs-2026',
  },
  openGraph: {
    title: 'Gujarat Govt Jobs 2026 – GPSC, GSSSB Vacancies | WeeklyNaukri',
    description: 'Apply for latest Gujarat government job notifications 2026. Get GPSC, GSSSB, and Gujarat Police vacancies at WeeklyNaukri.',
    url: '/gujarat-govt-jobs-2026',
    type: 'website',
  },
};

const gujaratKeywords = [
  'gujarat', 'gpsc', 'gsssb', 'ahmedabad', 'gandhinagar',
  'surat', 'gujarat police', 'guj govt'
];

function isGujaratJob(job) {
  const text = `${job.title} ${job.org || ''} ${job.company || ''}`.toLowerCase();
  return gujaratKeywords.some(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b|${keyword}`, 'i');
    return regex.test(text);
  });
}

export default async function GujaratGovtJobsPage() {
  let filteredJobs = { latestJobs: [], admitCards: [], results: [] };

  try {
    const data = await fetchSarkariResultData(false);

    filteredJobs = {
      latestJobs: (data.latestJobs || []).filter(isGujaratJob),
      admitCards: (data.admitCards || []).filter(isGujaratJob),
      results: (data.results || []).filter(isGujaratJob)
    };
  } catch (err) {
    console.error("Gujarat Govt Jobs Page server fetch error:", err.message);
  }

  return (
    <StateJobsClient
      initialJobs={filteredJobs}
      stateName="Gujarat"
      stateShort="GPSC"
      year="2026"
      colorScheme={{
        primary: 'bg-rose-600',
        gradient: 'from-rose-900 to-pink-950',
        accent: 'text-rose-600',
        bg: 'from-rose-50/50',
        ring: 'focus:ring-rose-100 focus:border-rose-500',
        tagBg: 'bg-rose-50',
        tagText: 'text-rose-700',
      }}
      boards={[
        { name: 'GPSC (Public Service Commission)', status: 'Active', statusColor: 'green' },
        { name: 'GSSSB (Subordinate Service Selection)', status: 'Active', statusColor: 'green' },
        { name: 'Gujarat Police Department', status: 'Active', statusColor: 'green' },
        { name: 'GSERB (Education Board)', status: 'Upcoming', statusColor: 'orange' },
      ]}
      highlights={[
        'Covers GPSC Class 1-2 and Deputy Section Officer exam notifications.',
        'GSSSB Clerk, Head Clerk, and Bin Sachivalay recruitment updates.',
        'Gujarat Police Constable (LRD) and Lokrakshak vacancy alerts.',
      ]}
      heroDescription="Find the latest government job vacancies, exam schedules, admit cards, and results for Gujarat recruitment boards — all in one place."
    />
  );
}
