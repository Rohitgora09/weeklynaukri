import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Card from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { mockTestSeriesList } from '../../data/mockTests';
import { blogPosts } from '../../data/blog';

export const revalidate = 3600; // Cache sitemap page for 1 hour

export const metadata = {
  title: 'HTML Sitemap: Complete Index of Sarkari Jobs & Results — WeeklyNaukri',
  description: 'Access the complete sitemap index of WeeklyNaukri.com. Find all government jobs, admit cards, exam results, syllabus keys, test series, and blog updates.',
  alternates: {
    canonical: '/sitemap'
  }
};

export default async function SitemapPage() {
  // Fetch all scraped jobs
  let scrapedItems = [];
  try {
    const { data } = await supabase
      .from('scraper_cache')
      .select('title, url_slug, category, org')
      .order('scraped_at', { ascending: false });
    scrapedItems = data || [];
  } catch (e) {
    console.error("Failed to fetch sitemap items:", e);
  }

  // Group items by category
  const categories = {
    latestJobs: { title: 'Latest Govt Jobs', items: [] },
    results: { title: 'Sarkari Results', items: [] },
    admitCards: { title: 'Admit Cards', items: [] },
    answerKeys: { title: 'Answer Keys', items: [] },
    notices: { title: 'SSC Notices & Notifications', items: [] },
    admissions: { title: 'Admissions & Openings', items: [] },
    documents: { title: 'Documents & Verification', items: [] },
    privateJobs: { title: 'Private Sector IT Careers', items: [] }
  };

  scrapedItems.forEach(item => {
    if (categories[item.category]) {
      categories[item.category].items.push(item);
    }
  });

  const staticPages = [
    { name: 'Home Portal', path: '/' },
    { name: 'Latest Government Jobs', path: '/latest-jobs' },
    { name: 'Sarkari Exam Results', path: '/results' },
    { name: 'Admit Card Downloads', path: '/admit-cards' },
    { name: 'Answer Keys & Objections', path: '/answer-keys' },
    { name: 'IT & Technical Govt Jobs', path: '/it-govt-jobs' },
    { name: 'Free Online Mock Test Series', path: '/test-series' },
    { name: 'Job Referrals Board', path: '/referrals' },
    { name: 'Career Prep Blog', path: '/blog' },
    { name: 'Official Exam Syllabus PDF Vault', path: '/syllabus' },
    { name: 'Remote Jobs Career Guide', path: '/remote-jobs-guide' },
    { name: 'Frequently Asked Questions', path: '/faq' },
    { name: 'About WeeklyNaukri', path: '/about' },
    { name: 'Contact Help Desk', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy-policy' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">HTML Sitemap</h1>
          <p className="text-gray-500 text-sm">Quick access directory listing all pages, mock tests, blog posts, and active job alerts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Static Pages Link Block */}
          <Card padding="p-6" hover={true}>
            <h2 className="font-extrabold text-blue-950 text-base mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide">Portal Pages</h2>
            <ul className="space-y-2 text-sm">
              {staticPages.map((page, idx) => (
                <li key={idx}>
                  <Link href={page.path} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium">
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          {/* Test Series Block */}
          <Card padding="p-6" hover={true}>
            <h2 className="font-extrabold text-blue-950 text-base mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide">Test Series</h2>
            <ul className="space-y-2 text-sm">
              {mockTestSeriesList.map((series) => (
                <li key={series.id}>
                  <Link href={`/test-series/${series.id}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium">
                    {series.title} Practice Exam
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          {/* Blog posts Block */}
          <Card padding="p-6" hover={true}>
            <h2 className="font-extrabold text-blue-950 text-base mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide">Study Guides & Blog</h2>
            <ul className="space-y-2 text-sm">
              {blogPosts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium">
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          {/* Scraped categories Block */}
          {Object.entries(categories).map(([key, category]) => {
            if (category.items.length === 0) return null;
            return (
              <Card key={key} padding="p-6" hover={true}>
                <h2 className="font-extrabold text-blue-950 text-base mb-4 border-b border-gray-100 pb-2 uppercase tracking-wide">
                  {category.title} ({category.items.length})
                </h2>
                <ul className="space-y-2 text-xs max-h-72 overflow-y-auto pr-2">
                  {category.items.map((item, idx) => (
                    <li key={idx}>
                      <Link href={`/job/${item.url_slug}`} className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium line-clamp-2">
                        <span className="text-gray-500 font-semibold">{item.org}:</span> {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}

        </div>
      </main>

      <Footer />
    </div>
  );
}
