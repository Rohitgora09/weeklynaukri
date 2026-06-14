'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileCheck,
  Search,
  Sparkles,
  ArrowRight,
  Calendar,
  Briefcase,
  BookOpen,
  Bell,
  AlertCircle,
  ClipboardCheck
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import JobList from '../../components/jobs/JobList';
import Card from '../../components/ui/Card';
import Tag from '../../components/ui/Tag';

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (category) => {
    window.location.href = '/';
  };

  const allAnswerKeys = answerKeys || [];

  const filterItems = (items) => {
    if (!searchQuery.toLowerCase().trim()) return items;
    const q = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      const searchable = [
        item.title, item.org, item.company, item.location,
        item.tag, item.date
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchable.includes(q);
    });
  };

  const filteredAnswerKeys = filterItems(allAnswerKeys);

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
    <div className="bg-white min-h-screen flex flex-col w-full">
      <Navbar onCategorySelect={handleCategorySelect} />

      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Banner Section */}
      <section className="bg-gradient-to-b from-violet-50/50 to-white px-6 py-12 md:py-20 text-center w-full">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-700 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            <FileCheck className="w-3.5 h-3.5 text-violet-600" /> Official Answer Keys
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-violet-950 leading-tight tracking-tight mb-6">
            Answer Key 2026 <br />
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Verify Your Exam Answers</span>
          </h1>

          {/* Quick Summary for AI Overview */}
          <p className="text-gray-600 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Download official answer keys for SSC CGL, UPSC, RRB NTPC, IBPS PO, and other government exams. Verify your responses, calculate expected scores, and raise objections before the final result. WeeklyNaukri.com provides direct links to official answer key PDFs.
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

      {/* Main Content Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full flex-1">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search answer keys by exam name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200/80 shadow-md shadow-gray-100/50 outline-none focus:ring-4 focus:ring-violet-100 focus:border-violet-500 bg-gray-50/50 hover:bg-gray-50 transition-all text-sm font-medium"
          />
        </div>

        {/* Answer Keys Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {filteredAnswerKeys.length > 0 ? (
              <JobList
                items={filteredAnswerKeys}
                title="Answer Keys"
                icon={FileCheck}
                color="bg-violet-600"
                limit={20}
              />
            ) : (
              <div className="text-center py-16 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-1">No Answer Keys Found</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  There are no current answer keys matching your search. Check back later or return to the main portal.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-tr from-violet-900 to-purple-950 text-white rounded-3xl border-0 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3 h-3 text-yellow-300" /> Answer Key Guide
                </div>
                <h3 className="text-xl font-bold mb-2">Answer Key Guide</h3>
                <p className="text-violet-100 text-sm mb-6 leading-relaxed">
                  Answer keys help you estimate your score before the official result. Use them to plan your next steps and prepare for upcoming exams.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-violet-100">Download answer keys as soon as they are released officially.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-violet-100">Raise objections within the deadline to challenge incorrect answers.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-violet-100">Compare provisional vs final answer key for score changes.</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl"></div>
            </Card>

            <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-violet-50/20">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-violet-600" /> Important Steps
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                  <span>Download Answer Key PDF</span>
                  <Tag text="Step 1" color="purple" />
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                  <span>Match Your Responses</span>
                  <Tag text="Step 2" color="purple" />
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                  <span>Raise Objections (if any)</span>
                  <Tag text="Step 3" color="orange" />
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                  <span>Wait for Final Answer Key</span>
                  <Tag text="Step 4" color="green" />
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <details
                key={index}
                className="group bg-gray-50/50 border border-gray-200 rounded-2xl overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
                  <span className="flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-violet-500 flex-shrink-0" />
                    {faq.question}
                  </span>
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
