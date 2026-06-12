import { fetchSSCNotices, fetchSarkariResultData } from '../lib/scraper';
import HomeClient from './HomeClient';

// Force SSR for home page so search engine always gets fresh scraped jobs
export const revalidate = 0;

export default async function Home() {
  let initialJobs = { latestJobs: [], admitCards: [], results: [] };
  let initialNotices = [];

  try {
    initialJobs = await fetchSarkariResultData(false);
    initialNotices = await fetchSSCNotices(false);
  } catch (err) {
    console.error("Home page Server Component fetch failure:", err.message);
  }

  return (
    <HomeClient 
      initialJobs={initialJobs} 
      initialNotices={initialNotices} 
    />
  );
}
