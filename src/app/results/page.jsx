import { fetchSarkariResultData } from '../../lib/scraper';
import ResultsClient from './ResultsClient';

export const revalidate = 0;

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
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Sarkari Result 2026 — WeeklyNaukri' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sarkari Result 2026 – Latest Govt Exam Results | WeeklyNaukri',
    description: 'Check all latest Sarkari Results 2026. SSC, RRB, UPSC, Banking, Police & State exams – scorecards, cut-offs & merit lists updated instantly.',
    images: ['/og-image.png'],
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
