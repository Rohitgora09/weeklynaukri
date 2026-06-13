function formatIsoDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const clean = dateStr.trim();
  
  // Try dd/mm/yyyy or dd-mm-yyyy
  const dmy = clean.match(/^(\d{1,2})[\/\-](\d{2})[\/\-](\d{4})$/);
  if (dmy) {
    const day = dmy[1].padStart(2, '0');
    const month = dmy[2].padStart(2, '0');
    const year = dmy[3];
    return `${year}-${month}-${day}`;
  }
  
  // Try "dd MMM YYYY" like "15 Jun 2026"
  const m = clean.match(/^(\d{1,2})\s+([A-Za-z]{3,10})\s+(\d{4})/);
  if (m) {
    const day = m[1].padStart(2, '0');
    const monthStr = m[2].toLowerCase().slice(0, 3);
    const year = m[3];
    
    const months = {
      jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
      jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
    };
    const month = months[monthStr];
    if (month) {
      return `${year}-${month}-${day}`;
    }
  }

  const parsed = new Date(clean);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }
  return null;
}

export default function JobPostingSchema({ job }) {
  if (!job) return null;

  const isJob = job.category === 'latestJobs' || job.category === 'privateJobs';
  const pageDescription = isJob
    ? `${job.org || ''} ${job.title || ''} 2026 — ${job.vacancies || ''} Posts. Last Date: ${job.dates?.applyEnd || 'Check Notification'}. Apply online, download notification, eligibility, age limit and more at WeeklyNaukri.com.`
    : `${job.title || ''} — Check status, download link, and official notification at WeeklyNaukri.com.`;

  const pageUrl = `https://weeklynaukri.com/job/${job.slug || job.id}`;
  
  const postedDate = formatIsoDate(job.dates?.applyStart) || new Date().toISOString().split('T')[0];
  const expiryDate = formatIsoDate(job.dates?.applyEnd || job.lastDate);
  const fallbackExpiry = new Date(new Date(postedDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const finalExpiry = expiryDate || fallbackExpiry;

  // 1. Primary Rich Schema (JobPosting vs NewsArticle)
  const primarySchema = isJob ? {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: pageDescription,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.org || job.company || 'Government Department',
    },
    datePosted: postedDate,
    validThrough: finalExpiry,
    employmentType: 'FULL_TIME',
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
      },
    },
  } : {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: job.title,
    datePublished: postedDate,
    dateModified: postedDate,
    description: pageDescription,
    author: {
      '@type': 'Organization',
      name: 'WeeklyNaukri.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'WeeklyNaukri.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://weeklynaukri.com/favicon.svg',
      },
    },
  };

  // 2. BreadcrumbList Trail Schema
  let categoryName = 'Govt Jobs';
  if (job.category === 'privateJobs') categoryName = 'Private Jobs';
  else if (job.category === 'results') categoryName = 'Sarkari Results';
  else if (job.category === 'admitCards') categoryName = 'Admit Cards';
  else if (job.category === 'answerKeys') categoryName = 'Answer Keys';
  else if (job.category === 'notices') categoryName = 'Notices';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://weeklynaukri.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryName,
        item: 'https://weeklynaukri.com',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: job.title,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(primarySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
