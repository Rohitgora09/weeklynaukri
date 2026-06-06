import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  ChevronDown,
  Briefcase,
  Building2,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Rocket,
  FileText,
  Clock,
  MapPin,
  ArrowRight,
  Search,
  Bell,
  BookOpen,
  Award,
  Users,
  TrendingUp,
  ExternalLink,
  Calendar,
  BadgeCheck,
  Sparkles,
  UploadCloud,
  X,
  Loader2,
} from 'lucide-react';
import {
  latestJobs,
  latestResults,
  admitCards,
  answerKeys,
  admissions,
  documents,
  privateJobs,
} from '../data/jobs';

const tabs = [
  { id: 'govt', label: 'Govt Jobs', icon: ShieldCheck },
  { id: 'private', label: 'Private Jobs', icon: Briefcase },
  { id: 'exam', label: 'Exam Prep', icon: GraduationCap },
  { id: 'apply', label: 'Quick Apply', icon: Rocket },
];

/* ─── Tag color helper ──────────────────────────────────── */
function tagClasses(color) {
  switch (color) {
    case 'purple': return 'bg-amber-100 text-amber-700';
    case 'red':    return 'bg-red-100 text-red-600';
    case 'green':  return 'bg-green-100 text-green-700';
    default:       return 'bg-gray-100 text-gray-500';
  }
}

/* ─── Logo components ───────────────────────────────────── */
function LogoSSC() {
  return (
    <div className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
      <ShieldCheck className="w-4 h-4" />
      <span className="text-xs font-bold tracking-widest uppercase">SSC</span>
    </div>
  );
}
function LogoUPSC() {
  return (
    <div className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
      <GraduationCap className="w-4 h-4" />
      <span className="text-xs font-bold tracking-widest uppercase">UPSC</span>
    </div>
  );
}
function LogoRailway() {
  return (
    <div className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
      <Building2 className="w-4 h-4" />
      <span className="text-xs font-bold tracking-widest uppercase">Railway</span>
    </div>
  );
}
function LogoIBPS() {
  return (
    <div className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
      <FileText className="w-4 h-4" />
      <span className="text-sm font-serif italic font-bold text-gray-400 hover:text-gray-600 transition-colors">
        IBPS
      </span>
    </div>
  );
}
function LogoNaukri() {
  return (
    <div className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
      <div className="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center text-[9px] font-bold">
        N
      </div>
      <span className="text-xs font-bold tracking-wider uppercase">NAUKRI</span>
    </div>
  );
}
function LogoLinkedIn() {
  return (
    <div className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
      <div className="grid grid-cols-2 gap-px">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-current" />
        ))}
      </div>
      <span className="text-xs font-bold tracking-wider lowercase">linkedin</span>
    </div>
  );
}

