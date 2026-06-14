import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { verifyToken } from '../../../../lib/auth';
import crypto from 'crypto';

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

    console.log("Clearing all backend scraper caches");
    const { error } = await supabase
      .from('scraper_cache')
      .delete()
      .neq('job_id', '');

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Caches successfully cleared and scheduled for reload.' });
  } catch (err) {
    console.error("API clear-cache error:", err.message);
    return NextResponse.json({ success: false, error: 'Cache clearing failed' }, { status: 500 });
  }
}

