import { fetchSarkariResultData } from '../../lib/scraper';
import AdmitCardsClient from './AdmitCardsClient';

export const revalidate = 0;

export const metadata = {
  title: 'Admit Card 2026: Download Latest Sarkari Exam Admit Cards — WeeklyNaukri',
  description: 'Download latest admit cards for SSC, UPSC, Railway, Bank, and State government exams. Get direct hall ticket download links and exam date updates at WeeklyNaukri.com.',
  keywords: [
    'Admit Card',
    'Admit Card 2026',
    'Hall Ticket Download',
    'Sarkari Exam Admit Card',
    'SSC Admit Card',
    'UPSC Admit Card',
    'Railway Admit Card'
  ],
  alternates: {
    canonical: '/admit-cards',
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
