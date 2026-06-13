import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { verifyOTP, checkRateLimit } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.ip || '127.0.0.1';
    const rateLimit = checkRateLimit(ip, 'otp');
    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, error: `Too many OTP verification attempts. Try again in ${rateLimit.retryAfter} seconds.` }, { status: 429 });
    }

    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: 'Email and OTP verification code are required' }, { status: 400 });
    }

    const verification = verifyOTP(email, otp);
    if (!verification.success) {
      return NextResponse.json({ success: false, error: verification.error }, { status: 400 });
    }

    const user = verification.user;

    // Save to Supabase users table
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        name: user.name,
        email: user.email,
        password_hash: user.password_hash,
        role: user.role,
        verified: user.verified === 1 || user.verified === true,
        created_at: user.createdAt
      });

    if (insertError) throw insertError;

    return NextResponse.json({
      success: true,
      message: 'Account verified successfully. You can now log in.',
      user: { name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("API verify-otp error:", err.message);
    return NextResponse.json({ success: false, error: 'Failed to complete OTP verification' }, { status: 500 });
  }
}
