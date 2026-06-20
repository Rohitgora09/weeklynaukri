'use client';

import Link from 'next/link';
import { Calendar, Building2, MapPin, ChevronRight } from 'lucide-react';

const TAG_COLORS = {
  purple: "bg-brand text-white",
  red: "bg-alert text-white",
  green: "bg-ok text-white",
  gray: "bg-slate-200 text-ink",
  blue: "bg-action text-white",
};

export default function JobCard({
  id,
  slug,
  title,
  org,
  company,
  location,
  salary,
  date,
  lastDate,
  examDate,
  tag,
  tagColor = 'blue',
  status,
  variant = 'list', // 'grid', 'list', 'private'
  index = 0
}) {
  const targetHref = slug ? `/job/${slug}` : `/job/${id}`;
  const displayDate = date || lastDate || examDate || '';

  // 1. Private Sectors style matching new design
  if (variant === 'private') {
    const firstLetter = company ? company.charAt(0).toUpperCase() : 'J';
    const colors = [
      'from-blue-600 to-indigo-650',
      'from-purple-650 to-pink-650',
      'from-emerald-600 to-teal-600',
      'from-amber-500 to-orange-650',
      'from-rose-600 to-red-650'
    ];
    const colorIndex = firstLetter.charCodeAt(0) % colors.length;
    const gradient = colors[colorIndex];

    return (
      <Link 
        href={targetHref} 
        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50/20 hover:shadow-md transition-all duration-300 gap-3 group cursor-pointer w-full"
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center font-extrabold text-md shadow-sm shrink-0`}>
            {firstLetter}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-ink group-hover:text-action transition-colors truncate">
              {title}
            </h4>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-[11px] text-muted">
              <span className="flex items-center gap-1 font-semibold text-slatebody">
                <Building2 className="w-3 h-3 text-slate-400" /> {company}
              </span>
              <span className="w-1 h-1 bg-slate-200 rounded-full hidden sm:inline"></span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" /> {location}
              </span>
            </div>
          </div>
        </div>
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0 gap-1.5">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-action border border-blue-100 uppercase tracking-wide">
            {salary || 'Referral'}
          </span>
          <span className="text-[9px] text-slate-400 font-medium">
            No Exam Required
          </span>
        </div>
      </Link>
    );
  }

  // 2. Default List row matching new design
  return (
    <div 
      className="grid grid-cols-12 items-center hover:bg-blue-50/40 transition-colors w-full px-4 py-3 border-b border-slate-100 last:border-0"
      data-testid={`feed-row-${slug || id}`}
    >
      <div className="col-span-1 text-xs text-muted hidden sm:block font-medium">
        {index + 1}
      </div>
      <div className="col-span-12 sm:col-span-7 pr-2">
        <Link href={targetHref} className="font-semibold text-sm text-ink hover:text-action flex items-start gap-1">
          <ChevronRight size={14} className="mt-0.5 text-action shrink-0 sm:hidden" />
          <span>{title}</span>
        </Link>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {org && <span className="text-[11px] text-muted">{org}</span>}
          {tag && <span className={`text-[9px] font-bold uppercase rounded-full px-2 py-0.5 ${TAG_COLORS[tagColor] || TAG_COLORS.blue}`}>{tag}</span>}
          {status && status.toLowerCase() !== (tag || '').toLowerCase() && (
            <span className="text-[9px] font-bold uppercase rounded-full px-2 py-0.5 bg-ok/10 text-ok border border-ok/20">{status}</span>
          )}
        </div>
      </div>
      <div className="col-span-6 sm:col-span-2 text-xs text-slatebody tabular">{displayDate}</div>
      <div className="col-span-6 sm:col-span-2 text-right">
        <Link href={targetHref} className="inline-flex items-center gap-1 text-xs font-bold text-action hover:underline" data-testid={`feed-detail-${slug || id}`}>
          Details <ChevronRight size={12} />
        </Link>
      </div>
    </div>
  );
}
