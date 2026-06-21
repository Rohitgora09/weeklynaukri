import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { supabase } from './supabase.js';
import { slugify } from '../utils/slugify.js';

puppeteer.use(StealthPlugin());


let sharedBrowser = null;
let isScrapingLock = false; // Lock flag to prevent parallel overlapping scraper warmups

// Fetch/create a single shared browser instance
async function getBrowser() {
  if (sharedBrowser) {
    try {
      // Check if browser is still responsive
      await sharedBrowser.version();
      return sharedBrowser;
    } catch (err) {
      console.log("Shared Puppeteer browser was closed/crashed. Re-launching...");
      try {
        await sharedBrowser.close();
      } catch (e) {}
      sharedBrowser = null;
    }
  }

  console.log("Launching new shared Puppeteer browser instance...");
  sharedBrowser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote'
    ]
  });

  return sharedBrowser;
}

function stableId(prefix, text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return prefix + Math.abs(hash).toString(36);
}

// 1. Fetch SSC Notices from Cache or Live
export async function fetchSSCNotices(force = false) {
  const CACHE_DURATION_MS = 15 * 60 * 1000;
  
  if (!force) {
    const { data: cached, error: cacheError } = await supabase
      .from('scraper_cache')
      .select('*')
      .eq('category', 'notices')
      .order('scraped_at', { ascending: false });

    if (!cacheError && cached && cached.length > 0) {
      const newestTime = new Date(cached[0].scraped_at).getTime();
      
      const mapper = item => ({
        id: item.job_id,
        slug: item.url_slug,
        title: item.title,
        org: item.org,
        date: new Date(item.scraped_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        link: item.source_url,
        tag: 'New',
        tagColor: 'purple'
      });

      if (Date.now() - newestTime < CACHE_DURATION_MS) {
        console.log("Returning Supabase cached SSC notices");
        return cached.map(mapper);
      } else {
        console.log("Returning STALE Supabase cached SSC notices (refreshing in background)...");
        // Trigger async background refresh without blocking
        fetchSSCNotices(true).catch(err => console.error("Background SSC notices scrape error:", err.message));
        return cached.map(mapper);
      }
    }
  }

  if (isScrapingLock) {
    console.log("Scraper lock is active, skipping live SSC fetch to prevent stack overflow");
    return [];
  }

  isScrapingLock = true;
  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log("Navigating to ssc.gov.in...");
    await page.goto('https://ssc.gov.in/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for angular app to load notices links
    await new Promise(resolve => setTimeout(resolve, 8000));

    const notices = await page.evaluate(() => {
      const results = [];
      const allLinks = Array.from(document.querySelectorAll('a'));
      
      allLinks.forEach(link => {
        const text = link.innerText.trim();
        const href = link.href;
        
        if (text.length > 15 && (
          href.toLowerCase().includes('.pdf') || 
          text.toLowerCase().includes('notice') || 
          text.toLowerCase().includes('examination') ||
          text.toLowerCase().includes('recruitment') ||
          text.toLowerCase().includes('result') ||
          text.toLowerCase().includes('admit') ||
          text.toLowerCase().includes('corrigendum') ||
          text.toLowerCase().includes('tentative') ||
          text.toLowerCase().includes('schedule')
        )) {
          if (!results.find(r => r.title === text)) {
            results.push({ title: text, link: href });
          }
        }
      });
      return results.slice(0, 15);
    });

    await page.close();
    
    console.log(`Scraped ${notices.length} notices from ssc.gov.in. Updating Supabase cache...`);

    const now = new Date().toISOString();
    
    // Clear old cached notices
    await supabase
      .from('scraper_cache')
      .delete()
      .eq('category', 'notices');
    
    const insertRows = notices.map(notice => {
      const id = stableId('ssc-', notice.title);
      const slug = slugify(notice.title);
      return {
        url_slug: slug,
        job_id: id,
        title: notice.title,
        org: 'Staff Selection Commission',
        category: 'notices',
        source_url: notice.link,
        scraped_at: now
      };
    });

    const uniqueRows = [];
    const seen = new Set();
    insertRows.forEach(row => {
      if (!seen.has(row.url_slug)) {
        seen.add(row.url_slug);
        uniqueRows.push(row);
      }
    });

    if (uniqueRows.length > 0) {
      const { error: insertError } = await supabase
        .from('scraper_cache')
        .insert(uniqueRows);
      if (insertError) throw insertError;
    }

    return uniqueRows.map(item => ({
      id: item.job_id,
      slug: item.url_slug,
      title: item.title,
      org: item.org,
      date: new Date(item.scraped_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      link: item.source_url,
      tag: 'New',
      tagColor: 'purple'
    }));

  } catch (error) {
    console.error("Error scraping SSC notices:", error.message);
    // Return stale cache as fallback
    const { data: stale } = await supabase
      .from('scraper_cache')
      .select('*')
      .eq('category', 'notices')
      .order('scraped_at', { ascending: false });

    const staleList = stale || [];
    return staleList.map(item => ({
      id: item.job_id,
      slug: item.url_slug,
      title: item.title,
      org: item.org,
      date: new Date(item.scraped_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      link: item.source_url,
      tag: 'New',
      tagColor: 'purple'
    }));
  } finally {
    isScrapingLock = false;
  }
}

// 2. Fetch SarkariResult Listings (Jobs, Admit Cards, Results)
export async function fetchSarkariResultData(force = false) {
  const CACHE_DURATION_MS = 15 * 60 * 1000;

  const getTagInfo = (category) => {
    switch (category) {
      case 'latestJobs': return { tag: 'New', color: 'purple' };
      case 'results': return { tag: 'Declared', color: 'green' };
      case 'admitCards': return { tag: 'Available', color: 'orange' };
      case 'answerKeys': return { tag: 'Out', color: 'blue' };
      case 'admissions': return { tag: 'Open', color: 'indigo' };
      case 'documents': return { tag: 'Active', color: 'teal' };
      default: return { tag: 'Available', color: 'gray' };
    }
  };

  const mapper = item => {
    const { tag, color } = getTagInfo(item.category);
    let dates = null;
    if (item.full_details_json) {
      try {
        const details = typeof item.full_details_json === 'string'
          ? JSON.parse(item.full_details_json)
          : item.full_details_json;
        if (details && details.dates) {
          dates = details.dates;
        }
      } catch (e) {
        console.warn(`Bad full_details_json for ${item.url_slug || item.job_id}:`, e.message);
      }
    }
    return {
      id: item.job_id,
      slug: item.url_slug,
      title: item.title,
      link: item.source_url,
      org: item.org,
      tag,
      tagColor: color,
      date: 'Recent',
      dates: dates
    };
  };

  if (!force) {
    const categories = ['latestJobs', 'admitCards', 'results', 'answerKeys', 'admissions', 'documents'];
    const { data: cached, error: cacheError } = await supabase
      .from('scraper_cache')
      .select('*')
      .in('category', categories);

    if (!cacheError && cached && cached.length > 0) {
      const grouped = {
        latestJobs: [],
        admitCards: [],
        results: [],
        answerKeys: [],
        admissions: [],
        documents: []
      };
      
      cached.forEach(item => {
        if (grouped[item.category]) {
          grouped[item.category].push(item);
        }
      });

      const allCached = Object.values(grouped).flat();
      if (allCached.length > 0) {
        const sortedCached = [...allCached].sort((a, b) => new Date(b.scraped_at) - new Date(a.scraped_at));
        const newestTime = new Date(sortedCached[0].scraped_at).getTime();

        const returnData = {
          latestJobs: grouped.latestJobs.map(mapper),
          admitCards: grouped.admitCards.map(mapper),
          results: grouped.results.map(mapper),
          answerKeys: grouped.answerKeys.map(mapper),
          admissions: grouped.admissions.map(mapper),
          documents: grouped.documents.map(mapper)
        };

        if (Date.now() - newestTime < CACHE_DURATION_MS && grouped.latestJobs.length > 0) {
          console.log("Returning Supabase cached SarkariResult data");
          return returnData;
        } else if (grouped.latestJobs.length > 0) {
          console.log("Returning STALE Supabase cached SarkariResult data (refreshing in background)...");
          // Trigger async background refresh without blocking
          fetchSarkariResultData(true).catch(err => console.error("Background SarkariResult scrape error:", err.message));
          return returnData;
        }
      }
    }
  }

  if (isScrapingLock) {
    console.log("Scraper lock active, skipping live SarkariResult fetch");
    return {
      latestJobs: [],
      admitCards: [],
      results: [],
      answerKeys: [],
      admissions: [],
      documents: []
    };
  }

  isScrapingLock = true;
  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log("Navigating to sarkariresult.com.cm...");
    await page.goto('https://sarkariresult.com.cm/', { waitUntil: 'domcontentloaded', timeout: 60000 });

    const rawData = await page.evaluate(() => {
      const results = { results: [], admitCards: [], latestJobs: [], answerKeys: [], admissions: [], documents: [] };
      
      const headers = Array.from(document.querySelectorAll('.gb-headline-text, h1, h2, h3, p'));
      headers.forEach(header => {
        const text = header.textContent.trim().toLowerCase();
        let category = null;
        
        if (text === 'results') category = 'results';
        else if (text === 'admit cards') category = 'admitCards';
        else if (text === 'latest jobs') category = 'latestJobs';
        else if (text === 'answer key') category = 'answerKeys';
        else if (text === 'admission') category = 'admissions';
        else if (text === 'documents') category = 'documents';
        
        if (category) {
          let current = header;
          let foundUl = null;
          
          for (let i = 0; i < 15; i++) {
            if (!current) break;
            
            const ul = current.tagName === 'UL' ? current : current.querySelector?.('ul');
            if (ul && (ul.classList.contains('wp-block-latest-posts') || ul.classList.contains('wp-block-latest-posts__list'))) {
              foundUl = ul;
              break;
            }
            
            if (current.nextElementSibling) {
              current = current.nextElementSibling;
            } else {
              current = current.parentElement;
              if (current && current.nextElementSibling) {
                current = current.nextElementSibling;
              } else {
                current = null;
              }
            }
          }
          
          if (foundUl) {
            const links = Array.from(foundUl.querySelectorAll('a'));
            links.forEach(a => {
              const aText = a.textContent.trim();
              const href = a.href;
              if (aText && href && aText.length > 5 && !aText.toLowerCase().includes('view more')) {
                results[category].push({
                  title: aText,
                  link: href,
                  org: aText.split(' ').slice(0, 3).join(' ')
                });
              }
            });
          }
        }
      });
      return results;
    });

    await page.close();

    console.log(`Scraped SarkariResult. Updating Supabase cache tables...`);
    const runStartedAt = new Date().toISOString();
    const categories = ['latestJobs', 'admitCards', 'results', 'answerKeys', 'admissions', 'documents'];

    // 1. Fetch existing items in active categories to preserve full_details_json
    const { data: existing, error: existingError } = await supabase
      .from('scraper_cache')
      .select('url_slug, full_details_json')
      .in('category', categories);

    const detailsMap = new Map();
    if (!existingError && existing) {
      existing.forEach(row => {
        if (row.full_details_json) {
          detailsMap.set(row.url_slug, row.full_details_json);
        }
      });
    }

    const insertRows = [];
    const activeCategories = [];

    const prepareRows = (items, categoryName) => {
      if (!items || items.length === 0) return;
      activeCategories.push(categoryName);
      items.forEach(item => {
        const id = stableId('sr-', item.title);
        const slug = slugify(item.title);
        const preservedDetails = detailsMap.get(slug) || null;
        insertRows.push({
          url_slug: slug,
          job_id: id,
          title: item.title,
          org: item.org,
          category: categoryName,
          source_url: item.link,
          full_details_json: preservedDetails,
          scraped_at: runStartedAt
        });
      });
    };

    prepareRows(rawData.latestJobs, 'latestJobs');
    prepareRows(rawData.admitCards, 'admitCards');
    prepareRows(rawData.results, 'results');
    prepareRows(rawData.answerKeys, 'answerKeys');
    prepareRows(rawData.admissions, 'admissions');
    prepareRows(rawData.documents, 'documents');

    // Deduplicate by both url_slug and job_id within the batch
    const uniqueRows = [];
    const seenSlugs = new Set();
    const seenIds = new Set();
    insertRows.forEach(row => {
      if (!seenSlugs.has(row.url_slug) && !seenIds.has(row.job_id)) {
        seenSlugs.add(row.url_slug);
        seenIds.add(row.job_id);
        uniqueRows.push(row);
      }
    });

    // 2. Delete old rows for active categories, then insert fresh rows
    //    (delete-then-insert avoids all upsert constraint issues)
    if (activeCategories.length > 0) {
      const { error: deleteError } = await supabase
        .from('scraper_cache')
        .delete()
        .in('category', activeCategories);
      if (deleteError) {
        console.error("Error deleting old cache rows:", deleteError.message);
      }
    }

    if (uniqueRows.length > 0) {
      const { error: insertError } = await supabase
        .from('scraper_cache')
        .insert(uniqueRows);
      if (insertError) throw insertError;
    }

    const getGroup = (category) => uniqueRows.filter(r => r.category === category).map(mapper);
    return {
      latestJobs: getGroup('latestJobs'),
      admitCards: getGroup('admitCards'),
      results: getGroup('results'),
      answerKeys: getGroup('answerKeys'),
      admissions: getGroup('admissions'),
      documents: getGroup('documents')
    };

  } catch (error) {
    console.error("Error scraping SarkariResult data:", error.message);
    const categories = ['latestJobs', 'admitCards', 'results', 'answerKeys', 'admissions', 'documents'];
    const { data: fallbackData } = await supabase
      .from('scraper_cache')
      .select('*')
      .in('category', categories);

    const grouped = {
      latestJobs: [],
      admitCards: [],
      results: [],
      answerKeys: [],
      admissions: [],
      documents: []
    };
    if (fallbackData) {
      fallbackData.forEach(item => {
        if (grouped[item.category]) {
          grouped[item.category].push(item);
        }
      });
    }
    return {
      latestJobs: grouped.latestJobs.map(mapper),
      admitCards: grouped.admitCards.map(mapper),
      results: grouped.results.map(mapper),
      answerKeys: grouped.answerKeys.map(mapper),
      admissions: grouped.admissions.map(mapper),
      documents: grouped.documents.map(mapper)
    };
  } finally {
    isScrapingLock = false;
  }
}

// 3. Fetch Deep Job Details from specific SarkariResult URL
export async function fetchSarkariJobDetails(url) {
  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

    // Wait a moment for dynamic content to settle
    await new Promise(resolve => setTimeout(resolve, 2000));

    const details = await page.evaluate(() => {
      // ── Helper: Robust section finder for GenerateBlocks (gb-headline) structure ──
      // Finds a section heading matching keywords, then extracts all <li> text items
      // from sibling elements within the same parent container AND next siblings
      function findSectionItems(headerKeywords) {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, [class*="gb-headline"]'));
        
        for (const heading of headings) {
          const hText = (heading.innerText || '').toLowerCase().trim();
          const matched = headerKeywords.some(kw => hText.includes(kw.toLowerCase()));
          if (!matched) continue;

          const items = [];
          
          // Strategy 1: Check the NEXT SIBLING elements (gb-headline divs contain the <ul>/<li>)
          let sibling = heading.nextElementSibling;
          for (let i = 0; i < 8 && sibling; i++) {
            const lis = sibling.querySelectorAll('li');
            if (lis.length > 0) {
              lis.forEach(li => {
                const t = (li.innerText || '').trim();
                if (t.length > 2) items.push(t);
              });
            }
            // Also check for standalone text in gb-headline divs (e.g. "15 Posts")
            if (sibling.classList && sibling.classList.contains('gb-headline-text') || 
                (sibling.className || '').includes('gb-headline')) {
              const t = (sibling.innerText || '').trim();
              if (t.length > 1 && t.length < 200 && items.indexOf(t) === -1) {
                // Only add if it doesn't already contain the list items
                if (lis.length === 0) items.push(t);
              }
            }
            sibling = sibling.nextElementSibling;
            // Stop if we hit another heading (next section)
            if (sibling && (sibling.tagName || '').match(/^H[1-6]$/)) break;
            if (sibling && (sibling.className || '').includes('gb-headline') && 
                sibling.tagName !== 'DIV' && sibling.tagName !== 'P') break;
          }
          
          // Strategy 2: Same parent container if siblings didn't work
          if (items.length === 0) {
            let container = heading.closest('.gb-grid-column') || heading.closest('.gb-container') || heading.parentElement;
            if (container) {
              const lis = container.querySelectorAll('li');
              lis.forEach(li => {
                const t = (li.innerText || '').trim();
                if (t.length > 2) items.push(t);
              });
              if (items.length === 0) {
                const divs = container.querySelectorAll('div[class*="gb-headline"], p');
                divs.forEach(d => {
                  if (d === heading) return;
                  const t = (d.innerText || '').trim();
                  if (t.length > 1 && t.length < 300) items.push(t);
                });
              }
            }
          }
          
          if (items.length > 0) return items;
        }
        return [];
      }

      // ══════════════════════════════════════════════════════════════
      // 1. IMPORTANT DATES — capture ALL items raw
      // ══════════════════════════════════════════════════════════════
      const dateItems = findSectionItems(['important dates', 'important date']);
      // Build structured dates from raw items
      const dates = { items: dateItems };
      for (const item of dateItems) {
        const lower = item.toLowerCase();
        if (lower.includes('apply') && lower.includes('start') || lower.includes('application begin') || lower.includes('form start')) {
          dates.applyStart = item.split(/[:–]\s*/).pop().trim();
        }
        if (lower.includes('last date') || lower.includes('apply') && lower.includes('last')) {
          dates.applyEnd = item.split(/[:–]\s*/).pop().trim();
        }
        if (lower.includes('exam date') || lower.includes('prelims') || lower.includes('cbt date')) {
          dates.examDate = item.split(/[:–]\s*/).pop().trim();
        }
      }
      if (!dates.applyStart) dates.applyStart = 'Check Notification';
      if (!dates.applyEnd) dates.applyEnd = 'Check Notification';

      // ══════════════════════════════════════════════════════════════
      // 2. APPLICATION FEE — capture ALL items raw (not categorized)
      // ══════════════════════════════════════════════════════════════
      const feeItems = findSectionItems(['application fee', 'exam fee', 'examination fee']);
      // Store raw fee items for display, and also extract categorized for backward compat
      const fee = { items: feeItems, general: 'N/A', scSt: 'N/A', women: 'N/A' };
      
      function extractFeeAmount(text) {
        if (!text || text === 'N/A') return 'N/A';
        const m = text.match(/(?:₹|Rs\.?\s*)\s*([\d,]+)\s*\/?-?/i);
        if (m) return m[1].replace(/,/g, '');
        const numMatch = text.match(/(\d[\d,]*)\s*\/?-?/);
        if (numMatch) return numMatch[1].replace(/,/g, '');
        if (/nil|free|no\s*fee|exempt/i.test(text)) return '0';
        return 'N/A';
      }

      for (const item of feeItems) {
        const lower = item.toLowerCase();
        if ((lower.includes('general') || lower.includes('ur') || lower.includes('all category') || lower.includes('other state')) && fee.general === 'N/A') {
          fee.general = extractFeeAmount(item);
        }
        if ((lower.includes('sc') && lower.includes('st') || lower.includes('obc')) && fee.scSt === 'N/A') {
          fee.scSt = extractFeeAmount(item);
        }
        if ((lower.includes('female') || lower.includes('women') || lower.includes('mahila')) && fee.women === 'N/A') {
          fee.women = extractFeeAmount(item);
        }
      }

      // ══════════════════════════════════════════════════════════════
      // 3. AGE LIMIT — capture raw items
      // ══════════════════════════════════════════════════════════════
      const ageItems = findSectionItems(['age limit', 'age criteria']);
      const ageLimit = { items: ageItems, min: 'N/A', max: 'N/A', relaxation: 'As per rules' };
      for (const item of ageItems) {
        const lower = item.toLowerCase();
        if (lower.includes('minimum') || lower.includes('min age')) {
          ageLimit.min = item.split(/[:–]\s*/).pop().trim();
        }
        if (lower.includes('maximum') || lower.includes('max age')) {
          ageLimit.max = item.split(/[:–]\s*/).pop().trim();
        }
        if (lower.includes('relaxation')) {
          ageLimit.relaxation = item;
        }
      }

      // ══════════════════════════════════════════════════════════════
      // 4. VACANCIES
      // ══════════════════════════════════════════════════════════════
      const vacancyItems = findSectionItems(['total post', 'vacancy', 'total vacancy']);
      let vacancies = 'Check Notification';
      if (vacancyItems.length > 0) {
        for (const item of vacancyItems) {
          const m = item.match(/([\d,]+)\s*(post|vacanc|seat)/i);
          if (m) {
            vacancies = m[1].replace(/,/g, '') + ' Posts';
            break;
          }
        }
        if (vacancies === 'Check Notification' && vacancyItems[0].length < 50) {
          vacancies = vacancyItems[0];
        }
      }

      // ══════════════════════════════════════════════════════════════
      // 5. ELIGIBILITY — capture raw items
      // ══════════════════════════════════════════════════════════════
      const eligItems = findSectionItems(['eligibility', 'qualification', 'education']);
      let eligibility = 'Check Official Notification';
      if (eligItems.length > 0) {
        eligibility = eligItems.slice(0, 3).join(', ');
        if (eligibility.length > 300) eligibility = eligibility.slice(0, 297) + '...';
      }

      // ══════════════════════════════════════════════════════════════
      // 6. VACANCY DETAILS TABLE
      // ══════════════════════════════════════════════════════════════
      const vacancyDetails = [];
      const allTables = Array.from(document.querySelectorAll('table'));
      // Find vacancy details table
      const allHeadings2 = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, [class*="gb-headline"]'));
      for (const heading of allHeadings2) {
        const hText = (heading.innerText || '').toLowerCase().trim();
        if (hText.includes('vacancy detail') || hText.includes('post detail')) {
          let sibling = heading.nextElementSibling || heading.parentElement?.nextElementSibling;
          for (let i = 0; i < 10 && sibling; i++) {
            const table = sibling.tagName === 'TABLE' ? sibling : sibling.querySelector?.('table');
            if (table) {
              const rows = Array.from(table.querySelectorAll('tr'));
              rows.forEach(row => {
                const cells = Array.from(row.querySelectorAll('td, th'));
                if (cells.length >= 2) {
                  vacancyDetails.push(cells.map(c => (c.innerText || '').trim()));
                }
              });
              break;
            }
            sibling = sibling.nextElementSibling;
          }
          break;
        }
      }

      // ══════════════════════════════════════════════════════════════
      // 7. IMPORTANT LINKS — ALL links from table
      // ══════════════════════════════════════════════════════════════
      const links = { apply: '#', notification: '#', official: '#' };
      const allImportantLinks = [];

      const allHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, [class*="gb-headline"]'));
      for (const heading of allHeadings) {
        const hText = (heading.innerText || '').toLowerCase().trim();
        if (hText.includes('useful') && hText.includes('link')) {
          let sibling = heading.nextElementSibling || heading.parentElement?.nextElementSibling;
          for (let i = 0; i < 10 && sibling; i++) {
            const table = sibling.tagName === 'TABLE' ? sibling : sibling.querySelector?.('table');
            if (table) {
              const rows = Array.from(table.querySelectorAll('tr'));
              rows.forEach(row => {
                const cells = Array.from(row.querySelectorAll('td, th'));
                if (cells.length >= 2) {
                  const label = (cells[0].innerText || '').trim();
                  const anchor = cells[1].querySelector('a[href]');
                  const href = anchor ? anchor.href : null;
                  if (label && href && href !== '#' && !href.includes('javascript:')) {
                    allImportantLinks.push({ label, url: href });
                    const lower = label.toLowerCase();
                    if ((lower.includes('apply online') || lower.includes('mains form')) && links.apply === '#') links.apply = href;
                    else if ((lower.includes('download') && lower.includes('notification') || lower.includes('official notification')) && links.notification === '#') links.notification = href;
                    else if (lower.includes('official website') && links.official === '#') links.official = href;
                  }
                }
              });
              break;
            }
            sibling = sibling.nextElementSibling;
          }
          break;
        }
      }

      // Fallback link scan
      if (allImportantLinks.length === 0) {
        const linkSections = Array.from(document.querySelectorAll('li, tr, p, div'));
        for (const el of linkSections) {
          const text = (el.innerText || '').toLowerCase();
          const anchor = el.querySelector('a[href]');
          if (!anchor) continue;
          const href = anchor.href;
          if (!href || href === '#' || href.includes('javascript:')) continue;
          if ((text.includes('apply online') || text.includes('mains form')) && links.apply === '#') links.apply = href;
          else if (text.includes('notification') && !text.includes('official') && links.notification === '#') links.notification = href;
          else if (text.includes('official website') && links.official === '#') links.official = href;
        }
      }

      // ══════════════════════════════════════════════════════════════
      // 8. MODE OF SELECTION
      // ══════════════════════════════════════════════════════════════
      const selectionItems = findSectionItems(['mode of selection', 'selection process']);
      const selectionProcess = selectionItems.filter(s => s.length > 2 && s.length < 200);

      // ══════════════════════════════════════════════════════════════
      // 9. PHYSICAL TESTS TABLES
      // ══════════════════════════════════════════════════════════════
      const physicalStandards = [];
      const physicalEfficiency = [];
      for (const table of allTables) {
        const tableText = (table.innerText || '').toLowerCase();
        if (tableText.includes('physical standard') || (tableText.includes('height') && tableText.includes('chest'))) {
          Array.from(table.querySelectorAll('tr')).forEach(row => {
            const cells = Array.from(row.querySelectorAll('td, th'));
            if (cells.length >= 2) physicalStandards.push(cells.map(c => (c.innerText || '').trim()));
          });
        }
        if (tableText.includes('physical efficiency') || tableText.includes('race distance')) {
          Array.from(table.querySelectorAll('tr')).forEach(row => {
            const cells = Array.from(row.querySelectorAll('td, th'));
            if (cells.length >= 2) physicalEfficiency.push(cells.map(c => (c.innerText || '').trim()));
          });
        }
      }

      // ══════════════════════════════════════════════════════════════
      // 10. HOW TO FILL / CHECK / DOWNLOAD
      // ══════════════════════════════════════════════════════════════
      const howToItems = findSectionItems(['how to fill', 'how to check', 'how to download', 'how to apply']);
      const howToSteps = howToItems.filter(s => s.length > 5 && s.length < 500);

      // ══════════════════════════════════════════════════════════════
      // 11. FAQ / IMPORTANT QUESTIONS
      // ══════════════════════════════════════════════════════════════
      const faqItems = [];
      for (const table of allTables) {
        const headerText = (table.innerText || '').toLowerCase();
        if (headerText.includes('important question') || headerText.includes('faq')) {
          let currentQ = null;
          Array.from(table.querySelectorAll('tr, td, li')).forEach(el => {
            const text = (el.innerText || '').trim();
            if (text.toLowerCase().startsWith('question:')) {
              currentQ = text.replace(/^question:\s*/i, '').trim();
            } else if (text.toLowerCase().startsWith('answer:') && currentQ) {
              const answer = text.replace(/^answer:\s*/i, '').trim();
              if (currentQ.length > 5 && answer.length > 5) faqItems.push({ q: currentQ, a: answer });
              currentQ = null;
            }
          });
        }
      }
      if (faqItems.length === 0) {
        let currentQ = null;
        Array.from(document.querySelectorAll('li')).forEach(li => {
          const text = (li.innerText || '').trim();
          if (text.toLowerCase().startsWith('question:')) {
            currentQ = text.replace(/^question:\s*/i, '').trim();
          } else if (text.toLowerCase().startsWith('answer:') && currentQ) {
            const answer = text.replace(/^answer:\s*/i, '').trim();
            if (currentQ.length > 5 && answer.length > 5) faqItems.push({ q: currentQ, a: answer });
            currentQ = null;
          }
        });
      }

      return {
        dates,
        fee,
        ageLimit,
        vacancies,
        eligibility,
        vacancyDetails,
        links,
        allImportantLinks,
        selectionProcess,
        physicalStandards,
        physicalEfficiency,
        howToSteps,
        faqItems
      };
    });

    await page.close();
    return details;
  } catch (error) {
    console.error("Error scraping detailed job info:", error.message);
    return null;
  }
}

// 3b. Deep-scrape detailed info for ALL cached SarkariResult listings
// This runs in the background worker and pre-populates full_details_json
// so users see complete data (dates, fees, age, vacancies) immediately.
export async function deepScrapeAllListings() {
  const sarkariCategories = ['latestJobs', 'admitCards', 'results', 'answerKeys', 'admissions'];

  console.log(`[DeepScrape] Starting deep scrape for all Sarkari listings...`);

  // Fetch all rows that need deep scraping
  const { data: rows, error } = await supabase
    .from('scraper_cache')
    .select('url_slug, source_url, full_details_json, category')
    .in('category', sarkariCategories);

  if (error || !rows) {
    console.error('[DeepScrape] Failed to query scraper_cache:', error?.message);
    return;
  }

  // Filter to only rows that need scraping:
  // - No full_details_json at all
  // - Or full_details_json was scraped with the old parser (no 'items' in fee)
  const needsScraping = rows.filter(row => {
    // Skip if source URL is a PDF
    if ((row.source_url || '').toLowerCase().includes('.pdf')) return false;
    
    if (!row.full_details_json) return true;

    try {
      const details = typeof row.full_details_json === 'string'
        ? JSON.parse(row.full_details_json)
        : row.full_details_json;

      if (!details.fee || !('items' in details.fee)) return true;
      return false; // Already has details scraped with the new parser
    } catch (e) {
      return true; // Bad JSON, re-scrape
    }
  });

  console.log(`[DeepScrape] Found ${needsScraping.length} listings needing deep scrape (out of ${rows.length} total).`);

  let successCount = 0;
  let failCount = 0;

  for (const row of needsScraping) {
    try {
      console.log(`[DeepScrape] Scraping: ${row.url_slug} (${row.source_url})`);
      const details = await fetchSarkariJobDetails(row.source_url);

      if (details) {
        const { error: updateError } = await supabase
          .from('scraper_cache')
          .update({ full_details_json: details })
          .eq('url_slug', row.url_slug);

        if (updateError) {
          console.error(`[DeepScrape] Failed to update ${row.url_slug}:`, updateError.message);
          failCount++;
        } else {
          successCount++;
          console.log(`[DeepScrape] ✓ Updated ${row.url_slug} — Fee: Gen=${details.fee?.general}, SC/ST=${details.fee?.scSt}, Women=${details.fee?.women}`);
        }
      } else {
        failCount++;
        console.log(`[DeepScrape] ✗ No details returned for ${row.url_slug}`);
      }

      // Delay between requests to avoid rate-limiting (3 seconds)
      await new Promise(resolve => setTimeout(resolve, 3000));

    } catch (err) {
      failCount++;
      console.error(`[DeepScrape] Error on ${row.url_slug}:`, err.message);
      // Continue with next item
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log(`[DeepScrape] Complete. Success: ${successCount}, Failed: ${failCount}`);
}

// 4. Fetch Private Sector IT/Software Jobs from Freshersworld
// Helper to fetch IT corporate jobs from Indeed India using Puppeteer Stealth
async function fetchIndeedJobs(browser) {
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log("Navigating to Indeed India for corporate private jobs...");
    const url = 'https://in.indeed.com/jobs?q=TCS+OR+Wipro+OR+Infosys+OR+Cognizant&l=India';
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    const results = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.job_seen_beacon'));
      return cards.map(card => {
        const titleEl = card.querySelector('a.jcs-JobTitle, h3.jobTitle a');
        const companyEl = card.querySelector('[data-testid="company-name"]');
        const locEl = card.querySelector('[data-testid="text-location"]');
        
        return {
          title: titleEl ? titleEl.textContent.trim() : null,
          url: titleEl ? titleEl.href : null,
          company: companyEl ? companyEl.textContent.trim() : null,
          location: locEl ? locEl.textContent.trim() : null,
        };
      });
    });
    
    await page.close();
    
    const targetCompanies = ['wipro', 'infosys', 'tcs', 'tata consultancy', 'cognizant'];
    const filtered = results.filter(job => {
      if (!job.company || !job.title || !job.url) return false;
      const comp = job.company.toLowerCase();
      return targetCompanies.some(target => comp.includes(target));
    });
    
    console.log(`Indeed scraper fetched ${filtered.length} target company jobs.`);
    return filtered;
  } catch (err) {
    console.error("Indeed Scrape Error:", err.message);
    return [];
  }
}

