'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar({ onCategorySelect }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

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

  const navItems = [
    { label: 'Govt Jobs', path: '/latest-jobs' },
    { label: 'Govt Tech Jobs', path: '/it-govt-jobs' },
    { label: 'Test Series', path: '/test-series' },
    { label: 'Private Jobs', value: 'Private Jobs' },
    { label: 'Results', path: '/results' },
    { label: 'Admit Cards', path: '/admit-cards' },
    { label: 'Referrals', path: '/referrals' },
  ];

  return (
    <nav 
      role="navigation" 
      aria-label="Main navigation"
      className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full"
    >
      <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="WeeklyNaukri - Go to homepage">
        <img src="/logo.svg" alt="WeeklyNaukri Logo" className="h-12 w-12 md:h-16 md:w-16 object-contain rounded-full shadow-sm shrink-0 bg-white p-1" />
        <span className="font-bold text-gray-900 tracking-tight hidden sm:block text-lg">WeeklyNaukri</span>
      </Link>

      <div className="hidden md:flex items-center gap-6" role="menubar">
        {navItems.map((item) => (
          item.path ? (
            <Link
              key={item.label}
              href={item.path}
              role="menuitem"
              className="relative flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-black transition-colors py-1 group rounded-md"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" aria-hidden="true"></span>
            </Link>
          ) : (
            <button
              key={item.label}
              onClick={() => handleNavCategory(item.value)}
              role="menuitem"
              className="relative flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-black transition-colors py-1 group cursor-pointer bg-transparent border-none rounded-md"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" aria-hidden="true"></span>
            </button>
          )
        ))}
      </div>

      <div className="flex items-center gap-4">
        {currentUser ? (
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-sm font-medium text-gray-800">
              Hi, {currentUser.name}
            </span>
            {currentUser.role === 'admin' && (
              <Link href="/dashboard" className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors rounded-md">
                Dashboard
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 px-3.5 py-2 rounded-full font-medium transition-colors cursor-pointer border border-gray-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-800 hover:text-black transition-colors rounded-md">
              Login
            </Link>
            <Link href="/signup" className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer">
              Get started free
            </Link>
          </div>
        )}
        {/* Hamburger Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-800 hover:text-black cursor-pointer rounded-lg"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div 
          id="mobile-nav-menu"
          role="menu" 
          aria-label="Mobile navigation"
          className="absolute top-full left-0 right-0 md:hidden bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-4 shadow-lg animate-fade-in-down z-40"
        >
          {navItems.map((item) => (
            item.path ? (
              <Link
                key={item.label}
                href={item.path}
                role="menuitem"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-gray-800 hover:text-black py-2 rounded-md"
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={() => handleNavCategory(item.value)}
                role="menuitem"
                className="text-left text-sm font-medium text-gray-800 hover:text-black py-2 bg-transparent border-none cursor-pointer w-full rounded-md"
              >
                {item.label}
              </button>
            )
          ))}
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
            {currentUser ? (
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-600 px-1">
                  Logged in as: <strong className="text-gray-900">{currentUser.name}</strong>
                </span>
                {currentUser.role === 'admin' && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center text-sm font-semibold text-amber-700 py-2 bg-amber-50 hover:bg-amber-100 rounded-xl"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-center text-sm font-medium bg-gray-100 text-gray-800 py-2.5 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer border-none"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm font-medium text-gray-800 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm font-medium bg-black text-white py-2.5 rounded-xl hover:bg-gray-850"
                >
                  Get started free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
