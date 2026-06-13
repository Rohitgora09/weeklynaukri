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
  Menu
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import JobList from '../components/jobs/JobList';
import SarkariCalendar from '../components/jobs/SarkariCalendar';
import Card from '../components/ui/Card';
import Tag from '../components/ui/Tag';
import { api } from '../services/api';

// Simple client-side list wrapper for lazy loading sections
function LazySection({ children }) {
  return children;
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
  
  // Custom mock data for admissions/documents/answer keys/private sectors
  const [privateJobs, setPrivateJobs] = useState([
    { id: 'p1', title: 'Senior Software Engineer (Node/React)', company: 'InnovateTech Solutions', location: 'Bangalore / Remote', salary: '₹12L - ₹18L', tag: 'Hot', tagColor: 'red' },
    { id: 'p2', title: 'Data Analyst', company: 'FinMetrics Solutions', location: 'Mumbai (On-site)', salary: '₹6L - ₹9L', tag: 'Remote', tagColor: 'green' },
    { id: 'p3', title: 'Digital Marketing Specialist', company: 'GrowthHackers Agency', location: 'Hyderabad (Hybrid)', salary: '₹5L - ₹8L', tag: 'Featured', tagColor: 'purple' },
    { id: 'p4', title: 'UI/UX Designer', company: 'DesignCraft Studios', location: 'Pune / Remote', salary: '₹8L - ₹12L', tag: 'New', tagColor: 'orange' }
  ]);
  
  const [answerKeys, setAnswerKeys] = useState(
    initialJobs.answerKeys && initialJobs.answerKeys.length > 0 
      ? initialJobs.answerKeys 
      : [
          { id: 'ans1', title: 'SSC GD Constable Answer Key 2026', date: '10 Jun 2026' },
          { id: 'ans2', title: 'UPSC Civil Services Prelims Answer Key 2026', date: '08 Jun 2026' },
          { id: 'ans3', title: 'IBPS PO Main Answer Key 2026', date: '05 Jun 2026' },
          { id: 'ans4', title: 'RRB NTPC CBT 1 Official Answer Key 2026', date: '01 Jun 2026' }
        ]
  );

  const [admissions, setAdmissions] = useState(
    initialJobs.admissions && initialJobs.admissions.length > 0 
      ? initialJobs.admissions 
      : [
          { id: 'adm1', title: 'Delhi University UG Admission 2026', date: '05 Jun 2026' },
          { id: 'adm2', title: 'IIT JEE Advanced Registration 2026', date: '30 May 2026' },
          { id: 'adm3', title: 'NEET UG Counselling Choice Filling 2026', date: '25 May 2026' },
          { id: 'adm4', title: 'IGNOU Admission Form July Cycle 2026', date: '20 May 2026' }
        ]
  );

  const [documents, setDocuments] = useState(
    initialJobs.documents && initialJobs.documents.length > 0 
      ? initialJobs.documents 
      : [
          { id: 'doc1', title: 'UP Scholarship Online Form 2026', date: '12 Jun 2026' },
          { id: 'doc2', title: 'Aadhar Card Mobile Number Link Guide', date: '08 Jun 2026' },
          { id: 'doc3', title: 'Pan Card Online Correction Portal 2026', date: '01 Jun 2026' },
          { id: 'doc4', title: 'Voter ID Card Online Registration 2026', date: '24 May 2026' }
        ]
  );

  // AI Resume Match States
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [resumeKeywords, setResumeKeywords] = useState([]);
  const [resumeError, setResumeError] = useState('');

  const debounceTimer = useRef(null);

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

  return (
    <div className="bg-white min-h-screen flex flex-col w-full">
      <Navbar onCategorySelect={handleCategorySelect} />

      {/* Hero Banner Section */}
      <section className="bg-gradient-to-b from-blue-50/50 to-white px-6 py-12 md:py-20 text-center w-full">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" /> India's Most Trusted Sarkari Result Portal
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-blue-950 leading-tight tracking-tight mb-6">
            Your Gateway to Indian <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Government & Private Jobs</span>
          </h1>
          
          <p className="text-gray-600 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Get instant updates on latest government job openings, sarkari results, admit cards, answer keys, and exam syllabus from all sectors.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-black text-white px-8 py-3.5 rounded-full font-medium hover:bg-gray-800 hover:-translate-y-0.5 transition-all shadow-md shadow-black/10 cursor-pointer"
            >
              Explore Job Openings
            </button>
            
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="bg-white text-gray-800 border border-gray-200 px-8 py-3.5 rounded-full font-medium hover:bg-gray-50 hover:-translate-y-0.5 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-blue-500" /> Match with AI Resume
            </button>
          </div>

          {resumeKeywords.length > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl text-xs">
              <span>Matched private jobs by skills: <strong>{resumeKeywords.join(', ')}</strong></span>
              <button onClick={() => setResumeKeywords([])} className="hover:text-green-950 font-bold ml-1"><X className="w-3.5 h-3.5" /></button>
            </div>
          )}

          {/* Quick search chips */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            <span className="text-xs text-gray-400 font-medium">Trending Searches:</span>
            {['SSC CGL', 'UPSC Prelims', 'Railway Group D', 'Bank PO', 'Agneepath Scheme', 'State PSC'].map(chip => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="bg-gray-50 border border-gray-200/60 hover:bg-gray-100 hover:border-gray-300 text-xs text-gray-600 px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Job Search Core Section */}
      <section id="search-section" className="max-w-7xl mx-auto px-6 py-12 w-full flex-1">
        {/* Search Bar Input */}
        {selectedCategory !== 'Exam Calendar' && (
          <div className="relative max-w-2xl mx-auto mb-12">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by post name, department, location, or exam..."
              defaultValue={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200/80 shadow-md shadow-gray-100/50 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-gray-50/50 hover:bg-gray-50 transition-all text-sm font-medium"
            />
          </div>
        )}

        {/* Tab Selection Filter */}
        <div className="flex border-b border-gray-100 mb-8 overflow-x-auto gap-1">
          {['All Categories', 'Govt Jobs', 'Private Jobs', 'Results', 'Admit Cards', 'Answer Keys', 'Exam Calendar'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedCategory(tab)}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === tab 
                  ? 'border-black text-black' 
                  : 'border-transparent text-gray-400 hover:text-gray-650'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Display grids or Exam Calendar */}
        {selectedCategory === 'Exam Calendar' ? (
          <SarkariCalendar allItems={[...latestJobs, ...admitCards, ...latestResults, ...answerKeys, ...admissions, ...documents]} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Main columns */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Govt jobs feed */}
              {showGovt && (
                <JobList
                  title="Latest Govt Jobs"
                  subtitle="Central & state government vacancies"
                  icon={Briefcase}
                  color="bg-blue-600"
                  items={filteredGovtJobs}
                  limit={12}
                  emptyText="No government job listings match your query."
                />
              )}

              {/* Results feed */}
              {showResults && (
                <JobList
                  title="Sarkari Results"
                  subtitle="Latest exam results declared"
                  icon={BookOpen}
                  color="bg-green-600"
                  items={filteredResults}
                  limit={12}
                  emptyText="No declared results match your query."
                />
              )}

              {/* Admit cards feed */}
              {showAdmitCards && (
                <JobList
                  title="Admit Cards"
                  subtitle="Download hall tickets & exam dates"
                  icon={Calendar}
                  color="bg-orange-500"
                  items={filteredAdmitCards}
                  limit={12}
                  emptyText="No admit cards match your query."
                />
              )}

            </div>

            {/* Right sidebar */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Live SSC notifications */}
              {showGovt && filteredSSCNotices.length > 0 && (
                <JobList
                  title="Live SSC Notices"
                  subtitle="Staff Selection Commission live alerts"
                  icon={Bell}
                  color="bg-purple-600"
                  variant="list"
                  items={filteredSSCNotices}
                  limit={8}
                />
              )}

              {/* Private sector jobs */}
              {showPrivate && (
                <JobList
                  title="Private Jobs"
                  subtitle="Top hiring companies matching skills"
                  icon={Building2}
                  color="bg-indigo-650"
                  variant="private"
                  items={filteredPrivateJobs}
                  limit={6}
                  emptyText="No private sector jobs match this query."
                />
              )}

            </div>

          </div>
        )}

        {/* Admissions, Answer Keys, Documents - grid splits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {showAdmissions && filteredAdmissions.length > 0 && (
            <JobList
              title="Admissions"
              subtitle="Colleges & university entrance exams"
              variant="list"
              items={filteredAdmissions}
              limit={5}
            />
          )}

          {showAnswerKeys && filteredAnswerKeys.length > 0 && (
            <JobList
              title="Answer Keys"
              subtitle="Official exam answer sheets"
              variant="list"
              items={filteredAnswerKeys}
              limit={5}
            />
          )}

          {showDocuments && filteredDocuments.length > 0 && (
            <JobList
              title="Important Documents"
              subtitle="Scholarships, certificate guides & forms"
              variant="list"
              items={filteredDocuments}
              limit={5}
            />
          )}
        </div>
        
        {/* Stats metrics card banner */}
        <LazySection>
          <div className="mt-16 bg-gradient-to-r from-blue-950 to-blue-900 rounded-2xl p-8 md:p-12 shadow-xl shadow-blue-900/10 text-center text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '50,000+', label: 'Active Job Listings', icon: Briefcase },
                { value: '18.3K+', label: 'Happy Users', icon: Users },
                { value: '1,200+', label: 'Govt Departments', icon: Building2 },
                { value: '95%', label: 'Match Accuracy', icon: TrendingUp },
              ].map((stat, i) => (
                <div key={i}>
                  <stat.icon className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <span className="block text-2xl md:text-3xl font-semibold">{stat.value}</span>
                  <span className="text-xs text-blue-200 mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </LazySection>
      </section>

      <Footer onFooterSearch={handleFooterSearch} />

      {/* AI Resume Upload Match Modal */}
      {isResumeModalOpen && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card padding="p-6 relative w-full max-w-md animate-fade-in-up" hover={false}>
            <button 
              onClick={() => setIsResumeModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 text-amber-600">
                <Sparkles className="w-6 h-6" />
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
          </Card>
        </div>
      )}
    </div>
  );
}
