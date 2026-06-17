'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  Users, 
  Building2, 
  TrendingUp, 
  Search, 
  Sparkles, 
  UploadCloud, 
  X, 
  Loader2,
  ArrowRight,
  Bell,
  BookOpen,
  Calendar,
  ExternalLink,
  Menu,
  SearchX,
  Calculator
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import JobList from '../components/jobs/JobList';
import SarkariCalendar from '../components/jobs/SarkariCalendar';
import Card from '../components/ui/Card';
import Tag from '../components/ui/Tag';
import { api } from '../services/api';
import { 
  privateJobs as fallbackPrivateJobs, 
  answerKeys as fallbackAnswerKeys, 
  admissions as fallbackAdmissions, 
  documents as fallbackDocuments 
} from '../data/jobs';

// Client-side list wrapper for lazy loading sections using IntersectionObserver
function LazySection({ children, height = '300px', forceVisible = false }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (forceVisible) {
      setIsVisible(true);
      return;
    }
    if (!window.IntersectionObserver) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [forceVisible]);

  const activeVisible = isVisible || forceVisible;

  return (
    <div 
      ref={ref} 
      className="w-full" 
      style={{ minHeight: activeVisible ? 'auto' : height }}
    >
      {activeVisible ? children : (
        <div 
          style={{ height }} 
          className="animate-pulse bg-gray-55 border border-gray-100 rounded-3xl w-full"
        />
      )}
    </div>
  );
}

