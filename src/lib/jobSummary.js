import { dedupeTitle } from './utils';

// Builds a short original overview paragraph (English + Hindi) for a job
// page from the structured fields we scraped. Phrasing variants are chosen
// deterministically from the slug so each page carries stable, unique text
// — never fabricated facts, only fields we actually have.

function has(v) {
  if (v === null || v === undefined) return false;
  const s = String(v).trim();
  return s !== '' && s !== 'N/A' && s !== 'undefined' && s !== 'null' && s !== '-' && s !== '#';
}

function hashStr(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pick(arr, seed, slot) {
  return arr[(seed + slot * 7919) % arr.length];
}

function feeText(fee) {
  if (!fee || !has(fee.general)) return null;
  const s = String(fee.general).trim();
  if (s.includes('₹')) return s;
  if (/^\d+$/.test(s)) return `₹${s}`;
  return s;
}

export function buildJobSummary(job) {
  if (!job || !has(job.title)) return null;

  const seed = hashStr(String(job.slug || job.id || job.title));
  const title = dedupeTitle(String(job.title).replace(/\s+/g, ' ').trim());
  const org = has(job.org) && job.org !== 'WeeklyNaukri.Com' ? job.org.trim() : null;
  const orgEn = org || 'The recruiting organisation';
  const orgHi = org || 'भर्ती संस्था';

  const vac = has(job.vacancies) ? String(job.vacancies).trim() : null;
  const applyStart = has(job.dates?.applyStart) ? job.dates.applyStart : null;
  const applyEnd = has(job.dates?.applyEnd) ? job.dates.applyEnd : null;
  const examDate = has(job.dates?.examDate) ? job.dates.examDate : has(job.examDate) ? job.examDate : null;
  const fee = feeText(job.fee);
  const ageMin = has(job.ageLimit?.min) ? job.ageLimit.min : null;
  const ageMax = has(job.ageLimit?.max) ? job.ageLimit.max : null;

  const cat = job.category;
  const en = [];
  const hi = [];

  if (cat === 'results') {
    en.push(pick([
      `${orgEn} has declared the ${title}.`,
      `The ${title} is out now.`,
      `${orgEn} has announced the ${title}.`,
    ], seed, 0));
    en.push('Candidates who appeared in the examination can check their result through the direct link on this page.');
    en.push(pick([
      'The roll-number wise result, merit list and cut-off details are linked below.',
      'Scroll down for the result link, merit list and expected cut-off information.',
    ], seed, 2));

    hi.push(`${orgHi} ने ${title} घोषित कर दिया है।`);
    hi.push('परीक्षा में शामिल हुए उम्मीदवार इस पेज पर दिए गए सीधे लिंक से अपना रिजल्ट देख सकते हैं।');
  } else if (cat === 'admitCards') {
    en.push(pick([
      `${orgEn} has released the ${title}.`,
      `The ${title} is now available for download.`,
    ], seed, 0));
    if (examDate) en.push(`The examination is scheduled for ${examDate}.`);
    en.push(pick([
      'Candidates can download their hall ticket using the direct link given below — keep your registration number and date of birth ready.',
      'Use the download link below with your registration number and date of birth to get your hall ticket.',
    ], seed, 1));

    hi.push(`${orgHi} ने ${title} जारी कर दिया है।`);
    if (examDate) hi.push(`परीक्षा ${examDate} को होगी।`);
    hi.push('नीचे दिए गए लिंक से रजिस्ट्रेशन नंबर और जन्मतिथि डालकर एडमिट कार्ड डाउनलोड करें।');
  } else if (cat === 'answerKeys') {
    en.push(pick([
      `${orgEn} has published the ${title}.`,
      `The ${title} is available now.`,
    ], seed, 0));
    en.push('Candidates can match their responses and estimate their score using the link below.');
    en.push('If an objection window is open, its dates and fee are listed in the important links table.');

    hi.push(`${orgHi} ने ${title} जारी कर दी है।`);
    hi.push('उम्मीदवार नीचे दिए गए लिंक से अपने उत्तर मिलाकर संभावित स्कोर निकाल सकते हैं।');
  } else {
    // latestJobs / privateJobs / default
    en.push(pick([
      `${orgEn} has invited online applications for the ${title}.`,
      `Online applications are open for the ${title} recruitment by ${orgEn}.`,
      `${orgEn} has released the official notification for the ${title}.`,
    ], seed, 0));
    if (vac) {
      en.push(pick([
        `A total of ${vac} vacancies will be filled through this recruitment.`,
        `This recruitment drive covers ${vac} posts.`,
      ], seed, 1));
    }
    if (applyStart && applyEnd) {
      en.push(`Candidates can apply online from ${applyStart} to ${applyEnd}.`);
    } else if (applyEnd) {
      en.push(`The last date to submit the online application is ${applyEnd}.`);
    }
    if (fee) en.push(`The application fee for General, OBC and EWS candidates is ${fee}.`);
    if (ageMin && ageMax) {
      en.push(`Applicants must be between ${ageMin} and ${ageMax} as on the notification date; age relaxation applies as per government rules.`);
    }
    en.push(pick([
      'The category-wise fee, eligibility criteria and the direct apply link are given in the tables below.',
      'Scroll down for the full vacancy breakup, eligibility details and official links.',
    ], seed, 3));

    hi.push(`${orgHi} ने ${title} के लिए ऑनलाइन आवेदन आमंत्रित किए हैं।`);
    if (vac) hi.push(`कुल ${vac} पदों पर भर्ती होगी।`);
    if (applyEnd) hi.push(`आवेदन की अंतिम तिथि ${applyEnd} है।`);
    hi.push('पात्रता, आयु सीमा और आवेदन शुल्क की पूरी जानकारी नीचे दी गई है।');
  }

  return { en: en.join(' '), hi: hi.join(' ') };
}
