import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import { verifyToken } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const adminPasswordHeader = request.headers.get('x-admin-password');
    let isAuthorized = false;

    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';
    if (adminPasswordHeader && adminPasswordHeader === expectedPassword) {
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
    db.prepare("DELETE FROM scraper_cache").run();

    return NextResponse.json({ success: true, message: 'Caches successfully cleared and scheduled for reload.' });
  } catch (err) {
    console.error("API clear-cache error:", err.message);
    return NextResponse.json({ success: false, error: 'Cache clearing failed' }, { status: 500 });
  }
}
