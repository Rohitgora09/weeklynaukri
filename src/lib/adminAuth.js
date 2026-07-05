import crypto from 'crypto';
import { verifyToken } from './auth';

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// Accepts either the ADMIN_PASSWORD header (for cron) or an admin JWT
// (for the dashboard UI) — same convention as /api/analytics/trigger-scrape.
export function isAdminRequest(request) {
  const expected = process.env.ADMIN_PASSWORD;
  const given = request.headers.get('x-admin-password');
  if (expected && given && safeEqual(given, expected)) return true;

  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const payload = verifyToken(authHeader.split(' ')[1]);
    if (payload && payload.role === 'admin') return true;
  }
  return false;
}
