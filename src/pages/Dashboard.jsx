import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ShieldAlert, 
  Activity, 
  Eye, 
  Users, 
  RefreshCw, 
  Trash2, 
  ArrowLeft, 
  LayoutDashboard, 
  Terminal, 
  Globe, 
  Laptop, 
  Smartphone,
  CheckCircle,
  FileText
} from 'lucide-react';

export default function Dashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Scraper manual trigger states
  const [scraping, setScraping] = useState(false);
  const [scrapeSuccess, setScrapeSuccess] = useState('');

  const navigate = useNavigate();

  // Check if admin password is saved in localStorage
  useEffect(() => {
    const savedPassword = localStorage.getItem('adminPassword');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Automatically fill in default password if logged in as admin
    if (currentUser.role === 'admin' && !savedPassword) {
      localStorage.setItem('adminPassword', 'admin123');
      setAuthorized(true);
      fetchDashboardStats('admin123');
    } else if (savedPassword) {
      setAuthorized(true);
      fetchDashboardStats(savedPassword);
    } else {
      setLoading(false);
    }
  }, []);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setError('');
    fetchDashboardStats(adminPassword);
  };

  const fetchDashboardStats = async (password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics/stats', {
        headers: { 'X-Admin-Password': password }
      });
      const data = await res.json();
      
      if (data.success) {
        setStats(data);
        localStorage.setItem('adminPassword', password);
        setAuthorized(true);
      } else {
        setError(data.error || 'Access Denied. Invalid Password.');
        localStorage.removeItem('adminPassword');
        setAuthorized(false);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to reach backend analytics server.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualScrape = async () => {
    setScraping(true);
    setScrapeSuccess('');
    const password = localStorage.getItem('adminPassword');
    
    try {
      const res = await fetch('/api/analytics/trigger-scrape', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Password': password
        }
      });
      const data = await res.json();
      
      if (data.success) {
        setScrapeSuccess('Manual cache refresh triggered successfully! Puppeteer is updating files.');
        // Refetch stats after 3 seconds
        setTimeout(() => fetchDashboardStats(password), 3000);
      } else {
        setError('Failed to trigger manual scraping.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failure during manual scrape request.');
    } finally {
      setScraping(false);
    }
  };

  const handleClearCache = async () => {
    const password = localStorage.getItem('adminPassword');
    try {
      const res = await fetch('/api/analytics/clear-cache', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Password': password
        }
      });
      const data = await res.json();
      if (data.success) {
        setScrapeSuccess('Scraper cache cleared successfully!');
        fetchDashboardStats(password);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminPassword');
    setAuthorized(false);
    setStats(null);
  };

  // Format milliseconds into human readable uptime (e.g. 2h 14m)
  const formatUptime = (ms) => {
    if (!ms) return '0s';
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 && days === 0 && hours === 0) parts.push(`${seconds}s`);
    return parts.join(' ') || '0s';
  };

  // Loading Screen
  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <Helmet><title>Dashboard Loading...</title></Helmet>
        <RefreshCw className="w-10 h-10 text-amber-500 animate-spin mb-4" />
        <p className="text-gray-400 text-sm tracking-widest uppercase">Fetching metrics database</p>
      </div>
    );
  }

  // --- PASSWORD GATE SCREEN ---
  if (!authorized) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-white">
        <Helmet>
          <title>Admin Access Gate — WeeklyNaukri.com</title>
        </Helmet>
        
        <div className="w-full max-w-md bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl p-8 text-center animate-fade-in-up">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
            <ShieldAlert className="w-7 h-7" />
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight mb-2">Security Authorization</h1>
          <p className="text-gray-400 text-sm mb-6">Enter your Admin Security Key to manage scrapers and track live visitor data.</p>
          
          {error && <div className="mb-4 p-3 bg-red-950/40 border border-red-900/50 text-red-400 rounded-xl text-xs">{error}</div>}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <input
              type="password"
              required
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter admin password (default: admin123)"
              className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-center tracking-widest text-white placeholder-gray-600"
            />
            <button
              type="submit"
              className="w-full bg-amber-500 text-black py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/15 cursor-pointer"
            >
              Verify Security Key
            </button>
          </form>

          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors mt-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
          </Link>
        </div>
      </div>
    );
  }

  // --- STATS PARSING FOR UI ---
  const traffic = stats?.stats || {};
  const recentHits = traffic.recentHits || [];
  const viewsByPage = traffic.viewsByPage || {};
  const browserDistribution = traffic.browsers || {};
  const deviceDistribution = traffic.devices || {};
  const dailyViews = traffic.dailyViews || {};

  // Sort daily views chronologically
  const sortedDates = Object.keys(dailyViews).sort().slice(-7); // Last 7 days
  const maxDayViews = Math.max(...sortedDates.map(d => dailyViews[d] || 0), 10); // Safeguard division by zero

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
      <Helmet>
        <title>WeeklyNaukri Admin Dashboard</title>
      </Helmet>

      {/* ─── HEADER ───────────────────────────────────────── */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-amber-500" />
            <div>
              <h1 className="font-bold text-lg leading-none">Control Center</h1>
              <span className="text-xs text-gray-500">WeeklyNaukri VPS Operations</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-xs text-green-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              Server Active
            </div>
            
            <button
              onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-white px-3 py-1.5 bg-gray-850 rounded-lg border border-gray-800 transition-colors cursor-pointer"
            >
              Lock Panel
            </button>
            <Link
              to="/"
              className="text-xs text-black bg-white hover:bg-gray-100 px-3.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return Site
            </Link>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
        
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center shrink-0">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs text-gray-500 font-medium uppercase tracking-wider">Total Views</span>
              <span className="text-2xl font-bold">{traffic.totalPageViews || 0}</span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs text-gray-500 font-medium uppercase tracking-wider">Unique Visitors</span>
              <span className="text-2xl font-bold">{traffic.totalUniqueVisitors || 0}</span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs text-gray-500 font-medium uppercase tracking-wider">Uptime</span>
              <span className="text-xl font-bold">{formatUptime(stats.uptime)}</span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs text-gray-500 font-medium uppercase tracking-wider">Database Status</span>
              <span className="text-sm font-semibold text-gray-300 block leading-tight">
                {stats.counts.referrals} Referral Posts
              </span>
              <span className="text-xs text-gray-500">
                {stats.counts.users} Registered Users
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 1: TRAFFIC CHART & PAGES SUMMARY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Traffic Daily Chart (Left Column - 2 Cols Span) */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-850 pb-4">
              <div>
                <h3 className="font-bold text-base">Traffic Overview</h3>
                <p className="text-xs text-gray-500">Daily pageviews registered over the last 7 days</p>
              </div>
              <span className="text-xs text-amber-500 font-medium bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                7 Days Trend
              </span>
            </div>

            {/* Custom SVG/CSS Graph */}
            <div className="h-64 flex items-end justify-between gap-4 pt-6 px-4">
              {sortedDates.map((date) => {
                const count = dailyViews[date] || 0;
                const heightPercent = Math.min(Math.max((count / maxDayViews) * 100, 4), 100);
                const displayDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                return (
                  <div key={date} className="flex-1 flex flex-col items-center group h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="bg-amber-500 text-black font-bold text-xs px-2 py-1 rounded mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg select-none">
                      {count} hits
                    </div>
                    {/* Visual Bar */}
                    <div 
                      className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-lg group-hover:from-amber-500 group-hover:to-amber-300 transition-all duration-300"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                    {/* Date Tag */}
                    <span className="text-[10px] text-gray-500 font-medium mt-3 whitespace-nowrap">
                      {displayDate}
                    </span>
                  </div>
                );
              })}
              {sortedDates.length === 0 && (
                <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                  Waiting for traffic logs data...
                </div>
              )}
            </div>
          </div>

          {/* Scraper Control & Server Metrics (Right Column - 1 Col Span) */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="border-b border-gray-850 pb-4 mb-4">
                <h3 className="font-bold text-base">Scraper Control Center</h3>
                <p className="text-xs text-gray-500">Manually trigger backend Puppeteer updates</p>
              </div>

              {scrapeSuccess && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 rounded-xl text-xs mb-4 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{scrapeSuccess}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* SSC Scraper status info */}
                <div className="bg-gray-950 border border-gray-850 rounded-xl p-4 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">SSC Notices Cache</span>
                    <span className="font-semibold text-green-400">Healthy</span>
                  </div>
                  <span className="text-[10px] text-gray-500">Updates hourly in the background</span>
                </div>

                <div className="bg-gray-950 border border-gray-850 rounded-xl p-4 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">SarkariResult Cache</span>
                    <span className="font-semibold text-green-400">Healthy</span>
                  </div>
                  <span className="text-[10px] text-gray-500">Refreshed every 15 minutes</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-4">
              <button
                onClick={handleManualScrape}
                disabled={scraping}
                className="w-full bg-amber-500 text-black py-3 rounded-xl font-bold hover:bg-amber-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10 text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${scraping ? 'animate-spin' : ''}`} />
                {scraping ? 'Scraping live sites...' : 'Refresh Scraper Cache Now'}
              </button>

              <button
                onClick={handleClearCache}
                className="w-full bg-gray-950 hover:bg-gray-900 text-gray-400 hover:text-white border border-gray-850 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Local Cache Memory
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: PAGES SUMMARY & DEVICE BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Top Pages Breakdown (Left Column - 2 Cols Span) */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 lg:col-span-2 space-y-4">
            <h3 className="font-bold text-base border-b border-gray-855 pb-3">Popular Pages & Routes</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-850 text-xs">
                    <th className="py-2.5 font-medium">Page URL Path</th>
                    <th className="py-2.5 font-medium text-right">Views Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-850">
                  {Object.keys(viewsByPage).sort((a,b) => viewsByPage[b] - viewsByPage[a]).slice(0, 5).map((path) => (
                    <tr key={path} className="hover:bg-gray-850/30 transition-colors">
                      <td className="py-3 font-mono text-xs text-amber-400 select-all">{path}</td>
                      <td className="py-3 text-right font-bold">{viewsByPage[path]}</td>
                    </tr>
                  ))}
                  {Object.keys(viewsByPage).length === 0 && (
                    <tr>
                      <td colSpan="2" className="py-4 text-center text-gray-500 text-xs">No route logs recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Browser / Device breakdown charts */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-base border-b border-gray-850 pb-3">Device & Browser Mix</h3>
            
            {/* Device breakdown */}
            <div className="space-y-3">
              <span className="text-xs text-gray-400 font-semibold uppercase block">Device Category</span>
              <div className="space-y-2">
                {['Desktop', 'Mobile', 'Tablet'].map((dev) => {
                  const count = deviceDistribution[dev] || 0;
                  const total = Object.values(deviceDistribution).reduce((a,b) => a+b, 0) || 1;
                  const pct = Math.round((count / total) * 100);
                  
                  return (
                    <div key={dev} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="flex items-center gap-1.5">
                          {dev === 'Desktop' ? <Laptop className="w-3.5 h-3.5 text-blue-400" /> : <Smartphone className="w-3.5 h-3.5 text-emerald-400" />}
                          {dev}
                        </span>
                        <span>{pct}% ({count})</span>
                      </div>
                      <div className="w-full bg-gray-950 h-2 rounded-full overflow-hidden border border-gray-850">
                        <div 
                          className={`h-full rounded-full ${dev === 'Desktop' ? 'bg-blue-500' : 'bg-emerald-500'}`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Browser breakdown progress list */}
            <div className="space-y-3 pt-2">
              <span className="text-xs text-gray-400 font-semibold uppercase block">Browser Distribution</span>
              <div className="space-y-2.5">
                {Object.keys(browserDistribution).sort((a,b) => browserDistribution[b] - browserDistribution[a]).slice(0, 3).map((br) => {
                  const count = browserDistribution[br] || 0;
                  const total = Object.values(browserDistribution).reduce((a,b) => a+b, 0) || 1;
                  const pct = Math.round((count / total) * 100);

                  return (
                    <div key={br} className="flex items-center justify-between text-xs border-b border-gray-850/50 pb-1.5">
                      <span className="text-gray-300 font-medium">{br}</span>
                      <span className="font-semibold text-gray-400">{pct}% ({count})</span>
                    </div>
                  );
                })}
                {Object.keys(browserDistribution).length === 0 && (
                  <span className="text-xs text-gray-500">No browser data.</span>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 3: SYSTEM CONSOLE (LIVE HITS LOG) */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-850 pb-3">
            <Terminal className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base">Live Visitor Request Console</h3>
            <span className="text-[10px] text-gray-500 bg-gray-950 px-2 py-0.5 rounded border border-gray-850 font-mono">
              tail -f analytics.log
            </span>
          </div>

          <div className="bg-gray-950 rounded-xl p-4 font-mono text-[11px] text-gray-300 border border-gray-850 h-56 overflow-y-auto space-y-1.5 scrollbar-thin">
            {recentHits.map((hit, idx) => {
              const time = new Date(hit.timestamp).toLocaleTimeString();
              return (
                <div key={idx} className="hover:bg-gray-900/50 py-0.5 px-1.5 rounded transition-colors flex flex-wrap gap-x-2 text-gray-400">
                  <span className="text-gray-600">[{time}]</span>
                  <span className="text-green-500">GET</span>
                  <span className="text-amber-400 font-semibold">{hit.pathname}</span>
                  <span className="text-gray-500">via</span>
                  <span className="text-blue-400">{hit.browser} ({hit.device})</span>
                  <span className="text-gray-600">ref: {hit.referrer}</span>
                </div>
              );
            })}
            {recentHits.length === 0 && (
              <div className="text-gray-600 text-center py-16">
                Console is idle. Waiting for incoming page loads...
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
