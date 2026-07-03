'use client';

import Link from 'next/link';
import { Send, MessageCircle, Zap } from 'lucide-react';

const YoutubeIcon = ({ size = 16, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

const InstagramIcon = ({ size = 16, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const SOCIALS = [
  { name: 'Telegram', url: 'https://t.me/weekly_naukri' },
  { name: 'WhatsApp', url: 'https://chat.whatsapp.com/GeHRdlojdjU7hurA2QCIT7' },
  { name: 'YouTube', url: 'https://youtube.com/@weeklynaukri' },
  { name: 'Instagram', url: 'https://instagram.com/weeklynaukri' },
];

const ICONS = {
  Telegram: Send,
  WhatsApp: MessageCircle,
  YouTube: YoutubeIcon,
  Instagram: InstagramIcon,
};

const COLS = [
  {
    title: 'Sarkari Hub',
    links: [
      ['Latest Jobs', '/latest-jobs'],
      ['Results', '/results'],
      ['Admit Cards', '/admit-cards'],
      ['Answer Keys', '/answer-keys'],
    ],
  },
  {
    title: 'Resources',
    links: [
      ['Study Notes', '/notes'],
      ['IT Govt Jobs', '/it-government-jobs-2026'],
      ['Exam Calendar', '/exam-calendar'],
      ['Private Jobs', '/referrals'],
    ],
  },
  {
    title: 'Tools',
    links: [
      ['Photo Resizer', '/image-resizer'],
      ['SSC GD 2026', '/ssc-gd-2026'],
      ['Career Blog', '/blog'],
      ['Sitemap', '/sitemap'],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-ink text-slate-350 w-full" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-3">
            <img src="/logo.svg" alt="WeeklyNaukri Logo" className="w-8 h-8 shrink-0" />
            <span className="font-heading font-extrabold text-lg text-white">
              Weekly<span className="text-action">Naukri</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs text-slate-400">
            India's fastest Sarkari Naukri hub. Latest government jobs, results, admit cards and exam utilities — updated daily.
          </p>
          <div className="flex gap-2 mt-4">
            {SOCIALS.map((s) => {
              const Icon = ICONS[s.name];
              return (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid place-items-center w-9 h-9 border border-slate-700 hover:bg-action hover:border-action transition-colors rounded-lg text-slate-300 hover:text-white"
                  data-testid={`social-${s.name.toLowerCase()}`}
                  aria-label={s.name}
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="font-heading text-white text-xs uppercase tracking-widest mb-3">{col.title}</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {col.links.map(([label, to]) => (
                <li key={to}>
                  <Link href={to} className="hover:text-action transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} WeeklyNaukri.com — All rights reserved.</span>
          <span>Privacy-first. All images processed locally in your browser.</span>
        </div>
      </div>
    </footer>
  );
}
