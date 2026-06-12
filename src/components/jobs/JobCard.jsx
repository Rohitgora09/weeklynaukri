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
    return (
      <Link href={targetHref} className="flex items-center justify-between py-3 group cursor-pointer hover:bg-gray-50 -mx-4 px-4 rounded-xl transition-colors w-full">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
            {title}
          </p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Building2 className="w-3 h-3" /> {company}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {location}
            </span>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-blue-700 ml-3 whitespace-nowrap">
          {salary}
        </span>
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
    <Link href={targetHref} className="bg-gray-50 rounded-xl p-4 hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all duration-200 cursor-pointer group block w-full">
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
          Details <ExternalLink className="w-2.5 h-2.5" />
        </span>
      </div>
    </Link>
  );
}
