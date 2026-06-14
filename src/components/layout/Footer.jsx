'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Footer({ onFooterSearch }) {
  const router = useRouter();

  const handleLinkClick = (category, query) => {
    if (onFooterSearch) {
      onFooterSearch(category, query);
    } else {
      router.push(`/?category=${encodeURIComponent(category)}&search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <footer role="contentinfo" aria-label="Site footer" className="bg-gray-50 border-t border-gray-200 pt-16 pb-8 mt-16 w-full">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="WeeklyNaukri - Go to homepage">
              <img src="/logo.svg" alt="WeeklyNaukri Logo" className="h-20 w-20 md:h-24 md:w-24 object-contain rounded-full shadow-sm shrink-0 bg-white p-1" />
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">India's #1 weekly job portal. Govt & private jobs, results, admit cards — all in one place at weeklynaukri.com</p>
          </div>
          <nav aria-label="Government job links">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Government</h3>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li><a href="https://ssc.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-black cursor-pointer transition-colors">SSC Jobs</a></li>
              <li><a href="https://upsc.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-black cursor-pointer transition-colors">UPSC Jobs</a></li>
              <li><a href="https://www.rrcb.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-black cursor-pointer transition-colors">Railway Jobs</a></li>
              <li><a href="https://ibps.in/" target="_blank" rel="noopener noreferrer" className="hover:text-black cursor-pointer transition-colors">Banking Jobs</a></li>
              <li><a href="https://joinindianarmy.nic.in/" target="_blank" rel="noopener noreferrer" className="hover:text-black cursor-pointer transition-colors">Defence Jobs</a></li>
              <li><a href="https://www.india.gov.in/my-government/state-pin-services/public-service-commissions" target="_blank" rel="noopener noreferrer" className="hover:text-black cursor-pointer transition-colors">State PSC</a></li>
            </ul>
          </nav>
          <nav aria-label="Resources and exam information">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li><button onClick={() => handleLinkClick('All Categories', 'Calendar')} className="hover:text-black cursor-pointer transition-colors bg-transparent border-none p-0 text-sm text-gray-600 text-left">Exam Calendar</button></li>
              <li><button onClick={() => handleLinkClick('All Categories', 'Syllabus')} className="hover:text-black cursor-pointer transition-colors bg-transparent border-none p-0 text-sm text-gray-600 text-left">Syllabus</button></li>
              <li><button onClick={() => handleLinkClick('All Categories', 'Previous Paper')} className="hover:text-black cursor-pointer transition-colors bg-transparent border-none p-0 text-sm text-gray-600 text-left">Previous Papers</button></li>
              <li><button onClick={() => handleLinkClick('All Categories', 'Mock Test')} className="hover:text-black cursor-pointer transition-colors bg-transparent border-none p-0 text-sm text-gray-600 text-left">Mock Tests</button></li>
              <li><Link href="/admit-cards" className="hover:text-black cursor-pointer transition-colors">Admit Cards</Link></li>
              <li><Link href="/answer-keys" className="hover:text-black cursor-pointer transition-colors">Answer Keys</Link></li>
              <li><Link href="/results" className="hover:text-black cursor-pointer transition-colors">Sarkari Results</Link></li>
              <li><Link href="/latest-jobs" className="hover:text-black cursor-pointer transition-colors">Latest Govt Jobs</Link></li>
              <li><Link href="/blog" className="hover:text-black cursor-pointer transition-colors">Career Blog</Link></li>
              <li><Link href="/remote-jobs-guide" className="hover:text-black cursor-pointer transition-colors">Remote Jobs Guide</Link></li>
              <li><Link href="/sitemap" className="hover:text-black cursor-pointer transition-colors">Sitemap</Link></li>
            </ul>
          </nav>
          <nav aria-label="Social links and contact">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Connect</h3>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li><a href="https://t.me/weekly_naukri" target="_blank" rel="noopener noreferrer" className="hover:text-black cursor-pointer transition-colors">Telegram</a></li>
              <li><a href="https://chat.whatsapp.com/GeHRdlojdjU7hurA2QCIT7" target="_blank" rel="noopener noreferrer" className="hover:text-black cursor-pointer transition-colors">WhatsApp</a></li>
              <li><a href="https://youtube.com/@weeklynaukri" target="_blank" rel="noopener noreferrer" className="hover:text-black cursor-pointer transition-colors">YouTube</a></li>
              <li><a href="https://instagram.com/weeklynaukri" target="_blank" rel="noopener noreferrer" className="hover:text-black cursor-pointer transition-colors">Instagram</a></li>
              <li><Link href="/contact" className="hover:text-black cursor-pointer transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-black cursor-pointer transition-colors">FAQ</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-black cursor-pointer transition-colors">Privacy Policy</Link></li>
            </ul>
          </nav>
        </div>
        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© 2026 WeeklyNaukri.com — Built for Indian job seekers. Not affiliated with any government body.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">weeklynaukri.com</span>
            <Sparkles className="w-4 h-4 text-gray-400" aria-hidden="true" />
          </div>
        </div>
      </div>
    </footer>
  );
}
