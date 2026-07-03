import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '../../../../lib/supabase';
import { sendAlertDigestEmail } from '../../../../lib/mailer';

// Sends new-listing digests to all subscribers. Protected by ADMIN_PASSWORD,
// intended to be hit by a daily cron on the VPS:
//   curl -X POST -H "x-admin-password: $ADMIN_PASSWORD" https://weeklynaukri.com/api/alerts/dispatch

export const maxDuration = 300;

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

const MAX_LOOKBACK_MS = 72 * 60 * 60 * 1000; // never resend older than 3 days
const MAX_JOBS_PER_CATEGORY = 15;

export async function POST(request) {
  const expected = process.env.ADMIN_PASSWORD;
  const given = request.headers.get('x-admin-password');
  if (!expected || !given || !safeEqual(given, expected)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: subscribers, error: subError } = await supabase
      .from('alert_subscribers')
      .select('*');
    if (subError) throw subError;

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ success: true, sent: 0, skipped: 0, message: 'No subscribers.' });
    }

    const oldestCutoff = new Date(Date.now() - MAX_LOOKBACK_MS).toISOString();
    const { data: recentJobs, error: jobsError } = await supabase
      .from('scraper_cache')
      .select('title, url_slug, category, scraped_at')
      .gt('scraped_at', oldestCutoff)
      .order('scraped_at', { ascending: false });
    if (jobsError) throw jobsError;

    let sent = 0;
    let skipped = 0;
    const failures = [];

    for (const sub of subscribers) {
      // Per-subscriber cutoff: whatever is newer — their last digest or 3 days ago
      const lastSent = sub.last_sent_at ? new Date(sub.last_sent_at).getTime() : 0;
      const cutoff = Math.max(lastSent, Date.now() - MAX_LOOKBACK_MS);

      const jobsByCategory = {};
      for (const cat of sub.categories || []) {
        const matches = (recentJobs || [])
          .filter(
            (j) =>
              j.category === cat &&
              j.url_slug &&
              new Date(j.scraped_at).getTime() > cutoff
          )
          .slice(0, MAX_JOBS_PER_CATEGORY);
        if (matches.length > 0) jobsByCategory[cat] = matches;
      }

      if (Object.keys(jobsByCategory).length === 0) {
        skipped++;
        continue;
      }

      try {
        await sendAlertDigestEmail(sub.email, jobsByCategory, sub.unsubscribe_token);
        await supabase
          .from('alert_subscribers')
          .update({ last_sent_at: new Date().toISOString() })
          .eq('id', sub.id);
        sent++;
      } catch (err) {
        console.error(`Alert email failed for ${sub.email}:`, err.message);
        failures.push(sub.email);
      }
    }

    return NextResponse.json({ success: true, sent, skipped, failed: failures.length });
  } catch (err) {
    console.error('Alert dispatch error:', err.message);
    return NextResponse.json({ success: false, error: 'Dispatch failed' }, { status: 500 });
  }
}
