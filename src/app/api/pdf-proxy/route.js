import { NextResponse } from 'next/server';

// Streams official notification PDFs through our domain so job pages can
// embed them inline instead of sending users to the source site.
// Restricted to official/government hosts — this must never become an
// open proxy.

const MAX_BYTES = 25 * 1024 * 1024; // refuse PDFs over 25MB

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36';

function isAllowedHost(host) {
  const h = host.toLowerCase();
  return (
    h.endsWith('.gov.in') ||
    h.endsWith('.nic.in') ||
    h === 'ibps.in' ||
    h.endsWith('.ibps.in') ||
    h === 'ssc.gov.in' ||
    h.endsWith('.rajasthan.gov.in')
  );
}

export async function GET(request) {
  const raw = new URL(request.url).searchParams.get('url') || '';

  let target;
  try {
    target = new URL(raw);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  if (!/^https?:$/.test(target.protocol) || !isAllowedHost(target.hostname)) {
    return NextResponse.json({ error: 'Host not allowed' }, { status: 403 });
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    const upstream = await fetch(target.href, {
      headers: { 'User-Agent': UA, Accept: 'application/pdf,*/*' },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: 'Upstream fetch failed' }, { status: 502 });
    }

    const length = parseInt(upstream.headers.get('content-length') || '0', 10);
    if (length > MAX_BYTES) {
      // Too big to proxy — send the user to the source instead
      return NextResponse.redirect(target.href, 302);
    }

    const contentType = upstream.headers.get('content-type') || '';
    if (!contentType.includes('pdf') && !target.pathname.toLowerCase().endsWith('.pdf')) {
      return NextResponse.redirect(target.href, 302);
    }

    const filename = (target.pathname.split('/').pop() || 'notification.pdf')
      .replace(/[^\w.\-]/g, '_')
      .slice(0, 100);

    return new Response(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('PDF proxy error:', err.message);
    return NextResponse.redirect(target.href, 302);
  }
}
