import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import { registerPendingUser, sendOTPEmail } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email, and password are required' }, { status: 400 });
    }

    const checkExists = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (checkExists) {
      return NextResponse.json({ success: false, error: 'Email address is already registered' }, { status: 400 });
    }

    // Register pending account details and generate OTP code
    const otp = registerPendingUser(name, email, password);

    // Send OTP email
    const mailResult = await sendOTPEmail(email, otp);

    const responsePayload = {
      success: true,
      message: 'OTP verification code sent. Please check your inbox.'
    };

    // Gate debugOtp behind non-production check
    if (mailResult.mocked && process.env.NODE_ENV !== 'production') {
      responsePayload.debugOtp = otp;
    }

    return NextResponse.json(responsePayload);
  } catch (err) {
    console.error("API Signup error:", err.message);
    return NextResponse.json({ success: false, error: 'Failed to process signup request' }, { status: 500 });
  }
}
