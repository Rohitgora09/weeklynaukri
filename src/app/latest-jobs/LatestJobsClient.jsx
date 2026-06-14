'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import JobList from '../../components/jobs/JobList';
import Card from '../../components/ui/Card';
import Tag from '../../components/ui/Tag';

const faqData = [
  {
    question: 'How to apply for government jobs online?',
    answer: 'Visit WeeklyNaukri.com/latest-jobs to find active Sarkari Naukri vacancies. Each listing includes direct links to official recruitment portals where you can register, fill the application form, upload documents, pay fees, and submit your application before the deadline.'
  },
  {
    question: 'What are the top government jobs in 2026?',
    answer: 'The top government job vacancies include SSC CGL, UPSC Civil Services, RRB NTPC, IBPS PO/Clerk, Defence (Army, Navy, Air Force), State PSC exams, and various posts in Railways, Banking, and Teaching sectors. WeeklyNaukri aggregates all these notifications in one place.'
  },
  {
    question: 'Is WeeklyNaukri free to use?',
    answer: 'Yes, all job alerts, notifications, and application links on WeeklyNaukri.com are 100% free. We do not charge any fees for accessing government job information, admit cards, or result updates. Our goal is to make Sarkari Naukri accessible to every aspirant.'
  }
];

export default function LatestJobsClient({ initialJobs }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (category) => {
    window.location.href = '/';
  };

  const filterItems = (items) => {
    if (!searchQuery.trim()) return items;
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

  const filteredJobs = filterItems(initialJobs);

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
      <section className="bg-gradient-to-b from-indigo-50/50 to-white px-6 py-12 md:py-20 text-center w-full">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" /> Sarkari Naukri Updates
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-indigo-950 leading-tight tracking-tight mb-6">
            Latest Government Jobs 2026 <br />
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Sarkari Naukri &amp; Free Job Alerts</span>
          </h1>

          {/* Quick Summary for AI Overview */}
          <p className="text-gray-600 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Find the latest government job vacancies for 2026 from SSC, UPSC, Railway (RRB), IBPS, Defence, and State Public Service Commissions. Apply online with direct links to official recruitment portals. WeeklyNaukri.com aggregates active Sarkari Naukri notifications with eligibility, fees, and important dates updated weekly.
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

      {/* Main Jobs Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full flex-1">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search jobs by department, title, or exam..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200/80 shadow-md shadow-gray-100/50 outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 bg-gray-50/50 hover:bg-gray-50 transition-all text-sm font-medium"
          />
        </div>

        {/* Jobs Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {filteredJobs.length > 0 ? (
              <JobList
                items={filteredJobs}
                title="Latest Government Jobs"
                icon={Briefcase}
                color="bg-indigo-600"
                limit={100}
              />
            ) : (
              <div className="text-center py-16 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-1">No Jobs Found</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  There are no current government job listings matching your search. Check back later or return to the main portal.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-tr from-indigo-900 to-indigo-950 text-white rounded-3xl border-0 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3 h-3 text-yellow-300" /> Why Apply Through Us?
                </div>
                <h3 className="text-xl font-bold mb-2">Why Apply Through Us?</h3>
                <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                  WeeklyNaukri.com connects you directly to official government recruitment portals — no middlemen, no fees.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-indigo-100">Direct official links to recruitment portals — apply instantly.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-indigo-100">Weekly updates on new vacancies from SSC, UPSC, Railway & more.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-indigo-100">100% free alerts — no registration fees or hidden charges.</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
            </Card>

            {/* FAQ Section */}
            <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-indigo-50/20 contain-layout-paint">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-indigo-600" /> Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl border border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">{faq.question}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
