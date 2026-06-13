import { supabase } from './supabase.js';

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

// Clean old tracking data to optimize database size (older than 30 days)
async function cleanOldHits() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    await supabase
      .from('analytics_hits')
      .delete()
      .lt('created_at', thirtyDaysAgo);
  } catch (err) {
    console.error("Failed to prune old analytics database hits:", err.message);
  }
}

// Record a new visitor hit
export async function trackHit({ pathname, referrer, screenWidth, userAgent, ip }) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
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

    const { error } = await supabase
      .from('analytics_hits')
      .insert({
        pathname,
        referrer: cleanReferrer,
        screen_width: screenWidth || 0,
        user_agent: userAgent || '',
        ip_hash: ipHash,
        created_at: now
      });

    if (error) throw error;

    // Run clean up asynchronously sometimes
    if (Math.random() < 0.05) {
      cleanOldHits();
    }
  } catch (err) {
    console.error("Error executing trackHit:", err.message);
  }
}

// Fetch aggregate dashboard stats
export async function getStats() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch analytics hits from last 30 days, up to 5000 records
    const { data: hits, error } = await supabase
      .from('analytics_hits')
      .select('pathname, referrer, screen_width, user_agent, ip_hash, created_at')
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: false })
      .range(0, 4999);

    if (error) throw error;

    const processedHits = hits || [];

    // 1. Total Page Views
    const totalPageViews = processedHits.length;

    // 2. Unique Visitors (aggregating unique IP hashes)
    const uniqueIps = new Set(processedHits.map(h => h.ip_hash));
    const totalUniqueVisitors = uniqueIps.size;

    // 3. Views by Page
    const viewsByPageMap = {};
    processedHits.forEach(h => {
      viewsByPageMap[h.pathname] = (viewsByPageMap[h.pathname] || 0) + 1;
    });
    const viewsByPage = Object.fromEntries(
      Object.entries(viewsByPageMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
    );

    // 4. Browsers Split
    const browsers = { Chrome: 0, Firefox: 0, Safari: 0, Edge: 0, Other: 0 };
    processedHits.forEach(h => {
      const b = getBrowser(h.user_agent);
      browsers[b] = (browsers[b] || 0) + 1;
    });

    // 5. Devices Split
    const devices = { Mobile: 0, Tablet: 0, Desktop: 0 };
    processedHits.forEach(h => {
      const d = getDevice(h.user_agent, h.screen_width);
      devices[d] = (devices[d] || 0) + 1;
    });

    // 6. Referrer splits
    const referrerMap = {};
    processedHits.forEach(h => {
      const ref = h.referrer || 'direct';
      referrerMap[ref] = (referrerMap[ref] || 0) + 1;
    });
    const referrers = Object.fromEntries(
      Object.entries(referrerMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
    );

    // 7. Daily Views Chart Data (last 7 days)
    const dailyViewsMap = {};
    processedHits.forEach(h => {
      if (h.created_at) {
        const day = h.created_at.split('T')[0];
        dailyViewsMap[day] = (dailyViewsMap[day] || 0) + 1;
      }
    });
    const dailyViews = {};
    const days = Object.keys(dailyViewsMap).sort().slice(-7);
    days.forEach(day => {
      dailyViews[day] = dailyViewsMap[day];
    });

    // 8. Recent Hits log (last 50 requests)
    const recentHits = processedHits.slice(0, 50).map(h => ({
      timestamp: h.created_at,
      pathname: h.pathname,
      browser: getBrowser(h.user_agent),
      device: getDevice(h.user_agent, h.screen_width),
      referrer: h.referrer
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

