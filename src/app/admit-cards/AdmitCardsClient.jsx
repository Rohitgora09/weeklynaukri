'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Ticket,
  Search,
  Sparkles,
  Calendar,
  CheckCircle,
  AlertCircle,
  Download,
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import JobList from '../../components/jobs/JobList';
import Card from '../../components/ui/Card';
import Tag from '../../components/ui/Tag';

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How to download admit card for government exams?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Visit WeeklyNaukri.com/admit-cards to find direct download links for all major government exam admit cards. Click on the relevant exam name, follow the link to the official recruitment portal, and log in with your registration number and date of birth to download your hall ticket.',
      },
    },
    {
      '@type': 'Question',
      name: 'What to do if admit card has wrong details?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Contact the recruitment board immediately through their official helpline or email. Most recruitment boards provide a correction window before the exam date. Keep screenshots of the error and your original application form as evidence. Do not attempt to manually alter the admit card.',
      },
    },
    {
      '@type': 'Question',
      name: 'When are admit cards released?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Admit cards are typically released 10-15 days before the exam date. However, some recruitment boards like SSC and UPSC may release them 3-4 weeks in advance. WeeklyNaukri.com updates admit card availability as soon as they are released by recruitment boards, so bookmark this page for instant updates.',
      },
    },
  ],
};

export default function AdmitCardsClient({ initialAdmitCards }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = () => {
    window.location.href = '/';
  };

  const admitCards = initialAdmitCards || [];

  const filterItems = (items) => {
    if (!searchQuery.trim()) return items;
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

  return (
    <div className="bg-white min-h-screen flex flex-col w-full">
      <Navbar onCategorySelect={handleCategorySelect} />

      {/* FAQ JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Banner Section */}
      <section className="bg-gradient-to-b from-orange-50/50 to-white px-6 py-12 md:py-20 text-center w-full">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            <Ticket className="w-3.5 h-3.5 text-orange-600" /> Admit Card Downloads
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-orange-950 leading-tight tracking-tight mb-6">
            Admit Card 2026 <br />
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Download Latest Hall Tickets
            </span>
          </h1>

          {/* AI Overview Summary */}
          <p className="text-gray-600 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Download the latest admit cards and hall tickets for government exams including SSC CGL, UPSC IAS, RRB NTPC, IBPS PO, and state-level recruitment exams. Get direct download links from official portals. WeeklyNaukri.com updates admit card availability as soon as they are released by recruitment boards.
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
            placeholder="Search admit cards by exam name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200/80 shadow-md shadow-gray-100/50 outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 bg-gray-50/50 hover:bg-gray-50 transition-all text-sm font-medium"
          />
        </div>

        {/* Jobs Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {filteredAdmitCards.length > 0 ? (
              <JobList
                items={filteredAdmitCards}
                title="Admit Cards"
                icon={Calendar}
                color="bg-orange-500"
                limit={100}
              />
            ) : (
              <div className="text-center py-16 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-1">No Admit Cards Found</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  There are no current admit cards matching your search. Check back later or return to the main portal for all updates.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-tr from-orange-900 to-amber-950 text-white rounded-3xl border-0 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3 h-3 text-yellow-300" /> Admit Card Tips
                </div>
                <h3 className="text-xl font-bold mb-2">Hall Ticket Checklist</h3>
                <p className="text-orange-100 text-sm mb-6 leading-relaxed">
                  Follow these tips to avoid any issues on exam day. Always be prepared with the right documents.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-orange-100">Download 2-3 copies of your admit card.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-orange-100">Verify your photo and signature on the hall ticket.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-orange-100">Check exam center address and reach early.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-orange-100">Carry a valid photo ID along with the admit card.</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
            </Card>

            <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-orange-50/20">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" /> Popular Exam Admit Cards
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                  <span>SSC CGL / CHSL / MTS</span>
                  <Tag text="Active" color="orange" />
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                  <span>UPSC IAS / IPS Prelims</span>
                  <Tag text="Active" color="green" />
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                  <span>RRB NTPC / Group D</span>
                  <Tag text="Upcoming" color="blue" />
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                  <span>IBPS PO / Clerk</span>
                  <Tag text="Upcoming" color="blue" />
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
