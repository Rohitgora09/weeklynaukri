import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '../../../../lib/supabase';

// Pushes recently scraped job URLs to IndexNow (Bing, Yandex, Naver, Seznam)
// so time-sensitive listings get indexed within minutes instead of days.
// Protected by ADMIN_PASSWORD; run from cron after scrapes:
//   curl -X POST -H "x-admin-password: $ADMIN_PASSWORD" https://weeklynaukri.com/api/indexnow/submit

const INDEXNOW_KEY = 'a17f3ef0b8022c06ba7d80d8e003ad69';
const HOST = 'weeklynaukri.com';
const LOOKBACK_HOURS = 36;
const MAX_URLS = 500;

const HUB_PAGES = [
  'https://weeklynaukri.com/',
  'https://weeklynaukri.com/latest-jobs',
  'https://weeklynaukri.com/results',
  'https://weeklynaukri.com/admit-cards',
  'https://weeklynaukri.com/answer-keys',
];

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request) {
  const expected = process.env.ADMIN_PASSWORD;
  const given = request.headers.get('x-admin-password');
  if (!expected || !given || !safeEqual(given, expected)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cutoff = new Date(Date.now() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();
    const { data: recentJobs, error } = await supabase
      .from('scraper_cache')
      .select('url_slug')
      .gt('scraped_at', cutoff)
      .order('scraped_at', { ascending: false })
      .limit(MAX_URLS);
    if (error) throw error;

    const jobUrls = (recentJobs || [])
      .filter((j) => j.url_slug && j.url_slug.trim() !== '')
      .map((j) => `https://weeklynaukri.com/job/${j.url_slug}`);

    const urlList = [...new Set([...HUB_PAGES, ...jobUrls])].slice(0, MAX_URLS);

    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });

    // IndexNow returns 200/202 on success
    const ok = res.status === 200 || res.status === 202;
    if (!ok) {
      const text = await res.text().catch(() => '');
      console.error(`IndexNow submission failed: HTTP ${res.status} ${text}`);
      return NextResponse.json(
        { success: false, status: res.status, submitted: 0 },
        { status: 502 }
      );
    }

    console.log(`IndexNow: submitted ${urlList.length} URLs (HTTP ${res.status})`);
    return NextResponse.json({ success: true, submitted: urlList.length, status: res.status });
  } catch (err) {
    console.error('IndexNow submit error:', err.message);
    return NextResponse.json({ success: false, error: 'Submission failed' }, { status: 500 });
  }
}
