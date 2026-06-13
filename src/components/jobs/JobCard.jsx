import Link from 'next/link';
import { Calendar, Building2, MapPin, ExternalLink } from 'lucide-react';
import Tag from '../ui/Tag';

export default function JobCard({
  id,
  slug,
  title,
  org,
  company,
  location,
  salary,
  date,
  tag,
  tagColor = 'blue',
  variant = 'grid', // 'grid', 'list', 'private'
  onClick
}) {
  const targetHref = slug ? `/job/${slug}` : `/job/${id}`;

  if (variant === 'private') {
    const firstLetter = company ? company.charAt(0).toUpperCase() : 'J';
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-pink-600',
      'from-emerald-500 to-teal-600',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-red-600'
    ];
    const colorIndex = firstLetter.charCodeAt(0) % colors.length;
    const gradient = colors[colorIndex];

    return (
      <Link href={targetHref} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-gray-150 hover:border-blue-200 bg-white hover:bg-blue-50/5 hover:shadow-lg hover:shadow-blue-900/[0.02] transition-all duration-300 gap-4 group cursor-pointer w-full mb-3 last:mb-0">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center font-extrabold text-lg shadow-md shrink-0`}>
            {firstLetter}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {title}
            </h4>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1.5 font-semibold text-gray-750">
                <Building2 className="w-3.5 h-3.5 text-gray-400" /> {company}
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:inline"></span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400" /> {location}
              </span>
            </div>
          </div>
        </div>
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 border-gray-50 pt-3 sm:pt-0 gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
            {salary}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">
            No Exam Required
          </span>
        </div>
      </Link>
    );
  }

  if (variant === 'list') {
    return (
      <Link href={targetHref} className="flex items-center justify-between py-2.5 group cursor-pointer hover:bg-gray-50 -mx-4 px-4 rounded-xl transition-colors w-full">
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
            {title}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{org}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {tag && <Tag color={tagColor}>{tag}</Tag>}
          <span className="text-xs font-medium text-gray-400 whitespace-nowrap">{date}</span>
        </div>
      </Link>
    );
  }

  // Default Grid Card (e.g. results, admit cards, answer keys)
  return (
    <Link href={targetHref} aria-label={`View details for ${title}`} className="bg-gray-50 rounded-xl p-4 hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all duration-200 cursor-pointer group block w-full">
      {tag && <Tag color={tagColor} className="mb-2">{tag}</Tag>}
      <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-950 transition-colors line-clamp-2 min-h-[40px]">
        {title}
      </p>
      {org && <p className="text-xs text-gray-500 mt-1 truncate">{org}</p>}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200/60">
        <p className="text-[10px] text-gray-400 flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {date}
        </p>
        <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 font-semibold uppercase tracking-wider group-hover:translate-x-0.5 transition-transform">
          <span className="sr-only">View details for {title}</span>
          <span aria-hidden="true">Details</span> <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
