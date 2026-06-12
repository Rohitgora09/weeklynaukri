import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import { verifyOTP } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: 'Email and OTP verification code are required' }, { status: 400 });
    }

    const verification = verifyOTP(email, otp);
    if (!verification.success) {
      return NextResponse.json({ success: false, error: verification.error }, { status: 400 });
    }

    const user = verification.user;

    // Save to SQLite users table
    const result = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, verified, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(user.name, user.email, user.password_hash, user.role, user.verified, user.createdAt);

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
