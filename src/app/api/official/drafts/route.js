import { NextResponse } from 'next/server';
import { isAdminRequest } from '../../../../lib/adminAuth';
import { supabase } from '../../../../lib/supabase';

// GET  — list staged notices (?status=draft|published|rejected, default draft)
// PATCH — { id, action: 'publish' | 'reject' }
// Publishing copies the notice into scraper_cache so the whole site
// (homepage, listing pages, job page, sitemap, alerts, IndexNow) picks
// it up through the existing machinery.

export async function GET(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const status = new URL(request.url).searchParams.get('status') || 'draft';
    const { data, error } = await supabase
      .from('official_jobs')
      .select('*')
      .eq('status', status)
      .order('detected_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return NextResponse.json({ success: true, drafts: data || [] });
  } catch (err) {
    console.error('Official drafts list error:', err.message);
    return NextResponse.json({ success: false, error: 'Could not load drafts' }, { status: 500 });
  }
}

export async function PATCH(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, action } = await request.json();
    if (!id || !['publish', 'reject'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }

    const { data: draft, error: readError } = await supabase
      .from('official_jobs')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (readError) throw readError;
    if (!draft) {
      return NextResponse.json({ success: false, error: 'Draft not found' }, { status: 404 });
    }

    if (action === 'reject') {
      const { error } = await supabase
        .from('official_jobs')
        .update({ status: 'rejected' })
        .eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true, status: 'rejected' });
    }

    // Publish: copy into scraper_cache (insert or refresh by url_slug)
    const cacheRow = {
      job_id: draft.url_slug,
      url_slug: draft.url_slug,
      title: draft.title,
      org: draft.org || draft.source.toUpperCase(),
      category: draft.category,
      source_url: draft.notice_url,
      scraped_at: new Date().toISOString(),
    };

    const { data: existingCache, error: cacheReadError } = await supabase
      .from('scraper_cache')
      .select('url_slug')
      .eq('url_slug', draft.url_slug)
      .maybeSingle();
    if (cacheReadError) throw cacheReadError;

    if (existingCache) {
      const { error } = await supabase
        .from('scraper_cache')
        .update(cacheRow)
        .eq('url_slug', draft.url_slug);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('scraper_cache').insert(cacheRow);
      if (error) throw error;
    }

    const { error: statusError } = await supabase
      .from('official_jobs')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .eq('id', id);
    if (statusError) throw statusError;

    return NextResponse.json({
      success: true,
      status: 'published',
      url: `https://weeklynaukri.com/job/${draft.url_slug}`,
    });
  } catch (err) {
    console.error('Official draft action error:', err.message);
    return NextResponse.json({ success: false, error: 'Action failed' }, { status: 500 });
  }
}
