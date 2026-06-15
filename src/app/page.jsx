import { fetchSSCNotices, fetchSarkariResultData, fetchPrivateJobs } from '../lib/scraper';
import HomeClient from './HomeClient';

// Force SSR for home page so search engine always gets fresh scraped jobs
export const revalidate = 0;

export default async function Home() {
  let initialJobs = { latestJobs: [], admitCards: [], results: [], privateJobs: [] };
  let initialNotices = [];

  try {
    const data = await fetchSarkariResultData(false);
    const pJobs = await fetchPrivateJobs(false);
    initialJobs = { ...data, privateJobs: pJobs };
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
