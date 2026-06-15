import { fetchSSCNotices, fetchSarkariResultData, fetchPrivateJobs } from '../lib/scraper';
import HomeClient from './HomeClient';

// Force SSR for home page so search engine always gets fresh scraped jobs
export const revalidate = 0;

export const metadata = {
  title: 'Latest Govt Jobs & Sarkari Result 2026 | WeeklyNaukri',
  description: "India's trusted portal for latest government jobs, sarkari result, admit cards & answer keys. Updated daily. SSC, UPSC, Railway, Banking & more.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Latest Govt Jobs & Sarkari Result 2026 | WeeklyNaukri',
    description: "India's trusted portal for latest government jobs, sarkari result, admit cards & answer keys. Updated daily. SSC, UPSC, Railway, Banking & more.",
    url: 'https://weeklynaukri.com/',
    type: 'website',
    siteName: 'WeeklyNaukri.com',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'WeeklyNaukri — Latest Govt Jobs & Sarkari Result 2026' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latest Govt Jobs & Sarkari Result 2026 | WeeklyNaukri',
    description: "India's trusted portal for latest government jobs, sarkari result, admit cards & answer keys. Updated daily. SSC, UPSC, Railway, Banking & more.",
    images: ['/og-image.png'],
  },
};

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
