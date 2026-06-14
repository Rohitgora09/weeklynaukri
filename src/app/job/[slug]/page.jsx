import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { 
  ArrowLeft, 
  Share2, 
  Calendar, 
  ExternalLink,
  IndianRupee
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { fetchSarkariJobDetails } from '../../../lib/scraper';
import JobPostingSchema from '../../../components/seo/JobPostingSchema';
import ShareButtonClient from './ShareButtonClient'; // Client side click handler for clipboard/share

// Import static fallback data
import { 
  latestJobs, 
  latestResults, 
  admitCards, 
  answerKeys, 
  admissions, 
  documents, 
  privateJobs 
} from '../../../data/jobs';

// Static lookup helper
function findStaticJob(idOrSlug) {
  const allData = [
    ...latestJobs, ...latestResults, ...admitCards, 
    ...answerKeys, ...admissions, ...documents, ...privateJobs
  ];
  return allData.find(item => item.id === idOrSlug || item.title?.toLowerCase().replace(/\s+/g, '-') === idOrSlug);
}

// Main logic to fetch job details (static or SQLite + scraped)
async function getJobData(slug) {
  // 1. Check static fallback data
  const staticJob = findStaticJob(slug);
  if (staticJob) {
    return { isStatic: true, job: staticJob };
  }

  // 2. Query Supabase Cache
  const { data: cached, error: cacheError } = await supabase
    .from('scraper_cache')
    .select('*')
    .or(`url_slug.eq.${slug},job_id.eq.${slug}`)
    .maybeSingle();

  if (cacheError || !cached) {
    return null;
  }

  // If already scraped detailed info is cached, return it
  if (cached.full_details_json) {
    try {
      const details = typeof cached.full_details_json === 'string'
        ? JSON.parse(cached.full_details_json)
        : cached.full_details_json;
      return {
        isStatic: false,
        job: {
          id: cached.job_id,
          slug: cached.url_slug,
          title: cached.title,
          org: cached.org || 'WeeklyNaukri.Com',
          status: cached.category === 'latestJobs' ? 'New' : (cached.category === 'results' ? 'Declared' : 'Available'),
          date: new Date(cached.scraped_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          source_url: cached.source_url,
          category: cached.category,
          ...details
        }
      };
    } catch (e) {
      console.error("Failed to parse cached details JSON:", e);
    }
  }

  // For private jobs, do not attempt to deep-scrape details on-demand
  if (cached.category === 'privateJobs') {
    return {
      isStatic: false,
      job: {
        id: cached.job_id,
        slug: cached.url_slug,
        title: cached.title,
        org: cached.org || 'WeeklyNaukri.Com',
        status: 'Available',
        date: 'Recent',
        source_url: cached.source_url,
        category: cached.category,
        links: { apply: cached.source_url, notification: cached.source_url, official: cached.source_url }
      }
    };
  }

  // If details aren't deep-cached yet, fetch them on-demand
  let details = null;
  try {
    console.log(`Deep scraping details on-demand for url: ${cached.source_url}`);
    details = await fetchSarkariJobDetails(cached.source_url);
  } catch (err) {
    console.error("Error deep scraping details on-demand:", err.message);
  }
  
  if (!details) {
    // Return summary only if scraping fails
    return {
      isStatic: false,
      job: {
        id: cached.job_id,
        slug: cached.url_slug,
        title: cached.title,
        org: cached.org || 'WeeklyNaukri.Com',
        status: 'Available',
        date: 'Recent',
        source_url: cached.source_url,
        category: cached.category,
        links: { apply: cached.source_url, notification: cached.source_url, official: cached.source_url }
      }
    };
  }

  // Update Supabase cache with detailed payload
  await supabase
    .from('scraper_cache')
    .update({ full_details_json: details })
    .eq('url_slug', cached.url_slug);

  return {
    isStatic: false,
    job: {
      id: cached.job_id,
      slug: cached.url_slug,
      title: cached.title,
      org: cached.org || 'WeeklyNaukri.Com',
      status: cached.category === 'latestJobs' ? 'New' : (cached.category === 'results' ? 'Declared' : 'Available'),
      date: new Date(cached.scraped_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      source_url: cached.source_url,
      category: cached.category,
      ...details
    }
  };
}

// Generate Server-Side Meta Data
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getJobData(slug);
  
  if (!data) {
    redirect('/');
  }

  const { job } = data;
  const isDetailedJob = !!job.fee;
  
  // Keep title concise and under 60 characters
  const rawTitle = isDetailedJob
    ? `${job.org} ${job.title} Form 2026`
    : `${job.title} 2026`;
  const cleanTitle = rawTitle.length > 47 ? `${rawTitle.slice(0, 44)}...` : rawTitle;
  const pageTitle = `${cleanTitle} — WeeklyNaukri`;

  // Keep meta description concise and under 155 characters
  const rawDesc = isDetailedJob
    ? `${job.org} ${job.title} (Vacancies: ${job.vacancies || 'N/A'}). Last Date: ${job.dates?.applyEnd || 'See info'}. Apply online & check details at WeeklyNaukri.`
    : `${job.title} 2026 - Check status, download notification, and get official links at WeeklyNaukri.com.`;
  const pageDescription = rawDesc.length > 153 ? `${rawDesc.slice(0, 150)}...` : rawDesc;

  const pageUrl = `https://weeklynaukri.com/job/${slug}`;
  const shareImage = 'https://weeklynaukri.com/logo.png';

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: pageUrl
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      type: 'article',
      siteName: 'WeeklyNaukri.com',
      images: [
        {
          url: shareImage,
          width: 1200,
          height: 630,
          alt: pageTitle
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [shareImage]
    }
  };
}

export default async function JobDetailsPage({ params }) {
  const { slug } = await params;
  const data = await getJobData(slug);

  if (!data) {
    redirect('/');
  }

  const { job } = data;
  const isDetailedJob = !!job.fee;

  // Fetch recent jobs for internal linking to avoid orphan pages
  let recentJobs = [];
  try {
    const { data: recentData, error: recentError } = await supabase
      .from('scraper_cache')
      .select('title, url_slug, org, category')
      .neq('url_slug', slug)
      .eq('category', 'latestJobs')
      .order('scraped_at', { ascending: false })
      .limit(6);

    if (!recentError && recentData) {
      recentJobs = recentData;
    }
  } catch (e) {
    console.error("Failed to query recent jobs for details widget:", e);
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Dynamic JSON-LD Structured Data Schema */}
      <JobPostingSchema job={job} />

      {/* Header Navigation Bar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <ShareButtonClient jobTitle={job.title} />
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 pt-6 md:pt-10">
        <div className="text-center mb-8">
          <h1 className="text-xl md:text-3xl font-extrabold text-blue-950 leading-tight mb-2 uppercase tracking-wide">
            {job.org} {job.title} Online Form 2026
          </h1>
          <h2 className="text-sm md:text-base font-bold text-amber-600 mb-2 uppercase tracking-wider">
            {job.org} / {job.company || 'Government'} Examination 2026 : Short Details
          </h2>
          <h3 className="text-md md:text-lg font-bold text-blue-900 uppercase">
            WeeklyNaukri.Com
          </h3>
        </div>

        {isDetailedJob ? (
          <div className="border border-gray-300 bg-white mb-8 rounded-lg overflow-hidden shadow-sm">
            
            {/* Important Dates & Fees splits */}
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-300">
              <div className="border-r-0 md:border-r border-b md:border-b-0 border-gray-300">
                <div className="bg-blue-950 text-white font-bold text-center py-2.5 text-sm uppercase">
                  Important Dates
                </div>
                <div className="p-5 text-sm space-y-2.5 text-gray-800">
                  <p><span className="font-semibold text-gray-600">Online Apply Start Date:</span> <span className="font-bold text-blue-900">{job.dates.applyStart}</span></p>
                  <p><span className="font-semibold text-gray-600">Online Apply Last Date:</span> <span className="font-bold text-amber-600">{job.dates.applyEnd}</span></p>
                  {job.dates.examDate && <p><span className="font-semibold text-gray-600">Exam Date:</span> <span className="font-bold text-blue-900">{job.dates.examDate}</span></p>}
                  <p><span className="font-semibold text-gray-600">Admit Card:</span> <span className="font-bold text-blue-900">Before Exam</span></p>
                  <p><span className="font-semibold text-gray-600">Result Date:</span> <span className="font-bold text-amber-600">Will Be Updated Here</span></p>
                </div>
              </div>

              <div>
                <div className="bg-blue-950 text-white font-bold text-center py-2.5 text-sm uppercase">
                  Application Fee
                </div>
                <div className="p-5 text-sm space-y-2 text-gray-800">
                  <p><span className="font-semibold text-gray-600">For General / OBC / EWS:</span> ₹ {job.fee.general}</p>
                  <p><span className="font-semibold text-gray-600">For SC / ST:</span> ₹ {job.fee.scSt}</p>
                  <p><span className="font-semibold text-gray-600">For Female Candidates:</span> ₹ {job.fee.women}</p>
                  <p className="font-bold mt-4 mb-1 border-t border-gray-150 pt-3 text-xs text-gray-500 uppercase">Payment Modes (Online Only):</p>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-gray-550">
                    <li>Credit / Debit Card</li>
                    <li>Internet Banking</li>
                    <li>UPI (GPay / PhonePe / BHIM)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Age Limit */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] border-b border-gray-300">
              <div className="border-r-0 md:border-r border-b md:border-b-0 border-gray-300">
                <div className="bg-blue-900 text-white font-bold text-center py-2 text-sm uppercase">
                  Age Limit (As of Notification)
                </div>
                <div className="p-5 text-sm space-y-2 text-gray-850">
                  <p><span className="font-semibold text-gray-500">Minimum Age Required:</span> {job.ageLimit.min}</p>
                  <p><span className="font-semibold text-gray-500">Maximum Age Allowed:</span> {job.ageLimit.max}</p>
                  <p className="text-xs text-gray-400 italic">Age Relaxation extra as per rules.</p>
                </div>
              </div>
              <div>
                <div className="bg-amber-600 text-white font-bold text-center py-2 text-sm uppercase">
                  Total Vacancies
                </div>
                <div className="p-5 flex items-center justify-center h-full min-h-[100px]">
                  <p className="text-xl font-bold text-gray-900">{job.vacancies}</p>
                </div>
              </div>
            </div>

            {/* Eligibility Table */}
            <div className="overflow-x-auto border-b border-gray-300">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-blue-950 text-white">
                    <th className="p-2.5 text-center text-xs font-bold uppercase border-r border-gray-300 w-1/3">Post Name</th>
                    <th className="p-2.5 text-center text-xs font-bold uppercase border-r border-gray-300 w-1/6">Total Posts</th>
                    <th className="p-2.5 text-center text-xs font-bold uppercase w-1/2">Eligibility Criteria</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-300">
                    <td className="p-4 text-sm font-semibold text-center border-r border-gray-300 text-blue-900">{job.title}</td>
                    <td className="p-4 text-sm text-center border-r border-gray-300 font-bold">{job.vacancies}</td>
                    <td className="p-4 text-xs text-gray-700 leading-relaxed">{job.eligibility}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* How to Fill Form */}
            <div className="border-b border-gray-300">
              <div className="bg-blue-950 text-white font-bold text-center py-2 text-sm uppercase">
                How To Fill Online Form
              </div>
              <ul className="list-disc pl-8 pr-6 py-5 text-xs space-y-2 text-gray-750 leading-relaxed">
                <li>Interested candidates can read full notifications and submit applications online before <span className="font-bold text-amber-600">{job.dates.applyEnd}</span>.</li>
                <li>Make sure to gather scans of all required documents (ID Proof, Photo, Signature, Eligibility marksheets) before initiating the application process.</li>
                <li>Preview and check all columns carefully before final submission of the application form.</li>
                <li className="text-red-600 font-semibold">Verify details such as age limit, qualification requirements, and payment status prior to submitting.</li>
              </ul>
            </div>

            {/* Selection details */}
            <div className="border-b border-gray-300 bg-gray-50/30">
              <div className="bg-blue-900 text-white font-bold text-center py-2 text-sm uppercase">
                Mode of Selection
              </div>
              <ul className="list-disc pl-8 py-3.5 text-xs text-gray-750">
                <li className="font-semibold">Computer Based Test (CBT) / Written Exam</li>
                <li>Document Verification</li>
              </ul>
            </div>

            {/* Useful Links Table */}
            <div>
              <div className="bg-blue-100 text-amber-600 font-bold text-center py-2 text-xs uppercase tracking-wider border-b border-gray-300">
                Useful Important Links
              </div>
              <table className="w-full text-left border-collapse">
                <tbody>
                  <tr className="border-b border-gray-300 hover:bg-gray-50/50">
                    <td className="p-3.5 text-xs font-bold text-blue-900 border-r border-gray-300 w-2/3">Apply Online</td>
                    <td className="p-3.5 text-center">
                      <a href={job.links?.apply || '#'} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-950 text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-800 transition-colors">
                        Click Here
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300 hover:bg-gray-50/50">
                    <td className="p-3.5 text-xs font-bold text-blue-900 border-r border-gray-300">Download Notification</td>
                    <td className="p-3.5 text-center">
                      <a href={job.links?.notification || '#'} target="_blank" rel="noopener noreferrer" className="inline-block bg-amber-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-amber-700 transition-colors">
                        Click Here
                      </a>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50">
                    <td className="p-3.5 text-xs font-bold text-blue-900 border-r border-gray-300">Official Website</td>
                    <td className="p-3.5 text-center">
                      <a href={job.links?.official || '#'} target="_blank" rel="noopener noreferrer" className="inline-block text-blue-700 font-bold hover:underline text-xs">
                        Click Here
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        ) : (
          /* Simplified Layout (Results, Admit Cards, etc.) */
          <div className="border border-gray-300 bg-white mb-8 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-blue-950 text-white font-bold text-center py-2.5 text-sm uppercase">
              Summary Information
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6 text-sm font-medium text-center leading-relaxed">
                This is a summary notification update. Please visit the official website or download the full notification below for complete details.
              </p>
              
              <div className="flex flex-col items-center gap-3 mb-8 text-sm border-y border-gray-250 py-4 bg-gray-50/50 rounded-xl">
                {job.examDate && <p className="text-gray-650"><strong className="text-blue-900">Exam Date:</strong> {job.examDate}</p>}
                {job.date && <p className="text-gray-650"><strong className="text-blue-900">Publish Date:</strong> {job.date}</p>}
                {job.status && <p className="text-gray-650"><strong className="text-blue-900">Current Status:</strong> <span className="text-amber-600 font-bold">{job.status}</span></p>}
              </div>

              {/* Useful Links Table */}
              <div className="border border-gray-300 rounded overflow-hidden">
                <div className="bg-blue-100 text-amber-600 font-bold text-center py-2 text-xs uppercase tracking-wider border-b border-gray-300">
                  Useful Important Links
                </div>
                <table className="w-full text-left border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-300 hover:bg-gray-50/50">
                      <td className="p-3.5 text-xs font-bold text-blue-900 border-r border-gray-300 w-2/3">Link / Download Page</td>
                      <td className="p-3.5 text-center">
                        <a href={job.links?.apply || '#'} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-950 text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-800 transition-colors">
                          Click Here
                        </a>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300 hover:bg-gray-50/50">
                      <td className="p-3.5 text-xs font-bold text-blue-900 border-r border-gray-300">Official Notification</td>
                      <td className="p-3.5 text-center">
                        <a href={job.links?.notification || '#'} target="_blank" rel="noopener noreferrer" className="inline-block bg-amber-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-amber-700 transition-colors">
                          Click Here
                        </a>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                      <td className="p-3.5 text-xs font-bold text-blue-900 border-r border-gray-300">Official Website</td>
                      <td className="p-3.5 text-center">
                        <a href={job.links?.official || '#'} target="_blank" rel="noopener noreferrer" className="inline-block text-blue-700 font-bold hover:underline text-xs">
                          Click Here
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

        {/* Community Alerts Widget */}
        <div className="mt-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1.5 justify-center sm:justify-start">📢 Never Miss an Update!</h4>
            <p className="text-xs text-gray-500 mt-1">Get the next Sarkari Result &amp; Job Alert directly on your phone.</p>
          </div>
          <div className="flex gap-3 shrink-0 w-full sm:w-auto justify-center">
            <a
              href="https://chat.whatsapp.com/GeHRdlojdjU7hurA2QCIT7"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Join WhatsApp
            </a>
            <a
              href="https://t.me/weekly_naukri"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Join Telegram
            </a>
          </div>
        </div>

        {/* Recent Government Job Openings Widget (SEO Internal Linking to eliminate orphan pages) */}
        {recentJobs.length > 0 && (
          <div className="mt-12 border border-gray-200 bg-gray-50/30 rounded-2xl p-6 md:p-8">
            <h4 className="font-extrabold text-blue-950 text-base mb-6 uppercase tracking-wider border-b border-gray-100 pb-3">
              Recent Government Job Openings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentJobs.map((rj, idx) => (
                <Link 
                  key={idx} 
                  href={`/job/${rj.url_slug}`} 
                  className="block bg-white p-4 rounded-xl border border-gray-200/80 hover:border-blue-500 hover:shadow-md transition-all group"
                >
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide truncate">{rj.org}</p>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1 mt-1">{rj.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
