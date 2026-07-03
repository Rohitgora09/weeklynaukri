'use client';

import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useSavedJobs } from '../../hooks/useSavedJobs';
import { T } from '../../lib/LanguageContext';

// Bookmark toggle for a job. variant="icon" renders a compact icon-only
// button for list rows; default renders a labeled pill for detail pages.
export default function SaveJobButton({ slug, title, org, category, variant = 'pill' }) {
  const { isSaved, toggleSave } = useSavedJobs();
  const saved = isSaved(slug);
  const job = { slug, title, org, category };

  if (variant === 'icon') {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSave(job);
        }}
        aria-label={saved ? 'Remove from saved jobs' : 'Save this job'}
        aria-pressed={saved}
        title={saved ? 'Saved' : 'Save job'}
        className={`inline-flex items-center justify-center w-7 h-7 rounded-full transition-colors cursor-pointer ${
          saved ? 'text-action bg-blue-50' : 'text-slate-300 hover:text-action hover:bg-blue-50'
        }`}
        data-testid={`save-job-${slug}`}
      >
        {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
      </button>
    );
  }

  return (
    <button
      onClick={() => toggleSave(job)}
      aria-pressed={saved}
      className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full border transition-colors cursor-pointer ${
        saved
          ? 'bg-action text-white border-action'
          : 'bg-white text-slatebody border-slate-200 hover:border-action hover:text-action'
      }`}
      data-testid={`save-job-${slug}`}
    >
      {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
      {saved ? <T en="Saved" hi="सेव हो गया" /> : <T en="Save Job" hi="जॉब सेव करें" />}
    </button>
  );
}
