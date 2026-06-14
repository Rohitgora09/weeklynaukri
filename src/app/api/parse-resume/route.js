import { NextResponse } from 'next/server';
import { verifyToken, checkRateLimit } from '../../../lib/auth';

export async function POST(request) {
  try {
    // 1. Require a valid JWT — must be logged in to parse a resume
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const user = token ? verifyToken(token) : null;
    if (!user) {
      return NextResponse.json({ success: false, error: 'You must be logged in to use the resume matcher.' }, { status: 401 });
    }

    // 2. Rate limit by IP — max 5 uploads per 5 minutes
    const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = checkRateLimit(ip, 'login');
    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, error: `Too many upload attempts. Try again in ${rateLimit.retryAfter} seconds.` }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get('resume');

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate PDF magic bytes (%PDF-) to ensure it's actually a PDF file
    if (buffer.length < 5 || buffer.toString('utf8', 0, 5) !== '%PDF-') {
      return NextResponse.json({ success: false, error: 'Invalid file format. Only PDF files are allowed.' }, { status: 400 });
    }

    // Dynamic import to bypass build-time module evaluation side-effects of pdf-parse
    const pdfParseModule = await import('pdf-parse');
    const pdfParse = pdfParseModule.default || pdfParseModule;
    
    const pdfData = await pdfParse(buffer);

    return NextResponse.json({ 
      success: true, 
      text: pdfData.text 
    });
  } catch (err) {
    console.error("PDF parsing error:", err.message);
    return NextResponse.json({ success: false, error: 'Failed to parse PDF resume' }, { status: 500 });
  }
}
