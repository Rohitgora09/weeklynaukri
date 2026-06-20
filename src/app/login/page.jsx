'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { login, user } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      // Success! Redirection is handled in useEffect or manually here:
      if (loggedUser.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
      router.refresh();
    } catch (err) {
      setError(err.message || 'Invalid email or password credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      {/* Navigation Header */}
      <nav className="bg-white sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.svg" alt="WeeklyNaukri Logo" className="w-9 h-9 shrink-0" />
            <span className="font-heading font-extrabold text-xl tracking-tight text-ink hidden sm:block">Weekly<span className="text-action">Naukri</span></span>
          </Link>
        </div>
      </nav>

      {/* Main Form content */}
      <main className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-sm border border-ink bg-white">
          <div className="bg-ink text-white px-6 py-5 text-center flex flex-col items-center">
            <img src="/logo.svg" alt="WeeklyNaukri Logo" className="w-12 h-12 rounded-full shadow-sm mb-2" />
            <h1 className="font-heading font-extrabold text-xl">Welcome Back</h1>
            <p className="text-xs text-slate-400 mt-1">Sign in to manage referrals and alerts.</p>
          </div>

          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-alert text-xs border border-red-100 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="text-[11px] uppercase tracking-wide text-muted font-semibold">Email Address</span>
                <div className="flex items-center border border-line mt-1 focus-within:border-action">
                  <Mail className="h-[15px] w-[15px] ml-3 text-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-2 py-2 text-sm outline-none"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-[11px] uppercase tracking-wide text-muted font-semibold">Password</span>
                <div className="flex items-center border border-line mt-1 focus-within:border-action relative">
                  <Lock className="h-[15px] w-[15px] ml-3 text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-2 pr-10 py-2 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 bg-transparent border-none p-0 flex items-center cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-action hover:bg-blue-800 text-white font-bold py-2.5 transition-colors disabled:opacity-50 mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slatebody">
              New to WeeklyNaukri?{' '}
              <Link href="/signup" className="font-semibold text-ink hover:underline">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
