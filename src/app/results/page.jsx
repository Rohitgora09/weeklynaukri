import { fetchSarkariResultData } from '../../lib/scraper';
import ResultsClient from './ResultsClient';

export const revalidate = 900; // Cache for 15 minutes

export const metadata = {
  title: 'Sarkari Result 2026 – Latest Govt Exam Results | WeeklyNaukri',
  description: 'Check all latest Sarkari Results 2026. SSC, RRB, UPSC, Banking, Police & State exams – scorecards, cut-offs & merit lists updated instantly.',
  alternates: {
    canonical: '/results',
  },
  openGraph: {
    title: 'Sarkari Result 2026 – Latest Govt Exam Results | WeeklyNaukri',
    description: 'Check all latest Sarkari Results 2026. SSC, RRB, UPSC, Banking, Police & State exams – scorecards, cut-offs & merit lists updated instantly.',
    url: '/results',
    type: 'website',
  },
};

export default async function ResultsPage() {
  let results = [];

  try {
    const data = await fetchSarkariResultData(false);
    results = data.results || [];
  } catch (err) {
    console.error("Results Page server fetch error:", err.message);
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': results.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'url': `https://weeklynaukri.com/job/${item.url_slug || item.slug || item.id}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <ResultsClient initialResults={results} />
    </>
  );
}
