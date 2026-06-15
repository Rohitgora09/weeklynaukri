import { supabase } from '../../lib/supabase';
import { 
  latestJobs, 
  latestResults, 
  admitCards, 
  answerKeys, 
  admissions, 
  documents, 
  privateJobs 
} from '../../data/jobs';
import { mockTestSeriesList } from '../../data/mockTests';
import { blogPosts } from '../../data/blog';


export const revalidate = 3600; // Cache sitemap for 1 hour

export async function GET() {
  try {
    const staticPages = [
      '',
      '/contact',
      '/privacy-policy',
      '/about',
      '/referrals',
      '/it-govt-jobs',
      '/test-series',
      '/faq',
      '/remote-jobs-guide',
      '/results',
      '/admit-cards',
      '/answer-keys',
      '/latest-jobs',
      '/blog',
      '/ssc-cgl-2026',
      '/rrb-alp-2026',
      '/it-government-jobs-2026',
      '/up-govt-jobs-2026',
      '/exam-calendar',
      '/rajasthan-jobs-2026',
      '/syllabus',
      '/ssc-gd-2026'
    ];

    const staticUrls = staticPages.map(page => ({
      loc: `https://weeklynaukri.com${page}`,
      changefreq: page === '' ? 'daily' : 'monthly',
      priority: page === '' ? '1.0' : '0.5'
    }));

    // Get all dynamic scraped jobs from Supabase Cache
    const { data: dynamicJobsData, error: dynamicJobsError } = await supabase
      .from('scraper_cache')
      .select('url_slug, scraped_at')
      .order('scraped_at', { ascending: false });

    if (dynamicJobsError) throw dynamicJobsError;

    const dynamicJobs = dynamicJobsData || [];

    const dynamicJobUrls = dynamicJobs
      .filter(job => job.url_slug && job.url_slug.trim() !== '')
      .map(job => ({
        loc: `https://weeklynaukri.com/job/${job.url_slug}`,
        lastmod: job.scraped_at ? new Date(job.scraped_at).toISOString().split('T')[0] : null,
        changefreq: 'weekly',
        priority: '0.9'
      }));

    const testSeriesUrls = mockTestSeriesList.map(series => ({
      loc: `https://weeklynaukri.com/test-series/${series.id}`,
      changefreq: 'weekly',
      priority: '0.8'
    }));

    const blogUrls = blogPosts.map(post => ({
      loc: `https://weeklynaukri.com/blog/${post.slug}`,
      changefreq: 'weekly',
      priority: '0.7'
    }));

    const allUrls = [...staticUrls, ...dynamicJobUrls, ...testSeriesUrls, ...blogUrls];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8'
      }
    });
  } catch (err) {
    console.error("Sitemap generation failure:", err.message);
    return new Response('Failed to generate sitemap', { status: 500 });
  }
}

