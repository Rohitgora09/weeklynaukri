import { fetchSarkariResultData } from '../../lib/scraper';
import AdmitCardsClient from './AdmitCardsClient';

export const revalidate = 0;

export const metadata = {
  title: 'Admit Card 2026: Download Sarkari Admit Cards — WeeklyNaukri',
  description: 'Download latest admit cards for SSC, UPSC, Railway, and Bank exams. Get direct hall ticket download links and exam date updates at WeeklyNaukri.com.',
  alternates: {
    canonical: '/admit-cards',
  },
  openGraph: {
    title: 'Admit Card 2026: Download Sarkari Admit Cards — WeeklyNaukri',
    description: 'Download latest admit cards for SSC, UPSC, Railway, and Bank exams. Get direct hall ticket download links and exam date updates at WeeklyNaukri.com.',
    url: '/admit-cards',
    type: 'website',
  },
};

export default async function AdmitCardsPage() {
  let admitCards = [];

  try {
    const data = await fetchSarkariResultData(false);
    admitCards = data.admitCards || [];
  } catch (err) {
    console.error("Admit Cards Page server fetch error:", err.message);
  }

  return (
    <AdmitCardsClient initialAdmitCards={admitCards} />
  );
}