/* ─── Overlay Cards ─────────────────────────────────────── */
function OverlayGovt() {
  return (
    <div className="animate-fade-in-overlay absolute inset-0 bg-black/40 flex items-center justify-center">
      <div className="animate-slide-up-overlay absolute top-1/2 left-1/2 bg-white rounded-2xl shadow-2xl p-6 w-[340px] md:w-[420px]">
        <h3 className="text-base font-semibold mb-1">Latest Government Jobs</h3>
        <p className="text-xs text-gray-500 mb-4">Updated daily from official sources</p>
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4">
          <div className="h-full bg-amber-500 rounded-full" style={{ width: '25%' }} />
        </div>
        <ul className="space-y-3 text-sm">
          {latestJobs.slice(0, 4).map((j, i) => (
            <li key={i} className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">{j.title}</span>
                <span className="block text-xs text-gray-400">{j.org}</span>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tagClasses(j.tagColor)}`}>
                {j.tag}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function OverlayPrivate() {
  return (
    <div className="animate-fade-in-overlay absolute inset-0 bg-black/40 flex items-center justify-center">
      <div className="animate-slide-up-overlay absolute top-1/2 left-1/2 bg-white rounded-2xl shadow-2xl p-6 w-[340px] md:w-[420px]">
        <h3 className="text-base font-semibold mb-1">Top Private Openings</h3>
        <p className="text-xs text-gray-500 mb-4">AI-matched to your profile</p>
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4">
          <div className="h-full bg-amber-500 rounded-full" style={{ width: '67%' }} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'IT & Software', value: '12,430+' },
            { label: 'Banking & Finance', value: '5,870+' },
            { label: 'Healthcare', value: '3,210+' },
            { label: 'Engineering', value: '8,940+' },
          ].map((m, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
              <span className="block text-lg font-semibold text-gray-900">{m.value}</span>
              <span className="text-[11px] text-gray-500">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OverlayExam() {
  return (
    <div className="animate-fade-in-overlay absolute inset-0 bg-black/40 flex items-center justify-center">
      <div className="animate-slide-up-overlay absolute top-1/2 left-1/2 bg-white rounded-2xl shadow-2xl p-6 w-[340px] md:w-[420px]">
        <h3 className="text-base font-semibold mb-1">Mock Test Results</h3>
        <p className="text-xs text-gray-500 mb-4">Practice for SSC, UPSC, Banking & more</p>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-full border-4 border-green-400 flex items-center justify-center">
            <span className="text-sm font-bold text-green-600">92%</span>
          </div>
          <div>
            <span className="block text-sm font-semibold text-gray-900">127/127 Passed</span>
            <span className="text-xs text-green-600 font-medium">All sections cleared</span>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          {['Quantitative Aptitude', 'Reasoning Ability', 'English Language', 'General Awareness'].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-gray-700">{s}</span>
              <span className="ml-auto text-xs text-green-600 font-medium">Passed</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OverlayApply() {
  return (
    <div className="animate-fade-in-overlay absolute inset-0 bg-black/40 flex items-center justify-center">
      <div className="animate-slide-up-overlay absolute top-1/2 left-1/2 bg-white rounded-2xl shadow-2xl p-6 w-[340px] md:w-[420px]">
        <h3 className="text-base font-semibold mb-1">Quick Apply</h3>
        <p className="text-xs text-gray-500 mb-4">One-click application to top openings</p>
        <ul className="space-y-3 mb-5">
          {[
            { text: 'Resume optimized by AI', done: true },
            { text: 'Eligibility verified', done: true },
            { text: 'Documents uploaded', done: true },
            { text: 'Application fee paid', done: false },
          ].map((c, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] ${
                  c.done ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                {c.done ? '✓' : ''}
              </div>
              <span className={c.done ? 'text-gray-900' : 'text-gray-400'}>{c.text}</span>
            </li>
          ))}
        </ul>
        <button className="w-full bg-black text-white py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer">
          Apply Now
        </button>
      </div>
    </div>
  );
}

/* ─── Section Card Component ────────────────────────────── */
function SectionCard({ icon: Icon, title, subtitle, color, children, delay }) {
  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: delay, opacity: 0 }}
    >
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Header */}
        <div className={`px-6 py-4 ${color} flex items-center gap-3`}>
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-base">{title}</h2>
            {subtitle && <p className="text-white/70 text-xs">{subtitle}</p>}
          </div>
        </div>
        {/* Body */}
        <div className="p-4 md:p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Main App ──────────────────────────────────────────── */
export default function Home() {
  const [activeTab, setActiveTab] = useState('govt');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [liveSSCNotices, setLiveSSCNotices] = useState([]);
  const [loadingSSC, setLoadingSSC] = useState(true);

  // Resume Matcher States
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [resumeKeywords, setResumeKeywords] = useState([]);
  const [resumeError, setResumeError] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setResumeError('Please upload a PDF file.');
      return;
    }
    setResumeFile(file);
    setResumeError('');
    setIsParsing(true);
    
    const formData = new FormData();
    formData.append('resume', file);
    
    try {
      const res = await fetch('http://localhost:3000/api/parse-resume', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.text) {
        const words = data.text.toLowerCase().match(/\b[a-z0-9]{3,}\b/g) || [];
        const stopWords = ['the','and','for','with','that','this','you','from','are','can','not','has','was','but','all','experience','skills','education','work'];
        const keywords = [...new Set(words.filter(w => !stopWords.includes(w)))];
        setResumeKeywords(keywords);
        setIsResumeModalOpen(false);
      } else {
        setResumeError(data.error || 'Failed to parse PDF.');
      }
    } catch (err) {
      console.error(err);
      setResumeError('Failed to connect to backend parser.');
    } finally {
      setIsParsing(false);
    }
  };

  // Fetch Live SSC Notices
  useEffect(() => {
    async function fetchSSC() {
      try {
        setLoadingSSC(true);
        const res = await fetch('/api/ssc-notices');
        const data = await res.json();
        if (data.success && data.data) {
          setLiveSSCNotices(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch SSC notices:', err);
      } finally {
        setLoadingSSC(false);
      }
    }
    fetchSSC();
  }, []);

  // Auto-cycle tabs every 4s
  useEffect(() => {
    const id = setInterval(() => {
      setActiveTab((prev) => {
        const idx = tabs.findIndex((t) => t.id === prev);
        return tabs[(idx + 1) % tabs.length].id;
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const overlayMap = {
    govt: <OverlayGovt />,
    private: <OverlayPrivate />,
    exam: <OverlayExam />,
    apply: <OverlayApply />,
  };

  /* ─── Search & Filter Logic ──────────────────────────── */
  const q = searchQuery.toLowerCase().trim();

  function filterItems(items) {
    if (!q) return items;
    return items.filter((item) => {
      const searchable = [
        item.title, item.org, item.company, item.location,
        item.tag, item.date, item.lastDate, item.examDate, item.type,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return searchable.includes(q);
    });
  }

  // Category-based visibility
  const showGovt = selectedCategory === 'All Categories' || selectedCategory === 'Govt Jobs';
  const showPrivate = selectedCategory === 'All Categories' || selectedCategory === 'Private Jobs';
  const showResults = selectedCategory === 'All Categories' || selectedCategory === 'Results';
  const showAdmitCards = selectedCategory === 'All Categories' || selectedCategory === 'Admit Cards';
  const showAnswerKeys = selectedCategory === 'All Categories' || selectedCategory === 'Answer Keys';
  const showAdmissions = selectedCategory === 'All Categories';
  const showDocuments = selectedCategory === 'All Categories';
  const showSSCLive = selectedCategory === 'All Categories' || selectedCategory === 'Govt Jobs';

  // Filtered data
  const filteredGovtJobs = filterItems(latestJobs);
  const filteredResults = filterItems(latestResults);
  const filteredAdmitCards = filterItems(admitCards);
  const filteredAnswerKeys = filterItems(answerKeys);
  const filteredAdmissions = filterItems(admissions);
  const filteredDocuments = filterItems(documents);
  let filteredPrivateJobs = filterItems(privateJobs);
  const filteredSSCNotices = filterItems(liveSSCNotices);

  if (resumeKeywords.length > 0) {
    filteredPrivateJobs = filteredPrivateJobs.filter(job => {
      const jobText = `${job.title} ${job.company} ${job.eligibility || ''}`.toLowerCase();
      // Match if the job text contains at least one extracted keyword from the resume
      return resumeKeywords.some(kw => jobText.includes(kw));
    });
  }

  const hasAnyResults = filteredGovtJobs.length || filteredResults.length || filteredAdmitCards.length ||
    filteredAnswerKeys.length || filteredAdmissions.length || filteredDocuments.length || 
    filteredPrivateJobs.length || filteredSSCNotices.length;

  function handleChipClick(chip) {
    setSearchQuery(chip);
    setSelectedCategory('All Categories');
  }

  return (
    <div className="bg-white min-h-screen">
      {/* ─── NAVIGATION ──────────────────────────────────── */}
      <nav
        className="animate-fade-in-up px-6 py-4 flex items-center justify-between max-w-7xl mx-auto"
        style={{ animationDelay: '0.1s', opacity: 0 }}
      >
        <a href="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="WeeklyNaukri Logo" className="h-16 w-16 md:h-20 md:w-20 object-cover object-center rounded-full shadow-md shrink-0" />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Govt Jobs', chevron: true },
            { label: 'Private Jobs', chevron: true },
            { label: 'Exam Prep', chevron: false },
            { label: 'Career Hub', chevron: false },
          ].map((item) => (
            <a
              key={item.label}
              href="#"
              className="relative flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-black transition-colors py-1 group"
            >
              <span className="relative z-10">{item.label}</span>
              {item.chevron && <ChevronDown className="w-3.5 h-3.5 relative z-10 group-hover:translate-y-0.5 transition-transform" />}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="text-sm text-gray-700 hover:text-black transition-colors hidden sm:block">
            Login
          </a>
          <button className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer">
            Get started free
          </button>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────── */}
      <section className="px-6 pt-24 pb-32 max-w-7xl mx-auto text-center">
        {/* Rating badge */}
        <div
          className="animate-fade-in-up inline-flex items-center gap-2 mb-8"
          style={{ animationDelay: '0.2s', opacity: 0 }}
        >
          <span className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center">
            <Star className="w-3.5 h-3.5 fill-black stroke-black" />
          </span>
          <span className="text-sm font-medium text-black">Trusted by 18.3K+ job seekers weekly</span>
        </div>

        {/* Heading */}
        <h1
          className="animate-fade-in-up text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-normal leading-[1.1] tracking-tight mb-5 flex flex-wrap justify-center gap-x-4 gap-y-2"
          style={{ animationDelay: '0.3s', opacity: 0 }}
        >
          {['Your', 'Weekly', 'Naukri'].map((word, i) => (
            <span key={i} className="inline-block hover:-translate-y-2 hover:text-blue-900 transition-all duration-300 cursor-default">
              {word}
            </span>
          ))}
          <div className="w-full h-0"></div> {/* Line break */}
          {['Updates,', 'Simplified.'].map((word, i) => (
            <span key={i} className="inline-block bg-gradient-to-r from-blue-950 via-blue-800 to-amber-500 bg-clip-text text-transparent hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-default">
              {word}
            </span>
          ))}
        </h1>

        {/* Subheading */}
        <p
          className="animate-fade-in-up text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          style={{ animationDelay: '0.4s', opacity: 0 }}
        >
          Latest sarkari naukri, govt & private jobs, results, admit cards
          and answer keys — updated every week at weeklynaukri.com
        </p>

        {/* CTA */}
        <div className="animate-fade-in-up mb-12" style={{ animationDelay: '0.5s', opacity: 0 }}>
          <button className="bg-amber-500 text-white px-8 py-3 rounded-full text-base font-medium hover:bg-amber-600 transition-colors cursor-pointer shadow-md shadow-amber-500/20">
            Explore Jobs
          </button>
        </div>

        {/* Sliding Banner (Marquee) */}
        <div className="animate-fade-in-up mt-8 relative overflow-hidden flex flex-col gap-4 py-4" style={{ animationDelay: '0.6s', opacity: 0 }}>
          
          {/* Top Marquee (Latest Jobs) - Moving Left */}
          <div className="animate-marquee flex gap-4">
            {[...latestJobs, ...latestJobs, ...latestJobs].map((job, idx) => (
              <Link 
                key={`job-${idx}`} 
                to={`/job/${job.id}`}
                className="flex-shrink-0 w-72 md:w-80 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow hover:border-amber-400"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase">
                    Latest Job
                  </span>
                  <span className="text-[10px] text-gray-500 line-clamp-1">{job.org}</span>
                </div>
                <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">{job.title}</h3>
                {job.lastDate && <p className="text-xs text-gray-500 mt-1">Ends: {job.lastDate}</p>}
              </Link>
            ))}
          </div>

          {/* Bottom Marquee (Admit Cards) - Moving Right */}
          <div className="animate-marquee-reverse flex gap-4">
            {[...admitCards, ...admitCards, ...admitCards].map((card, idx) => (
              <Link 
                key={`admit-${idx}`} 
                to={`/job/${card.id}`}
                className="flex-shrink-0 w-72 md:w-80 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow hover:border-amber-400"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 uppercase">
                    Admit Card
                  </span>
                  <span className="text-[10px] text-gray-500 line-clamp-1">{card.org}</span>
                </div>
                <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">{card.title}</h3>
                {card.date && <p className="text-xs text-gray-500 mt-1">Date: {card.date}</p>}
              </Link>
            ))}
          </div>

          {/* Fade Edges for Marquee */}
          <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </div>

        {/* Partner Logos */}
        <div
          className="animate-fade-in-up mt-24 flex flex-wrap items-center justify-center gap-8 md:gap-14"
          style={{ animationDelay: '0.8s', opacity: 0 }}
        >
          <LogoSSC />
          <LogoUPSC />
          <LogoRailway />
          <LogoIBPS />
          <LogoNaukri />
          <LogoLinkedIn />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────── */}
      {/* JOB LISTING SECTIONS — real content from SarkariResult */}
      {/* ─────────────────────────────────────────────────── */}

      {/* Quick Search Bar */}
      <section className="px-6 max-w-7xl mx-auto -mt-16 mb-16 relative z-10">
        <div
          className="animate-fade-in-up bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-lg"
          style={{ animationDelay: '0.9s', opacity: 0 }}
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for govt jobs, exams, results, admit cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors text-lg cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-black/10 bg-white cursor-pointer"
              >
                <option>All Categories</option>
                <option>Govt Jobs</option>
                <option>Private Jobs</option>
                <option>Results</option>
                <option>Admit Cards</option>
                <option>Answer Keys</option>
              </select>
              <select className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-black/10 bg-white cursor-pointer hidden md:block">
                <option>All India</option>
                <option>Central Govt</option>
                <option>State Govt</option>
                <option>Railway</option>
                <option>Banking</option>
                <option>Defence</option>
                <option>Teaching</option>
              </select>
              <button
                onClick={() => document.getElementById('job-results')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-amber-500 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors cursor-pointer whitespace-nowrap shadow-sm shadow-amber-500/20"
              >
                Search
              </button>
            </div>
          </div>
          {/* Quick-filter chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {['SSC CGL', 'UPSC CSE', 'Railway NTPC', 'IBPS PO', 'Army Agniveer', 'Delhi Police'].map((chip) => (
              <span
                key={chip}
                onClick={() => handleChipClick(chip)}
                className={`px-3 py-1 rounded-full text-xs cursor-pointer transition-colors border ${
                  searchQuery.toLowerCase() === chip.toLowerCase()
                    ? 'bg-black text-white border-black'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Search result indicator */}
          {q && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {hasAnyResults
                  ? <>Showing results for "<span className="font-semibold text-gray-900">{searchQuery}</span>"</>
                  : <>No results found for "<span className="font-semibold text-gray-900">{searchQuery}</span>"</>
                }
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All Categories'); }}
                className="text-xs text-black font-medium hover:underline cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Grid */}
      <section id="job-results" className="px-6 max-w-7xl mx-auto pb-20">

        {/* No Results Message */}
        {q && !hasAnyResults && (
          <div className="animate-fade-in-up text-center py-16">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-sm text-gray-500 mb-4">Try a different search term or clear your filters.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All Categories'); }}
              className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Live SSC Notices ─────────────────────────── */}
          {showSSCLive && (filteredSSCNotices.length > 0 || loadingSSC || !q) && (
          <SectionCard
            icon={ShieldCheck}
            title="Live SSC Notices"
            subtitle="Real-time updates from ssc.gov.in"
            color="bg-blue-950"
            delay="0.9s"
          >
            <div className="space-y-0 divide-y divide-gray-100">
              {loadingSSC ? (
                <div className="py-8 flex flex-col items-center justify-center text-gray-400">
                  <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin mb-2"></div>
                  <p className="text-xs">Connecting to ssc.gov.in...</p>
                </div>
              ) : filteredSSCNotices.length > 0 ? (
                filteredSSCNotices.map((job, i) => (
                  <a href={job.link} target="_blank" rel="noopener noreferrer" key={i} className="flex items-start justify-between py-3 group cursor-pointer block hover:bg-gray-50 -mx-4 px-4 rounded-xl transition-colors">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors line-clamp-2">
                        {job.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {job.date}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full ml-1 mt-1 whitespace-nowrap bg-amber-500 text-white">
                      Live
                    </span>
                  </a>
                ))
              ) : (
                <div className="py-6 text-center text-sm text-gray-500">
                  No recent notices found.
                </div>
              )}
            </div>
          </SectionCard>
          )}

          {/* ── Latest Govt Jobs ─────────────────────────── */}
          {showGovt && filteredGovtJobs.length > 0 && (
          <SectionCard
            icon={ShieldCheck}
            title="Latest Government Jobs"
            subtitle="Updated 06 Jun 2026 — Sarkari Naukri"
            color="bg-gradient-to-r from-indigo-600 to-purple-600"
            delay="1.0s"
          >
            <div className="space-y-0 divide-y divide-gray-100">
              {filteredGovtJobs.map((job, i) => (
                <Link to={`/job/${job.id}`} key={i} className="flex items-start justify-between py-3 group cursor-pointer block hover:bg-gray-50 -mx-4 px-4 rounded-xl transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                      {job.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{job.org}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] text-gray-500 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {job.vacancies} posts
                      </span>
                      <span className="text-[11px] text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {job.lastDate}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ml-3 mt-1 whitespace-nowrap ${tagClasses(job.tagColor)}`}>
                    {job.tag}
                  </span>
                </Link>
              ))}
            </div>
            <button className="mt-3 w-full text-center text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors flex items-center justify-center gap-1 cursor-pointer">
              View All Government Jobs <ArrowRight className="w-4 h-4" />
            </button>
          </SectionCard>
          )}

          {/* ── Latest Results ───────────────────────────── */}
          {showResults && filteredResults.length > 0 && (
          <SectionCard
            icon={Award}
            title="Latest Results"
            subtitle="Sarkari Result — Exam Results 2026"
            color="bg-gradient-to-r from-green-600 to-emerald-600"
            delay="1.1s"
          >
            <div className="space-y-0 divide-y divide-gray-100">
              {filteredResults.map((r, i) => (
                <Link to={`/job/${r.id}`} key={i} className="flex items-center justify-between py-3 group cursor-pointer block hover:bg-gray-50 -mx-4 px-4 rounded-xl transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors truncate">
                      {r.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {r.date}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 ml-3 whitespace-nowrap flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {r.status}
                  </span>
                </Link>
              ))}
            </div>
            <button className="mt-3 w-full text-center text-sm text-green-600 font-medium hover:text-green-800 transition-colors flex items-center justify-center gap-1 cursor-pointer">
              View All Results <ArrowRight className="w-4 h-4" />
            </button>
          </SectionCard>
          )}

          {/* ── Admit Cards ──────────────────────────────── */}
          {showAdmitCards && filteredAdmitCards.length > 0 && (
          <SectionCard
            icon={FileText}
            title="Admit Cards / Hall Tickets"
            subtitle="Download links for upcoming exams"
            color="bg-gradient-to-r from-orange-500 to-amber-500"
            delay="1.2s"
          >
            <div className="space-y-0 divide-y divide-gray-100">
              {filteredAdmitCards.map((ac, i) => (
                <Link to={`/job/${ac.id}`} key={i} className="flex items-center justify-between py-3 group cursor-pointer block hover:bg-gray-50 -mx-4 px-4 rounded-xl transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                      {ac.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Exam: {ac.examDate}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ml-3 whitespace-nowrap ${
                      ac.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {ac.status}
                  </span>
                </Link>
              ))}
            </div>
            <button className="mt-3 w-full text-center text-sm text-orange-600 font-medium hover:text-orange-800 transition-colors flex items-center justify-center gap-1 cursor-pointer">
              View All Admit Cards <ArrowRight className="w-4 h-4" />
            </button>
          </SectionCard>
          )}

          {/* ── Admissions ────────────────────────────────── */}
          {showAdmissions && filteredAdmissions.length > 0 && (
          <SectionCard
            icon={GraduationCap}
            title="Admission Forms"
            subtitle="Universities, Schools & Coaching"
            color="bg-gradient-to-r from-teal-500 to-emerald-500"
            delay="1.25s"
          >
            <div className="space-y-0 divide-y divide-gray-100">
              {filteredAdmissions.map((ad, i) => (
                <Link to={`/job/${ad.id}`} key={i} className="flex items-center justify-between py-3 group cursor-pointer block hover:bg-gray-50 -mx-4 px-4 rounded-xl transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-teal-600 transition-colors truncate">
                      {ad.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-3">
                      <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {ad.org}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {ad.date}</span>
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-teal-500 transition-colors ml-3 shrink-0" />
                </Link>
              ))}
            </div>
            <button className="mt-3 w-full text-center text-sm text-teal-600 font-medium hover:text-teal-800 transition-colors flex items-center justify-center gap-1 cursor-pointer">
              View All Admissions <ArrowRight className="w-4 h-4" />
            </button>
          </SectionCard>
          )}

          {/* ── Documents & Syllabus ────────────────────── */}
          {showDocuments && filteredDocuments.length > 0 && (
          <SectionCard
            icon={FileText}
            title="Important Documents & Syllabus"
            subtitle="Calendars, Scholarships, Certificates"
            color="bg-gradient-to-r from-sky-500 to-blue-500"
            delay="1.28s"
          >
            <div className="space-y-0 divide-y divide-gray-100">
              {filteredDocuments.map((doc, i) => (
                <Link to={`/job/${doc.id}`} key={i} className="flex items-center justify-between py-3 group cursor-pointer block hover:bg-gray-50 -mx-4 px-4 rounded-xl transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-sky-600 transition-colors truncate">
                      {doc.title}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 ml-3 whitespace-nowrap">
                    {doc.type}
                  </span>
                </Link>
              ))}
            </div>
            <button className="mt-3 w-full text-center text-sm text-sky-600 font-medium hover:text-sky-800 transition-colors flex items-center justify-center gap-1 cursor-pointer">
              View All Documents <ArrowRight className="w-4 h-4" />
            </button>
          </SectionCard>
          )}

          {/* ── Private Jobs ──────────────────────────────── */}
          {showPrivate && (
          <SectionCard
            icon={Briefcase}
            title={
              <div className="flex items-center justify-between w-full">
                <span>Private Sector Jobs</span>
                {resumeKeywords.length > 0 ? (
                  <button onClick={() => setResumeKeywords([])} className="text-xs bg-red-500/20 text-red-100 hover:bg-red-500/30 px-3 py-1 rounded-full flex items-center gap-1 transition-colors">
                    <X className="w-3 h-3" /> Clear Match
                  </button>
                ) : (
                  <button onClick={() => setIsResumeModalOpen(true)} className="text-xs bg-white/20 text-white hover:bg-white/30 px-3 py-1 rounded-full flex items-center gap-1 transition-colors shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI Match Resume
                  </button>
                )}
              </div>
            }
            subtitle={resumeKeywords.length > 0 ? `Matched ${filteredPrivateJobs.length} jobs to your skills!` : "Top IT, Banking & corporate openings"}
            color="bg-gradient-to-r from-blue-600 to-cyan-600"
            delay="1.3s"
          >
            {filteredPrivateJobs.length === 0 && resumeKeywords.length > 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No private jobs matched your resume skills perfectly right now.</p>
                <button onClick={() => setResumeKeywords([])} className="mt-2 text-blue-600 font-medium">Clear filter to see all jobs</button>
              </div>
            ) : (
            <div className="space-y-0 divide-y divide-gray-100">
              {filteredPrivateJobs.map((pj, i) => (
                <Link to={`/job/${pj.id}`} key={i} className="flex items-center justify-between py-3 group cursor-pointer block hover:bg-gray-50 -mx-4 px-4 rounded-xl transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {pj.title}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {pj.company}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {pj.location}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-700 ml-3 whitespace-nowrap">
                    {pj.salary}
                  </span>
                </Link>
              ))}
            </div>
            )}
            <button className="mt-3 w-full text-center text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center justify-center gap-1 cursor-pointer">
              View All Private Jobs <ArrowRight className="w-4 h-4" />
            </button>
          </SectionCard>
          )}

        </div>

        {/* ── Answer Keys (full-width) ─────────────────── */}
        {showAnswerKeys && filteredAnswerKeys.length > 0 && (
        <div className="mt-6">
          <SectionCard
            icon={BookOpen}
            title="Answer Keys"
            subtitle="Official & unofficial answer keys"
            color="bg-gradient-to-r from-rose-500 to-pink-500"
            delay="1.4s"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredAnswerKeys.map((ak, i) => (
                <Link
                  to={`/job/${ak.id}`}
                  key={i}
                  className="bg-gray-50 rounded-xl p-4 hover:bg-rose-50 transition-colors cursor-pointer group block"
                >
                  <p className="text-sm font-medium text-gray-900 group-hover:text-rose-600 transition-colors">
                    {ak.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {ak.date}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-2 text-[11px] text-rose-600 font-medium">
                    <ExternalLink className="w-3 h-3" /> View Key
                  </span>
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>
        )}

        {/* ── Stats Banner ─────────────────────────────── */}
        <div
          className="animate-fade-in-up mt-12 bg-gradient-to-r from-blue-950 to-blue-900 rounded-2xl p-8 md:p-12 shadow-xl shadow-blue-900/10"
          style={{ animationDelay: '1.5s', opacity: 0 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '50,000+', label: 'Active Job Listings', icon: Briefcase },
              { value: '18.3K+', label: 'Happy Users', icon: Users },
              { value: '1,200+', label: 'Govt Departments', icon: Building2 },
              { value: '95%', label: 'Match Accuracy', icon: TrendingUp },
            ].map((stat, i) => (
              <div key={i}>
                <stat.icon className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <span className="block text-2xl md:text-3xl font-semibold text-white">{stat.value}</span>
                <span className="text-xs text-blue-200 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <a href="/" className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="WeeklyNaukri Logo" className="h-20 w-20 md:h-24 md:w-24 object-cover object-center rounded-full shadow-md shrink-0" />
              </a>
              <p className="text-sm text-gray-500">India's #1 weekly job portal. Govt & private jobs, results, admit cards — all in one place at weeklynaukri.com</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Government</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="hover:text-black cursor-pointer transition-colors">SSC Jobs</li>
                <li className="hover:text-black cursor-pointer transition-colors">UPSC Jobs</li>
                <li className="hover:text-black cursor-pointer transition-colors">Railway Jobs</li>
                <li className="hover:text-black cursor-pointer transition-colors">Banking Jobs</li>
                <li className="hover:text-black cursor-pointer transition-colors">Defence Jobs</li>
                <li className="hover:text-black cursor-pointer transition-colors">State PSC</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="hover:text-black cursor-pointer transition-colors">Exam Calendar</li>
                <li className="hover:text-black cursor-pointer transition-colors">Syllabus</li>
                <li className="hover:text-black cursor-pointer transition-colors">Previous Papers</li>
                <li className="hover:text-black cursor-pointer transition-colors">Mock Tests</li>
                <li className="hover:text-black cursor-pointer transition-colors">Admit Cards</li>
                <li className="hover:text-black cursor-pointer transition-colors">Answer Keys</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="hover:text-black cursor-pointer transition-colors">Telegram</li>
                <li className="hover:text-black cursor-pointer transition-colors">WhatsApp</li>
                <li className="hover:text-black cursor-pointer transition-colors">YouTube</li>
                <li className="hover:text-black cursor-pointer transition-colors">Instagram</li>
                <li><Link to="/contact" className="hover:text-black cursor-pointer transition-colors">Contact Us</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-black cursor-pointer transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">© 2026 WeeklyNaukri.com — Built for Indian job seekers. Not affiliated with any government body.</p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400">weeklynaukri.com</span>
              <Sparkles className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        </div>
      </footer>

      {/* ── Resume Match Modal ───────────────────────────── */}
      {isResumeModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-fade-in-up">
            <button onClick={() => setIsResumeModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">AI Resume Match</h3>
              <p className="text-sm text-gray-500 mt-1">Upload your PDF resume to instantly find private sector jobs matching your skills.</p>
            </div>
            
            <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group">
              <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={isParsing} />
              {isParsing ? (
                <>
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                  <span className="text-sm font-medium text-gray-700">Analyzing skills...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-blue-600 transition-colors mb-3" />
                  <span className="text-sm font-medium text-gray-700">Click to upload PDF</span>
                  <span className="text-xs text-gray-500 mt-1">Max file size: 5MB</span>
                </>
              )}
            </label>
            {resumeError && <p className="text-sm text-red-500 mt-3 text-center">{resumeError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
