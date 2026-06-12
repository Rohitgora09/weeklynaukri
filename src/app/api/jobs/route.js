import { NextResponse } from 'next/server';
import { fetchSarkariResultData, fetchSSCNotices } from '../../../lib/scraper';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    // Fetch lists
    const liveData = await fetchSarkariResultData(force);
    const notices = await fetchSSCNotices(force);

    return NextResponse.json({
      success: true,
      data: {
        ...liveData,
        notices
      }
    });
  } catch (err) {
    console.error("API Jobs fetch error:", err.message);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve job feeds' },
      { status: 500 }
    );
  }
}
