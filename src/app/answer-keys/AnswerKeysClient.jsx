'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  KeyRound,
  Search,
  Sparkles,
  ArrowRight,
  AlertCircle,
  ClipboardCheck
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import JobList from '../../components/jobs/JobList';
import Card from '../../components/ui/Card';

const faqData = [
  {
    question: 'How to check answer key for government exams?',
    answer: 'Visit the official website of the exam conducting body (e.g., ssc.gov.in, upsc.gov.in). Navigate to the Answer Key section, enter your roll number and date of birth, and download the PDF. You can also find direct links to official answer keys on WeeklyNaukri.com.'
  },
  {
    question: 'How to raise objection on answer key?',
    answer: 'After the provisional answer key is released, candidates can raise objections within the specified window (usually 3-7 days). Log in to the official portal, select the question you want to challenge, provide supporting evidence or references, and pay the objection fee (typically ₹100 per question). If your objection is accepted, the fee is refunded.'
  },
  {
    question: 'What is the difference between provisional and final answer key?',
    answer: 'A provisional answer key is released first for candidates to review and raise objections. After evaluating all objections, the exam body releases the final answer key, which is used for calculating marks and preparing the result. The final answer key cannot be challenged further.'
  }
];

export default function AnswerKeysClient({ initialJobs, answerKeys }) {
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

  const allAnswerKeys = [...(initialJobs?.answerKeys || []), ...(answerKeys || [])];

  const filteredAnswerKeys = (() => {
    if (!searchQuery) return allAnswerKeys;
    const q = searchQuery.toLowerCase().trim();
    return allAnswerKeys.filter((item) => {
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

  // FAQ JSON-LD schema
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
    <div className="bg-white min-h-screen flex flex-col w-full" data-testid="category-page-answer-keys">
      <Navbar onCategorySelect={handleCategorySelect} />

      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1">
        {/* Breadcrumbs */}
        <nav className="text-xs text-muted mb-4">
          <Link href="/" className="hover:text-action">Home</Link> / <span className="text-ink">Answer Keys</span>
        </nav>

        {/* Title and search bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-ok font-bold">Answer Key Feed</span>
            <h1 className="font-heading font-extrabold text-3xl tracking-tight text-ink">Official Answer Keys</h1>
          </div>
          <form onSubmit={handleSearchSubmit} className="flex items-center border border-slate-200 rounded-full overflow-hidden bg-white w-full sm:w-80 focus-within:border-action focus-within:ring-2 focus-within:ring-action/20 transition">
            <Search size={16} className="ml-4 text-muted" />
            <input 
              value={searchVal} 
              onChange={handleSearchChange} 
              placeholder="Search Answer Keys…"
              className="w-full px-3 py-2 text-sm outline-none" 
              data-testid="feed-search-input" 
            />
            <button type="submit" className="bg-brand text-white text-xs font-semibold px-5 py-2.5 hover:bg-action transition-colors cursor-pointer" data-testid="feed-search-button">Go</button>
          </form>
        </div>

        {/* Answer Keys Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {filteredAnswerKeys.length > 0 ? (
              <JobList
                items={filteredAnswerKeys}
                title="Answer Keys"
                iconName="KeyRound"
                accent="ok"
                limit={100}
                variant="list"
              />
            ) : (
              <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="font-semibold text-ink text-lg mb-1">No Answer Keys Found</h3>
                <p className="text-slatebody text-sm max-w-sm mx-auto">
                  There are no current answer keys matching your search. Check back later or return to the main portal.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-tr from-green-900 to-emerald-950 text-white rounded-3xl border-0 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3 h-3 text-yellow-300" /> Answer Key Guide
                </div>
                <h3 className="text-xl font-bold mb-2">Answer Key Guide</h3>
                <p className="text-green-105 text-sm mb-6 leading-relaxed">
                  Answer keys help you estimate your score before the official result. Use them to plan your next steps and prepare for upcoming exams.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-green-100">Download answer keys as soon as they are released officially.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-green-100">Raise objections within the deadline to challenge incorrect answers.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-green-100">Compare provisional vs final answer key for score changes.</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>
            </Card>

            <Card className="p-6 border border-slate-200 shadow-sm rounded-3xl bg-slate-50/20">
              <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-ok" /> Important Steps
              </h3>
              <ul className="space-y-3 text-sm text-slatebody">
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                  <span>Download Answer Key PDF</span>
                  <span className="text-[10px] bg-slate-100 text-slate-800 px-2.5 py-0.5 font-bold uppercase rounded-full">Step 1</span>
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                  <span>Match Your Responses</span>
                  <span className="text-[10px] bg-slate-100 text-slate-800 px-2.5 py-0.5 font-bold uppercase rounded-full">Step 2</span>
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                  <span>Raise Objections (if any)</span>
                  <span className="text-[10px] bg-amber-50 text-amber-700 px-2.5 py-0.5 font-bold uppercase rounded-full border border-amber-100">Step 3</span>
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                  <span>Wait for Final Answer Key</span>
                  <span className="text-[10px] bg-green-50 text-ok px-2.5 py-0.5 font-bold uppercase rounded-full border border-green-100">Step 4</span>
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
              <details
                key={index}
                className="group bg-slate-50/50 border border-slate-200 rounded-2xl overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-semibold text-ink text-sm hover:bg-slate-50 transition-colors">
                  <span className="flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-ok flex-shrink-0" />
                    {faq.question}
                  </span>
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