// 4. Fetch Private Sector IT/Software Jobs from Freshersworld & Indeed
export async function fetchPrivateJobs(force = false) {
  const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes cache
  
  const mapper = item => {
    let details = {};
    if (item.full_details_json) {
      try {
        const parsed = typeof item.full_details_json === 'string'
          ? JSON.parse(item.full_details_json)
          : item.full_details_json;
        if (parsed) {
          details = parsed;
        }
      } catch (e) {}
    }
    return {
      id: item.job_id,
      slug: item.url_slug,
      title: item.title,
      org: item.org,
      company: item.org,
      location: details.location || 'Bangalore',
      salary: details.salary || '₹5-8 LPA',
      tag: 'Hot',
      tagColor: 'green',
      link: item.source_url,
      date: 'Recent'
    };
  };

  if (!force) {
    const { data: cached, error: cacheError } = await supabase
      .from('scraper_cache')
      .select('*')
      .eq('category', 'privateJobs')
      .order('scraped_at', { ascending: false });

    if (!cacheError && cached && cached.length > 0) {
      const newestTime = new Date(cached[0].scraped_at).getTime();
      if (Date.now() - newestTime < CACHE_DURATION_MS) {
        console.log("Returning Supabase cached private jobs");
        return cached.map(mapper);
      } else {
        console.log("Returning STALE Supabase cached private jobs (refreshing in background)...");
        // Trigger async background refresh without blocking
        fetchPrivateJobs(true).catch(err => console.error("Background private jobs scrape error:", err.message));
        return cached.map(mapper);
      }
    }
  }

  if (isScrapingLock) {
    console.log("Scraper lock active, skipping private jobs live fetch");
    const { data: cached } = await supabase
      .from('scraper_cache')
      .select('*')
      .eq('category', 'privateJobs')
      .order('scraped_at', { ascending: false });
    return (cached || []).map(mapper);
  }

  isScrapingLock = true;
  let browser;
  try {
    browser = await getBrowser();

    // 1. Fetch Freshersworld Jobs
    const fwPage = await browser.newPage();
    await fwPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log("Navigating to Freshersworld IT jobs...");
    await fwPage.goto('https://www.freshersworld.com/jobs/jobsearch/it-software-jobs', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait slightly to make sure content loads
    await new Promise(resolve => setTimeout(resolve, 4000));

    const rawJobs = await fwPage.evaluate(() => {
      const results = [];
      const cards = Array.from(document.querySelectorAll('.job-container'));
      cards.forEach(card => {
        const titleEl = card.querySelector('.seo_title');
        const companyEl = card.querySelector('.company-name');
        const locEl = card.querySelector('.job-location');
        const expEl = card.querySelector('.experience');
        const url = card.getAttribute('job_display_url');
        
        if (titleEl && companyEl && url) {
          let titleText = titleEl.textContent.trim();
          titleText = titleText.replace(/Jobs Opening in.*/i, '').replace(/Job Opening.*/i, '').trim();
          
          const companyText = companyEl.textContent.trim();
          const locationText = locEl ? locEl.textContent.trim().replace(/\s*\.\.\.\s*$/, '') : 'Bangalore';
          const experienceText = expEl ? expEl.textContent.trim() : '0-2 Years';
          
          results.push({
            title: titleText,
            company: companyText,
            location: locationText,
            experience: experienceText,
            url: url
          });
        }
      });
      return results.slice(0, 15);
    });

    await fwPage.close();

    // 2. Fetch Indeed Corporate Jobs
    const indeedJobs = await fetchIndeedJobs(browser);
    const mappedIndeedJobs = indeedJobs.map(job => ({
      title: job.title,
      company: job.company,
      location: job.location || 'India',
      experience: '0-3 Years',
      url: job.url
    }));

    // Combine both sources
    const combinedJobs = [...mappedIndeedJobs, ...rawJobs];
    console.log(`Scraped ${combinedJobs.length} private jobs (Indeed: ${mappedIndeedJobs.length}, Freshersworld: ${rawJobs.length}). Saving to Supabase...`);
    const now = new Date().toISOString();

    const getMockSalary = (title) => {
      const t = title.toLowerCase();
      if (t.includes('senior') || t.includes('lead') || t.includes('architect')) {
        return `₹${8 + Math.floor(Math.random()*4)} - ₹${14 + Math.floor(Math.random()*6)} LPA`;
      }
      if (t.includes('qa') || t.includes('test') || t.includes('tester') || t.includes('support')) {
        return `₹${3 + Math.floor(Math.random()*2)} - ₹${5 + Math.floor(Math.random()*3)} LPA`;
      }
      if (t.includes('designer') || t.includes('ui') || t.includes('ux') || t.includes('graphics')) {
        return `₹${4 + Math.floor(Math.random()*2)} - ₹${7 + Math.floor(Math.random()*3)} LPA`;
      }
      return `₹${4 + Math.floor(Math.random()*3)} - ₹${8 + Math.floor(Math.random()*4)} LPA`;
    };

    await supabase
      .from('scraper_cache')
      .delete()
      .eq('category', 'privateJobs');

    const insertRows = combinedJobs.map(job => {
      const id = stableId('pvt-', job.title + '-' + job.company);
      const slug = slugify(job.title) + (job.company ? '-' + slugify(job.company) : '');
      const salary = getMockSalary(job.title);
      
      const details = {
        location: job.location,
        salary: salary,
        eligibility: `${job.experience}, B.Tech/B.E/MCA/B.Sc/BCA or equivalent degree.`,
        dates: { applyStart: 'Immediately', applyEnd: 'Within 30 Days', examDate: 'N/A' },
        fee: { general: '₹0', scSt: '₹0', women: '₹0' },
        ageLimit: { min: '18 Years', max: 'No limit', relaxation: 'N/A' },
        vacancies: 'Multiple',
        links: { apply: job.url, notification: job.url, official: job.url }
      };

      return {
        url_slug: slug,
        job_id: id,
        title: job.title,
        org: job.company,
        category: 'privateJobs',
        source_url: job.url,
        full_details_json: details,
        scraped_at: now
      };
    });

    // Deduplicate by BOTH url_slug and job_id to prevent PK constraint errors
    const uniqueRows = [];
    const seenSlugs = new Set();
    const seenIds = new Set();
    insertRows.forEach(row => {
      if (!seenSlugs.has(row.url_slug) && !seenIds.has(row.job_id)) {
        seenSlugs.add(row.url_slug);
        seenIds.add(row.job_id);
        uniqueRows.push(row);
      }
    });

    if (uniqueRows.length > 0) {
      // Delete old private jobs first, then insert fresh batch
      await supabase
        .from('scraper_cache')
        .delete()
        .eq('category', 'privateJobs');

      const { error: insertError } = await supabase
        .from('scraper_cache')
        .insert(uniqueRows);
      if (insertError) throw insertError;
    }

    return uniqueRows.map(mapper);

  } catch (error) {
    console.error("Error scraping private jobs:", error.message);
    const { data: stale } = await supabase
      .from('scraper_cache')
      .select('*')
      .eq('category', 'privateJobs')
      .order('scraped_at', { ascending: false });
    return (stale || []).map(mapper);
  } finally {
    isScrapingLock = false;
  }
}
