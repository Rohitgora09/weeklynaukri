import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { fetchSSCNotices, fetchSarkariResultData } from '../../../../lib/scraper';
import { verifyToken } from '../../../../lib/auth';

// Constant-time string comparison to avoid timing attacks
function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminPasswordHeader = request.headers.get('x-admin-password');
    let isAuthorized = false;

    const expectedPassword = process.env.ADMIN_PASSWORD;
    if (expectedPassword && adminPasswordHeader && safeEqual(adminPasswordHeader, expectedPassword)) {
      isAuthorized = true;
    }

    if (!isAuthorized && authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = verifyToken(token);
      if (payload && payload.role === 'admin') {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log("Manual scraper refresh triggered from Admin Dashboard");
    
    // Trigger scraper asynchronously
    (async () => {
      try {
        await fetchSSCNotices(true);
        await fetchSarkariResultData(true);
        console.log("Manual scraper refresh completed successfully!");
      } catch (err) {
        console.error("Manual scrape background failure:", err.message);
      }
    })();

    return NextResponse.json({ success: true, message: 'Scrapers triggered in background.' });
  } catch (err) {
    console.error("API trigger-scrape error:", err.message);
    return NextResponse.json({ success: false, error: 'Scraper failed to start' }, { status: 500 });
  }
}