export default function HomeClient({ initialJobs, initialNotices }) {
  // Category & Search state
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Scraped listings states
  const [latestJobs, setLatestJobs] = useState(initialJobs.latestJobs || []);
  const [admitCards, setAdmitCards] = useState(initialJobs.admitCards || []);
  const [latestResults, setLatestResults] = useState(initialJobs.results || []);
  const [liveSSCNotices, setLiveSSCNotices] = useState(initialNotices || []);
  
  // Custom mock data for admissions/documents/answer keys/private sectors (mapped to correct global job data IDs to avoid 404s)
  const [privateJobs, setPrivateJobs] = useState(
    initialJobs.privateJobs && initialJobs.privateJobs.length > 0 
      ? initialJobs.privateJobs 
      : fallbackPrivateJobs
  );
  
  const [answerKeys, setAnswerKeys] = useState(
    initialJobs.answerKeys && initialJobs.answerKeys.length > 0 
      ? initialJobs.answerKeys 
      : fallbackAnswerKeys
  );

  const [admissions, setAdmissions] = useState(
    initialJobs.admissions && initialJobs.admissions.length > 0 
      ? initialJobs.admissions 
      : fallbackAdmissions
  );

  const [documents, setDocuments] = useState(
    initialJobs.documents && initialJobs.documents.length > 0 
      ? initialJobs.documents 
      : fallbackDocuments
  );

  // AI Resume Match States
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [resumeKeywords, setResumeKeywords] = useState([]);
  const [resumeError, setResumeError] = useState('');

  const debounceTimer = useRef(null);
  const modalRef = useRef(null);

  // Track page views on clients
  useEffect(() => {
    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pathname: '/',
          referrer: document.referrer || 'direct',
          screenWidth: window.innerWidth,
          userAgent: navigator.userAgent
        })
      }).catch(() => {});
    } catch (e) {}
  }, []);

  // Focus trap for modal (Accessibility)
  useEffect(() => {
    if (!isResumeModalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsResumeModalOpen(false);
        return;
      }

      if (e.key !== 'Tab' || !modalRef.current) return;
      
      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusable.length === 0) return;
      
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Auto-focus the first focusable element in the modal
    const timer = setTimeout(() => {
      const firstFocusable = modalRef.current?.querySelector('button, [href], input');
      firstFocusable?.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isResumeModalOpen]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setSearchQuery(value);
    }, 300);
  };

  const handleChipClick = (chip) => {
    setSearchQuery(chip);
    setSelectedCategory('All Categories');
    document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFooterSearch = (category, query) => {
    setSelectedCategory(category);
    setSearchQuery(query);
    document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // PDF Parser resume upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setResumeError('Please upload a valid PDF resume file.');
      return;
    }

    setResumeError('');
    setIsParsing(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.upload('/api/parse-resume', formData);
      if (res.success && res.text) {
        // Extract common keywords
        const text = res.text.toLowerCase();
        const skillCatalog = ['react', 'node', 'javascript', 'python', 'designer', 'marketing', 'analyst', 'java', 'sql', 'css', 'design'];
        const matched = skillCatalog.filter(skill => text.includes(skill));
        
        if (matched.length > 0) {
          setResumeKeywords(matched);
          setSelectedCategory('Private Jobs');
          setIsResumeModalOpen(false);
          document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
        } else {
          setResumeError('Could not detect matching private sector skills in this resume. Try another format.');
        }
      }
    } catch (err) {
      console.error(err);
      setResumeError('Failed to parse resume file. Ensure it is less than 5MB and not corrupted.');
    } finally {
      setIsParsing(false);
    }
  };

  /* --- SEARCH AND FILTERING LOGIC --- */
  const q = searchQuery.toLowerCase().trim();

  const filterItems = (items) => {
    if (!q) return items;
    return items.filter((item) => {
      const searchable = [
        item.title, item.org, item.company, item.location,
        item.tag, item.date, item.lastDate, item.type
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchable.includes(q);
    });
  };

  // Category visibility flags
  const showGovt = selectedCategory === 'All Categories' || selectedCategory === 'Govt Jobs';
  const showPrivate = selectedCategory === 'All Categories' || selectedCategory === 'Private Jobs';
  const showResults = selectedCategory === 'All Categories' || selectedCategory === 'Results';
  const showAdmitCards = selectedCategory === 'All Categories' || selectedCategory === 'Admit Cards';
  const showAnswerKeys = selectedCategory === 'All Categories' || selectedCategory === 'Answer Keys';
  const showAdmissions = selectedCategory === 'All Categories';
  const showDocuments = selectedCategory === 'All Categories';

  const filteredGovtJobs = filterItems(latestJobs);
  const filteredResults = filterItems(latestResults);
  const filteredAdmitCards = filterItems(admitCards);
  const filteredAnswerKeys = filterItems(answerKeys);
  const filteredAdmissions = filterItems(admissions);
  const filteredDocuments = filterItems(documents);
  const filteredSSCNotices = filterItems(liveSSCNotices);
  
  let filteredPrivateJobs = filterItems(privateJobs);
  if (resumeKeywords.length > 0) {
    filteredPrivateJobs = filteredPrivateJobs.filter(job => {
      const jobText = `${job.title} ${job.company} ${job.location}`.toLowerCase();
      return resumeKeywords.some(kw => jobText.includes(kw));
    });
  }

  // Check if search returned no results across all visible sections
  const hasNoResults = q && selectedCategory !== 'Exam Calendar' && (
    (showGovt ? filteredGovtJobs.length === 0 : true) &&
    (showPrivate ? filteredPrivateJobs.length === 0 : true) &&
    (showResults ? filteredResults.length === 0 : true) &&
    (showAdmitCards ? filteredAdmitCards.length === 0 : true) &&
    (showAnswerKeys ? filteredAnswerKeys.length === 0 : true)
  );

  const categoryTabs = ['All Categories', 'Govt Jobs', 'Private Jobs', 'Results', 'Admit Cards', 'Answer Keys', 'Exam Calendar'];
  const forceLazyVisible = !!searchQuery || selectedCategory !== 'All Categories';

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Weekly Naukri?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Weekly Naukri is a free job portal listing the latest government and private job notifications, sarkari results, and exam updates across India."
        }
      },
      {
        "@type": "Question",
        "name": "How often are new government jobs updated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "New government job listings are updated daily including SSC, Railways, Banking, Defence, State PSC, and IT sector vacancies."
        }
      },
      {
        "@type": "Question",
        "name": "Is Weekly Naukri free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Weekly Naukri is completely free. You can browse all job listings, results, and admit cards without any subscription."
        }
      },
      {
        "@type": "Question",
        "name": "How do I get notified about new sarkari jobs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can join our WhatsApp channel or Telegram group to receive instant alerts for new government job notifications and sarkari results."
        }
      }
    ]
  };

  return (
    <div className="bg-white min-h-screen flex flex-col w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar onCategorySelect={handleCategorySelect} />

      {/* Hero Banner Section */}
      <section aria-label="Hero - Find Government and Private Jobs" className="bg-gradient-to-b from-blue-50/60 via-blue-50/30 to-white px-6 py-14 md:py-24 text-center w-full">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 animate-stagger-1">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> India's Most Trusted Sarkari Result Portal
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-blue-950 leading-tight tracking-tight mb-6 animate-stagger-2">
            Find the Latest <br />
            Government Jobs &amp; <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Private Sectors</span>
          </h1>
          
          <p className="text-gray-700 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed animate-stagger-3">
            Get instant updates on the latest govt jobs, sarkari results, admit cards, answer keys, and exam syllabus from all sectors.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-stagger-4">
            <button
              onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-base hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-600/25 cursor-pointer animate-cta-pulse flex items-center gap-2"
              aria-label="Explore all available job openings"
            >
              Explore Job Openings
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
            
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-full font-semibold text-base hover:bg-blue-50 hover:border-blue-300 hover:-translate-y-0.5 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              aria-label="Upload your resume to find matching jobs using AI"
            >
              <UploadCloud className="w-5 h-5 text-blue-600" aria-hidden="true" /> Match with AI Resume
            </button>
          </div>

          {resumeKeywords.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 bg-green-50 text-green-800 border border-green-200 px-4 py-2 rounded-xl text-xs" role="status">
              <span>Matched private jobs by skills: <strong>{resumeKeywords.join(', ')}</strong></span>
              <button onClick={() => setResumeKeywords([])} className="hover:text-green-950 font-bold ml-1 cursor-pointer bg-transparent border-none p-0" aria-label="Clear resume skill matches">
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Direct navigation cards grid */}
          <div className="mt-10 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up">
            {/* Govt Tech Jobs Card */}
            <div className="bg-blue-50/50 border border-blue-200/70 rounded-2xl p-4 flex items-center justify-between shadow-sm text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-650 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Sparkles className="w-4.5 h-4.5 text-amber-300" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-bold text-blue-950 text-xs">Govt Tech Jobs</h2>
                  <p className="text-[10px] text-blue-800/80">Software & IT posts</p>
                </div>
              </div>
              <Link 
                href="/it-govt-jobs" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold px-3.5 py-2 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm shrink-0 ml-2"
                aria-label="Explore Technical and IT Government Jobs"
              >
                Explore
              </Link>
            </div>

            {/* SSC GD 2026 Calculator Card */}
            <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-4 flex items-center justify-between shadow-sm text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Calculator className="w-4.5 h-4.5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-bold text-amber-950 text-xs">SSC GD Estimator</h2>
                  <p className="text-[10px] text-amber-800/80">Marks & cut-off calculator</p>
                </div>
              </div>
              <Link 
                href="/ssc-gd-2026" 
                className="bg-gradient-to-r from-amber-500 to-orange-550 text-white text-xs font-semibold px-3.5 py-2 rounded-full hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm shrink-0 ml-2"
                aria-label="Explore SSC GD Score Calculator"
              >
                Calculate
              </Link>
            </div>
          </div>

          {/* Quick search chips */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5 max-w-2xl mx-auto" role="group" aria-label="Trending search suggestions">
            <span className="text-xs text-gray-500 font-medium">Trending Searches:</span>
            {['SSC GD', 'SSC CGL', 'UPSC Prelims', 'Railway Group D', 'Bank PO', 'State PSC'].map(chip => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="bg-gray-50 border border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-xs text-gray-700 px-3.5 py-1.5 rounded-full transition-all cursor-pointer font-medium"
                aria-label={`Search for ${chip} jobs`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Community Alert Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-8 mb-4 w-full">
        <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100 rounded-2xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xl shrink-0" role="img" aria-label="megaphone">📢</span>
            <p className="text-sm text-gray-700 font-semibold leading-normal">
              Join our channels for instant Sarkari Result &amp; Job Alerts!
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-center">
            <a
              href="https://chat.whatsapp.com/GeHRdlojdjU7hurA2QCIT7"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm hover:-translate-y-0.5 cursor-pointer"
            >
              WhatsApp Group
            </a>
            <a
              href="https://t.me/weekly_naukri"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm hover:-translate-y-0.5 cursor-pointer"
            >
              Telegram Channel
            </a>
          </div>
        </div>
      </div>

      {/* Job Search Core Section */}
      <section id="search-section" aria-label="Job search and listings" className="max-w-7xl mx-auto px-6 py-12 w-full flex-1">
        {/* Search Bar Input */}
        {selectedCategory !== 'Exam Calendar' && (
          <div className="relative max-w-2xl mx-auto mb-12" role="search" aria-label="Search jobs">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              placeholder="Search by post name, department, location, or exam..."
              defaultValue={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search for jobs by post name, department, location, or exam"
              className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-300 shadow-md shadow-gray-100/50 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-gray-50/50 hover:bg-gray-50 transition-all text-sm font-medium"
            />
          </div>
        )}

        {/* Tab Selection Filter */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto gap-1" role="tablist" aria-label="Job category tabs">
          {categoryTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedCategory(tab)}
              role="tab"
              aria-selected={selectedCategory === tab}
              aria-controls={`panel-${tab.replace(/\s/g, '-').toLowerCase()}`}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer rounded-t-lg ${
                selectedCategory === tab 
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50' 
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* No results state */}
        {hasNoResults && (
          <div className="flex flex-col items-center justify-center py-16 text-center" role="status" aria-live="polite">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <SearchX className="w-8 h-8 text-gray-400" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">No results found</h2>
            <p className="text-sm text-gray-500 max-w-md">
              We couldn't find any listings matching "<strong className="text-gray-800">{searchQuery}</strong>". Try a different keyword or browse all categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
                const input = document.querySelector('input[aria-label]');
                if (input) input.value = '';
              }}
              className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer bg-transparent border-none"
            >
              Clear search & show all
            </button>
          </div>
        )}

        {/* Display grids or Exam Calendar */}
        {selectedCategory === 'Exam Calendar' ? (
          <SarkariCalendar allItems={[...latestJobs, ...admitCards, ...latestResults, ...answerKeys, ...admissions, ...documents]} />
        ) : selectedCategory === 'Private Jobs' ? (
          <div className="max-w-4xl mx-auto w-full">
            <JobList
              title="Private Jobs"
              subtitle="Top hiring companies matching skills"
              icon={Building2}
              color="bg-indigo-650"
              variant="private"
              items={filteredPrivateJobs}
              limit={20}
              emptyText="No private sector jobs match this query."
            />
          </div>
        ) : selectedCategory === 'Results' ? (
          <div className="max-w-4xl mx-auto w-full">
            <JobList
              title="Sarkari Results"
              subtitle="Latest exam results declared"
              icon={BookOpen}
              color="bg-green-600"
              items={filteredResults}
              limit={24}
              emptyText="No declared results match your query."
            />
          </div>
        ) : selectedCategory === 'Admit Cards' ? (
          <div className="max-w-4xl mx-auto w-full">
            <JobList
              title="Admit Cards"
              subtitle="Download hall tickets & exam dates"
              icon={Calendar}
              color="bg-orange-500"
              items={filteredAdmitCards}
              limit={24}
              emptyText="No admit cards match your query."
            />
          </div>
        ) : selectedCategory === 'Answer Keys' ? (
          <div className="max-w-4xl mx-auto w-full">
            <JobList
              title="Answer Keys"
              subtitle="Official exam answer sheets"
              icon={BookOpen}
              variant="list"
              items={filteredAnswerKeys}
              limit={24}
              emptyText="No answer keys match your query."
            />
          </div>
        ) : (
          !hasNoResults && (
          <div className="space-y-10">
            {/* Primary Grid: Results, Admit Cards, Latest Jobs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {showResults && (
                <JobList
                  title="Sarkari Results"
                  subtitle="Latest exam results declared"
                  icon={BookOpen}
                  color="bg-green-600"
                  variant="list"
                  items={filteredResults}
                  limit={15}
                  emptyText="No declared results match your query."
                />
              )}
              {showAdmitCards && (
                <JobList
                  title="Admit Cards"
                  subtitle="Download hall tickets & exam dates"
                  icon={Calendar}
                  color="bg-orange-500"
                  variant="list"
                  items={filteredAdmitCards}
                  limit={15}
                  emptyText="No admit cards match your query."
                />
              )}
              {showGovt && (
                <JobList
                  title="Latest Govt Jobs"
                  subtitle="Central & state government vacancies"
                  icon={Briefcase}
                  color="bg-blue-600"
                  variant="list"
                  items={filteredGovtJobs}
                  limit={15}
                  emptyText="No government job listings match your query."
                />
              )}
            </div>

            {/* Secondary Grid: Answer Keys, Admissions, Important Documents */}
            <LazySection height="450px" forceVisible={forceLazyVisible}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                {showAnswerKeys && (
                  <JobList
                    title="Answer Keys"
                    subtitle="Official exam answer sheets"
                    icon={BookOpen}
                    color="bg-rose-500"
                    variant="list"
                    items={filteredAnswerKeys}
                    limit={10}
                    emptyText="No answer keys match your query."
                  />
                )}
                {showAdmissions && (
                  <JobList
                    title="Admissions"
                    subtitle="Colleges & university entrance exams"
                    icon={Sparkles}
                    color="bg-teal-650"
                    variant="list"
                    items={filteredAdmissions}
                    limit={10}
                    emptyText="No admission alerts match your query."
                  />
                )}
                {showDocuments && (
                  <JobList
                    title="Important Documents"
                    subtitle="Scholarships & certificate forms"
                    icon={Briefcase}
                    color="bg-amber-600"
                    variant="list"
                    items={filteredDocuments}
                    limit={10}
                    emptyText="No documents match your query."
                  />
                )}
              </div>
            </LazySection>

            {/* Tertiary Grid: Live SSC Notices & Private Sector Careers */}
            <LazySection height="350px" forceVisible={forceLazyVisible}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                {showGovt && filteredSSCNotices.length > 0 && (
                  <JobList
                    title="Live SSC Notices"
                    subtitle="Staff Selection Commission live alerts"
                    icon={Bell}
                    color="bg-purple-650"
                    variant="list"
                    items={filteredSSCNotices}
                    limit={8}
                    emptyText="No live notices found."
                  />
                )}
                {showPrivate && (
                  <JobList
                    title="Private Jobs"
                    subtitle="Top hiring companies matching skills"
                    icon={Building2}
                    color="bg-indigo-650"
                    variant="private"
                    items={filteredPrivateJobs}
                    limit={8}
                    emptyText="No private sector jobs match this query."
                  />
                )}
              </div>
            </LazySection>
          </div>
          )
        )}
        
        {/* Stats metrics card banner */}
        <LazySection height="220px" forceVisible={forceLazyVisible}>
          <div className="mt-16 bg-gradient-to-r from-blue-950 to-blue-900 rounded-2xl p-8 md:p-12 shadow-xl shadow-blue-900/10 text-center text-white" aria-label="Platform statistics">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '50,000+', label: 'Active Job Listings', icon: Briefcase },
                { value: '18.3K+', label: 'Happy Users', icon: Users },
                { value: '1,200+', label: 'Govt Departments', icon: Building2 },
                { value: '95%', label: 'Match Accuracy', icon: TrendingUp },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <stat.icon className="w-6 h-6 text-amber-400 mb-2" aria-hidden="true" />
                  <span className="block text-2xl md:text-3xl font-bold" aria-label={`${stat.value} ${stat.label}`}>{stat.value}</span>
                  <span className="text-xs text-blue-200 mt-1 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </LazySection>

        {/* SEO Text Block / Info Section for Search Engines & Users */}
        <div className="mt-16 border-t border-gray-100 pt-16 text-left max-w-4xl mx-auto contain-layout-paint">
          <h2 className="text-2xl font-bold text-blue-950 mb-6">WeeklyNaukri - India's Premier Sarkari Result & Latest Govt Jobs Portal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600 leading-relaxed">
            <div>
              <p className="mb-4">
                Welcome to <strong>WeeklyNaukri.com</strong>, your ultimate destination for all government exam updates, private sector jobs, results, admit cards, and answer keys. We specialize in aggregating active notifications for <strong>Sarkari Naukri</strong> (government jobs) and major IT/private jobs across India, making it easier for aspirants to find their dream careers.
              </p>
              <p>
                Our team crawls official recruitment portals of central and state bodies including the Staff Selection Commission (SSC), Union Public Service Commission (UPSC), Railway Recruitment Boards (RRB), Institute of Banking Personnel Selection (IBPS), Defence recruitment, and State PSCs. Every listing is thoroughly verified to provide accurate details on eligibility criteria, vacancies, important dates, and direct apply links.
              </p>
            </div>
            <div>
              <p className="mb-4">
                Looking for the latest <strong>Sarkari Result</strong>? We provide instantaneous updates on examination results, scorecards, merit lists, and cut-off marks as soon as they are declared. You can also download official <strong>admit cards</strong> and hall tickets for upcoming competitive examinations, ensuring you never miss an exam deadline.
              </p>
              <p>
                In addition to government jobs, WeeklyNaukri offers a unique referral portal for top IT and corporate vacancies, helping engineering and management graduates land private sector jobs. Explore our free mock test series and comprehensive exam calendars to stay ahead in your preparation journey.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 border-t border-gray-150/70 pt-10 text-left max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-blue-950 mb-6">Frequently Asked Questions (FAQ)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-2">What is Weekly Naukri?</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Weekly Naukri is India's leading job portal that aggregates and indexes the latest government notifications, sarkari results, admit cards, and private sector IT opportunities in one unified portal.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-2">Is Weekly Naukri free to use?</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Yes, our platform is 100% free for all job seekers. You can browse active vacancies, check exam results, download syllabi, and practice with our online mock test series without any hidden charges or subscriptions.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-2">How often are new government jobs updated?</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Our databases are refreshed daily by crawling official portals. We list active openings from central and state boards including SSC, UPSC, Railway (RRB), IBPS, and Defence organizations.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-2">How do I get notified about new job alerts?</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    You can receive instant updates by subscribing to our official Telegram channel and WhatsApp updates group. Link buttons for these channels are pinned directly in our homepage announcement bar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LazySection height="400px" forceVisible={forceLazyVisible}>
        <Footer onFooterSearch={handleFooterSearch} />
      </LazySection>

      {/* AI Resume Upload Match Modal */}
      {isResumeModalOpen && (
        <div 
          className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="resume-modal-title"
          onClick={(e) => { if (e.target === e.currentTarget) setIsResumeModalOpen(false); }}
        >
          <Card padding="p-6 relative w-full max-w-md animate-fade-in-up" hover={false}>
            <div ref={modalRef}>
              <button 
                onClick={() => setIsResumeModalOpen(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer bg-transparent border-none p-1 rounded-lg"
                aria-label="Close resume upload dialog"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-600">
                  <Sparkles className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 id="resume-modal-title" className="text-xl font-bold text-gray-900">AI Resume Match</h3>
                <p className="text-sm text-gray-600 mt-1">Upload your PDF resume to instantly find private sector jobs matching your skills.</p>
              </div>
              
              <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 hover:border-blue-300 transition-all group">
                <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={isParsing} aria-label="Upload PDF resume file" />
                {isParsing ? (
                  <>
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" role="status" aria-label="Analyzing resume" />
                    <span className="text-sm font-medium text-gray-800">Analyzing skills...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-blue-600 transition-colors mb-3" aria-hidden="true" />
                    <span className="text-sm font-medium text-gray-800">Click to upload PDF</span>
                    <span className="text-xs text-gray-500 mt-1">Max file size: 5MB</span>
                  </>
                )}
              </label>
              {resumeError && (
                <div className="mt-3 text-center" role="alert">
                  <p className="text-sm text-red-600 font-medium">{resumeError}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
