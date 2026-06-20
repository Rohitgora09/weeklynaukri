'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Search,
  Sparkles,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import JobList from '../../components/jobs/JobList';
import Card from '../../components/ui/Card';

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

  const filterItems = (items) => {
    if (!searchQuery) return items;
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
    <div className="bg-white min-h-screen flex flex-col w-full" data-testid="category-page-latestJobs">
      <Navbar onCategorySelect={handleCategorySelect} />

      {/* FAQ JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Main Feed Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-4">
          <Link href="/" className="hover:text-action">Home</Link> / <span className="text-ink">Latest Govt Jobs</span>
        </nav>

        {/* Title and search bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-action font-bold">Sarkari Feed</span>
            <h1 className="font-heading font-extrabold text-3xl tracking-tight text-ink">Latest Govt Jobs</h1>
          </div>
          <form onSubmit={handleSearchSubmit} className="flex items-center border border-slate-200 rounded-full overflow-hidden bg-white w-full sm:w-80 focus-within:border-action focus-within:ring-2 focus-within:ring-action/20 transition">
            <Search size={16} className="ml-4 text-muted" />
            <input 
              value={searchVal} 
              onChange={handleSearchChange} 
              placeholder="Search Latest Jobs…"
              className="w-full px-3 py-2 text-sm outline-none" 
              data-testid="feed-search-input" 
            />
            <button type="submit" className="bg-brand text-white text-xs font-semibold px-5 py-2.5 hover:bg-action transition-colors cursor-pointer" data-testid="feed-search-button">Go</button>
          </form>
        </div>

        {/* Jobs Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {filteredJobs.length > 0 ? (
              <JobList
                items={filteredJobs}
                title="Latest Government Jobs"
                iconName="Briefcase"
                accent="brand"
                limit={100}
                variant="list"
              />
            ) : (
              <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="font-semibold text-ink text-lg mb-1">No Jobs Found</h3>
                <p className="text-slatebody text-sm max-w-sm mx-auto">
                  There are no current government job listings matching your search. Check back later or return to the main portal.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-tr from-brand to-blue-900 text-white rounded-3xl border-0 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3 h-3 text-yellow-300" /> Why Apply Through Us?
                </div>
                <h3 className="text-xl font-bold mb-2">Why Apply Through Us?</h3>
                <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                  WeeklyNaukri.com connects you directly to official government recruitment portals — no middlemen, no fees.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-blue-100">Direct official links to recruitment portals — apply instantly.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-blue-100">Weekly updates on new vacancies from SSC, UPSC, Railway & more.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-blue-100">100% free alerts — no registration fees or hidden charges.</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
            </Card>

            {/* FAQ Section */}
            <Card className="p-6 border border-slate-200 shadow-sm rounded-3xl bg-slate-50/20 contain-layout-paint">
              <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-action" /> Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl border border-slate-200">
                    <h4 className="text-sm font-semibold text-ink mb-1">{faq.question}</h4>
                    <p className="text-xs text-slatebody leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
