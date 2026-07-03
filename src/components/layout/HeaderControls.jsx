'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Moon, Sun, Bookmark } from 'lucide-react';
import { useLanguage } from '../../lib/LanguageContext';

// Language switch + dark mode switch + saved jobs shortcut.
// Rendered in the Navbar and in the job page mini-nav.
export default function HeaderControls({ compact = false }) {
  const { lang, setLang } = useLanguage();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('wn_theme', next ? 'dark' : 'light');
    } catch (e) {}
  };

  const btn =
    'flex items-center justify-center rounded-full border border-slate-200 text-slatebody hover:text-ink hover:bg-slate-50 transition-colors cursor-pointer ' +
    (compact ? 'w-8 h-8' : 'w-9 h-9');

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
        className={`${btn} px-2 w-auto text-[11px] font-bold tracking-wide`}
        aria-label={lang === 'hi' ? 'Switch to English' : 'हिंदी में देखें'}
        title={lang === 'hi' ? 'Switch to English' : 'हिंदी में देखें'}
        data-testid="lang-toggle"
      >
        {lang === 'hi' ? 'EN' : 'हिंदी'}
      </button>
      <button
        onClick={toggleTheme}
        className={btn}
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={dark ? 'Light mode' : 'Dark mode'}
        data-testid="theme-toggle"
      >
        {dark ? <Sun size={15} /> : <Moon size={15} />}
      </button>
      <Link
        href="/saved"
        className={btn}
        aria-label="Saved jobs"
        title="Saved jobs"
        data-testid="saved-jobs-link"
      >
        <Bookmark size={15} />
      </Link>
    </div>
  );
}
