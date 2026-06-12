import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import { comparePassword, generateToken } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid email or password credentials' }, { status: 401 });
    }

    if (user.verified !== 1) {
      return NextResponse.json({ success: false, error: 'This account email has not been verified yet.' }, { status: 401 });
    }

    const matches = comparePassword(password, user.password_hash);
    if (!matches) {
      return NextResponse.json({ success: false, error: 'Invalid email or password credentials' }, { status: 401 });
    }

    // Generate real JWT token
    const token = generateToken(user);

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error("API login error:", err.message);
    return NextResponse.json({ success: false, error: 'Login verification failed' }, { status: 500 });
  }
}
