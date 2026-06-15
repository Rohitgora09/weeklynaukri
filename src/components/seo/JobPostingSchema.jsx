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

function getBaseSalary(job) {
  let minVal = 25000;
  let maxVal = 60000;
  const unit = 'MONTH';

  const salaryStr = job.salary || '';
  if (salaryStr) {
    // Try to parse "₹5-10 LPA" or similar
    const lpaMatch = salaryStr.match(/₹?(\d+)-(\d+)\s*LPA/i);
    if (lpaMatch) {
      minVal = Math.round((parseFloat(lpaMatch[1]) * 100000) / 12);
      maxVal = Math.round((parseFloat(lpaMatch[2]) * 100000) / 12);
    } else {
      const singleLpa = salaryStr.match(/₹?(\d+)\s*LPA/i);
      if (singleLpa) {
        const value = Math.round((parseFloat(singleLpa[1]) * 100000) / 12);
        minVal = Math.round(value * 0.8);
        maxVal = Math.round(value * 1.2);
      }
    }
  } else {
    // Government jobs default salary based on title keywords
    const title = (job.title || '').toLowerCase();
    if (title.includes('ias') || title.includes('ips') || title.includes('officer') || title.includes('scientist') || title.includes('commissioner')) {
      minVal = 56100; // Pay Level 10
      maxVal = 177500;
    } else if (title.includes('inspector') || title.includes('sub inspector') || title.includes('si') || title.includes('assistant section officer') || title.includes('aso')) {
      minVal = 44900; // Pay Level 7
      maxVal = 142400;
    } else if (title.includes('constable') || title.includes('clerk') || title.includes('assistant') || title.includes('typist') || title.includes('technician')) {
      minVal = 21700; // Pay Level 3
      maxVal = 69100;
    }
  }

  return {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: {
      '@type': 'QuantitativeValue',
      minValue: minVal,
      maxValue: maxVal,
      unitText: unit
    }
  };
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
      logo: 'https://weeklynaukri.com/logo.png',
    },
    datePosted: postedDate,
    validThrough: finalExpiry,
    employmentType: 'FULL_TIME',
    baseSalary: getBaseSalary(job),
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Government Department Location',
        addressLocality: 'New Delhi',
        addressRegion: 'Delhi',
        postalCode: '110001',
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
    image: [
      'https://weeklynaukri.com/logo.png'
    ],
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

  let categoryUrl = 'https://weeklynaukri.com';
  if (job.category === 'latestJobs') categoryUrl = 'https://weeklynaukri.com/latest-jobs';
  else if (job.category === 'privateJobs') categoryUrl = 'https://weeklynaukri.com/referrals';
  else if (job.category === 'results') categoryUrl = 'https://weeklynaukri.com/results';
  else if (job.category === 'admitCards') categoryUrl = 'https://weeklynaukri.com/admit-cards';
  else if (job.category === 'answerKeys') categoryUrl = 'https://weeklynaukri.com/answer-keys';

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
        item: categoryUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: job.title,
        item: pageUrl,
      },
    ],
  };

  // 3. Auto-Generated FAQPage Schema (For AI visibility)
  let faqSchema = null;
  if (isJob && (job.dates?.applyEnd || job.vacancies)) {
    const questions = [];
    if (job.dates?.applyEnd) {
      questions.push({
        '@type': 'Question',
        name: `What is the last date to apply for ${job.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The last date to apply online is ${job.dates.applyEnd}. Make sure to submit your application and pay any required fees before this deadline.`
        }
      });
    }
    if (job.vacancies) {
      questions.push({
        '@type': 'Question',
        name: `How many vacancies are available for ${job.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `There are a total of ${job.vacancies} vacancies available for this recruitment.`
        }
      });
    }
    if (job.ageLimit?.min || job.ageLimit?.max) {
      questions.push({
        '@type': 'Question',
        name: `What is the age limit for ${job.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The age limit is typically ${job.ageLimit?.min || 'minimum'} to ${job.ageLimit?.max || 'maximum'}. Please check the official notification for age relaxation rules.`
        }
      });
    }

    if (questions.length > 0) {
      faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions
      };
    }
  }

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
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
