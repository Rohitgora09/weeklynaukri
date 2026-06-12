import { NextResponse } from 'next/server';
import { fetchSarkariJobDetails } from '../../../lib/scraper';

const allowedHostnames = [
  'sarkariresult.com.cm',
  'www.sarkariresult.com.cm',
  'ssc.gov.in',
  'www.ssc.gov.in',
  'upsc.gov.in',
  'www.upsc.gov.in'
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL parameter is required' }, { status: 400 });
    }

    // SSRF Whitelist Checking
    try {
      const parsedUrl = new URL(url);
      if (!allowedHostnames.includes(parsedUrl.hostname)) {
        return NextResponse.json({ success: false, error: 'SSRF Check: Domain target not allowed' }, { status: 403 });
      }
    } catch (e) {
      return NextResponse.json({ success: false, error: 'SSRF Check: Invalid URL format' }, { status: 400 });
    }

    const data = await fetchSarkariJobDetails(url);
    if (!data) {
      return NextResponse.json({ success: false, error: 'Failed to extract job details' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("API Job details fetch error:", err.message);
    return NextResponse.json({ success: false, error: 'Failed to fetch job details' }, { status: 500 });
  }
}
