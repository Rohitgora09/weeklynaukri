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

  // upsc.gov.in 307s file requests to its homepage; www serves them
  if (target.hostname === 'upsc.gov.in') {
    target.hostname = 'www.upsc.gov.in';
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    const upstream = await fetch(target.href, {
      headers: {
        'User-Agent': UA,
        Accept: 'application/pdf,*/*',
        Referer: target.origin,
      },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!upstream.ok || !upstream.body) {
      return NextResponse.redirect(target.href, 302);
    }

    const length = parseInt(upstream.headers.get('content-length') || '0', 10);
    if (length > MAX_BYTES) {
      // Too big to proxy — send the user to the source instead
      return NextResponse.redirect(target.href, 302);
    }

    // Validate magic bytes — WAF pages and redirects-to-homepage arrive as
    // HTML with 200; streaming those as application/pdf breaks the viewer
    const reader = upstream.body.getReader();
    const first = await reader.read();
    const firstChunk = first.value || new Uint8Array(0);
    const head = Buffer.from(firstChunk.slice(0, 1024)).toString('latin1');
    if (!head.includes('%PDF')) {
      reader.cancel().catch(() => {});
      return NextResponse.redirect(target.href, 302);
    }

    const stream = new ReadableStream({
      start(streamController) {
        streamController.enqueue(firstChunk);
      },
      async pull(streamController) {
        const { done, value } = await reader.read();
        if (done) streamController.close();
        else streamController.enqueue(value);
      },
      cancel() {
        reader.cancel().catch(() => {});
      },
    });

    const filename = (target.pathname.split('/').pop() || 'notification.pdf')
      .replace(/[^\w.\-]/g, '_')
      .slice(0, 100);

    return new Response(stream, {
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
