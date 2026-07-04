import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Magic UI-style bento grid, ported dependency-free.
// Pass sm:col-span-2 in className to feature a card.
export function BentoGrid({ children, className = '' }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${className}`}>
      {children}
    </div>
  );
}

export function BentoCard({
  href,
  icon: Icon,
  title,
  description,
  cta = 'Open',
  gradient = 'from-blue-600 to-sky-500',
  className = '',
  testid,
}) {
  return (
    <Link
      href={href}
      data-testid={testid}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 flex flex-col gap-3 ${className}`}
    >
      {/* Decorative gradient blob that grows on hover */}
      <div
        aria-hidden="true"
        className={`absolute -top-12 -right-12 w-36 h-36 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500 pointer-events-none`}
      />
      <span
        className={`grid place-items-center w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md group-hover:scale-110 transition-transform shrink-0`}
      >
        <Icon size={20} />
      </span>
      <div className="relative">
        <h3 className="font-heading font-bold text-sm text-ink">{title}</h3>
        <p className="text-xs text-muted mt-1 leading-relaxed">{description}</p>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-action mt-2.5 opacity-80 group-hover:opacity-100 group-hover:gap-2 transition-all">
          {cta} <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}
