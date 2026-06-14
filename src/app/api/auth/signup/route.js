import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { registerPendingUser, sendOTPEmail, checkRateLimit } from '../../../../lib/auth';

export async function POST(request) {
  try {
    // Rate limit signups — max 5 per 5 minutes per IP
    const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = checkRateLimit(ip, 'otp');
    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, error: `Too many signup attempts. Try again in ${rateLimit.retryAfter} seconds.` }, { status: 429 });
    }

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Input length limits
    if (name.length > 100) {
      return NextResponse.json({ success: false, error: 'Name must be under 100 characters' }, { status: 400 });
    }
    if (email.length > 254) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    if (password.length > 128) {
      return NextResponse.json({ success: false, error: 'Password must be under 128 characters' }, { status: 400 });
    }

    const { data: checkExists, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) throw error;

    // Always return the same message whether email exists or not — prevents email enumeration
    if (checkExists) {
      return NextResponse.json({
        success: true,
        message: 'OTP verification code sent. Please check your inbox.'
      });
    }

    // Register pending account details and generate OTP code
    const otp = registerPendingUser(name, email, password);

    // Send OTP email
    const mailResult = await sendOTPEmail(email, otp);

    const responsePayload = {
      success: true,
      message: 'OTP verification code sent. Please check your inbox.'
    };

    // NEVER expose OTP in response — log server-side only in non-production
    if (mailResult.mocked && process.env.NODE_ENV !== 'production') {
      console.log(`[DEV ONLY] OTP for ${email}: ${otp}`);
    }

    return NextResponse.json(responsePayload);
  } catch (err) {
    console.error("API Signup error:", err.message);
    return NextResponse.json({ success: false, error: 'Failed to process signup request' }, { status: 500 });
  }
}
