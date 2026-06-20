'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import JobList from '../../components/jobs/JobList';
import Card from '../../components/ui/Card';

const faqData = [
  {
    question: 'How to download admit card for government exams?',
    answer: 'Visit WeeklyNaukri.com/admit-cards to find direct download links for all major government exam admit cards. Click on the relevant exam name, follow the link to the official recruitment portal, and log in with your registration number and date of birth to download your hall ticket.',
  },
  {
    question: 'What to do if admit card has wrong details?',
    answer: 'Contact the recruitment board immediately through their official helpline or email. Most recruitment boards provide a correction window before the exam date. Keep screenshots of the error and your original application form as evidence. Do not attempt to manually alter the admit card.',
  },
  {
    question: 'When are admit cards released?',
    answer: 'Admit cards are typically released 10-15 days before the exam date. However, some recruitment boards like SSC and UPSC may release them 3-4 weeks in advance. WeeklyNaukri.com updates admit card availability as soon as they are released by recruitment boards, so bookmark this page for instant updates.',
  },
];

export default function AdmitCardsClient({ initialAdmitCards }) {
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

  const admitCards = initialAdmitCards || [];

  const filterItems = (items) => {
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase().trim();
    return items.filter((item) => {
      const searchable = [
        item.title, item.org, item.company, item.location,
        item.tag, item.date,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchable.includes(q);
    });
  };

  const filteredAdmitCards = filterItems(admitCards);

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
    <div className="bg-white min-h-screen flex flex-col w-full" data-testid="category-page-admitCards">
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
          <Link href="/" className="hover:text-action">Home</Link> / <span className="text-ink">Admit Cards</span>
        </nav>

        {/* Title and search bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-action font-bold">Sarkari Feed</span>
            <h1 className="font-heading font-extrabold text-3xl tracking-tight text-ink">Admit Cards</h1>
          </div>
          <form onSubmit={handleSearchSubmit} className="flex items-center border border-slate-200 rounded-full overflow-hidden bg-white w-full sm:w-80 focus-within:border-action focus-within:ring-2 focus-within:ring-action/20 transition">
            <Search size={16} className="ml-4 text-muted" />
            <input 
              value={searchVal} 
              onChange={handleSearchChange} 
              placeholder="Search Admit Cards…"
              className="w-full px-3 py-2 text-sm outline-none" 
              data-testid="feed-search-input" 
            />
            <button type="submit" className="bg-brand text-white text-xs font-semibold px-5 py-2.5 hover:bg-action transition-colors cursor-pointer" data-testid="feed-search-button">Go</button>
          </form>
        </div>

        {/* Jobs Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {filteredAdmitCards.length > 0 ? (
              <JobList
                items={filteredAdmitCards}
                title="Admit Cards"
                iconName="IdCard"
                accent="action"
                limit={100}
                variant="list"
              />
            ) : (
              <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="font-semibold text-ink text-lg mb-1">No Admit Cards Found</h3>
                <p className="text-slatebody text-sm max-w-sm mx-auto">
                  There are no current admit cards matching your search. Check back later or return to the main portal for all updates.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-tr from-brand to-blue-900 text-white rounded-3xl border-0 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3 h-3 text-yellow-300" /> Admit Card Tips
                </div>
                <h3 className="text-xl font-bold mb-2">Hall Ticket Checklist</h3>
                <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                  Follow these tips to avoid any issues on exam day. Always be prepared with the right documents.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-blue-100">Download 2-3 copies of your admit card.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-blue-100">Verify your photo and signature on the hall ticket.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-blue-100">Check exam center address and reach early.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-blue-100">Carry a valid photo ID along with the admit card.</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
            </Card>

            <Card className="p-6 border border-slate-200 shadow-sm rounded-3xl bg-slate-50/20">
              <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-action" /> Popular Exam Admit Cards
              </h3>
              <ul className="space-y-3 text-sm text-slatebody">
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                  <span>SSC CGL / CHSL / MTS</span>
                  <span className="text-[10px] bg-amber-50 text-amber-700 px-2.5 py-0.5 font-bold uppercase rounded-full border border-amber-100">Active</span>
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                  <span>UPSC IAS / IPS Prelims</span>
                  <span className="text-[10px] bg-green-50 text-green-700 px-2.5 py-0.5 font-bold uppercase rounded-full border border-green-100">Active</span>
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                  <span>RRB NTPC / Group D</span>
                  <span className="text-[10px] bg-blue-50 text-action px-2.5 py-0.5 font-bold uppercase rounded-full border border-blue-100">Upcoming</span>
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200">
                  <span>IBPS PO / Clerk</span>
                  <span className="text-[10px] bg-blue-50 text-action px-2.5 py-0.5 font-bold uppercase rounded-full border border-blue-100">Upcoming</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
