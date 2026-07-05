import { NextResponse } from 'next/server';
import { isAdminRequest } from '../../../../lib/adminAuth';
import { scanOfficialSources } from '../../../../lib/officialSources';

// Scans official government sources for new notices and stages them as
// drafts. Cron (every 30-60 min):
//   curl -X POST -H "x-admin-password: $ADMIN_PASSWORD" https://weeklynaukri.com/api/official/scan

export const maxDuration = 300;

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await scanOfficialSources();
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('Official scan error:', err.message);
    return NextResponse.json({ success: false, error: 'Scan failed' }, { status: 500 });
  }
}
