import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
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
