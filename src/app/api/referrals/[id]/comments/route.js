import { NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';
import { verifyToken, checkRateLimit } from '../../../../../lib/auth';

export async function POST(request, { params }) {
  try {
    // 1. Require a valid JWT — must be logged in to post a comment
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const user = token ? verifyToken(token) : null;
    if (!user) {
      return NextResponse.json({ success: false, error: 'You must be logged in to post a comment.' }, { status: 401 });
    }

    // 2. Rate limit by IP — max 5 comments per 5 minutes
    const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = checkRateLimit(ip, 'login');
    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, error: `Too many comments. Try again in ${rateLimit.retryAfter} seconds.` }, { status: 429 });
    }

    const { id: referralId } = await params;
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ success: false, error: 'Comment text is required' }, { status: 400 });
    }

    // 3. Input length limit
    if (text.length > 1000) {
      return NextResponse.json({ success: false, error: 'Comment must be under 1000 characters' }, { status: 400 });
    }

    const { data: checkReferral, error: checkError } = await supabase
      .from('referrals')
      .select('id')
      .eq('id', referralId)
      .maybeSingle();

    if (checkError || !checkReferral) {
      return NextResponse.json({ success: false, error: 'Referral listing not found' }, { status: 404 });
    }

    const newComment = {
      id: 'comment-' + Date.now().toString(),
      referral_id: referralId,
      text,
      author: user.name || user.email,  // from JWT — not client-controlled
      createdAt: new Date().toISOString()
    };

    const { error: insertError } = await supabase
      .from('comments')
      .insert({
        id: newComment.id,
        referral_id: newComment.referral_id,
        text: newComment.text,
        author: newComment.author,
        created_at: newComment.createdAt
      });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true, data: newComment });
  } catch (err) {
    console.error("API post comment error:", err.message);
    return NextResponse.json({ success: false, error: 'Failed to save comment' }, { status: 500 });
  }
}
