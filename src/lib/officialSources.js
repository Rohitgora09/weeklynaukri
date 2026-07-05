import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { supabase } from './supabase';
import { parseUPSC, parseIBPS, parseRPSC } from './officialParsers';

puppeteer.use(StealthPlugin());

// Watches official government recruitment sources and stages newly
// detected notices as drafts in the official_jobs table. Publishing a
// draft (via /api/official/drafts) copies it into scraper_cache, which
// the rest of the site already reads.

const SOURCES = [
  {
    id: 'upsc',
    listUrl: 'https://upsc.gov.in/whats-new',
    parse: parseUPSC,
    method: 'fetch',
  },
  {
    id: 'ibps',
    listUrl: 'https://www.ibps.in/',
    parse: parseIBPS,
    method: 'fetch',
  },
  {
    id: 'rpsc',
    listUrl: 'https://rpsc.rajasthan.gov.in/advertisements',
    parse: parseRPSC,
    method: 'puppeteer', // ASP.NET page renders notices client-side
  },
];

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36';

async function fetchHtml(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchRenderedHtml(url) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
    ],
  });
  try {
    const page = await browser.newPage();
    await page.setUserAgent(UA);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    return await page.content();
  } finally {
    await browser.close();
  }
}

export function slugifyTitle(title) {
  return String(title)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .slice(0, 90)
    .replace(/^-|-$/g, '');
}

function shortHash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(36).slice(0, 5);
}

// Scan every source, insert unseen notices as drafts.
// Returns { perSource: {id: {found, added, error?}}, added }
export async function scanOfficialSources() {
  const perSource = {};
  let totalAdded = 0;

  for (const source of SOURCES) {
    try {
      const html =
        source.method === 'puppeteer'
          ? await fetchRenderedHtml(source.listUrl)
          : await fetchHtml(source.listUrl);

      const items = source.parse(html).slice(0, 60);
      if (items.length === 0) {
        perSource[source.id] = { found: 0, added: 0 };
        continue;
      }

      const urls = items.map((i) => i.url);
      const { data: existing, error: existingError } = await supabase
        .from('official_jobs')
        .select('notice_url')
        .in('notice_url', urls);
      if (existingError) throw existingError;

      const known = new Set((existing || []).map((r) => r.notice_url));
      const fresh = items.filter((i) => !known.has(i.url));

      let added = 0;
      for (const item of fresh) {
        const baseSlug = slugifyTitle(item.title) || `notice-${shortHash(item.url)}`;
        const slug = `${baseSlug}-${shortHash(item.url)}`;
        const { error: insertError } = await supabase.from('official_jobs').insert({
          source: source.id,
          title: item.title,
          notice_url: item.url,
          category: item.category,
          org: item.org,
          url_slug: slug,
          status: 'draft',
        });
        if (insertError) {
          // Unique-violation races are fine to skip; log everything else
          if (!String(insertError.message || '').includes('duplicate')) {
            console.error(`official_jobs insert failed (${source.id}):`, insertError.message);
          }
          continue;
        }
        added++;
      }

      perSource[source.id] = { found: items.length, added };
      totalAdded += added;
    } catch (err) {
      console.error(`Official source scan failed (${source.id}):`, err.message);
      perSource[source.id] = { found: 0, added: 0, error: err.message };
    }
  }

  return { perSource, added: totalAdded };
}
