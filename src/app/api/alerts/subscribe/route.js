import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '../../../../lib/supabase';

const ALLOWED_CATEGORIES = ['latestJobs', 'results', 'admitCards', 'answerKeys'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const categories = Array.isArray(body.categories)
      ? body.categories.filter((c) => ALLOWED_CATEGORIES.includes(c))
      : [];

    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (categories.length === 0) {
      return NextResponse.json({ success: false, error: 'Pick at least one alert category.' }, { status: 400 });
    }

    // Update categories if the email is already subscribed, otherwise insert
    const { data: existing, error: readError } = await supabase
      .from('alert_subscribers')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (readError) throw readError;

    if (existing) {
      const { error } = await supabase
        .from('alert_subscribers')
        .update({ categories })
        .eq('id', existing.id);
      if (error) throw error;
      return NextResponse.json({ success: true, updated: true });
    }

    const { error: insertError } = await supabase.from('alert_subscribers').insert({
      email,
      categories,
      unsubscribe_token: crypto.randomBytes(24).toString('hex'),
    });
    if (insertError) throw insertError;

    return NextResponse.json({ success: true, updated: false });
  } catch (err) {
    console.error('Alert subscribe error:', err.message);
    return NextResponse.json({ success: false, error: 'Could not subscribe right now. Please try again later.' }, { status: 500 });
  }
}
