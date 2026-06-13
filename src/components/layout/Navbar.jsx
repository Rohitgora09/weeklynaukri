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

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <img src="/logo.svg" alt="WeeklyNaukri Logo" className="h-12 w-12 md:h-16 md:w-16 object-contain rounded-full shadow-sm shrink-0 bg-white p-1" />
        <span className="font-bold text-gray-900 tracking-tight hidden sm:block text-lg">WeeklyNaukri</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {[
          { label: 'Govt Jobs', value: 'Govt Jobs' },
          { label: 'Govt Tech Jobs', path: '/it-govt-jobs' },
          { label: 'Private Jobs', value: 'Private Jobs' },
          { label: 'Results', value: 'Results' },
          { label: 'Admit Cards', value: 'Admit Cards' },
          { label: 'Referrals', path: '/referrals' },
        ].map((item) => (
          item.path ? (
            <Link
              key={item.label}
              href={item.path}
              className="relative flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-black transition-colors py-1 group"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ) : (
            <button
              key={item.label}
              onClick={() => handleNavCategory(item.value)}
              className="relative flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-black transition-colors py-1 group cursor-pointer bg-transparent border-none"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </button>
          )
        ))}
      </div>

      <div className="flex items-center gap-4">
        {currentUser ? (
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Hi, {currentUser.name}
            </span>
            {currentUser.role === 'admin' && (
              <Link href="/dashboard" className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                Dashboard
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 px-3.5 py-2 rounded-full font-medium transition-colors cursor-pointer border border-gray-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-700 hover:text-black transition-colors">
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
          className="md:hidden p-2 text-gray-700 hover:text-black focus:outline-none cursor-pointer"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 md:hidden bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-4 shadow-lg animate-fade-in-down z-40">
          {[
            { label: 'Govt Jobs', value: 'Govt Jobs' },
            { label: 'Govt Tech Jobs', path: '/it-govt-jobs' },
            { label: 'Private Jobs', value: 'Private Jobs' },
            { label: 'Results', value: 'Results' },
            { label: 'Admit Cards', value: 'Admit Cards' },
            { label: 'Referrals', path: '/referrals' },
          ].map((item) => (
            item.path ? (
              <Link
                key={item.label}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-gray-700 hover:text-black py-2"
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={() => handleNavCategory(item.value)}
                className="text-left text-sm font-medium text-gray-700 hover:text-black py-2 bg-transparent border-none cursor-pointer w-full"
              >
                {item.label}
              </button>
            )
          ))}
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
            {currentUser ? (
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-500 px-1">
                  Logged in as: <strong className="text-gray-800">{currentUser.name}</strong>
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
                  className="text-center text-sm font-medium bg-gray-100 text-gray-700 py-2.5 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer border-none"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm font-medium text-gray-700 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50"
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
