import { fetchSarkariResultData } from '../../lib/scraper';
import RajasthanJobsClient from './RajasthanJobsClient';

export const revalidate = 900; // Cache for 15 minutes

export const metadata = {
  title: 'Rajasthan Govt Jobs 2026 – RPSC, RSSB, Police | WeeklyNaukri',
  description: 'Apply for latest Rajasthan government job notifications 2026. Get RPSC, RSSB / RSMSSB, and Rajasthan Police vacancies at WeeklyNaukri.',
  alternates: {
    canonical: '/rajasthan-jobs-2026',
  },
  openGraph: {
    title: 'Rajasthan Govt Jobs 2026 – RPSC, RSSB, Police | WeeklyNaukri',
    description: 'Apply for latest Rajasthan government job notifications 2026. Get RPSC, RSSB / RSMSSB, and Rajasthan Police vacancies at WeeklyNaukri.',
    url: '/rajasthan-jobs-2026',
    type: 'website',
  },
};

const rajKeywords = [
  'rajasthan', 'rpsc', 'rssb', 'rsmssb', 'jaipur', 'jodhpur', 
  'udaipur', 'raj govt', 'reet', 'cet '
];

function isRajJob(job) {
  const text = `${job.title} ${job.org || ''} ${job.company || ''}`.toLowerCase();
  return rajKeywords.some(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b|${keyword}`, 'i');
    return regex.test(text);
  });
}

export default async function RajasthanJobsPage() {
  let filteredJobs = { latestJobs: [], admitCards: [], results: [] };

  try {
    const data = await fetchSarkariResultData(false);

    filteredJobs = {
      latestJobs: (data.latestJobs || []).filter(isRajJob),
      admitCards: (data.admitCards || []).filter(isRajJob),
      results: (data.results || []).filter(isRajJob)
    };
  } catch (err) {
    console.error("Rajasthan Govt Jobs Page server fetch error:", err.message);
  }

  return (
    <RajasthanJobsClient initialJobs={filteredJobs} />
  );
}
