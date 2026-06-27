import { fetchSarkariResultData } from '../../lib/scraper';
import StateJobsClient from '../../components/pages/StateJobsClient';

export const revalidate = 900; // Cache for 15 minutes

export const metadata = {
  title: 'Chhattisgarh Govt Jobs 2026 – CGPSC, CG Vyapam Vacancies | WeeklyNaukri',
  description: 'Apply for latest Chhattisgarh government job notifications 2026. Get CGPSC, CG Vyapam, and CG Police vacancies at WeeklyNaukri.',
  alternates: {
    canonical: '/chhattisgarh-govt-jobs-2026',
  },
  openGraph: {
    title: 'Chhattisgarh Govt Jobs 2026 – CGPSC, CG Vyapam Vacancies | WeeklyNaukri',
    description: 'Apply for latest Chhattisgarh government job notifications 2026. Get CGPSC, CG Vyapam, and CG Police vacancies at WeeklyNaukri.',
    url: '/chhattisgarh-govt-jobs-2026',
    type: 'website',
  },
};

const cgKeywords = [
  'chhattisgarh', 'cgpsc', 'cg vyapam', 'raipur',
  'bilaspur', 'cg police', 'cg govt'
];

function isCGJob(job) {
  const text = `${job.title} ${job.org || ''} ${job.company || ''}`.toLowerCase();
  return cgKeywords.some(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b|${keyword}`, 'i');
    return regex.test(text);
  });
}

export default async function ChhattisgarhGovtJobsPage() {
  let filteredJobs = { latestJobs: [], admitCards: [], results: [] };

  try {
    const data = await fetchSarkariResultData(false);

    filteredJobs = {
      latestJobs: (data.latestJobs || []).filter(isCGJob),
      admitCards: (data.admitCards || []).filter(isCGJob),
      results: (data.results || []).filter(isCGJob)
    };
  } catch (err) {
    console.error("Chhattisgarh Govt Jobs Page server fetch error:", err.message);
  }

  return (
    <StateJobsClient
      initialJobs={filteredJobs}
      stateName="Chhattisgarh"
      stateShort="CGPSC"
      year="2026"
      colorScheme={{
        primary: 'bg-lime-600',
        gradient: 'from-lime-900 to-green-950',
        accent: 'text-lime-600',
        bg: 'from-lime-50/50',
        ring: 'focus:ring-lime-100 focus:border-lime-500',
        tagBg: 'bg-lime-50',
        tagText: 'text-lime-700',
      }}
      boards={[
        { name: 'CGPSC (Public Service Commission)', status: 'Active', statusColor: 'green' },
        { name: 'CG Vyapam (Professional Examination Board)', status: 'Active', statusColor: 'green' },
        { name: 'CG Police Department', status: 'Active', statusColor: 'green' },
        { name: 'CG Board (School Education)', status: 'Upcoming', statusColor: 'orange' },
      ]}
      highlights={[
        'Covers CGPSC State Service and Forest Service exam notifications.',
        'CG Vyapam Patwari, TET, and B.Ed entrance recruitment updates.',
        'CG Police Constable and Sub-Inspector vacancy alerts.',
      ]}
      heroDescription="Find the latest government job vacancies, exam schedules, admit cards, and results for Chhattisgarh recruitment boards — all in one place."
    />
  );
}
