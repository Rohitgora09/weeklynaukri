'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, KeyRound, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // OTP Verification States
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [debugOtp, setDebugOtp] = useState(''); // Stores mock OTP for testing
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();
  const { signup, verifyOtp, user } = useAuth();
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // Redirect if logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [user]);

  const handleSignupDetails = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await signup(name, email, password);
      if (data.success) {
        setOtpSent(true);
        setSuccess('A 6-digit verification code has been generated!');
        if (data.debugOtp) {
          setDebugOtp(data.debugOtp);
        }
      } else {
        setError(data.error || 'An error occurred during signup');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to the authentication server');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otpCode];
    newOtp[index] = value.substring(value.length - 1);
    setOtpCode(newOtp);

    // Auto-focus next input field
    if (value && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const otp = otpCode.join('');
    if (otp.length !== 6) {
      setError('Please enter all 6 digits of the verification code');
      return;
    }

    setLoading(true);

    try {
      const data = await verifyOtp(email, otp);
      if (data.success) {
        setSuccess('Account verified successfully! Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(data.error || 'Invalid OTP code. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Verification server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <nav className="bg-white sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.svg" alt="WeeklyNaukri Logo" width="48" height="48" className="h-12 w-12 object-cover rounded-full shadow-sm shrink-0" />
            <span className="font-bold text-gray-900 tracking-tight hidden sm:block text-lg">WeeklyNaukri</span>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-sm border border-ink bg-white">
          {!otpSent ? (
            <div className="bg-ink text-white px-6 py-5 text-center flex flex-col items-center">
              <img src="/logo.svg" alt="WeeklyNaukri Logo" className="w-12 h-12 rounded-full shadow-sm mb-2" />
              <h1 className="font-heading font-extrabold text-xl">Create an account</h1>
              <p className="text-xs text-slate-400 mt-1">Join WeeklyNaukri.com for free job alerts.</p>
            </div>
          ) : (
            <div className="bg-ink text-white px-6 py-5 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-action text-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                <KeyRound className="w-6 h-6" />
              </div>
              <h1 className="font-heading font-extrabold text-xl">Verify your account</h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter code sent to <strong className="text-white">{email}</strong>
              </p>
            </div>
          )}

          <div className="p-6 md:p-8">
            {debugOtp && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-250 text-xs text-amber-800 animate-pulse font-medium">
                <span className="font-bold uppercase block mb-1">🛠️ Development Mock Mode</span>
                No real SMTP email was configured. Use this code to verify:
                <strong className="block text-lg mt-1 tracking-widest text-amber-950">{debugOtp}</strong>
              </div>
            )}

            {error && <div className="mb-4 p-3 bg-red-50 text-alert text-xs border border-red-100 font-medium">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-50 text-ok text-xs border border-green-100 font-medium">{success}</div>}

            {!otpSent ? (
              <>
                <form onSubmit={handleSignupDetails} className="space-y-4">
                  <label className="block">
                    <span className="text-[11px] uppercase tracking-wide text-muted font-semibold">Full Name</span>
                    <div className="flex items-center border border-line mt-1 focus-within:border-action">
                      <User className="h-[15px] w-[15px] ml-3 text-muted" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-2 py-2 text-sm outline-none"
                      />
                    </div>
                  </label>

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
                    {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>

                <div className="mt-6 text-center text-xs text-slatebody">
                  Already have an account?{' '}
                  <Link href="/login" className="font-semibold text-ink hover:underline">
                    Sign in here
                  </Link>
                </div>
              </>
            ) : (
              <>
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="flex justify-between gap-2">
                    {otpCode.map((digit, index) => (
                      <input
                        key={index}
                        ref={otpRefs[index]}
                        type="text"
                        maxLength="1"
                        required
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-10 h-12 text-center text-lg font-bold border border-line bg-gray-50/50 outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-action hover:bg-blue-800 text-white font-bold py-2.5 transition-colors disabled:opacity-50 mt-2 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP & Activate'}
                  </button>
                </form>

                <div className="mt-6 text-center text-xs text-slatebody">
                  Didn't receive the code?{' '}
                  <button
                    onClick={() => {
                      setOtpSent(false);
                      setError('');
                      setSuccess('');
                      setDebugOtp('');
                    }}
                    className="font-semibold text-ink hover:underline cursor-pointer bg-transparent border-none p-0 inline"
                  >
                    Go back to change details
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
