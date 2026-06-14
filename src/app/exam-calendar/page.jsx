import Link from 'next/link';
import { ArrowLeft, Calendar, Bell, ExternalLink, MapPin } from 'lucide-react';

export const revalidate = 86400; // Cache for 24 hours

export const metadata = {
  title: 'Govt Exam Calendar 2026-27 | WeeklyNaukri',
  description: 'Complete government exam calendar 2026-27 for SSC, UPSC, Railway, IBPS, State PSC & Defence exams. Never miss an exam date.',
  alternates: {
    canonical: '/exam-calendar',
  },
  openGraph: {
    title: 'Govt Exam Calendar 2026-27 | WeeklyNaukri',
    description: 'Complete government exam calendar 2026-27 for SSC, UPSC, Railway, IBPS, State PSC & Defence exams. Never miss an exam date.',
    url: '/exam-calendar',
    type: 'website',
  },
};

const examEvents = [
  {
    name: 'UPSC Civil Services Prelims 2026',
    dateText: '26 Sep 2026',
    startDate: '2026-09-26',
    endDate: '2026-09-26',
    board: 'UPSC',
    status: 'Scheduled',
    link: 'https://upsc.gov.in',
    desc: 'Union Public Service Commission Civil Services (IAS/IPS) Preliminary Examination 2026.'
  },
  {
    name: 'SSC CGL Tier-I Exam 2026',
    dateText: '15 Aug 2026',
    startDate: '2026-08-15',
    endDate: '2026-09-15',
    board: 'SSC',
    status: 'Scheduled',
    link: 'https://ssc.gov.in',
    desc: 'Staff Selection Commission Combined Graduate Level Examination Tier-I 2026.'
  },
  {
    name: 'RRB NTPC CBT-1 Exam 2026',
    dateText: '10 Oct 2026',
    startDate: '2026-10-10',
    endDate: '2026-10-30',
    board: 'Railway Board',
    status: 'Tentative',
    link: 'https://indianrailways.gov.in',
    desc: 'Railway Recruitment Board Non-Technical Popular Categories Stage-I CBT Exam.'
  },
  {
    name: 'IBPS PO Prelims 2026',
    dateText: '05 Sep 2026',
    startDate: '2026-09-05',
    endDate: '2026-09-12',
    board: 'IBPS',
    status: 'Scheduled',
    link: 'https://ibps.in',
    desc: 'Institute of Banking Personnel Selection Probationary Officers Preliminary Exam.'
  },
  {
    name: 'UPPSC PCS Prelims 2026',
    dateText: '08 Nov 2026',
    startDate: '2026-11-08',
    endDate: '2026-11-08',
    board: 'UPPSC',
    status: 'Tentative',
    link: 'https://uppsc.up.nic.in',
    desc: 'Uttar Pradesh Public Service Commission Combined State/Upper Subordinate Prelims Exam.'
  },
  {
    name: 'SBI Clerk Junior Associate Exam',
    dateText: '18 Sep 2026',
    startDate: '2026-09-18',
    endDate: '2026-09-28',
    board: 'State Bank of India',
    status: 'Tentative',
    link: 'https://sbi.co.in/careers',
    desc: 'State Bank of India Junior Associate Prelims Recruitment Exam.'
  }
];

export default function ExamCalendarPage() {
  const eventSchemas = examEvents.map((evt) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    'name': evt.name,
    'startDate': evt.startDate,
    'endDate': evt.endDate,
    'eventStatus': evt.status === 'Scheduled' ? 'https://schema.org/EventScheduled' : 'https://schema.org/EventPostponed',
    'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
    'location': {
      '@type': 'Place',
      'name': 'All India Exam Centers',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Multiple Cities',
        'addressCountry': 'IN'
      }
    },
    'organizer': {
      '@type': 'Organization',
      'name': evt.board,
      'url': evt.link
    },
    'description': evt.desc
  }));

  return (
    <div className="bg-white min-h-screen flex flex-col w-full pb-20">
      {/* Event Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchemas) }}
      />

      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" /> 2026 Calendar
          </div>
        </div>
      </nav>

      {/* Breadcrumbs */}
      <div className="max-w-4xl mx-auto px-6 pt-6 w-full text-xs text-gray-550 flex items-center gap-1.5">
        <Link href="/" className="hover:text-blue-700 transition-colors">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-700 font-medium">Exam Calendar</span>
      </div>

      {/* Hero Header */}
      <header className="max-w-4xl mx-auto px-6 pt-8 pb-10 text-center w-full">
        <h1 className="text-3xl md:text-5xl font-extrabold text-blue-950 mb-4 tracking-tight">
          Government Exam Calendar 2026–27
        </h1>
        <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Tentative and scheduled examination dates for SSC, UPSC, Railways, Bank Exams, and State-level PSC recruitments in India. Bookmark this page for updates.
        </p>
      </header>

      {/* Main List */}
      <main className="max-w-3xl mx-auto px-6 w-full flex-1">
        <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm bg-white">
          <div className="bg-blue-950 text-white font-bold px-6 py-4 text-sm uppercase flex items-center justify-between">
            <span>Exam Event</span>
            <span className="hidden sm:inline">Board / Date</span>
          </div>

          <div className="divide-y divide-gray-150">
            {examEvents.map((evt, idx) => (
              <div key={idx} className="p-6 hover:bg-gray-50/40 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      evt.status === 'Scheduled' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {evt.status}
                    </span>
                    <span className="text-xs font-semibold text-gray-400">{evt.board}</span>
                  </div>
                  <h3 className="font-extrabold text-blue-950 text-sm md:text-base">{evt.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-md">{evt.desc}</p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Exam Date</p>
                    <p className="text-sm font-black text-blue-900 mt-0.5">{evt.dateText}</p>
                  </div>
                  <a
                    href={evt.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-gray-200 hover:border-blue-500 hover:bg-blue-50/30 rounded-xl text-gray-400 hover:text-blue-600 transition-all cursor-pointer"
                    title="Visit Board Website"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscribe Widget */}
        <div className="mt-8 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h4 className="font-bold text-gray-800 text-sm flex items-center gap-1.5 justify-center md:justify-start">🔔 Stay Updated on Dates</h4>
            <p className="text-xs text-gray-500 mt-1">Get immediate exam date updates and hall ticket links on WhatsApp and Telegram.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto justify-center">
            <a
              href="https://chat.whatsapp.com/GeHRdlojdjU7hurA2QCIT7"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
            >
              WhatsApp
            </a>
            <a
              href="https://t.me/weekly_naukri"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
            >
              Telegram
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
