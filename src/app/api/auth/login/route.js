import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';
import { comparePassword, generateToken, checkRateLimit } from '../../../../lib/auth';

export async function POST(request) {
  try {
    // Use x-real-ip (set by Nginx from $remote_addr) — cannot be spoofed by clients
    const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = checkRateLimit(ip, 'login');
    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, error: `Too many login attempts. Try again in ${rateLimit.retryAfter} seconds.` }, { status: 429 });
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) throw error;

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid email or password credentials' }, { status: 401 });
    }

    if (!user.verified) {
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
