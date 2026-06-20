'use client';

import Link from 'next/link';
import { 
  ChevronRight, 
  FileCheck2, 
  IdCard, 
  Briefcase, 
  KeyRound, 
  GraduationCap, 
  FileText, 
  Building2,
  BookOpen,
  Calendar,
  Bell
} from 'lucide-react';
import JobCard from './JobCard';

const ICONS = {
  FileCheck2,
  IdCard,
  Briefcase,
  KeyRound,
  GraduationCap,
  FileText,
  Building2,
  BookOpen,
  Calendar,
  Bell
};

const ACCENTS = {
  alert: "from-rose-600 to-red-500",
  action: "from-blue-600 to-sky-500",
  brand: "from-blue-900 to-indigo-700",
  ok: "from-green-600 to-emerald-500",
  warn: "from-amber-500 to-yellow-500",
};

export default function JobList({
  title,
  subtitle,
  icon,
  iconName,
  items = [],
  variant = 'list', // 'grid', 'list', 'private'
  accent = 'brand', // 'alert', 'action', 'brand', 'ok', 'warn'
  limit = 10,
  emptyText = 'No active listings found.',
  viewMoreUrl
}) {
  const displayedItems = items.slice(0, limit);
  const accentClass = ACCENTS[accent] || ACCENTS.brand;
  
  // Resolve icon component
  let IconComponent = icon;
  if (iconName && ICONS[iconName]) {
    IconComponent = ICONS[iconName];
  } else if (!IconComponent) {
    IconComponent = Briefcase;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white flex flex-col overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 lift h-full">
      {/* Header Accent Bar */}
      <div className={`bg-gradient-to-r ${accentClass} text-white px-4 py-3 flex items-center justify-between`}>
        <h2 className="font-heading font-bold text-sm uppercase tracking-wide flex items-center gap-2">
          <span className="grid place-items-center w-7 h-7 rounded-lg bg-white/20">
            <IconComponent size={15} />
          </span> 
          {title}
        </h2>
        <span className="text-[10px] tabular bg-white/25 rounded-full px-2 py-0.5 font-semibold">
          {items.length}
        </span>
      </div>

      {/* Table Headers for list variant */}
      {variant === 'list' && displayedItems.length > 0 && (
        <div className={`hidden sm:grid grid-cols-12 bg-gradient-to-r ${accentClass} text-white text-[11px] uppercase tracking-wider font-bold border-t border-white/10`}>
          <div className="col-span-1 px-4 py-2">#</div>
          <div className="col-span-7 px-4 py-2">Title</div>
          <div className="col-span-2 px-4 py-2">Date</div>
          <div className="col-span-2 px-4 py-2 text-right">Action</div>
        </div>
      )}

      {/* List content */}
      <div className="flex-1">
        {displayedItems.length === 0 ? (
          <div className="px-4 py-8 text-sm text-slatebody text-center">
            {emptyText}
          </div>
        ) : (
          <div className={variant === 'private' ? "space-y-2 p-4" : "divide-y divide-slate-100"}>
            {displayedItems.map((item, idx) => (
              <JobCard
                key={item.id || idx}
                variant={variant}
                index={idx}
                {...item}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer View More link */}
      {viewMoreUrl && displayedItems.length > 0 && (
        <Link
          href={viewMoreUrl}
          className="mt-auto text-center text-xs font-bold uppercase tracking-widest py-3 border-t border-slate-200 text-action hover:bg-action hover:text-white transition-colors flex items-center justify-center gap-1.5"
        >
          View More <ChevronRight size={13} />
        </Link>
      )}
    </div>
  );
}
