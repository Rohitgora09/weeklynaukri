import { NextResponse } from 'next/server';
import db from '../../../../../lib/db';

export async function POST(request, { params }) {
  try {
    const { id: referralId } = await params;
    const { text, author } = await request.json();

    if (!text) {
      return NextResponse.json({ success: false, error: 'Comment text is required' }, { status: 400 });
    }

    const checkReferral = db.prepare('SELECT id FROM referrals WHERE id = ?').get(referralId);
    if (!checkReferral) {
      return NextResponse.json({ success: false, error: 'Referral listing not found' }, { status: 404 });
    }

    const newComment = {
      id: 'comment-' + Date.now().toString(),
      referral_id: referralId,
      text,
      author: author || 'Anonymous',
      createdAt: new Date().toISOString()
    };

    db.prepare(`
      INSERT INTO comments (id, referral_id, text, author, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      newComment.id,
      newComment.referral_id,
      newComment.text,
      newComment.author,
      newComment.createdAt
    );

    return NextResponse.json({ success: true, data: newComment });
  } catch (err) {
    console.error("API post comment error:", err.message);
    return NextResponse.json({ success: false, error: 'Failed to save comment' }, { status: 500 });
  }
}
