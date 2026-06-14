import { fetchSarkariResultData } from '../../lib/scraper';
import LatestJobsClient from './LatestJobsClient';

export const revalidate = 0;

export const metadata = {
  title: 'Latest Govt Jobs 2026: Sarkari Naukri Vacancy Updates — WeeklyNaukri',
  description: 'Apply for the latest government jobs in India. Find Sarkari Naukri vacancies from SSC, UPSC, Railway, Bank, Defence, and State recruitment boards with direct apply links at WeeklyNaukri.com.',
  keywords: [
    'Latest Govt Jobs',
    'Sarkari Naukri',
    'Government Jobs 2026',
    'Govt Vacancy',
    'Free Job Alert',
    'SSC Jobs',
    'UPSC Jobs',
    'Railway Jobs'
  ],
  alternates: {
    canonical: '/latest-jobs',
  },
};

export default async function LatestJobsPage() {
  let latestJobs = [];

  try {
    const data = await fetchSarkariResultData(false);
    latestJobs = data.latestJobs || [];
  } catch (err) {
    console.error("Latest Jobs Page server fetch error:", err.message);
  }

  return (
    <LatestJobsClient initialJobs={latestJobs} />
  );
}
