import db from './db.js';

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

// Clean old tracking data to optimize SQLite size (older than 30 days)
function cleanOldHits() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare("DELETE FROM analytics_hits WHERE created_at < ?").run(thirtyDaysAgo);
  } catch (err) {
    console.error("Failed to prune old analytics database hits:", err.message);
  }
}

// Record a new visitor hit
export function trackHit({ pathname, referrer, screenWidth, userAgent, ip }) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const browser = getBrowser(userAgent || '');
    const device = getDevice(userAgent || '', screenWidth);
    
    let cleanReferrer = 'direct';
    if (referrer && referrer !== 'direct') {
      try {
        cleanReferrer = new URL(referrer).hostname;
      } catch (e) {
        cleanReferrer = referrer;
      }
    }

    const ipHash = stableHash(ip || '127.0.0.1') + '-' + today;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO analytics_hits (pathname, referrer, screen_width, user_agent, ip_hash, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(pathname, cleanReferrer, screenWidth || 0, userAgent || '', ipHash, now);

    // Run clean up asynchronously sometimes
    if (Math.random() < 0.05) {
      cleanOldHits();
    }
  } catch (err) {
    console.error("Error executing trackHit:", err.message);
  }
}

// Fetch aggregate dashboard stats
export function getStats() {
  try {
    // 1. Total Page Views
    const totalPageViews = db.prepare('SELECT COUNT(*) as count FROM analytics_hits').get().count;

    // 2. Unique Visitors (aggregating unique IP hashes)
    const totalUniqueVisitors = db.prepare('SELECT COUNT(DISTINCT ip_hash) as count FROM analytics_hits').get().count;

    // 3. Views by Page
    const viewsByPageRows = db.prepare(`
      SELECT pathname, COUNT(*) as count 
      FROM analytics_hits 
      GROUP BY pathname 
      ORDER BY count DESC 
      LIMIT 10
    `).all();
    const viewsByPage = {};
    viewsByPageRows.forEach(row => { viewsByPage[row.pathname] = row.count; });

    // 4. Browsers Split
    const browserRows = db.prepare(`
      SELECT user_agent, COUNT(*) as count 
      FROM analytics_hits 
      GROUP BY user_agent
    `).all();
    const browsers = { Chrome: 0, Firefox: 0, Safari: 0, Edge: 0, Other: 0 };
    browserRows.forEach(row => {
      const b = getBrowser(row.user_agent);
      browsers[b] = (browsers[b] || 0) + row.count;
    });

    // 5. Devices Split
    const deviceRows = db.prepare(`
      SELECT user_agent, screen_width, COUNT(*) as count 
      FROM analytics_hits 
      GROUP BY user_agent, screen_width
    `).all();
    const devices = { Mobile: 0, Tablet: 0, Desktop: 0 };
    deviceRows.forEach(row => {
      const d = getDevice(row.user_agent, row.screen_width);
      devices[d] = (devices[d] || 0) + row.count;
    });

    // 6. Referrer splits
    const referrerRows = db.prepare(`
      SELECT referrer, COUNT(*) as count 
      FROM analytics_hits 
      GROUP BY referrer 
      ORDER BY count DESC 
      LIMIT 10
    `).all();
    const referrers = {};
    referrerRows.forEach(row => { referrers[row.referrer] = row.count; });

    // 7. Daily Views Chart Data (last 7 days)
    const dailyViewsRows = db.prepare(`
      SELECT strftime('%Y-%m-%d', created_at) as day, COUNT(*) as count 
      FROM analytics_hits 
      GROUP BY day 
      ORDER BY day DESC 
      LIMIT 7
    `).all();
    const dailyViews = {};
    dailyViewsRows.reverse().forEach(row => { dailyViews[row.day] = row.count; });

    // 8. Recent Hits log (last 50 requests)
    const recentHitsRows = db.prepare(`
      SELECT pathname, referrer, user_agent, screen_width, created_at 
      FROM analytics_hits 
      ORDER BY created_at DESC 
      LIMIT 50
    `).all();
    const recentHits = recentHitsRows.map(row => ({
      timestamp: row.created_at,
      pathname: row.pathname,
      browser: getBrowser(row.user_agent),
      device: getDevice(row.user_agent, row.screen_width),
      referrer: row.referrer
    }));

    return {
      totalPageViews,
      totalUniqueVisitors,
      viewsByPage,
      browsers,
      devices,
      referrers,
      dailyViews,
      recentHits
    };
  } catch (err) {
    console.error("Error executing getStats:", err.message);
    return {
      totalPageViews: 0,
      totalUniqueVisitors: 0,
      viewsByPage: {},
      browsers: {},
      devices: {},
      referrers: {},
      dailyViews: {},
      recentHits: []
    };
  }
}
