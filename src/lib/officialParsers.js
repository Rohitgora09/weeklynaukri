// Pure HTML parsers for official government recruitment sources.
// Kept dependency-free so they can be tested against saved pages.

function stripTags(s) {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#0?39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Map a notice title to the site's category taxonomy
export function categorizeNotice(title) {
  const t = title.toLowerCase();
  if (/(answer key|answer-key)/.test(t)) return 'answerKeys';
  if (/(admit card|e-admit|hall ticket|call letter)/.test(t)) return 'admitCards';
  if (/(final result|written result|result of|declared|merit list|score card|marks of)/.test(t)) return 'results';
  if (/\bresult\b/.test(t)) return 'results';
  return 'latestJobs';
}

// UPSC "What's New" (https://upsc.gov.in/whats-new) — Drupal views rows,
// one anchor per row, titles like "Final Result: 11 Posts of ...".
export function parseUPSC(html) {
  const items = [];
  const chunks = html.split(/<div class="views-row/).slice(1);
  for (const chunk of chunks) {
    const m = chunk.match(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    if (!m) continue;
    const title = stripTags(m[2]);
    if (title.length < 15) continue;
    let url;
    try {
      // Always use www — the bare host 307s file requests to the homepage
      url = new URL(encodeURI(m[1]), 'https://www.upsc.gov.in/').href;
    } catch (e) {
      continue;
    }
    items.push({ title, url, category: categorizeNotice(title), org: 'UPSC' });
  }
  return items;
}

// IBPS homepage (https://www.ibps.in/) — notification PDFs under
// wp-content/uploads plus registration links on ibpsreg.ibps.in.
export function parseIBPS(html) {
  const items = [];
  const seen = new Set();
  const re = /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1];
    const title = stripTags(m[2]);
    if (title.length < 20 || seen.has(href)) continue;
    const isNotice = /wp-content\/uploads\/[^"]*\.pdf/i.test(href);
    const isRegistration = /^https?:\/\/ibpsreg\.ibps\.in\//i.test(href);
    if (!isNotice && !isRegistration) continue;
    seen.add(href);
    items.push({
      title: title.slice(0, 300),
      url: href,
      category: categorizeNotice(title),
      org: 'IBPS',
    });
  }
  return items;
}

// RPSC (rendered DOM via Puppeteer — ASP.NET page) — generic pass over
// anchors that point at notice PDFs with meaningful link text.
export function parseRPSC(html) {
  const items = [];
  const seen = new Set();
  const re = /<a[^>]*href="([^"]+\.pdf[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const title = stripTags(m[2]);
    if (title.length < 25) continue; // skips icons and "RTI"-style stubs
    let url;
    try {
      url = new URL(m[1], 'https://rpsc.rajasthan.gov.in/').href;
    } catch (e) {
      continue;
    }
    if (seen.has(url)) continue;
    seen.add(url);
    items.push({ title: title.slice(0, 300), url, category: categorizeNotice(title), org: 'RPSC' });
  }
  return items;
}
