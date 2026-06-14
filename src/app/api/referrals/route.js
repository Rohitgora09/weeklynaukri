import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { verifyToken, checkRateLimit } from '../../../lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sort');

    const { data: referrals, error } = await supabase
      .from('referrals')
      .select('*, comments(*)');

    if (error) throw error;

    let processedReferrals = referrals || [];

    // Sort nested comments by created_at
    processedReferrals = processedReferrals.map(ref => {
      const sortedComments = [...(ref.comments || [])].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      return {
        ...ref,
        comments: sortedComments
      };
    });

    if (sortBy === 'recent') {
      processedReferrals.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return NextResponse.json({ success: true, data: processedReferrals });
  } catch (err) {
    console.error("API get referrals error:", err.message);
    return NextResponse.json({ success: false, error: 'Failed to retrieve referrals' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // 1. Require a valid JWT — must be logged in to post a referral
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const user = token ? verifyToken(token) : null;
    if (!user) {
      return NextResponse.json({ success: false, error: 'You must be logged in to post a referral.' }, { status: 401 });
    }

    // 2. Rate limit by user IP — max 5 posts per 5 minutes
    const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = checkRateLimit(ip, 'login'); // reuses login window tracking
    if (!rateLimit.allowed) {
      return NextResponse.json({ success: false, error: `Too many posts. Try again in ${rateLimit.retryAfter} seconds.` }, { status: 429 });
    }

    const { company, role, description, link } = await request.json();

    if (!company || !role || !description) {
      return NextResponse.json({ success: false, error: 'Company, role, and description are required' }, { status: 400 });
    }

    // 3. Input length limits to prevent database bloat
    if (company.length > 100) {
      return NextResponse.json({ success: false, error: 'Company name must be under 100 characters' }, { status: 400 });
    }
    if (role.length > 100) {
      return NextResponse.json({ success: false, error: 'Role title must be under 100 characters' }, { status: 400 });
    }
    if (description.length > 2000) {
      return NextResponse.json({ success: false, error: 'Description must be under 2000 characters' }, { status: 400 });
    }
    if (link && link.length > 300) {
      return NextResponse.json({ success: false, error: 'Link URL must be under 300 characters' }, { status: 400 });
    }

    if (link && !link.startsWith('https://')) {
      return NextResponse.json({ success: false, error: 'Link must start with https://' }, { status: 400 });
    }

    // 4. Author name comes from the verified JWT — not from the client body (no spoofing)
    const newReferral = {
      id: 'ref-' + Date.now().toString(),
      company,
      role,
      description,
      link: link || '',
      author: user.name || user.email,  // from JWT, not client-controlled
      createdAt: new Date().toISOString()
    };

    const { error } = await supabase
      .from('referrals')
      .insert({
        id: newReferral.id,
        company: newReferral.company,
        role: newReferral.role,
        description: newReferral.description,
        link: newReferral.link,
        author: newReferral.author,
        created_at: newReferral.createdAt
      });

    if (error) throw error;

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
