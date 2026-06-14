import { fetchSSCNotices, fetchSarkariResultData } from '../../lib/scraper';
import ItGovtJobsClient from './ItGovtJobsClient';

export const revalidate = 0;

export const metadata = {
  title: 'IT Government Jobs: Technical Govt Jobs — Weekly Naukri',
  description: 'Apply to the latest IT government jobs, software developer, system admin, and technical vacancies in public sector undertakings. Find active direct apply links.',
  alternates: {
    canonical: '/it-govt-jobs',
  },
  openGraph: {
    title: 'IT Government Jobs: Technical Govt Jobs — Weekly Naukri',
    description: 'Apply to the latest IT government jobs, software developer, system admin, and technical vacancies in public sector undertakings. Find active direct apply links.',
    url: '/it-govt-jobs',
    type: 'website',
  },
};

const techKeywords = [
  'it', 'tech', 'technical', 'software', 'computer', 'developer', 
  'programmer', 'network', 'unix', 'linux', 'systems', 'analyst',
  'information technology', 'bca', 'mca', 'b.tech', 'be', 'cse', 
  'database', 'support'
];

function isTechnicalJob(job) {
  const text = `${job.title} ${job.org || ''}`.toLowerCase();
  return techKeywords.some(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b|${keyword}`, 'i');
    return regex.test(text);
  });
}

export default async function ItGovtJobsPage() {
  let filteredJobs = { latestJobs: [], admitCards: [], results: [] };
  let filteredNotices = [];

  try {
    const data = await fetchSarkariResultData(false);
    const notices = await fetchSSCNotices(false);

    filteredJobs = {
      latestJobs: (data.latestJobs || []).filter(isTechnicalJob),
      admitCards: (data.admitCards || []).filter(isTechnicalJob),
      results: (data.results || []).filter(isTechnicalJob)
    };

    filteredNotices = (notices || []).filter(isTechnicalJob);
  } catch (err) {
    console.error("IT Govt Jobs Page server fetch error:", err.message);
  }

  return (
    <ItGovtJobsClient 
      initialJobs={filteredJobs} 
      initialNotices={filteredNotices} 
    />
  );
}
