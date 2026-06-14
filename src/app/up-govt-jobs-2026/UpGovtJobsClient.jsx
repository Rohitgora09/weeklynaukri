'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Search, 
  Sparkles, 
  ArrowRight,
  Calendar,
  Briefcase,
  BookOpen,
  Bell
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import JobList from '../../components/jobs/JobList';
import Card from '../../components/ui/Card';
import Tag from '../../components/ui/Tag';

export default function UpGovtJobsClient({ initialJobs }) {
  const [selectedCategory, setSelectedCategory] = useState('UP Govt Jobs');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = () => {
    window.location.href = '/';
  };

  const latestJobs = initialJobs.latestJobs || [];
  const admitCards = initialJobs.admitCards || [];
  const latestResults = initialJobs.results || [];

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

  const getActiveList = () => {
    switch (selectedCategory) {
      case 'UP Govt Jobs':
        return filteredJobs;
      case 'Admit Cards':
        return filteredAdmitCards;
      case 'Results':
        return filteredResults;
      default:
        return [];
    }
  };

  const activeItems = getActiveList();

  return (
    <div className="bg-white min-h-screen flex flex-col w-full">
      <Navbar onCategorySelect={handleCategorySelect} />

      {/* Hero Banner Section */}
      <section className="bg-gradient-to-b from-red-50/50 to-white px-6 py-12 md:py-20 text-center w-full">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            <MapPin className="w-3.5 h-3.5 text-red-600" /> Uttar Pradesh Govt Vacancies
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-red-950 leading-tight tracking-tight mb-6">
            UP Govt Jobs 2026 <br />
            <span className="bg-gradient-to-r from-red-650 to-orange-650 bg-clip-text text-transparent">UPSSSC, UPPSC &amp; Police Alerts</span>
          </h1>
          
          <p className="text-gray-600 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Find the latest government job vacancies, exam notifications, admit cards, and results for Uttar Pradesh recruitment boards — all in one place.
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
            placeholder="Search UP vacancies by department, post, or exam..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200/80 shadow-md shadow-gray-100/50 outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 bg-gray-50/50 hover:bg-gray-50 transition-all text-sm font-medium"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-gray-100 mb-8 overflow-x-auto gap-1">
          {['UP Govt Jobs', 'Admit Cards', 'Results'].map(tab => {
            const getCount = () => {
              if (tab === 'UP Govt Jobs') return filteredJobs.length;
              if (tab === 'Admit Cards') return filteredAdmitCards.length;
              if (tab === 'Results') return filteredResults.length;
              return 0;
            };

            return (
              <button
                key={tab}
                onClick={() => setSelectedCategory(tab)}
                className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  selectedCategory === tab 
                    ? 'border-red-600 text-red-650 font-bold' 
                    : 'border-transparent text-gray-400 hover:text-gray-655'
                }`}
              >
                {tab}
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedCategory === tab ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-400'
                }`}>{getCount()}</span>
              </button>
            );
          })}
        </div>

        {/* Jobs Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeItems.length > 0 ? (
              <JobList 
                items={activeItems} 
                title={selectedCategory} 
                icon={selectedCategory === 'UP Govt Jobs' ? Briefcase : (selectedCategory === 'Admit Cards' ? Calendar : BookOpen)}
                color={selectedCategory === 'UP Govt Jobs' ? 'bg-red-600' : (selectedCategory === 'Admit Cards' ? 'bg-orange-500' : 'bg-green-600')}
                limit={100}
              />
            ) : (
              <div className="text-center py-16 bg-gray-50/50 border border-dashed border-gray-200 rounded-3xl">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-800 text-lg mb-1">No UP Vacancies Found</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  There are no current listings in Uttar Pradesh matching your filters. Check back later or return to main portal.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-tr from-red-900 to-rose-950 text-white rounded-3xl border-0 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3 h-3 text-yellow-300" /> State Updates
                </div>
                <h3 className="text-xl font-bold mb-2">Uttar Pradesh Recruitment</h3>
                <p className="text-red-100 text-sm mb-6 leading-relaxed">
                  UP boasts some of the largest state-level examinations in India. Track latest updates from key boards.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-red-100">Covers UPSSSC Lekhpal, VDO, and PET exams.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-red-100">UPPSC Provincial Civil Services (PCS) notifications.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center mt-0.5">✔</div>
                    <p className="text-xs text-red-100">UP Police SI, Constable and Technical vacancies.</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"></div>
            </Card>

            <Card className="p-6 border border-gray-150 rounded-3xl bg-red-50/10 shadow-sm">
              <h3 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">📢 UP WhatsApp Channel</h3>
              <p className="text-xs text-gray-600 mb-5 leading-relaxed">
                Join our groups to get direct alerts for UP jobs, admit cards, and declared results.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://chat.whatsapp.com/GeHRdlojdjU7hurA2QCIT7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2.5 rounded-xl text-center shadow-sm block transition-all"
                >
                  WhatsApp
                </a>
                <a
                  href="https://t.me/weekly_naukri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-2.5 rounded-xl text-center shadow-sm block transition-all"
                >
                  Telegram
                </a>
              </div>
            </Card>

            <Card className="p-6 border border-gray-100 shadow-sm rounded-3xl bg-red-50/20">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-650" /> Principal UP Boards
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                  <span>UPSSSC (Subordinate Services)</span>
                  <Tag text="Active" color="green" />
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                  <span>UPPSC (Civil Services &amp; RO/ARO)</span>
                  <Tag text="Active" color="blue" />
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                  <span>UPPRPB (Police Department)</span>
                  <Tag text="Active" color="green" />
                </li>
                <li className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                  <span>UPMSP / Basic Education (TET/TGT)</span>
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
