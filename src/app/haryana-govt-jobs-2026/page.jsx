import { fetchSarkariResultData } from '../../lib/scraper';
import StateJobsClient from '../../components/pages/StateJobsClient';

export const revalidate = 900; // Cache for 15 minutes

export const metadata = {
  title: 'Haryana Govt Jobs 2026 – HSSC, HCS Vacancies | WeeklyNaukri',
  description: 'Apply for latest Haryana government job notifications 2026. Get HSSC, HPSC, HCS, and Haryana Police vacancies at WeeklyNaukri.',
  alternates: {
    canonical: '/haryana-govt-jobs-2026',
  },
  openGraph: {
    title: 'Haryana Govt Jobs 2026 – HSSC, HCS Vacancies | WeeklyNaukri',
    description: 'Apply for latest Haryana government job notifications 2026. Get HSSC, HPSC, HCS, and Haryana Police vacancies at WeeklyNaukri.',
    url: '/haryana-govt-jobs-2026',
    type: 'website',
  },
};

const haryanaKeywords = [
  'haryana', 'hssc', 'hcs', 'hpsc', 'panchkula',
  'chandigarh', 'haryana police', 'htet'
];

function isHaryanaJob(job) {
  const text = `${job.title} ${job.org || ''} ${job.company || ''}`.toLowerCase();
  return haryanaKeywords.some(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b|${keyword}`, 'i');
    return regex.test(text);
  });
}

export default async function HaryanaGovtJobsPage() {
  let filteredJobs = { latestJobs: [], admitCards: [], results: [] };

  try {
    const data = await fetchSarkariResultData(false);

    filteredJobs = {
      latestJobs: (data.latestJobs || []).filter(isHaryanaJob),
      admitCards: (data.admitCards || []).filter(isHaryanaJob),
      results: (data.results || []).filter(isHaryanaJob)
    };
  } catch (err) {
    console.error("Haryana Govt Jobs Page server fetch error:", err.message);
  }

  return (
    <StateJobsClient
      initialJobs={filteredJobs}
      stateName="Haryana"
      stateShort="HSSC"
      year="2026"
      colorScheme={{
        primary: 'bg-teal-600',
        gradient: 'from-teal-900 to-cyan-950',
        accent: 'text-teal-600',
        bg: 'from-teal-50/50',
        ring: 'focus:ring-teal-100 focus:border-teal-500',
        tagBg: 'bg-teal-50',
        tagText: 'text-teal-700',
      }}
      boards={[
        { name: 'HSSC (Staff Selection Commission)', status: 'Active', statusColor: 'green' },
        { name: 'HPSC / HCS (Civil Service)', status: 'Active', statusColor: 'green' },
        { name: 'Haryana Police Department', status: 'Active', statusColor: 'green' },
        { name: 'HTET (Teachers Eligibility Test)', status: 'Upcoming', statusColor: 'orange' },
      ]}
      highlights={[
        'Covers HSSC Group C & D and CET-based recruitment notifications.',
        'HPSC HCS Prelims & Mains examination updates.',
        'Haryana Police Constable and Sub-Inspector vacancy alerts.',
      ]}
      heroDescription="Find the latest government job vacancies, exam schedules, admit cards, and results for Haryana recruitment boards — all in one place."
    />
  );
}
