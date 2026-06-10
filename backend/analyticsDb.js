import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbDir = path.join(__dirname, 'data');
const dbFile = path.join(dbDir, 'analytics.json');

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initial default structure
let analyticsData = {
  totalPageViews: 0,
  totalUniqueVisitors: 0,
  viewsByPage: {},
  browsers: {},
  devices: {},
  referrers: {},
  dailyViews: {},
  recentHits: [],
  dailyIPs: {} // key YYYY-MM-DD, array of IP hashes
};

// Load existing stats if available
if (fs.existsSync(dbFile)) {
  try {
    const rawData = fs.readFileSync(dbFile, 'utf8');
    const parsed = JSON.parse(rawData);
    analyticsData = { ...analyticsData, ...parsed };
  } catch (err) {
    console.error("Failed to load analytics database, initializing empty:", err);
  }
}

// Browser parsing helper
function getBrowser(userAgent) {
  const ua = userAgent.toLowerCase();
  if (ua.includes('chrome') || ua.includes('crios')) return 'Chrome';
  if (ua.includes('firefox') || ua.includes('fxios')) return 'Firefox';
  if (ua.includes('safari') && !ua.includes('chrome') && !ua.includes('chromium')) return 'Safari';
  if (ua.includes('edge') || ua.includes('edg')) return 'Edge';
  return 'Other';
}

// Device parsing helper
function getDevice(userAgent, width) {
  if (width && width < 768) return 'Mobile';
  if (width && width < 1024) return 'Tablet';
  
  const ua = userAgent.toLowerCase();
  if (ua.includes('mobi') || ua.includes('android') || ua.includes('iphone')) return 'Mobile';
  if (ua.includes('ipad') || ua.includes('tablet')) return 'Tablet';
  return 'Desktop';
}

// Stable hashing for IP tracking to protect user privacy
function stableHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Clean old data to avoid bloating JSON size
function cleanOldData() {
  // 1. Keep recent hits capped at 50 logs
  if (analyticsData.recentHits && analyticsData.recentHits.length > 50) {
    analyticsData.recentHits = analyticsData.recentHits.slice(0, 50);
  }
  
  // 2. Keep only the last 7 days of raw unique visitor IP hashes
  if (analyticsData.dailyIPs) {
    const days = Object.keys(analyticsData.dailyIPs);
    if (days.length > 7) {
      days.sort();
      const removeDays = days.slice(0, days.length - 7);
      removeDays.forEach(d => {
        delete analyticsData.dailyIPs[d];
      });
    }
  }
}

// Debounce saving database to optimize disk I/O performance
let writeTimeout = null;
function saveDb() {
  if (writeTimeout) return;
  writeTimeout = setTimeout(() => {
    try {
      cleanOldData();
      fs.writeFileSync(dbFile, JSON.stringify(analyticsData, null, 2), 'utf8');
    } catch (err) {
      console.error("Error writing analytics file to disk:", err);
    }
    writeTimeout = null;
  }, 2000); // 2-second debounce
}

// Exported Functions
export function trackHit({ pathname, referrer, screenWidth, userAgent, ip }) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const browser = getBrowser(userAgent || '');
    const device = getDevice(userAgent || '', screenWidth);
    const cleanReferrer = referrer ? new URL(referrer).hostname : 'direct';

    // 1. Increment Pageviews
    analyticsData.totalPageViews = (analyticsData.totalPageViews || 0) + 1;
    
    // Page breakdown
    if (!analyticsData.viewsByPage) analyticsData.viewsByPage = {};
    analyticsData.viewsByPage[pathname] = (analyticsData.viewsByPage[pathname] || 0) + 1;
    
    // Browser breakdown
    if (!analyticsData.browsers) analyticsData.browsers = {};
    analyticsData.browsers[browser] = (analyticsData.browsers[browser] || 0) + 1;
    
    // Device breakdown
    if (!analyticsData.devices) analyticsData.devices = {};
    analyticsData.devices[device] = (analyticsData.devices[device] || 0) + 1;
    
    // Referrer breakdown
    if (!analyticsData.referrers) analyticsData.referrers = {};
    analyticsData.referrers[cleanReferrer] = (analyticsData.referrers[cleanReferrer] || 0) + 1;
    
    // Daily views chart data
    if (!analyticsData.dailyViews) analyticsData.dailyViews = {};
    analyticsData.dailyViews[today] = (analyticsData.dailyViews[today] || 0) + 1;

    // 2. Unique Visitors Check
    if (!analyticsData.dailyIPs) analyticsData.dailyIPs = {};
    if (!analyticsData.dailyIPs[today]) analyticsData.dailyIPs[today] = [];

    const ipHash = stableHash(ip || '127.0.0.1');
    if (!analyticsData.dailyIPs[today].includes(ipHash)) {
      analyticsData.dailyIPs[today].push(ipHash);
      analyticsData.totalUniqueVisitors = (analyticsData.totalUniqueVisitors || 0) + 1;
    }

    // 3. Add to live console hits log
    if (!analyticsData.recentHits) analyticsData.recentHits = [];
    analyticsData.recentHits.unshift({
      timestamp: new Date().toISOString(),
      pathname,
      browser,
      device,
      referrer: cleanReferrer
    });

    saveDb();
  } catch (err) {
    console.error("Error executing trackHit:", err);
  }
}

export function getStats() {
  // Return a copy of analytics stats (excluding dailyIPs to prevent returning raw hashes to client)
  const { dailyIPs, ...stats } = analyticsData;
  return stats;
}
