'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Zap, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../lib/LanguageContext';
import HeaderControls from './HeaderControls';

const NAV_ITEMS = [
  { label: 'Home', hi: 'होम', path: '/' },
  { label: 'Latest Jobs', hi: 'नवीनतम नौकरियां', path: '/latest-jobs' },
  { label: 'Results', hi: 'रिजल्ट', path: '/results' },
  { label: 'Admit Cards', hi: 'एडमिट कार्ड', path: '/admit-cards' },
  { label: 'Answer Keys', hi: 'आंसर की', path: '/answer-keys' },
  { label: 'Test Series', hi: 'टेस्ट सीरीज', path: '/test-series' },
  { label: 'Study Notes', hi: 'स्टडी नोट्स', path: '/notes' },
  { label: 'Image Resizer', hi: 'फोटो रिसाइज़र', path: '/image-resizer' },
  { label: 'SSC GD 2026', hi: 'SSC GD 2026', path: '/ssc-gd-2026' },
  { label: 'Blog', hi: 'ब्लॉग', path: '/blog' },
];

export default function Navbar({ onCategorySelect }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const router = useRouter();
  const { lang } = useLanguage();
  const navLabel = (item) => (lang === 'hi' && item.hi ? item.hi : item.label);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        setCurrentUser(JSON.parse(userJson));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    router.push('/login');
    router.refresh();
  };

  const handleNavCategory = (category) => {
    setMobileMenuOpen(false);
    if (onCategorySelect) {
      onCategorySelect(category);
    } else {
      router.push(`/?category=${encodeURIComponent(category)}`);
    }
  };

  const submitSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/latest-jobs?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm w-full" data-testid="site-header">


      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 gap-4">
        {/* Brand logo & name */}
        <Link href="/" className="flex items-center gap-2 shrink-0" data-testid="logo-home-link">
          <img src="/logo.svg" alt="WeeklyNaukri Logo" className="w-9 h-9 shrink-0" />
          <span className="flex flex-col leading-none">
            <span className="font-heading font-bold text-xl tracking-tight text-ink">
              Weekly<span className="text-action">Naukri</span>
            </span>
            <span className="text-[9px] text-muted tracking-[0.18em] mt-0.5" lang="hi">
              साप्ताहिक नौकरी
            </span>
          </span>
        </Link>

        {/* Search form (desktop) */}
        <form onSubmit={submitSearch} className="hidden md:flex flex-1 min-w-[210px] max-w-md items-center border border-slate-200 rounded-full overflow-hidden focus-within:border-action focus-within:ring-2 focus-within:ring-action/20 transition">
          <Search size={16} className="ml-4 text-muted" />
          <input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder={lang === 'hi' ? 'नौकरी, रिजल्ट, परीक्षा खोजें…' : 'Search jobs, results, exams…'}
            className="w-full px-3 py-2 text-sm outline-none bg-transparent"
            data-testid="header-search-input"
          />
          <button type="submit" className="bg-brand text-white text-xs font-semibold px-4 py-2.5 hover:bg-action transition-colors cursor-pointer" data-testid="header-search-button">
            {lang === 'hi' ? 'खोजें' : 'Search'}
          </button>
        </form>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm">
          {NAV_ITEMS.slice(0, 7).map((item, i) => (
            <Link
              key={item.label}
              href={item.path}
              className={`px-3 py-1.5 rounded-full font-medium text-slatebody hover:text-ink hover:bg-slate-50 transition-colors whitespace-nowrap ${i >= 5 ? 'hidden xl:block' : ''}`}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {navLabel(item)}
            </Link>
          ))}
        </nav>

        <div className="hidden sm:block">
          <HeaderControls />
        </div>

        {/* Auth / Action links */}
        <div className="hidden sm:flex items-center gap-4 text-sm shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="font-medium text-slatebody">
                Hi, {currentUser.name}
              </span>
              {currentUser.role === 'admin' && (
                <Link href="/dashboard" className="font-semibold text-warn hover:text-amber-600 transition-colors">
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-xs bg-slate-50 text-slatebody hover:bg-slate-100 hover:text-ink px-3.5 py-2 rounded-full font-semibold border border-slate-250 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-slatebody hover:text-ink font-medium">
                Login
              </Link>
              <Link href="/signup" className="bg-brand text-white px-5 py-2.5 rounded-full font-bold hover:bg-action transition-colors cursor-pointer shadow-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile controls + menu button */}
        <div className="sm:hidden">
          <HeaderControls compact />
        </div>
        <button
          className="lg:hidden p-2 text-slatebody hover:text-ink cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="mobile-menu-toggle"
          aria-label="Menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-line bg-white" data-testid="mobile-nav">
          <form onSubmit={submitSearch} className="flex items-center border-b border-line">
            <Search size={16} className="ml-3 text-muted" />
            <input
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search…"
              className="w-full px-2 py-3 text-sm outline-none"
              data-testid="mobile-search-input"
            />
          </form>
          <div className="grid grid-cols-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium border-b border-r border-line text-slatebody hover:bg-slate-50"
                data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {navLabel(item)}
              </Link>
            ))}
            {currentUser ? (
              <>
                {currentUser.role === 'admin' && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="col-span-2 px-4 py-3 text-sm font-bold border-b border-line text-warn bg-amber-50/20 hover:bg-amber-50"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="col-span-2 px-4 py-3 text-sm text-left font-semibold border-b border-line text-red-600 hover:bg-red-50 cursor-pointer bg-transparent"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-semibold border-b border-line text-slatebody hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-bold border-b border-line text-action bg-blue-50/50 hover:bg-blue-50"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Signature: bilingual-letterhead tricolor rule */}
      <div className="tricolor-rule" aria-hidden="true" />
    </header>
  );
}
