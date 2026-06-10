import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find(u => u.email === email)) {
        setError('Email already exists');
        return;
      }
      
      users.push({ name, email, password }); // In a real app, never store plain passwords!
      localStorage.setItem('users', JSON.stringify(users));
      
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError('An error occurred during signup');
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
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h1>
              <p className="text-gray-500 text-sm">Join WeeklyNaukri.com for free job alerts.</p>
            </div>
            
            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}

            <form className="space-y-5" onSubmit={handleSignup}>
              
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
                className="w-full bg-black text-white py-3.5 rounded-xl font-medium shadow-md shadow-black/10 hover:bg-gray-800 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer mt-4"
              >
                Create Account
              </button>

            </form>

            <div className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-black hover:underline">
                Sign in here
              </Link>
            </div>
            
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
