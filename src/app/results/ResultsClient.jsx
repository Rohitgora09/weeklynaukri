'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Award, 
  Search, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  BookOpen
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import JobList from '../../components/jobs/JobList';
import Card from '../../components/ui/Card';
import Tag from '../../components/ui/Tag';

const faqData = [
  {
    question: 'How to check Sarkari Result 2026?',
    answer: 'Visit WeeklyNaukri.com/results to find the latest government exam results. Search for your exam name, click the result link, and you will be redirected to the official recruitment board portal where you can enter your roll number and date of birth to view your scorecard.'
  },
  {
    question: 'Where to download government exam scorecard?',
    answer: 'You can download your scorecard directly from the official recruitment board website. WeeklyNaukri.com provides direct links to SSC, UPSC, RRB, IBPS, and state PSC result portals. Click on the relevant result listing to access the official download page.'
  },
  {
    question: 'What is Sarkari Result?',
    answer: 'Sarkari Result refers to the outcome of government recruitment exams conducted by central and state agencies in India. It includes merit lists, cut-off marks, scorecards, and final selection lists for exams like SSC CGL, UPSC CSE, RRB NTPC, IBPS PO, and various state-level competitive examinations.'
  }
];

export default function ResultsClient({ initialResults }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (category) => {
    window.location.href = '/';
  };

  const results = initialResults || [];

  const filteredResults = (() => {
    if (!searchQuery.trim()) return results;
    const q = searchQuery.toLowerCase().trim();
    return results.filter((item) => {
      const searchable = [
        item.title, item.org, item.company, item.location,
        item.tag, item.date
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchable.includes(q);
    });
  })();

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

  return (
    <div className="bg-white min-h-screen flex flex-col w-full">
      <Navbar onCategorySelect={handleCategorySelect} />

      {/* FAQ JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Banner Section */}
      <section className="bg-gradient-to-b from-emerald-50/50 to-white px-6 py-12 md:py-20 text-center w-full">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            <Award className="w-3.5 h-3.5 text-emerald-600" /> Sarkari Exam Results
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-emerald-950 leading-tight tracking-tight mb-6">
            Sarkari Result 2026 <br />
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              {results[0] ? `Latest: ${results[0].title}` : 'Latest Government Exam Results'}
            </span>
          </h1>
          
          <p className="text-gray-600 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Download scorecards, merit lists, and cut-off marks for SSC, UPSC, Railway, Bank, and State government exams — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="bg-black text-white px-8 py-3.5 rounded-full font-medium hover:bg-gray-800 hover:-translate-y-0.5 transition-all shadow-md shadow-black/10 cursor-pointer"
            >
              Back to Main Portal
            </Link>
          </div>
        </div>
      </section>

      {/* AI Overview Quick Summary */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-6">
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">
            Check the latest Sarkari Results for 2026 including SSC CGL, UPSC Civil Services, RRB NTPC, IBPS PO, and state-level exams. Download your scorecard, merit list, and cut-off marks directly from official portals. WeeklyNaukri.com aggregates results from all major government recruitment boards weekly.
          </p>
        </div>
      </section>

      {/* Main Results Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full flex-1">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search results by exam name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200/80 shadow-md shadow-gray-100/50 outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 bg-gray-50/50 hover:bg-gray-50 transition-all text-sm font-medium"
          />
        </div>

        {/* Results Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {filteredResults.length > 0 ? (
              <JobList 
                items={filteredResults} 
                title="Latest Results" 
                icon={BookOpen}
                color="bg-green-600"
                limit={100}
              />
            ) : (
              <div className="text-center py-16 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-1">No Results Found</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  There are no current result listings matching your search keywords. Check back later or return to the main portal.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-tr from-emerald-900 to-green-950 text-white rounded-3xl border-0 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3 h-3 text-yellow-300" /> Why Check Results Here?
                </div>
                <h3 className="text-xl font-bold mb-2">Sarkari Result Hub</h3>
                <p className="text-emerald-100 text-sm mb-6 leading-relaxed">
                  WeeklyNaukri aggregates results from all major government recruitment boards so you never miss an important update.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-emerald-100">Direct links to official result portals for SSC, UPSC, RRB & more.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-emerald-100">Updated weekly with merit lists, cut-off marks & scorecards.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-emerald-100">Covers Central, State, Railway, Banking & Defence exam results.</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
            </Card>

            <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-emerald-50/20">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Popular Result Boards
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                  <span>SSC (Staff Selection Commission)</span>
                  <Tag text="Active" color="green" />
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                  <span>UPSC (Civil Services)</span>
                  <Tag text="Active" color="green" />
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                  <span>RRB (Railway Recruitment)</span>
                  <Tag text="Active" color="blue" />
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                  <span>IBPS (Banking & Insurance)</span>
                  <Tag text="Upcoming" color="orange" />
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16 contain-layout-paint">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <details key={index} className="group bg-gray-50/50 border border-gray-200 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-semibold text-gray-800 text-sm hover:bg-gray-50 transition-colors">
                  {faq.question}
                  <ArrowRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
