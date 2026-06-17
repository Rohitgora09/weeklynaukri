import { fetchSarkariResultData } from '../../lib/scraper';
import UpGovtJobsClient from './UpGovtJobsClient';

export const revalidate = 900; // Cache for 15 minutes

export const metadata = {
  title: 'UP Govt Jobs 2026 – UPSSSC, UPPSC, Police | WeeklyNaukri',
  description: 'All Uttar Pradesh government job notifications 2026 at one place. UPSSSC, UPPSC, UP Police, TGT & more. Apply online at WeeklyNaukri.',
  alternates: {
    canonical: '/up-govt-jobs-2026',
  },
  openGraph: {
    title: 'UP Govt Jobs 2026 – UPSSSC, UPPSC, Police | WeeklyNaukri',
    description: 'All Uttar Pradesh government job notifications 2026 at one place. UPSSSC, UPPSC, UP Police, TGT & more. Apply online at WeeklyNaukri.',
    url: '/up-govt-jobs-2026',
    type: 'website',
  },
};

const upKeywords = [
  'up ', 'up-', 'up.', 'uttar pradesh', 'upssssc', 'uppsc', 'up police', 
  'upmsp', 'tgt', 'pgt', 'lucknow', 'kanpur', 'prayagraj', 'varanasi', 
  'noida', 'lekhpal', 'vdo', 'pet exam', 'uppbpb', 'allahabad'
];

function isUPJob(job) {
  const text = `${job.title} ${job.org || ''} ${job.company || ''}`.toLowerCase();
  return upKeywords.some(keyword => {
    // Word boundary or substring search for UP specific boards
    if (keyword === 'up ' || keyword === 'up-' || keyword === 'up.') {
      return text.includes(keyword) || text.startsWith('up');
    }
    const regex = new RegExp(`\\b${keyword}\\b|${keyword}`, 'i');
    return regex.test(text);
  });
}

export default async function UpGovtJobsPage() {
  let filteredJobs = { latestJobs: [], admitCards: [], results: [] };

  try {
    const data = await fetchSarkariResultData(false);

    filteredJobs = {
      latestJobs: (data.latestJobs || []).filter(isUPJob),
      admitCards: (data.admitCards || []).filter(isUPJob),
      results: (data.results || []).filter(isUPJob)
    };
  } catch (err) {
    console.error("UP Govt Jobs Page server fetch error:", err.message);
  }

  return (
    <UpGovtJobsClient initialJobs={filteredJobs} />
  );
}
