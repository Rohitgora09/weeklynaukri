'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, FileCheck2, IdCard, KeyRound } from 'lucide-react';
import { useLanguage } from '../../lib/LanguageContext';

const TABS = [
  { label: 'Home', hi: 'होम', path: '/', icon: Home },
  { label: 'Jobs', hi: 'नौकरियां', path: '/latest-jobs', icon: Briefcase },
  { label: 'Results', hi: 'रिजल्ट', path: '/results', icon: FileCheck2 },
  { label: 'Admit Card', hi: 'एडमिट कार्ड', path: '/admit-cards', icon: IdCard },
  { label: 'Keys', hi: 'आंसर की', path: '/answer-keys', icon: KeyRound },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { lang } = useLanguage();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-[0_-2px_12px_rgba(15,23,42,0.08)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Quick navigation"
      data-testid="mobile-bottom-nav"
    >
      <div className="grid grid-cols-5">
        {TABS.map(({ label, hi, path, icon: Icon }) => {
          const active = pathname === path;
          const shown = lang === 'hi' && hi ? hi : label;
          return (
            <Link
              key={path}
              href={path}
              aria-current={active ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-semibold transition-colors ${
                active ? 'text-action' : 'text-muted hover:text-ink'
              }`}
              data-testid={`bottom-nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Icon size={19} strokeWidth={active ? 2.4 : 2} aria-hidden="true" />
              {shown}
              {active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-action" aria-hidden="true" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
