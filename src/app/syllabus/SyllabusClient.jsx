'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  Code2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Card from '../../components/ui/Card';

export default function SyllabusClient({ syllabusList }) {
  const [copiedId, setCopiedId] = useState(null);
  const [activeEmbedId, setActiveEmbedId] = useState(null);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleEmbed = (id) => {
    setActiveEmbedId(activeEmbedId === id ? null : id);
  };

  return (
    <div className="w-full">
      {/* Header Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-4 border border-blue-100">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Official Prep Guides
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-950 tracking-tight mb-4">
          Official Exam Syllabus PDF Vault
        </h1>
        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
          Access clean, compressed, and fast-loading official syllabus PDFs for major government examinations. Clean download mirrors verified daily.
        </p>
      </div>

      {/* Syllabus Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {syllabusList.map((exam) => {
          const absoluteUrl = `https://weeklynaukri.com/syllabus`;
          const htmlCode = `<a href="${absoluteUrl}" target="_blank">Download ${exam.title} (Fast Mirror)</a>`;

          return (
            <Card 
              key={exam.id}
              padding="p-6 md:p-8"
              hover={true}
              className="border-gray-200/80 bg-white flex flex-col h-full rounded-2xl shadow-sm relative overflow-hidden"
            >
              {/* Header Info */}
              <div className="flex flex-col gap-2 mb-6">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                  {exam.org}
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                  {exam.title}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-xs text-gray-500 font-medium">
                  <span>Updated: {exam.lastUpdated}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                  <span>File Size: {exam.fileSize}</span>
                </div>
              </div>

              {/* Overview */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {exam.overview}
              </p>

              {/* Exam Pattern Table */}
              <div className="bg-gray-50/70 border border-gray-150/50 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Exam Pattern Summary</span>
                  <span className="text-[10px] text-gray-500 normal-case font-medium">({exam.pattern.duration})</span>
                </h3>
                <div className="space-y-2 text-xs">
                  {exam.pattern.tier1.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-gray-700 py-1 border-b border-gray-100 last:border-0">
                      <span className="font-medium">{item.subject}</span>
                      <span className="font-bold text-gray-900 shrink-0">{item.questions} Q / {item.marks} Marks</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-150/75 flex justify-between text-[11px] text-gray-500 font-medium">
                  <span>Neg. Marking: {exam.pattern.negativeMarking}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-3">
                <a 
                  href={exam.pdfUrl}
                  download
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold text-sm px-5 py-3 rounded-xl hover:bg-blue-700 hover:shadow-md transition-all duration-200"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </a>
                <a 
                  href={exam.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-150/80 text-gray-800 font-semibold text-sm px-5 py-3 rounded-xl hover:bg-gray-200 transition-all"
                >
                  <ExternalLink className="w-4 h-4" /> View PDF
                </a>
                <button
                  onClick={() => toggleEmbed(exam.id)}
                  className={`flex-1 inline-flex items-center justify-center gap-2 border font-semibold text-sm px-5 py-3 rounded-xl transition-all cursor-pointer ${
                    activeEmbedId === exam.id 
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' 
                      : 'border-gray-250 text-gray-650 hover:bg-gray-50'
                  }`}
                >
                  <Code2 className="w-4 h-4" /> Link Code
                </button>
              </div>

              {/* Embed Code Dropdown */}
              {activeEmbedId === exam.id && (
                <div className="mt-4 p-4 bg-indigo-50/40 border border-indigo-100 rounded-xl animate-fade-in-up">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider">HTML Code for Bloggers</span>
                    <button 
                      onClick={() => handleCopy(exam.id, htmlCode)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer bg-transparent border-none p-0"
                    >
                      {copiedId === exam.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Code
                        </>
                      )}
                    </button>
                  </div>
                  <textarea 
                    readOnly
                    value={htmlCode}
                    className="w-full text-xs font-mono bg-white border border-indigo-150 p-2.5 rounded-lg text-gray-700 select-all focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    rows={2}
                  />
                  <p className="text-[10px] text-indigo-600/80 mt-1.5 leading-normal">
                    Hey fellow bloggers! You can copy and paste this HTML snippet into your article to provide your readers with a clean, fast PDF download mirror.
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Referral Box/SEO Link Insertion */}
      <div className="bg-blue-950 text-white rounded-3xl p-8 md:p-12 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-black mb-3">Prepare Better With Active Practice Exams</h2>
          <p className="text-blue-150 text-sm md:text-base leading-relaxed mb-6">
            Knowing the syllabus is just step one. Put your knowledge to the test with our full-length online test series featuring real-time marking, immediate scorecards, and expert-verified answer guides.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/test-series" 
              className="bg-white text-blue-950 hover:bg-gray-100 transition-colors font-bold text-sm px-6 py-3 rounded-xl"
            >
              Go to Online Practice Series
            </Link>
            <Link 
              href="/" 
              className="bg-blue-900/40 text-white hover:bg-blue-900/60 transition-colors font-bold text-sm px-6 py-3 rounded-xl border border-blue-800/80"
            >
              Back to Sarkari Jobs Board
            </Link>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          {/* Elegant SVG grid pattern */}
          <svg width="100%" height="100%" fill="currentColor">
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
    </div>
  );
}
