import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, KeyRound, ArrowRight } from 'lucide-react';

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
  
  const navigate = useNavigate();
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // Handle registration details submission
  const handleSignupDetails = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await res.json();
      
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
      console.error(err);
      setError('Failed to connect to the authentication server');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return; // Allow numbers only
    
    const newOtp = [...otpCode];
    newOtp[index] = value.substring(value.length - 1); // Keep last char
    setOtpCode(newOtp);

    // Auto-focus next input field
    if (value && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Auto-focus previous input on backspace
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  // Submit OTP code for verification
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
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('Account verified successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.error || 'Invalid OTP code. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Verification server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Sign Up — WeeklyNaukri.com</title>
        <meta name="description" content="Create a free account on WeeklyNaukri.com to get custom job alerts and save jobs." />
      </Helmet>

      {/* ─── Nav ──────────────────────────────────────────── */}
      <nav className="bg-white sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.svg" alt="WeeklyNaukri Logo" width="48" height="48" className="h-12 w-12 object-cover object-center rounded-full shadow-sm shrink-0" />
            <span className="font-bold text-gray-900 tracking-tight hidden sm:block text-lg">WeeklyNaukri</span>
          </Link>
        </div>
      </nav>

      {/* ─── Main Content ─────────────────────────────────── */}
      <main className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-black/[0.03] border border-gray-100 overflow-hidden animate-fade-in-up">
          <div className="p-8 md:p-10">
            
            {/* DEV MODE OTP Display Banner */}
            {debugOtp && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 animate-pulse">
                <span className="font-bold uppercase block mb-1">🛠️ Development Mock Mode</span>
                No real SMTP email was configured. Use this code to verify:
                <strong className="block text-lg mt-1 tracking-widest text-amber-950">{debugOtp}</strong>
              </div>
            )}

            {error && <div className="mb-4 p-3.5 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">{error}</div>}
            {success && <div className="mb-4 p-3.5 bg-green-50 text-green-700 rounded-xl text-sm border border-green-100">{success}</div>}

            {!otpSent ? (
              /* --- STATE 1: SIGNUP FORM DETAILS --- */
              <>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h1>
                  <p className="text-gray-500 text-sm">Join WeeklyNaukri.com for free job alerts.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSignupDetails}>
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        required
                        disabled={loading}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black/10 focus:border-gray-400 bg-gray-50/50 hover:bg-gray-50 transition-colors outline-none"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        required
                        disabled={loading}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black/10 focus:border-gray-400 bg-gray-50/50 hover:bg-gray-50 transition-colors outline-none"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        disabled={loading}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="block w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-black/10 focus:border-gray-400 bg-gray-50/50 hover:bg-gray-50 transition-colors outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3.5 rounded-xl font-medium shadow-md shadow-black/10 hover:bg-gray-800 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-black hover:underline">
                    Sign in here
                  </Link>
                </div>
              </>
            ) : (
              /* --- STATE 2: OTP VERIFICATION --- */
              <>
                <div className="text-center mb-8">
                  <div className="mx-auto w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-4">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your account</h1>
                  <p className="text-gray-500 text-sm">
                    Enter the 6-digit OTP code sent to <strong className="text-gray-800">{email}</strong>
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleVerifyOtp}>
                  {/* 6 Digit Input Group */}
                  <div className="flex justify-between gap-2">
                    {otpCode.map((digit, index) => (
                      <input
                        key={index}
                        ref={otpRefs[index]}
                        type="text"
                        maxLength="1"
                        required
                        disabled={loading}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 text-center text-xl font-bold border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 focus:ring-2 focus:ring-black/10 focus:border-gray-400 outline-none transition-all"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3.5 rounded-xl font-medium shadow-md shadow-black/10 hover:bg-gray-800 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'Verifying OTP...' : 'Verify OTP & Activate'}
                  </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                  Didn't receive the code?{' '}
                  <button
                    onClick={() => {
                      setOtpSent(false);
                      setError('');
                      setSuccess('');
                      setDebugOtp('');
                    }}
                    className="font-semibold text-black hover:underline cursor-pointer bg-transparent border-none"
                  >
                    Go back to change details
                  </button>
                </div>
              </>
            )}

          </div>
          
          {/* Decorative Bottom Banner */}
          <div className="bg-blue-50/50 border-t border-blue-100/50 p-6 text-center">
            <p className="text-xs text-blue-800/70">
              By signing up, you agree to our <Link to="/privacy-policy" className="font-medium hover:text-blue-900 underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
