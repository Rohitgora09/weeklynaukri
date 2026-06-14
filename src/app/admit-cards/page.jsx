import { fetchSarkariResultData } from '../../lib/scraper';
import AdmitCardsClient from './AdmitCardsClient';

export const revalidate = 0;

export const metadata = {
  title: 'Admit Card 2026 – Download Govt Hall Tickets | WeeklyNaukri',
  description: 'Download admit cards & hall tickets for SSC, RRB, UPSC, IBPS, Police & State PSC exams 2026. Instant updates on WeeklyNaukri.',
  alternates: {
    canonical: '/admit-cards',
  },
  openGraph: {
    title: 'Admit Card 2026 – Download Govt Hall Tickets | WeeklyNaukri',
    description: 'Download admit cards & hall tickets for SSC, RRB, UPSC, IBPS, Police & State PSC exams 2026. Instant updates on WeeklyNaukri.',
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
