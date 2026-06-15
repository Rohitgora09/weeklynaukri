import { fetchSarkariResultData } from '../../lib/scraper';
import LatestJobsClient from './LatestJobsClient';

export const revalidate = 0;

export const metadata = {
  title: 'Latest Govt Jobs 2026: Sarkari Naukri — WeeklyNaukri',
  description: 'Apply for latest government jobs in India. Find Sarkari Naukri vacancies from SSC, UPSC, Railway, and Bank with direct links at WeeklyNaukri.',
  alternates: {
    canonical: '/latest-jobs',
  },
  openGraph: {
    title: 'Latest Govt Jobs 2026: Sarkari Naukri — WeeklyNaukri',
    description: 'Apply for latest government jobs in India. Find Sarkari Naukri vacancies from SSC, UPSC, Railway, and Bank with direct links at WeeklyNaukri.',
    url: '/latest-jobs',
    type: 'website',
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

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': latestJobs.map((job, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'url': `https://weeklynaukri.com/job/${job.url_slug || job.slug || job.id}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <LatestJobsClient initialJobs={latestJobs} />
    </>
  );
}
