export default function JobPostingSchema({ job }) {
  if (!job) return null;

  const isDetailedJob = !!job.fee;
  const pageDescription = isDetailedJob
    ? `${job.org || ''} ${job.title || ''} 2026 — ${job.vacancies || ''} Posts. Last Date: ${job.dates?.applyEnd || 'Check Notification'}. Apply online, download notification, eligibility, age limit and more at WeeklyNaukri.com.`
    : `${job.title || ''} — Check status, download link, and official notification at WeeklyNaukri.com.`;

  const pageUrl = `https://weeklynaukri.com/job/${job.slug || job.id}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': isDetailedJob ? 'JobPosting' : 'WebPage',
    ...(isDetailedJob ? {
      title: job.title,
      description: pageDescription,
      hiringOrganization: {
        '@type': 'Organization',
        name: job.org || job.company || 'Government Department',
      },
      datePosted: job.dates?.applyStart || '2026-01-01',
      validThrough: job.dates?.applyEnd || '2026-12-31',
      employmentType: 'FULL_TIME',
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IN',
        },
      },
    } : {
      name: job.title,
      description: pageDescription,
      url: pageUrl,
      publisher: {
        '@type': 'Organization',
        name: 'WeeklyNaukri.com',
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
