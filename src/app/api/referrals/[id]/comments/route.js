import { NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function POST(request, { params }) {
  try {
    const { id: referralId } = await params;
    const { text, author } = await request.json();

    if (!text) {
      return NextResponse.json({ success: false, error: 'Comment text is required' }, { status: 400 });
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
      author: author || 'Anonymous',
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

