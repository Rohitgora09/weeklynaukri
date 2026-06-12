import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Name, email, and message are required' }, { status: 400 });
    }
    console.log(`Contact form: ${name} (${email}) - ${subject || 'No Subject'}: ${message}`);
    return NextResponse.json({ success: true, message: 'Your message has been received. We will get back to you soon!' });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to process feedback form' }, { status: 500 });
  }
}
