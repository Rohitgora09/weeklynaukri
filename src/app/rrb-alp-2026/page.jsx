import Link from 'next/link';
import { redirect } from 'next/navigation';
import { 
  ArrowLeft, 
  Share2, 
  Calendar, 
  ExternalLink,
  IndianRupee
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import JobPostingSchema from '../../components/seo/JobPostingSchema';
import ShareButtonClient from '../job/[slug]/ShareButtonClient';

export const revalidate = 3600; // Cache for 1 hour

const faqData = [
  {
    question: 'What is the eligibility for RRB ALP 2026?',
    answer: 'Candidates must possess Matriculation/SSLC plus ITI (NCVT/SCVT) in relevant trades, OR a 3-year Diploma in Mechanical/Electrical/Electronics/Automobile Engineering, OR an Engineering Degree in these disciplines.'
  },
  {
    question: 'What is the vision standard for RRB ALP 2026?',
    answer: 'Candidates must meet the A-1 medical standard. This includes distant vision of 6/6, 6/6 without glasses, near vision of Sn 0.6, 0.6 without glasses, and passing color, binocular, field, and night vision tests.'
  },
  {
    question: 'Is the RRB ALP application fee refundable?',
    answer: 'Yes. For General/OBC candidates, ₹400 out of the ₹500 fee is refunded after appearing in Stage-I CBT. For SC/ST/Female/EBC/Ex-Servicemen, the full ₹250 fee is refunded after Stage-I CBT.'
  },
  {
    question: 'What is the selection process for RRB ALP 2026?',
    answer: 'The selection process consists of five stages: First Stage CBT (CBT-1), Second Stage CBT (CBT-2), Computer Based Aptitude Test (CBAT), Document Verification (DV), and Medical Examination.'
  }
];

async function getRrbAlpData() {
  try {
    const { data: cached, error } = await supabase
      .from('scraper_cache')
      .select('*')
      .eq('url_slug', 'railway-rrb-alp-online-form-2026-11127-posts-last-date-today')
      .maybeSingle();

    if (!error && cached) {
      const details = typeof cached.full_details_json === 'string'
        ? JSON.parse(cached.full_details_json)
        : cached.full_details_json || {};

      return {
        id: cached.job_id,
        slug: 'rrb-alp-2026',
        title: 'RRB ALP Online Form 2026 – 11,127 Posts',
        org: cached.org || 'Railway Recruitment Board',
        status: 'Available',
        date: new Date(cached.scraped_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        category: 'latestJobs',
        fee: {
          general: '₹500 (₹400 Refundable)',
          scSt: '₹250 (Full Refundable)',
          women: '₹250 (Full Refundable)'
        },
        dates: {
          applyStart: details.dates?.applyStart || '15 May 2026',
          applyEnd: details.dates?.applyEnd || '14 June 2026',
          examDate: details.dates?.examDate || 'Notify Later'
        },
        ageLimit: {
          min: details.ageLimit?.min || '18 Years',
          max: details.ageLimit?.max || '30 Years',
          relaxation: details.ageLimit?.relaxation || 'As per rules'
        },
        vacancies: '11,127',
        eligibility: 'Class 10th / Matriculation plus ITI (NCVT/SCVT) in relevant trades, OR 3 Years Diploma in Mechanical / Electrical / Electronics / Automobile Engineering, OR Degree in relevant Engineering streams.',
        links: {
          apply: details.links?.apply || 'https://www.rrbapply.gov.in/',
          notification: details.links?.notification || 'https://indianrailways.gov.in/',
          official: details.links?.official || 'https://indianrailways.gov.in/'
        }
      };
    }
  } catch (e) {
    console.error("Error fetching RRB ALP from Supabase:", e);
  }
  return {
    id: 'rrb-alp-2026',
    slug: 'rrb-alp-2026',
    title: 'RRB ALP Online Form 2026 – 11,127 Posts',
    org: 'Railway Recruitment Board (RRB)',
    vacancies: '11,127',
    fee: { general: '₹500 (₹400 Refundable)', scSt: '₹250 (Full Refundable)', women: '₹250 (Full Refundable)' },
    dates: { applyStart: '15 May 2026', applyEnd: '14 June 2026', examDate: 'Notify Later' },
    ageLimit: { min: '18 Years', max: '30 Years', relaxation: 'As per rules' },
    eligibility: 'Class 10th / Matriculation plus ITI (NCVT/SCVT) in relevant trades, OR 3 Years Diploma in Mechanical / Electrical / Electronics / Automobile Engineering, OR Degree in relevant Engineering streams.',
    links: { apply: 'https://www.rrbapply.gov.in/', notification: 'https://indianrailways.gov.in/', official: 'https://indianrailways.gov.in/' }
  };
}

export async function generateMetadata() {
  const pageTitle = 'RRB ALP Online Form 2026 – 11,127 Posts | WeeklyNaukri';
  const pageDescription = 'Railway RRB ALP 2026 – Apply for 11,127 Loco Pilot posts. Check eligibility, last date & direct official apply link on WeeklyNaukri.';
  const pageUrl = 'https://weeklynaukri.com/rrb-alp-2026';
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

export default async function RrbAlpPage() {
  const job = await getRrbAlpData();

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  // Fetch recent jobs for internal linking
  let recentJobs = [];
  try {
    const { data: recentData, error: recentError } = await supabase
      .from('scraper_cache')
      .select('title, url_slug, org, category')
      .eq('category', 'latestJobs')
      .order('scraped_at', { ascending: false })
      .limit(6);

    if (!recentError && recentData) {
      recentJobs = recentData;
    }
  } catch (e) {
    console.error("Failed to query recent jobs for RRB ALP page widget:", e);
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Structured Schema Markup */}
      <JobPostingSchema job={job} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header Navigation Bar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <ShareButtonClient jobTitle={job.title} />
        </div>
      </nav>

      {/* Breadcrumbs */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-6 text-xs text-gray-550 flex items-center gap-1.5">
        <Link href="/" className="hover:text-blue-700 transition-colors">Home</Link>
        <span className="text-gray-300">/</span>
        <Link href="/latest-jobs" className="hover:text-blue-700 transition-colors">Latest Jobs</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-700 font-medium">RRB ALP 2026</span>
      </div>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 pt-4">
        <div className="text-center mb-8">
          <h1 className="text-xl md:text-3xl font-extrabold text-blue-950 leading-tight mb-2 uppercase tracking-wide">
            {job.org} {job.title}
          </h1>
          <h2 className="text-sm md:text-base font-bold text-amber-600 mb-2 uppercase tracking-wider">
            {job.org} Assistant Loco Pilot (ALP) CEN 01/2026 : Online Details
          </h2>
          <h3 className="text-md md:text-lg font-bold text-blue-900 uppercase">
            WeeklyNaukri.Com
          </h3>
        </div>

        <div className="border border-gray-300 bg-white mb-8 rounded-lg overflow-hidden shadow-sm">
          {/* Important Dates & Fees */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-300">
            <div className="border-r-0 md:border-r border-b md:border-b-0 border-gray-300">
              <div className="bg-blue-950 text-white font-bold text-center py-2.5 text-sm uppercase">
                Important Dates
              </div>
              <div className="p-5 text-sm space-y-2.5 text-gray-800">
                <p><span className="font-semibold text-gray-600">Online Apply Start Date:</span> <span className="font-bold text-blue-900">{job.dates.applyStart}</span></p>
                <p><span className="font-semibold text-gray-600">Online Apply Last Date:</span> <span className="font-bold text-amber-600">{job.dates.applyEnd}</span></p>
                <p><span className="font-semibold text-gray-600">Exam Date:</span> <span className="font-bold text-blue-900">{job.dates.examDate}</span></p>
                <p><span className="font-semibold text-gray-600">Admit Card:</span> <span className="font-bold text-blue-900">Before Exam</span></p>
                <p><span className="font-semibold text-gray-600">Result Date:</span> <span className="font-bold text-amber-600">Will Be Updated Here</span></p>
              </div>
            </div>

            <div>
              <div className="bg-blue-950 text-white font-bold text-center py-2.5 text-sm uppercase">
                Application Fee (Refundable)
              </div>
              <div className="p-5 text-sm space-y-2 text-gray-800">
                <p><span className="font-semibold text-gray-600">For General / OBC:</span> {job.fee.general}</p>
                <p><span className="font-semibold text-gray-600">For SC / ST / Ex-Servicemen:</span> {job.fee.scSt}</p>
                <p><span className="font-semibold text-gray-600">For Female / Transgender / EBC:</span> {job.fee.women}</p>
                <p className="font-bold mt-4 mb-1 border-t border-gray-150 pt-3 text-xs text-gray-550 uppercase">Refund Terms:</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Fee refund is processed by RRB only after candidates appear in the Stage-I CBT examination. Ensure correct bank details are submitted during registration.
                </p>
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
                <p className="text-xs text-gray-400 italic">Age Relaxation extra as per RRB rules.</p>
              </div>
            </div>
            <div>
              <div className="bg-amber-600 text-white font-bold text-center py-2 text-sm uppercase">
                Total Vacancies
              </div>
              <div className="p-5 flex items-center justify-center h-full min-h-[100px]">
                <p className="text-xl font-bold text-gray-900">{job.vacancies} Posts</p>
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

          {/* Vision and Medical Standards */}
          <div className="border-b border-gray-300">
            <div className="bg-blue-900 text-white font-bold text-center py-2 text-sm uppercase">
              A-1 Vision &amp; Medical Standards
            </div>
            <ul className="list-disc pl-8 pr-6 py-5 text-xs space-y-2 text-gray-750 leading-relaxed">
              <li><strong className="text-blue-950">Medical Classification:</strong> Must be A-1 category (physically fit in all respects).</li>
              <li><strong className="text-blue-950">Distant Vision:</strong> 6/6, 6/6 without glasses (with fogging test, must not accept +2D).</li>
              <li><strong className="text-blue-950">Near Vision:</strong> Sn: 0.6, 0.6 without glasses.</li>
              <li><strong className="text-blue-950">Mandatory Vision Tests:</strong> Must pass tests for Colour Vision, Binocular Vision, Field of Vision, and Night Vision.</li>
            </ul>
          </div>

          {/* How to Fill Form */}
          <div className="border-b border-gray-300">
            <div className="bg-blue-950 text-white font-bold text-center py-2 text-sm uppercase">
              How To Fill Online Form
            </div>
            <ul className="list-disc pl-8 pr-6 py-5 text-xs space-y-2 text-gray-750 leading-relaxed">
              <li>Create your login credentials on the official RRB online recruitment portal (`www.rrbapply.gov.in`).</li>
              <li>Read CEN 01/2026 instruction brochure carefully before filling up details.</li>
              <li>Upload passport size color photograph (white background) and signature according to exact dimensions.</li>
              <li>Fill up qualifications details (Matriculation/ITI/Diploma/Degree) and select your preferred RRB Zone carefully. Zone once chosen cannot be changed.</li>
              <li>Pay the application fee and take a printout of the final application receipt for future reference.</li>
            </ul>
          </div>

          {/* Selection details */}
          <div className="border-b border-gray-300 bg-gray-50/30">
            <div className="bg-blue-900 text-white font-bold text-center py-2 text-sm uppercase">
              Mode of Selection
            </div>
            <ul className="list-disc pl-8 py-3.5 text-xs text-gray-750">
              <li className="font-semibold">First Stage Computer Based Test (CBT-1)</li>
              <li className="font-semibold">Second Stage Computer Based Test (CBT-2)</li>
              <li className="font-semibold">Computer Based Aptitude Test (CBAT / Psycho Test)</li>
              <li>Document Verification (DV) &amp; Medical Examination (ME)</li>
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
                  <td className="p-3.5 text-xs font-bold text-blue-900 border-r border-gray-300 w-2/3">Apply Online (RRB Apply Portal)</td>
                  <td className="p-3.5 text-center">
                    <a href={job.links.apply} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-950 text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-800 transition-colors">
                      Click Here
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-gray-300 hover:bg-gray-50/50">
                  <td className="p-3.5 text-xs font-bold text-blue-900 border-r border-gray-300">Download Official CEN 01/2026 Notification</td>
                  <td className="p-3.5 text-center">
                    <a href={job.links.notification} target="_blank" rel="noopener noreferrer" className="inline-block bg-amber-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-amber-700 transition-colors">
                      Click Here
                    </a>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="p-3.5 text-xs font-bold text-blue-900 border-r border-gray-300">Official Railway Recruitment Board Website</td>
                  <td className="p-3.5 text-center">
                    <a href={job.links.official} target="_blank" rel="noopener noreferrer" className="inline-block text-blue-700 font-bold hover:underline text-xs">
                      Click Here
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h3 className="font-extrabold text-blue-950 text-lg mb-6 uppercase tracking-wider border-b border-gray-100 pb-3">
            Frequently Asked Questions (FAQs)
          </h3>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-50/50 border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition-colors">
                <h4 className="font-bold text-gray-800 text-sm mb-2">Q. {faq.question}</h4>
                <p className="text-xs text-gray-650 leading-relaxed">A. {faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Community Alerts Widget */}
        <div className="mt-12 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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

        {/* Quick SEO Cross-Linking Widget */}
        <div className="mt-8 border border-gray-200 bg-white rounded-2xl p-6 shadow-sm">
          <h4 className="font-extrabold text-blue-950 text-xs mb-4 uppercase tracking-wider">
            Quick Navigation Shortcuts
          </h4>
          <div className="grid grid-cols-3 gap-3 text-center text-xs font-bold">
            <Link href="/results" className="p-3 bg-green-50 border border-green-100 hover:border-green-300 text-green-700 rounded-xl transition-all">
              Latest Results 2026
            </Link>
            <Link href="/admit-cards" className="p-3 bg-orange-50 border border-orange-100 hover:border-orange-300 text-orange-700 rounded-xl transition-all">
              Download Admit Cards
            </Link>
            <Link href="/answer-keys" className="p-3 bg-purple-50 border border-purple-100 hover:border-purple-300 text-purple-700 rounded-xl transition-all">
              Exam Answer Keys
            </Link>
          </div>
        </div>

        {/* Recent Government Job Openings */}
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
