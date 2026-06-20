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
  const [searchVal, setSearchVal] = useState('');

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchVal.trim());
  };

  const handleCategorySelect = (category) => {
    window.location.href = `/?category=${encodeURIComponent(category)}`;
  };

  const results = initialResults || [];

  const filteredResults = (() => {
    if (!searchQuery) return results;
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
    <div className="bg-white min-h-screen flex flex-col w-full" data-testid="category-page-results">
      <Navbar onCategorySelect={handleCategorySelect} />

      {/* FAQ JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1">
        {/* Breadcrumbs */}
        <nav className="text-xs text-muted mb-4">
          <Link href="/" className="hover:text-action">Home</Link> / <span className="text-ink">Sarkari Results</span>
        </nav>

        {/* Title and search bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-action font-bold">Sarkari Feed</span>
            <h1 className="font-heading font-extrabold text-3xl tracking-tight text-ink">Sarkari Results</h1>
          </div>
          <form onSubmit={handleSearchSubmit} className="flex items-center border border-slate-200 rounded-full overflow-hidden bg-white w-full sm:w-80 focus-within:border-action focus-within:ring-2 focus-within:ring-action/20 transition">
            <Search size={16} className="ml-4 text-muted" />
            <input 
              value={searchVal} 
              onChange={handleSearchChange} 
              placeholder="Search Results…"
              className="w-full px-3 py-2 text-sm outline-none" 
              data-testid="feed-search-input" 
            />
            <button type="submit" className="bg-brand text-white text-xs font-semibold px-5 py-2.5 hover:bg-action transition-colors cursor-pointer" data-testid="feed-search-button">Go</button>
          </form>
        </div>

        {/* Results Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {filteredResults.length > 0 ? (
              <JobList 
                items={filteredResults} 
                title="Latest Results" 
                iconName="FileCheck2"
                accent="alert"
                limit={100}
                variant="list"
              />
            ) : (
              <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="font-semibold text-ink text-lg mb-1">No Results Found</h3>
                <p className="text-slatebody text-sm max-w-sm mx-auto">
                  There are no current result listings matching your search keywords. Check back later or return to the main portal.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-tr from-rose-900 to-red-950 text-white rounded-3xl border-0 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3 h-3 text-yellow-300" /> Why Check Results Here?
                </div>
                <h3 className="text-xl font-bold mb-2">Sarkari Result Hub</h3>
                <p className="text-rose-105 text-sm mb-6 leading-relaxed">
                  WeeklyNaukri aggregates results from all major government recruitment boards so you never miss an important update.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-rose-100">Direct links to official result portals for SSC, UPSC, RRB & more.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-rose-100">Updated weekly with merit lists, cut-off marks & scorecards.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-rose-100">Covers Central, State, Railway, Banking & Defence exam results.</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl"></div>
            </Card>

            <Card className="p-6 border border-slate-200 shadow-sm rounded-3xl bg-slate-50/20">
              <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-ok" /> Popular Result Boards
              </h3>
              <ul className="space-y-3 text-sm text-slatebody">
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                  <span>SSC (Staff Selection Commission)</span>
                  <span className="text-[10px] bg-green-50 text-green-700 px-2.5 py-0.5 font-bold uppercase rounded-full border border-green-100">Active</span>
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                  <span>UPSC (Civil Services)</span>
                  <span className="text-[10px] bg-green-50 text-green-700 px-2.5 py-0.5 font-bold uppercase rounded-full border border-green-100">Active</span>
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                  <span>RRB (Railway Recruitment)</span>
                  <span className="text-[10px] bg-blue-50 text-action px-2.5 py-0.5 font-bold uppercase rounded-full border border-blue-100">Active</span>
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                  <span>IBPS (Banking & Insurance)</span>
                  <span className="text-[10px] bg-blue-50 text-action px-2.5 py-0.5 font-bold uppercase rounded-full border border-blue-100">Upcoming</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16 contain-layout-paint">
          <h2 className="text-2xl font-bold text-ink mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <details key={index} className="group bg-slate-50/50 border border-slate-200 rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-semibold text-ink text-sm hover:bg-slate-50 transition-colors">
                  {faq.question}
                  <ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-4 text-sm text-slatebody leading-relaxed border-t border-slate-50 pt-2">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
