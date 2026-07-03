import { fetchSSCNotices, fetchSarkariResultData } from '../../lib/scraper';
import ItGovtJobsClient from './ItGovtJobsClient';

export const revalidate = 900; // Cache for 15 minutes

export const metadata = {
  title: 'IT Govt Jobs India 2026 – Tech & Software | WeeklyNaukri',
  description: "Find IT & software government jobs in India 2026. NIC, DRDO, ISRO, PSU tech & programmer vacancies. India's only dedicated Govt Tech Jobs section.",
  alternates: {
    canonical: '/it-government-jobs-2026',
  },
  openGraph: {
    title: 'IT Govt Jobs India 2026 – Tech & Software | WeeklyNaukri',
    description: "Find IT & software government jobs in India 2026. NIC, DRDO, ISRO, PSU tech & programmer vacancies. India's only dedicated Govt Tech Jobs section.",
    url: '/it-government-jobs-2026',
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

export default async function ItGovernmentJobsPage() {
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
    console.error("IT Govt Jobs 2026 Page server fetch error:", err.message);
  }

  return (
    <ItGovtJobsClient 
      initialJobs={filteredJobs} 
      initialNotices={filteredNotices} 
    />
  );
}
