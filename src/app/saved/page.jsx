'use client';

import Link from 'next/link';
import { Bookmark, Trash2, ChevronRight, Briefcase } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useSavedJobs } from '../../hooks/useSavedJobs';
import { T } from '../../lib/LanguageContext';

const CATEGORY_LABELS = {
  latestJobs: { en: 'Govt Job', hi: 'सरकारी नौकरी' },
  results: { en: 'Result', hi: 'रिजल्ट' },
  admitCards: { en: 'Admit Card', hi: 'एडमिट कार्ड' },
  answerKeys: { en: 'Answer Key', hi: 'आंसर की' },
  privateJobs: { en: 'Private Job', hi: 'प्राइवेट जॉब' },
};

export default function SavedJobsPage() {
  const { saved, removeSaved } = useSavedJobs();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-10 flex-1 w-full">
        <div className="flex items-center gap-3 mb-2">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-blue-50 text-action">
            <Bookmark size={20} />
          </span>
          <h1 className="font-heading font-extrabold text-2xl text-ink">
            <T en="Saved Jobs" hi="सेव की गई नौकरियां" />
          </h1>
        </div>
        <p className="text-sm text-slatebody mb-8">
          <T
            en="Bookmarks are stored on this device — no login needed."
            hi="बुकमार्क इसी डिवाइस पर सेव रहते हैं — लॉगिन की ज़रूरत नहीं।"
          />
        </p>

        {saved.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <Briefcase className="mx-auto text-slate-300 mb-3" size={36} />
            <p className="font-semibold text-ink mb-1">
              <T en="No saved jobs yet" hi="अभी तक कोई जॉब सेव नहीं की" />
            </p>
            <p className="text-sm text-slatebody mb-6">
              <T
                en="Tap the bookmark icon on any job to save it here."
                hi="किसी भी जॉब पर बुकमार्क आइकन दबाकर उसे यहां सेव करें।"
              />
            </p>
            <Link
              href="/latest-jobs"
              className="inline-flex items-center gap-1.5 bg-action text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-blue-800 transition-colors"
            >
              <T en="Browse Latest Jobs" hi="नवीनतम नौकरियां देखें" /> <ChevronRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {saved.map((job) => {
              const cat = CATEGORY_LABELS[job.category];
              return (
                <div
                  key={job.slug}
                  className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-3 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/job/${job.slug}`}
                      className="font-semibold text-sm text-ink hover:text-action block truncate"
                    >
                      {job.title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {job.org && <span className="text-[11px] text-muted">{job.org}</span>}
                      {cat && (
                        <span className="text-[9px] font-bold uppercase rounded-full px-2 py-0.5 bg-blue-50 text-action border border-blue-100">
                          <T en={cat.en} hi={cat.hi} />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/job/${job.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-action hover:underline px-2"
                    >
                      <T en="View" hi="देखें" /> <ChevronRight size={12} />
                    </Link>
                    <button
                      onClick={() => removeSaved(job.slug)}
                      aria-label="Remove saved job"
                      className="w-8 h-8 grid place-items-center rounded-full text-slate-400 hover:text-alert hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
