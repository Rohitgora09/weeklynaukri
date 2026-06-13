'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Cpu, 
  Search, 
  Sparkles, 
  ArrowRight,
  Calendar,
  Briefcase,
  BookOpen
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import JobList from '../../components/jobs/JobList';
import Card from '../../components/ui/Card';
import Tag from '../../components/ui/Tag';

export default function ItGovtJobsClient({ initialJobs, initialNotices }) {
  const [selectedCategory, setSelectedCategory] = useState('Technical Jobs');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (category) => {
    // Navigate home if non-IT filter selected to preserve seamless navigation
    window.location.href = '/';
  };

  const latestJobs = initialJobs.latestJobs || [];
  const admitCards = initialJobs.admitCards || [];
  const latestResults = initialJobs.results || [];
  const notices = initialNotices || [];

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

  const filteredJobs = filterItems(latestJobs);
  const filteredAdmitCards = filterItems(admitCards);
  const filteredResults = filterItems(latestResults);
  const filteredNotices = filterItems(notices);

  const getActiveList = () => {
    switch (selectedCategory) {
      case 'Technical Jobs':
        return filteredJobs;
      case 'Admit Cards':
        return filteredAdmitCards;
      case 'Results':
        return filteredResults;
      case 'SSC Notices':
        return filteredNotices;
      default:
        return [];
    }
  };

  const activeItems = getActiveList();

  return (
    <div className="bg-white min-h-screen flex flex-col w-full">
      <Navbar onCategorySelect={handleCategorySelect} />

      {/* Hero Banner Section */}
      <section className="bg-gradient-to-b from-blue-50/50 to-white px-6 py-12 md:py-20 text-center w-full">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            <Cpu className="w-3.5 h-3.5 text-blue-600" /> IT & Technical Govt Vacancies
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-blue-950 leading-tight tracking-tight mb-6">
            IT Government Jobs <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">& Technical Career Alerts</span>
          </h1>
          
          <p className="text-gray-600 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Get instant alerts on government jobs for IT graduates, system administrators, software programmers, network engineers, and technical assistants in public sector undertakings.
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
            placeholder="Search IT jobs by department, title, or exam..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200/80 shadow-md shadow-gray-100/50 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-gray-50/50 hover:bg-gray-50 transition-all text-sm font-medium"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-gray-100 mb-8 overflow-x-auto gap-1">
          {['Technical Jobs', 'Admit Cards', 'Results', 'SSC Notices'].map(tab => {
            const getCount = () => {
              if (tab === 'Technical Jobs') return filteredJobs.length;
              if (tab === 'Admit Cards') return filteredAdmitCards.length;
              if (tab === 'Results') return filteredResults.length;
              if (tab === 'SSC Notices') return filteredNotices.length;
              return 0;
            };

            return (
              <button
                key={tab}
                onClick={() => setSelectedCategory(tab)}
                className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  selectedCategory === tab 
                    ? 'border-black text-black' 
                    : 'border-transparent text-gray-400 hover:text-gray-655'
                }`}
              >
                {tab}
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedCategory === tab ? 'bg-gray-100 text-gray-800' : 'bg-gray-50 text-gray-400'
                }`}>{getCount()}</span>
              </button>
            );
          })}
        </div>

        {/* Jobs Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeItems.length > 0 ? (
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                <JobList jobs={activeItems} />
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-1">No IT Jobs Found</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  There are no current technical listings matching your filters or search keywords. Check back later or return to main portal.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-tr from-blue-900 to-indigo-950 text-white rounded-3xl border-0 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3 h-3 text-yellow-300" /> Premium Alerts
                </div>
                <h3 className="text-xl font-bold mb-2">Technical Sarkari Jobs</h3>
                <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                  Technical government jobs offer job security, excellent benefits, and great work-life balance for software professionals in India.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-blue-100">Direct application links from official PSU portals.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-blue-100">Exams notifications tracked for IT officers.</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
            </Card>

            <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-amber-50/20">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" /> Key Tech Organizations
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                  <span>NIC (National Informatics Centre)</span>
                  <Tag text="Active" color="green" />
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                  <span>ISRO & DRDO Technical</span>
                  <Tag text="Active" color="blue" />
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                  <span>BEL & ECIL IT Officers</span>
                  <Tag text="Upcoming" color="orange" />
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
