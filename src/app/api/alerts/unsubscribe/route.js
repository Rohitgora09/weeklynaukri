import { supabase } from '../../../../lib/supabase';

function page(title, message) {
  return new Response(
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — WeeklyNaukri</title></head>
<body style="font-family:Arial,sans-serif;background:#f8fafc;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:40px;max-width:420px;text-align:center;">
    <h1 style="color:#1e3a8a;font-size:20px;margin-top:0;">${title}</h1>
    <p style="color:#475569;font-size:14px;line-height:1.6;">${message}</p>
    <a href="https://weeklynaukri.com/" style="display:inline-block;margin-top:12px;background:#1e3a8a;color:#fff;padding:10px 24px;border-radius:999px;text-decoration:none;font-weight:bold;font-size:14px;">Back to WeeklyNaukri</a>
  </div>
</body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

export async function GET(request) {
  try {
    const token = new URL(request.url).searchParams.get('token') || '';
    if (!token || token.length > 100) {
      return page('Invalid link', 'This unsubscribe link is not valid.');
    }

    const { data, error } = await supabase
      .from('alert_subscribers')
      .delete()
      .eq('unsubscribe_token', token)
      .select('email');

    if (error) throw error;
    if (!data || data.length === 0) {
      return page('Already unsubscribed', 'This email is no longer subscribed to job alerts.');
    }

    return page('Unsubscribed', 'You will no longer receive job alert emails from WeeklyNaukri. You can re-subscribe any time from the website.');
  } catch (err) {
    console.error('Alert unsubscribe error:', err.message);
    return page('Something went wrong', 'Could not process the unsubscribe request. Please try again later.');
  }
}
