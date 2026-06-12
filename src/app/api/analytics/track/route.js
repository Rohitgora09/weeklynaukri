import { NextResponse } from 'next/server';
import { trackHit } from '../../../../lib/analytics';

export async function POST(request) {
  try {
    const { pathname, referrer, screenWidth, userAgent } = await request.json();

    if (!pathname) {
      return NextResponse.json({ success: false, error: 'Pathname is required' }, { status: 400 });
    }

    // Get Client IP Address from request headers
    let ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    if (ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }

    trackHit({
      pathname,
      referrer,
      screenWidth,
      userAgent: userAgent || request.headers.get('user-agent'),
      ip
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API track error:", err.message);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
