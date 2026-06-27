import { fetchSarkariResultData } from '../../lib/scraper';
import StateJobsClient from '../../components/pages/StateJobsClient';

export const revalidate = 900; // Cache for 15 minutes

export const metadata = {
  title: 'MP Govt Jobs 2026 – MPPSC, MPESB, Vyapam Vacancies | WeeklyNaukri',
  description: 'Apply for latest Madhya Pradesh government job notifications 2026. Get MPPSC, MPESB, Vyapam, and MP Police vacancies at WeeklyNaukri.',
  alternates: {
    canonical: '/mp-govt-jobs-2026',
  },
  openGraph: {
    title: 'MP Govt Jobs 2026 – MPPSC, MPESB, Vyapam Vacancies | WeeklyNaukri',
    description: 'Apply for latest Madhya Pradesh government job notifications 2026. Get MPPSC, MPESB, Vyapam, and MP Police vacancies at WeeklyNaukri.',
    url: '/mp-govt-jobs-2026',
    type: 'website',
  },
};

const mpKeywords = [
  'madhya pradesh', 'mppsc', 'mpesb', 'vyapam', 'mp govt',
  'bhopal', 'indore', 'gwalior', 'jabalpur', 'mp police'
];

function isMPJob(job) {
  const text = `${job.title} ${job.org || ''} ${job.company || ''}`.toLowerCase();
  return mpKeywords.some(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b|${keyword}`, 'i');
    return regex.test(text);
  });
}

export default async function MPGovtJobsPage() {
  let filteredJobs = { latestJobs: [], admitCards: [], results: [] };

  try {
    const data = await fetchSarkariResultData(false);

    filteredJobs = {
      latestJobs: (data.latestJobs || []).filter(isMPJob),
      admitCards: (data.admitCards || []).filter(isMPJob),
      results: (data.results || []).filter(isMPJob)
    };
  } catch (err) {
    console.error("MP Govt Jobs Page server fetch error:", err.message);
  }

  return (
    <StateJobsClient
      initialJobs={filteredJobs}
      stateName="Madhya Pradesh"
      stateShort="MP"
      year="2026"
      colorScheme={{
        primary: 'bg-indigo-600',
        gradient: 'from-indigo-900 to-blue-950',
        accent: 'text-indigo-600',
        bg: 'from-indigo-50/50',
        ring: 'focus:ring-indigo-100 focus:border-indigo-500',
        tagBg: 'bg-indigo-50',
        tagText: 'text-indigo-700',
      }}
      boards={[
        { name: 'MPPSC (Public Service Commission)', status: 'Active', statusColor: 'green' },
        { name: 'MPESB / Vyapam (Staff Selection)', status: 'Active', statusColor: 'green' },
        { name: 'MP Police Department', status: 'Active', statusColor: 'green' },
        { name: 'MP High Court', status: 'Upcoming', statusColor: 'orange' },
      ]}
      highlights={[
        'Covers MPPSC State Service and Forest Service exam notifications.',
        'MPESB / Vyapam Group 1-5 recruitment and result updates.',
        'MP Police Constable and Sub-Inspector vacancy alerts.',
      ]}
      heroDescription="Find the latest government job vacancies, exam schedules, admit cards, and results for Madhya Pradesh recruitment boards — all in one place."
    />
  );
}
