import { ImageResponse } from 'next/og';
import { supabase } from '../../../lib/supabase';

export const alt = 'Weekly Naukri Job Announcement';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { slug } = await params;
  
  // Fetch job details
  const { data: cached } = await supabase
    .from('scraper_cache')
    .select('title, org, category')
    .eq('url_slug', slug)
    .maybeSingle();

  const title = cached?.title || 'Job Update';
  const org = cached?.org || 'WeeklyNaukri.com';
  const category = cached?.category || 'Jobs';

  const categoryLabels = {
    latestJobs: 'LATEST JOB',
    results: 'RESULT DECLARED',
    admitCards: 'ADMIT CARD OUT',
    answerKeys: 'ANSWER KEY OUT',
    admissions: 'ADMISSIONS OPEN',
  };
  const categoryLabel = categoryLabels[category] || 'GOVT JOBS';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(30, 58, 138, 0.4) 0%, rgba(30, 58, 138, 0) 70%)',
            top: '-100px',
            right: '-100px',
          }}
        />

        {/* Category Tag */}
        <div
          style={{
            background: '#2563eb',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            padding: '10px 24px',
            borderRadius: '50px',
            textTransform: 'uppercase',
            marginBottom: '40px',
            letterSpacing: '2px',
          }}
        >
          {categoryLabel}
        </div>

        {/* Title */}
        <div
          style={{
            color: 'white',
            fontSize: '52px',
            fontWeight: '800',
            textAlign: 'center',
            lineHeight: '1.25',
            maxWidth: '1000px',
            marginBottom: '30px',
          }}
        >
          {title}
        </div>

        {/* Org */}
        <div
          style={{
            color: '#94a3b8',
            fontSize: '32px',
            fontWeight: '500',
            marginBottom: '50px',
          }}
        >
          {org}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '2px solid #334155',
            paddingTop: '30px',
            marginTop: 'auto',
          }}
        >
          <div style={{ color: '#3b82f6', fontSize: '28px', fontWeight: 'bold' }}>
            WeeklyNaukri.com
          </div>
          <div style={{ color: '#10b981', fontSize: '24px', fontWeight: 'bold' }}>
            100% Verified Updates
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
