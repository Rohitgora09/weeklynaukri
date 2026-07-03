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
  Calculator,
  Megaphone,
  ChevronRight,
  FileCheck2,
  IdCard,
  KeyRound,
  GraduationCap,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Image as ImageIcon,
  FileStack
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { T } from '../lib/LanguageContext';
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

  const ticker = latestJobs.concat(latestResults).slice(0, 10);
  const totalLive = latestJobs.length + admitCards.length + latestResults.length + answerKeys.length + admissions.length + documents.length + privateJobs.length;

  return (
    <div className="bg-white min-h-screen flex flex-col w-full" data-testid="home-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar onCategorySelect={handleCategorySelect} />

      {/* Ticker / Notice Marquee Banner */}
      <div className="bg-gradient-to-r from-rose-600 to-red-500 text-white overflow-hidden marquee-wrap w-full flex items-center">
        <div className="max-w-7xl mx-auto flex items-center w-full">
          <span className="bg-ink text-white text-[11px] font-extrabold uppercase tracking-widest px-4 py-2.5 shrink-0 flex items-center">
            LIVE
          </span>
          <span className="text-white/45 px-2 shrink-0 select-none font-bold">|</span>
          <div className="overflow-hidden flex-1">
            <div className="animate-marquee text-xs py-2">
              {ticker.concat(ticker).map((t, i) => (
                <Link key={i} href={`/job/${t.url_slug || t.slug || t.id}`} className="mx-6 hover:underline font-medium inline-block">
                  • {t.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white w-full">
        {/* Animated Glow Blobs */}
        <div className="blob bg-blue-300 w-72 h-72 -top-20 -left-10" />
        <div className="blob bg-emerald-200 w-72 h-72 top-10 right-0 animate-delay-3000" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 dot-grid opacity-40" />

        <div className="relative max-w-7xl mx-auto px-4 py-10 lg:py-14 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-action font-bold bg-blue-50 border border-blue-100 rounded-full px-3 py-1 mb-4">
            <Sparkles size={12} /> Sarkari Result Hub · 2026
          </div>
          
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight leading-[1.08] text-ink mb-4 max-w-5xl mx-auto">
            <T
              en={<>Latest <span className="text-gradient">Govt &amp; Private Jobs</span>, Sarkari Results &amp; Admit Cards</>}
              hi={<>नवीनतम <span className="text-gradient">सरकारी और प्राइवेट नौकरियां</span>, सरकारी रिजल्ट और एडमिट कार्ड</>}
            />
          </h1>
          
          <p className="text-slatebody text-sm sm:text-base mb-6 max-w-2xl mx-auto leading-relaxed">
            <T
              en={<><strong className="text-ink">WeeklyNaukri</strong> is a fast, privacy-first hub for <strong className="text-ink">Sarkari Naukri</strong>, govt jobs, private careers, and competitive exams. Get verified <strong className="text-ink">admit cards, results &amp; keys</strong>.</>}
              hi={<><strong className="text-ink">WeeklyNaukri</strong> — सरकारी नौकरी, प्राइवेट जॉब्स और प्रतियोगी परीक्षाओं का तेज़ और भरोसेमंद हब। वेरिफाइड <strong className="text-ink">एडमिट कार्ड, रिजल्ट और आंसर की</strong> पाएं।</>}
            />
          </p>

          {/* Search input bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
              }
            }} 
            className="mt-6 flex items-center bg-white border-2 border-ink rounded-full overflow-hidden max-w-xl mx-auto shadow-sm focus-within:ring-4 focus-within:ring-action/15 transition"
          >
            <Search size={18} className="ml-4 text-muted" />
            <input 
              value={searchQuery} 
              onChange={handleSearchChange} 
              placeholder="Search a job, exam or result…" 
              className="w-full px-3 py-3.5 text-sm outline-none bg-transparent"
              data-testid="hero-search-input" 
            />
            <button type="submit" className="bg-action text-white text-sm font-bold px-6 py-3.5 hover:bg-blue-800 transition-colors cursor-pointer" data-testid="hero-search-button">Search</button>
          </form>

          {/* Statistics chips row */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
            {[
              { icon: TrendingUp, label: `${totalLive > 0 ? totalLive : "50"}+ live listings`, c: "text-action bg-blue-50 border-blue-100" },
              { icon: Zap, label: "Updated daily", c: "text-ok bg-green-50 border-green-100" },
              { icon: ShieldCheck, label: "Privacy-first tools", c: "text-brand bg-indigo-50 border-indigo-100" },
              { icon: CheckCircle2, label: "100% free", c: "text-rose-600 bg-rose-50 border-rose-100" },
            ].map((s, i) => (
              <span key={i} className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-full border px-3 py-1.5 ${s.c}`}>
                <s.icon size={13} /> {s.label}
              </span>
            ))}
          </div>

          {/* Action links */}
          <div className="mt-8 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Govt Tech Jobs Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm text-left hover:border-blue-200 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-650 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Sparkles className="w-4.5 h-4.5 text-amber-300" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-bold text-ink text-xs">Govt Tech Jobs</h2>
                  <p className="text-[10px] text-slatebody">Software & IT posts</p>
                </div>
              </div>
              <Link 
                href="/it-government-jobs-2026"
                className="bg-brand hover:bg-action text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors shadow-sm shrink-0 ml-2"
                aria-label="Explore Technical and IT Government Jobs"
              >
                Explore
              </Link>
            </div>

            {/* SSC GD 2026 Calculator Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm text-left hover:border-blue-200 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Calculator className="w-4.5 h-4.5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-bold text-ink text-xs">SSC GD Estimator</h2>
                  <p className="text-[10px] text-slatebody">Marks & cut-off calculator</p>
                </div>
              </div>
              <Link 
                href="/ssc-gd-2026" 
                className="bg-brand hover:bg-action text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors shadow-sm shrink-0 ml-2"
                aria-label="Explore SSC GD Score Calculator"
              >
                Calculate
              </Link>
            </div>
          </div>

          {/* AI Resume Upload Match button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="bg-action text-white border-none px-8 py-3.5 rounded-full font-bold text-sm hover:bg-blue-800 hover:-translate-y-0.5 transition-all shadow-md flex items-center gap-2 cursor-pointer"
              aria-label="Upload your resume to find matching jobs using AI"
            >
              <UploadCloud className="w-5 h-5 text-white" aria-hidden="true" /> Match with AI Resume
            </button>
          </div>

          {resumeKeywords.length > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-green-50 text-green-800 border border-green-200 px-4 py-2 rounded-xl text-xs" role="status">
              <span>Matched private jobs by skills: <strong>{resumeKeywords.join(', ')}</strong></span>
              <button onClick={() => setResumeKeywords([])} className="hover:text-green-950 font-bold ml-1 cursor-pointer bg-transparent border-none p-0" aria-label="Clear resume skill matches">
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Quick search chips */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto" role="group" aria-label="Trending search suggestions">
            <span className="text-xs text-slatebody font-medium">Trending:</span>
            {['SSC GD', 'SSC CGL', 'UPSC Prelims', 'Railway Group D', 'Bank PO', 'State PSC'].map(chip => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-action text-xs text-slatebody px-3.5 py-1.5 rounded-full transition-all cursor-pointer font-medium"
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
            <p className="text-sm text-ink font-semibold leading-normal">
              Join our channels for Sarkari Result &amp; Job Alerts!
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

      {/* Category Sticky Nav Strip */}
      <section className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-[64px] z-30 hidden md:block w-full">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2 overflow-x-auto feed-scroll">
          {[
            { id: 'Results', label: 'Latest Results', icon: FileCheck2 },
            { id: 'Admit Cards', label: 'Admit Cards', icon: IdCard },
            { id: 'Govt Jobs', label: 'Latest Govt Jobs', icon: Briefcase },
            { id: 'Answer Keys', label: 'Answer Keys', icon: KeyRound },
            { id: 'Admissions', label: 'Admissions', icon: GraduationCap },
            { id: 'Private Jobs', label: 'Private Jobs', icon: Building2 }
          ].map((item) => {
            const Icon = item.icon;
            const count = item.id === 'Results' ? latestResults.length : 
                          item.id === 'Admit Cards' ? admitCards.length :
                          item.id === 'Govt Jobs' ? latestJobs.length :
                          item.id === 'Answer Keys' ? answerKeys.length :
                          item.id === 'Admissions' ? admissions.length :
                          item.id === 'Private Jobs' ? privateJobs.length : 0;
            return (
              <button 
                key={item.id} 
                onClick={() => {
                  setSelectedCategory(item.id);
                  document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group shrink-0 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === item.id 
                    ? 'border-action text-action bg-blue-50' 
                    : 'border-slate-200 bg-white text-slatebody hover:border-action hover:text-action hover:bg-blue-50'
                }`}
              >
                <Icon size={14} className="text-action" /> {item.label}
                {count > 0 && <span className="tabular text-[10px] bg-slate-100 group-hover:bg-white rounded-full px-1.5 py-0.5">{count}</span>}
              </button>
            );
          })}
        </div>
      </section>

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
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search for jobs by post name, department, location, or exam"
              className="w-full pl-12 pr-4 py-4 rounded-full border border-slate-200 shadow-md shadow-slate-100/50 outline-none focus:ring-4 focus:ring-action/10 focus:border-action bg-slate-50/50 hover:bg-slate-50 transition-all text-sm font-medium"
            />
          </div>
        )}

        {/* Tab Selection Filter */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto gap-1" role="tablist" aria-label="Job category tabs">
          {['All Categories', 'Govt Jobs', 'Private Jobs', 'Results', 'Admit Cards', 'Answer Keys', 'Exam Calendar'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedCategory(tab)}
              role="tab"
              aria-selected={selectedCategory === tab}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer rounded-t-lg ${
                selectedCategory === tab 
                  ? 'border-action text-action bg-blue-50/50' 
                  : 'border-transparent text-slatebody hover:text-ink hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* No results state */}
        {hasNoResults && (
          <div className="flex flex-col items-center justify-center py-16 text-center" role="status" aria-live="polite">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-200">
              <SearchX className="w-8 h-8 text-slate-400" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-ink mb-2">No results found</h2>
            <p className="text-sm text-slatebody max-w-md">
              We couldn't find any listings matching "<strong className="text-ink">{searchQuery}</strong>". Try a different keyword or browse all categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
              }}
              className="mt-4 text-sm font-semibold text-action hover:text-blue-850 transition-colors cursor-pointer bg-transparent border-none"
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
              title={<T en="Private Jobs" hi="प्राइवेट नौकरियां" />}
              subtitle="Top hiring companies matching skills"
              iconName="Building2"
              variant="private"
              accent="action"
              items={filteredPrivateJobs}
              limit={20}
              emptyText="No private sector jobs match this query."
            />
          </div>
        ) : selectedCategory === 'Results' ? (
          <div className="max-w-4xl mx-auto w-full">
            <JobList
              title={<T en="Sarkari Results" hi="सरकारी रिजल्ट" />}
              subtitle="Latest exam results declared"
              iconName="FileCheck2"
              accent="alert"
              items={filteredResults}
              limit={24}
              emptyText="No declared results match your query."
            />
          </div>
        ) : selectedCategory === 'Admit Cards' ? (
          <div className="max-w-4xl mx-auto w-full">
            <JobList
              title={<T en="Admit Cards" hi="एडमिट कार्ड" />}
              subtitle="Download hall tickets & exam dates"
              iconName="IdCard"
              accent="action"
              items={filteredAdmitCards}
              limit={24}
              emptyText="No admit cards match your query."
            />
          </div>
        ) : selectedCategory === 'Answer Keys' ? (
          <div className="max-w-4xl mx-auto w-full">
            <JobList
              title={<T en="Answer Keys" hi="आंसर की" />}
              subtitle="Official exam answer sheets"
              iconName="KeyRound"
              accent="ok"
              items={filteredAnswerKeys}
              limit={24}
              emptyText="No answer keys match your query."
            />
          </div>
        ) : (
          !hasNoResults && (
            <div className="space-y-10">
              {/* Primary Grid: Results, Admit Cards, Latest Jobs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {showResults && (
                  <JobList
                    title={<T en="Sarkari Results" hi="सरकारी रिजल्ट" />}
                    subtitle="Latest exam results declared"
                    iconName="FileCheck2"
                    accent="alert"
                    items={filteredResults}
                    limit={15}
                    emptyText="No declared results match your query."
                    viewMoreUrl="/results"
                  />
                )}
                {showAdmitCards && (
                  <JobList
                    title={<T en="Admit Cards" hi="एडमिट कार्ड" />}
                    subtitle="Download hall tickets & exam dates"
                    iconName="IdCard"
                    accent="action"
                    items={filteredAdmitCards}
                    limit={15}
                    emptyText="No admit cards match your query."
                    viewMoreUrl="/admit-cards"
                  />
                )}
                {showGovt && (
                  <JobList
                    title={<T en="Latest Govt Jobs" hi="नवीनतम सरकारी नौकरियां" />}
                    subtitle="Central & state government vacancies"
                    iconName="Briefcase"
                    accent="brand"
                    items={filteredGovtJobs}
                    limit={15}
                    emptyText="No government job listings match your query."
                    viewMoreUrl="/latest-jobs"
                  />
                )}
              </div>

              {/* Secondary Grid: Answer Keys, Admissions, Private Jobs */}
              <LazySection height="450px" forceVisible={forceLazyVisible}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                  {showAnswerKeys && (
                    <JobList
                      title={<T en="Answer Keys" hi="आंसर की" />}
                      subtitle="Official exam answer sheets"
                      iconName="KeyRound"
                      accent="ok"
                      items={filteredAnswerKeys}
                      limit={10}
                      emptyText="No answer keys match your query."
                      viewMoreUrl="/answer-keys"
                    />
                  )}
                  {showAdmissions && (
                    <JobList
                      title={<T en="Admissions" hi="एडमिशन" />}
                      subtitle="Colleges & university entrance exams"
                      iconName="GraduationCap"
                      accent="warn"
                      items={filteredAdmissions}
                      limit={10}
                      emptyText="No admission alerts match your query."
                    />
                  )}
                  {showPrivate && (
                    <JobList
                      title={<T en="Private Jobs" hi="प्राइवेट नौकरियां" />}
                      subtitle="Top hiring companies matching skills"
                      iconName="Building2"
                      accent="action"
                      variant="private"
                      items={filteredPrivateJobs}
                      limit={10}
                      emptyText="No private sector jobs match this query."
                      viewMoreUrl="/referrals"
                    />
                  )}
                </div>
              </LazySection>

              {/* Tertiary Grid: Live SSC Notices */}
              {showGovt && filteredSSCNotices.length > 0 && (
                <LazySection height="350px" forceVisible={forceLazyVisible}>
                  <div className="max-w-4xl mx-auto w-full">
                    <JobList
                      title="Live SSC Notices"
                      subtitle="Staff Selection Commission live alerts"
                      iconName="Bell"
                      accent="brand"
                      items={filteredSSCNotices}
                      limit={8}
                      emptyText="No live notices found."
                    />
                  </div>
                </LazySection>
              )}
            </div>
          )
        )}

        {/* Trust band */}
        <section className="bg-ink text-white w-full rounded-2xl overflow-hidden mt-16 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CheckCircle2, t: "Verified Sources", d: "Cross-checked with official portals" },
              { icon: Zap, t: "Updated Daily", d: "Auto-ingested live notifications" },
              { icon: ShieldCheck, t: "Privacy-First", d: "Image tools never leave your device" },
              { icon: Sparkles, t: "Free Forever", d: "No signup, no paywalls" },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="grid place-items-center w-10 h-10 rounded-lg bg-white/10 text-white shrink-0"><s.icon size={18} /></span>
                <div>
                  <p className="font-heading font-bold text-sm">{s.t}</p>
                  <p className="text-xs text-slate-350 leading-snug mt-0.5">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tools + FAQ Accordion */}
        <section className="mt-16 bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="font-heading font-bold text-2xl tracking-tight text-ink">Free Exam Utilities</h2>
              <p className="text-slatebody text-sm mt-1 mb-5">Built for candidates. Fast, privacy-first, no signup.</p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: ImageIcon, title: "Photo & Signature Resizer", desc: "SSC, UPSC presets. 100% in-browser.", to: "/image-resizer", testid: "tool-image-resizer", grad: "from-blue-600 to-sky-500" },
                  { icon: Calculator, title: "SSC GD 2026 Calculator", desc: "Marks, cut-off & PET estimator.", to: "/ssc-gd-2026", testid: "tool-ssc-gd", grad: "from-emerald-600 to-green-500" },
                  { icon: FileStack, title: "Syllabus PDF Vault", desc: "Patterns, weightage & downloads.", to: "/syllabus", testid: "tool-syllabus", grad: "from-indigo-700 to-blue-700" },
                ].map((t) => (
                  <Link key={t.to} href={t.to} data-testid={t.testid}
                    className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1.5 hover:border-action/30"
                  >
                    <span className={`grid place-items-center w-12 h-12 rounded-xl bg-gradient-to-br ${t.grad} text-white mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                      <t.icon size={22} />
                    </span>
                    <h3 className="font-heading font-bold text-sm text-ink">{t.title}</h3>
                    <p className="text-xs text-muted mt-1 leading-relaxed">{t.desc}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-action mt-3">Open <ArrowRight size={12} /></span>
                  </Link>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3 bg-green-50 rounded-xl border border-green-100 p-4">
                <ShieldCheck size={20} className="text-ok shrink-0" />
                <p className="text-sm text-slatebody"><strong className="text-ink">Privacy-first:</strong> Image tools run 100% inside your browser. Your photos are never uploaded to any server.</p>
              </div>
            </div>

            {/* FAQ Accordion Side Block */}
            <aside data-testid="home-faq-sidebar">
              <h2 className="font-heading font-bold text-2xl tracking-tight text-ink mb-4">FAQ</h2>
              <div className="space-y-3">
                {[
                  { q: "What is WeeklyNaukri.com?", a: "WeeklyNaukri.com is a mobile-first Sarkari Naukri hub providing the latest government jobs, results, admit cards, answer keys, admissions and exam utilities for Indian competitive exams, updated daily." },
                  { q: "How often is the portal updated?", a: "Our feeds for Latest Jobs, Results and Admit Cards are refreshed every day so candidates never miss an official notification." },
                  { q: "Are the photo resizer and calculators free?", a: "Yes. All utilities including the Photo & Signature Resizer and the SSC GD 2026 Marks Calculator are 100% free and process data locally in your browser." },
                  { q: "Is my photo uploaded to any server?", a: "No. The image resizer is privacy-first — your photo and signature are processed entirely inside your browser using HTML5 canvas and never leave your device." },
                ].map((f, i) => (
                  <details key={i} className="bg-white rounded-xl border border-slate-200 group overflow-hidden" data-testid={`faq-item-${i}`}>
                    <summary className="cursor-pointer list-none px-4 py-3.5 font-semibold text-sm flex justify-between items-center hover:bg-slate-50 transition-colors text-ink">
                      {f.q}<span className="text-action group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                    </summary>
                    <p className="px-4 pb-3.5 text-sm text-slatebody leading-relaxed border-t border-slate-50 pt-2">{f.a}</p>
                  </details>
                ))}
              </div>
            </aside>
          </div>
        </section>

        {/* SEO Text Block / Info Section */}
        <div className="mt-16 border-t border-slate-200 pt-16 text-left max-w-4xl mx-auto contain-layout-paint">
          <h2 className="text-2xl font-bold text-ink mb-6">WeeklyNaukri - India's Premier Sarkari Result & Latest Govt Jobs Portal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slatebody leading-relaxed">
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
        </div>
      </section>

      <LazySection height="400px" forceVisible={forceLazyVisible}>
        <Footer />
      </LazySection>

      {/* AI Resume Upload Match Modal */}
      {isResumeModalOpen && (
        <div 
          className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="resume-modal-title"
          onClick={(e) => { if (e.target === e.currentTarget) setIsResumeModalOpen(false); }}
        >
          <Card padding="p-6 relative w-full max-w-md animate-fade-in-up" hover={false}>
            <div ref={modalRef}>
              <button 
                onClick={() => setIsResumeModalOpen(false)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer bg-transparent border-none p-1 rounded-lg"
                aria-label="Close resume upload dialog"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-50 text-action rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 id="resume-modal-title" className="text-xl font-bold text-ink">AI Resume Match</h3>
                <p className="text-sm text-slatebody mt-1">Upload your PDF resume to instantly find private sector jobs matching your skills.</p>
              </div>
              
              <label className="border-2 border-dashed border-slate-350 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 hover:border-blue-300 transition-all group">
                <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={isParsing} aria-label="Upload PDF resume file" />
                {isParsing ? (
                  <>
                    <Loader2 className="w-8 h-8 text-action animate-spin mb-3" role="status" aria-label="Analyzing resume" />
                    <span className="text-sm font-medium text-slatebody">Analyzing skills...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-action transition-colors mb-3" aria-hidden="true" />
                    <span className="text-sm font-medium text-slatebody">Click to upload PDF</span>
                    <span className="text-xs text-slate-400 mt-1">Max file size: 5MB</span>
                  </>
                )}
              </label>
              {resumeError && (
                <div className="mt-3 text-center" role="alert">
                  <p className="text-sm text-red-650 font-semibold">{resumeError}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
