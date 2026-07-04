import Link from 'next/link';
import { AlertCircle, Briefcase, FileCheck2, IdCard, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <AlertCircle className="w-16 h-16 text-amber-500 mb-4" />
      <h1 className="text-6xl font-bold text-blue-950 mb-4">404</h1>
      <p className="text-xl text-gray-650 mb-3 font-semibold">Page Not Found</p>
      <p className="text-gray-500 mb-8 max-w-md">
        This listing has expired or the page has been removed. Government job
        notifications are taken down once their last date passes — but new ones
        arrive every day.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 w-full max-w-lg">
        <Link
          href="/latest-jobs"
          className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-blue-950 hover:border-blue-400 hover:bg-blue-50/40 transition-colors"
        >
          <Briefcase size={16} /> Latest Jobs
        </Link>
        <Link
          href="/results"
          className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-blue-950 hover:border-blue-400 hover:bg-blue-50/40 transition-colors"
        >
          <FileCheck2 size={16} /> Results
        </Link>
        <Link
          href="/admit-cards"
          className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-blue-950 hover:border-blue-400 hover:bg-blue-50/40 transition-colors"
        >
          <IdCard size={16} /> Admit Cards
        </Link>
      </div>

      <Link
        href="/"
        className="bg-blue-950 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-900 transition-colors shadow-md shadow-blue-900/10"
      >
        Return Home
      </Link>
    </div>
  );
}
