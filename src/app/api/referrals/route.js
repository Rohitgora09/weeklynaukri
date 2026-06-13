import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

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
