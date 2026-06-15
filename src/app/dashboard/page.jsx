'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ShieldAlert, 
  Terminal, 
  RefreshCw, 
  Cpu, 
  FileCheck, 
  Eye, 
  Users, 
  Server,
  TrendingUp,
  Monitor,
  Laptop
} from 'lucide-react';
import { api } from '../../services/api';

export const metadata = {
  title: 'Admin Dashboard — WeeklyNaukri',
  robots: { index: false, follow: false },
};

export default function Dashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [triggerMsg, setTriggerMsg] = useState('');
  
  const refreshInterval = useRef(null);

  // Load dashboard stats from server API
  const loadStats = async (authPass = null) => {
    const activePassword = authPass || localStorage.getItem('adminPassword') || '';
    if (!activePassword) return;

    setError('');
    try {
      const res = await api.get('/api/analytics/stats', {
        headers: { 'x-admin-password': activePassword }
      });
      if (res.success) {
        setStats(res);
        setAuthorized(true);
        localStorage.setItem('adminPassword', activePassword);
      } else {
        throw new Error(res.error || 'Authorization failed');
      }
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
      localStorage.removeItem('adminPassword');
      setAuthorized(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('adminPassword');
    if (saved) {
      loadStats(saved);
      // Setup auto polling every 10 seconds for real time charts
      refreshInterval.current = setInterval(() => {
        loadStats(saved);
      }, 10000);
    }

    return () => {
      if (refreshInterval.current) clearInterval(refreshInterval.current);
    };
  }, []);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    loadStats(password);
    
    // Setup interval on success
    if (refreshInterval.current) clearInterval(refreshInterval.current);
    refreshInterval.current = setInterval(() => {
      loadStats(password);
    }, 10000);
  };

  const handleTriggerScrape = async () => {
    setTriggerMsg('Triggering scrapers in background...');
    try {
      const res = await api.post('/api/analytics/trigger-scrape', {});
      if (res.success) {
        setTriggerMsg('Scrapers successfully running in background.');
        setTimeout(() => setTriggerMsg(''), 4000);
        loadStats();
      }
    } catch (err) {
      setTriggerMsg('Failed: ' + err.message);
    }
  };

  const handleClearCache = async () => {
    setTriggerMsg('Clearing cache...');
    try {
      const res = await api.post('/api/analytics/clear-cache', {});
      if (res.success) {
        setTriggerMsg('Scraper cache database successfully cleared.');
        setTimeout(() => setTriggerMsg(''), 4000);
        loadStats();
      }
    } catch (err) {
      setTriggerMsg('Failed: ' + err.message);
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6 w-full">
        <div className="w-full max-w-md bg-gray-800 border border-gray-700 p-8 rounded-3xl text-center shadow-2xl">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/25">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Security Gated Access</h1>
          <p className="text-gray-400 text-sm mb-6">Enter administrator dashboard key for weeklynaukri.com</p>

          {error && <div className="mb-4 p-3 bg-red-500/20 text-red-400 text-xs rounded-xl border border-red-500/30">{error}</div>}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="block w-full px-4 py-3 bg-gray-900 border border-gray-750 text-white rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-center"
            />
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 py-3 rounded-xl font-semibold transition-all cursor-pointer"
            >
              Verify Key
            </button>
          </form>

          <Link href="/" className="text-xs text-gray-450 hover:underline block mt-6">
            Back to Website
          </Link>
        </div>
      </div>
    );
  }

  // Calculate stats parameters
  const serverStats = stats?.stats || {};
  const sys = stats?.system || {};
  const counts = stats?.counts || {};
  
  // Custom SVG Bar Chart parameters
  const dailyViewsKeys = Object.keys(serverStats.dailyViews || {});
  const dailyViewsValues = Object.values(serverStats.dailyViews || {});
  const maxViewVal = Math.max(...dailyViewsValues, 10);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col w-full">
      {/* Header controls */}
      <header className="border-b border-gray-900 bg-gray-900/60 backdrop-blur px-6 py-4 sticky top-0 z-40 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              <Server className="w-5 h-5 text-amber-500" /> Admin Command Center
            </h1>
            <p className="text-[10px] text-gray-450">WeeklyNaukri VPS Metrics</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadStats()}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors cursor-pointer text-gray-400 hover:text-white"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('adminPassword');
              setAuthorized(false);
            }}
            className="text-xs bg-red-650 hover:bg-red-750 px-3.5 py-2 rounded-xl font-bold transition-all text-white cursor-pointer"
          >
            Lock Terminal
          </button>
        </div>
      </header>

      {/* Main grids */}
      <main className="p-6 max-w-7xl mx-auto space-y-6 w-full flex-1">
        
        {/* Scraper controls banner */}
        {triggerMsg && (
          <div className="p-4 bg-blue-900/20 border border-blue-500/20 text-blue-400 text-xs rounded-2xl animate-pulse flex items-center justify-between">
            <span>{triggerMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Uptime', val: Math.round(stats.uptime / 1000 / 60) + ' min', icon: Cpu, desc: 'Process execution time' },
            { label: 'Page Views', val: serverStats.totalPageViews || 0, icon: Eye, desc: 'Total tracked route loads' },
            { label: 'Unique Visitors', val: serverStats.totalUniqueVisitors || 0, icon: Users, desc: 'Hashed visitor IPs' },
            { label: 'Referrals Count', val: counts.referrals || 0, icon: FileCheck, desc: 'Disk SQLite entries' },
          ].map((block, idx) => (
            <div key={idx} className="bg-gray-900 border border-gray-850 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-450 uppercase">{block.label}</span>
                <block.icon className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-2xl font-bold">{block.val}</p>
              <p className="text-[10px] text-gray-550 mt-1">{block.desc}</p>
            </div>
          ))}
        </div>

        {/* Charts & Actions splits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Traffic charts */}
          <div className="lg:col-span-8 bg-gray-900 border border-gray-850 p-6 rounded-3xl">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-sm text-gray-300">
              <TrendingUp className="w-4 h-4 text-amber-500" /> Traffic Trend (Pageviews/Day)
            </h3>
            
            {dailyViewsKeys.length === 0 ? (
              <p className="text-xs text-gray-500 py-10 text-center">No traffic logged in the database yet.</p>
            ) : (
              <div className="w-full">
                {/* Pure custom SVG Chart */}
                <svg viewBox="0 0 600 200" className="w-full h-auto overflow-visible">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="580" y2="20" stroke="#1f2937" strokeDasharray="4" />
                  <line x1="40" y1="80" x2="580" y2="80" stroke="#1f2937" strokeDasharray="4" />
                  <line x1="40" y1="140" x2="580" y2="140" stroke="#1f2937" strokeDasharray="4" />
                  <line x1="40" y1="170" x2="580" y2="170" stroke="#374151" />

                  {/* Bars */}
                  {dailyViewsKeys.map((day, idx) => {
                    const val = dailyViewsValues[idx];
                    const height = (val / maxViewVal) * 140;
                    const x = 50 + idx * 75;
                    const y = 170 - height;
                    
                    return (
                      <g key={idx} className="group">
                        <rect 
                          x={x} 
                          y={y} 
                          width="35" 
                          height={height} 
                          fill="#f59e0b" 
                          opacity="0.8" 
                          className="hover:opacity-100 transition-opacity" 
                          rx="4"
                        />
                        {/* Tooltip value */}
                        <text 
                          x={x + 17.5} 
                          y={y - 8} 
                          fill="#ffffff" 
                          fontSize="10" 
                          fontWeight="bold" 
                          textAnchor="middle"
                          opacity="0"
                          className="group-hover:opacity-100 transition-opacity"
                        >
                          {val}
                        </text>
                        {/* Day label */}
                        <text 
                          x={x + 17.5} 
                          y="185" 
                          fill="#9ca3af" 
                          fontSize="9" 
                          textAnchor="middle"
                        >
                          {day.substring(5)}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
          </div>

          {/* Quick task triggers */}
          <div className="lg:col-span-4 bg-gray-900 border border-gray-850 p-6 rounded-3xl flex flex-col justify-between">
            <div>
              <h3 className="font-bold mb-3 text-sm text-gray-300">Scraper Controls</h3>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Manually dispatch Puppeteer jobs on the VPS server to fetch the latest SarkariResult content or notices immediately.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleTriggerScrape}
                className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Scrape SarkariResult Now
              </button>
              
              <button
                onClick={handleClearCache}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl text-xs font-semibold border border-gray-705 transition-all cursor-pointer"
              >
                Reset Scraper Caches
              </button>
            </div>
          </div>
        </div>

        {/* Browser splits, Device splits, Top pages, Terminal Console logs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Top viewed routes */}
          <div className="md:col-span-4 bg-gray-900 border border-gray-850 p-6 rounded-3xl">
            <h3 className="font-bold mb-4 text-sm text-gray-300">Top Visited Pages</h3>
            <div className="space-y-3">
              {Object.entries(serverStats.viewsByPage || {}).map(([page, views], idx) => (
                <div key={idx} className="flex justify-between items-center text-xs border-b border-gray-850/50 pb-2">
                  <span className="text-gray-400 font-mono truncate max-w-[200px]" title={page}>{page}</span>
                  <span className="font-bold text-amber-500">{views} views</span>
                </div>
              ))}
            </div>
          </div>

          {/* Device and Browser break downs */}
          <div className="md:col-span-4 bg-gray-900 border border-gray-850 p-6 rounded-3xl">
            <h3 className="font-bold mb-4 text-sm text-gray-300">Devices & Browsers</h3>
            
            {/* Devices */}
            <div className="space-y-3 mb-6">
              <h4 className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Devices</h4>
              {Object.entries(serverStats.devices || {}).map(([dev, count], idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-gray-450 flex items-center gap-1.5"><Monitor className="w-3.5 h-3.5 text-gray-400" /> {dev}</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
            </div>

            {/* Browsers */}
            <div className="space-y-3 border-t border-gray-850 pt-4">
              <h4 className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Browsers</h4>
              {Object.entries(serverStats.browsers || {}).map(([browser, count], idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-gray-450 flex items-center gap-1.5"><Laptop className="w-3.5 h-3.5 text-gray-400" /> {browser}</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Node/Platform system specs */}
          <div className="md:col-span-4 bg-gray-900 border border-gray-850 p-6 rounded-3xl">
            <h3 className="font-bold mb-4 text-sm text-gray-300">System Resources</h3>
            <div className="space-y-3.5 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Platform OS</span>
                <span className="font-semibold text-white uppercase">{sys.platform}</span>
              </div>
              <div className="flex justify-between">
                <span>Node.js Version</span>
                <span className="font-semibold text-white">{sys.nodeVersion}</span>
              </div>
              <div className="flex justify-between">
                <span>Memory Allocation</span>
                <span className="font-semibold text-white">{sys.memoryUsage}</span>
              </div>
              <div className="flex justify-between">
                <span>SQLite DB Size</span>
                <span className="font-semibold text-amber-500">Lightweight</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time console hit terminal logs */}
        <div className="bg-gray-900 border border-gray-850 rounded-3xl overflow-hidden shadow-xl">
          <div className="bg-gray-850 px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold text-amber-500 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> LIVE VISITORS TRAFFIC LOGS
            </h3>
            <span className="text-[9px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono animate-pulse">Running</span>
          </div>
          
          <div className="p-5 font-mono text-[10px] text-gray-400 max-h-[250px] overflow-y-auto space-y-2 leading-5">
            {(serverStats.recentHits || []).map((hit, idx) => (
              <div key={idx} className="hover:bg-gray-850/30 p-1 rounded transition-colors flex flex-wrap items-center justify-between gap-2 border-b border-gray-850/20 pb-1.5">
                <span>
                  <strong className="text-gray-500">[{new Date(hit.timestamp).toLocaleTimeString()}]</strong>{' '}
                  <span className="text-green-550">GET</span>{' '}
                  <span className="text-white font-bold">{hit.pathname}</span>{' '}
                  <span className="text-gray-500">— {hit.device} / {hit.browser}</span>
                </span>
                <span className="text-gray-600">Referrer: {hit.referrer}</span>
              </div>
            ))}
            {(!serverStats.recentHits || serverStats.recentHits.length === 0) && (
              <p className="text-center text-gray-650 py-4 italic">Waiting for visitor hits...</p>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
