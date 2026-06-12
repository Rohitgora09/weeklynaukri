import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sort');

    let referrals = db.prepare('SELECT * FROM referrals').all();

    // Fetch comments for each referral
    const commentsStmt = db.prepare('SELECT * FROM comments WHERE referral_id = ? ORDER BY created_at ASC');
    referrals = referrals.map(ref => ({
      ...ref,
      comments: commentsStmt.all(ref.id)
    }));

    if (sortBy === 'recent') {
      referrals.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return NextResponse.json({ success: true, data: referrals });
  } catch (err) {
    console.error("API get referrals error:", err.message);
    return NextResponse.json({ success: false, error: 'Failed to retrieve referrals' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { company, role, description, link, author } = await request.json();

    if (!company || !role || !description) {
      return NextResponse.json({ success: false, error: 'Company, role, and description are required' }, { status: 400 });
    }

    if (link && !link.startsWith('https://')) {
      return NextResponse.json({ success: false, error: 'Link must start with https://' }, { status: 400 });
    }

    const newReferral = {
      id: 'ref-' + Date.now().toString(),
      company,
      role,
      description,
      link: link || '',
      author: author || 'Anonymous',
      createdAt: new Date().toISOString()
    };

    db.prepare(`
      INSERT INTO referrals (id, company, role, description, link, author, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      newReferral.id,
      newReferral.company,
      newReferral.role,
      newReferral.description,
      newReferral.link,
      newReferral.author,
      newReferral.createdAt
    );

    return NextResponse.json({
      success: true,
      data: {
        ...newReferral,
        comments: []
      }
    });
  } catch (err) {
    console.error("API post referral error:", err.message);
    return NextResponse.json({ success: false, error: 'Failed to create referral listing' }, { status: 500 });
  }
}
