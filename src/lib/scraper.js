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
      // ── Helper: extract value after a colon/dash from a text line ──
      function extractValue(text) {
        if (!text) return 'N/A';
        // Remove HTML tags if any leaked through
        const clean = text.replace(/<[^>]*>/g, '').trim();
        // Try splitting at : or –
        const parts = clean.split(/\s*[:–]\s*/);
        if (parts.length > 1) {
          return parts.slice(1).join(':').trim() || clean;
        }
        return clean;
      }

      // ── Helper: extract fee amount from text (strips ₹, /-, whitespace) ──
      function extractFeeAmount(text) {
        if (!text) return 'N/A';
        // Match a number (possibly with commas) that may be preceded by ₹ and followed by /-
        const m = text.match(/₹?\s*([\d,]+)\s*\/?-?/);
        if (m) return m[1].replace(/,/g, '');
        // If text literally says "Nil" or "0" or "Free"
        if (/nil|free/i.test(text)) return '0';
        return 'N/A';
      }

      // ── Helper: find all <li> text items within a section identified by its header ──
      function findSectionItems(headerKeywords) {
        // Strategy: find heading elements (h1-h6, div with gb-headline class) whose text
        // matches one of the keywords, then collect <li> texts from the next sibling container.
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, [class*="gb-headline"]'));
        
        for (const heading of headings) {
          const hText = (heading.innerText || '').toLowerCase().trim();
          const matched = headerKeywords.some(kw => hText.includes(kw.toLowerCase()));
          if (!matched) continue;

          // Collect list items: look in the heading's parent container or next siblings
          const items = [];
          
          // Strategy 1: Same parent container — look for sibling elements with <li>
          let container = heading.closest('.gb-grid-column') || heading.closest('.gb-container') || heading.parentElement;
          if (container) {
            const lis = container.querySelectorAll('li');
            lis.forEach(li => {
              const t = (li.innerText || '').trim();
              if (t.length > 2) items.push(t);
            });
            // Also check for standalone div/p text (e.g., vacancy count in a div)
            if (items.length === 0) {
              const divs = container.querySelectorAll('div[class*="gb-headline"], p');
              divs.forEach(d => {
                if (d === heading) return;
                const t = (d.innerText || '').trim();
                if (t.length > 1 && t.length < 200) items.push(t);
              });
            }
          }
          
          // Strategy 2: Walk next siblings if container didn't yield results
          if (items.length === 0) {
            let sibling = heading.nextElementSibling;
            for (let i = 0; i < 5 && sibling; i++) {
              const lis = sibling.querySelectorAll('li');
              if (lis.length > 0) {
                lis.forEach(li => {
                  const t = (li.innerText || '').trim();
                  if (t.length > 2) items.push(t);
                });
                break;
              }
              sibling = sibling.nextElementSibling;
            }
          }
          
          if (items.length > 0) return items;
        }
        return [];
      }

      // ── Helper: search list items for a matching keyword and extract the value ──
      function findInItems(items, keywords) {
        for (const item of items) {
          const lower = item.toLowerCase();
          for (const kw of keywords) {
            if (lower.includes(kw.toLowerCase())) {
              return extractValue(item);
            }
          }
        }
        return 'N/A';
      }

      // ══════════════════════════════════════════════════════════════
      // 1. PARSE IMPORTANT DATES
      // ══════════════════════════════════════════════════════════════
      const dateItems = findSectionItems(['important dates', 'important date']);
      const applyStart = findInItems(dateItems, ['Apply Start Date', 'Application Begin', 'Form Start Date', 'Mains Form Start']);
      const applyEnd = findInItems(dateItems, ['Apply Last Date', 'Last Date for Apply', 'Last Date', 'Form Last Date', 'Mains Form Last Date']);
      let examDate = findInItems(dateItems, ['Exam Date', 'Pre Exam Date', 'Prelims Date', 'CBT Date']);

      // ══════════════════════════════════════════════════════════════
      // 2. PARSE APPLICATION FEE
      // ══════════════════════════════════════════════════════════════
      const feeItems = findSectionItems(['application fee', 'exam fee', 'examination fee']);
      
      // Find general fee — look for various common label patterns
      const generalFeeText = findInItems(feeItems, [
        'General, OBC, EWS', 'General / OBC / EWS', 'General / OBC',
        'Gen / OBC', 'Gen, OBC', 'General/OBC', 'All Category Candidate',
        'All Other Category', 'UR / OBC', 'Unreserved'
      ]);
      const generalFee = extractFeeAmount(generalFeeText);

      // Find SC/ST fee
      const scStFeeText = findInItems(feeItems, [
        'SC / ST', 'SC/ST', 'SC / ST / PH', 'SC/ST/PH'
      ]);
      const scStFee = extractFeeAmount(scStFeeText);

      // Find female / women fee
      const femaleFeeText = findInItems(feeItems, [
        'Female Category', 'All Female', 'Female', 'Women', 'All Category Female',
        'Mahila', 'Lady'
      ]);
      const femaleFee = extractFeeAmount(femaleFeeText);

      // ══════════════════════════════════════════════════════════════
      // 3. PARSE AGE LIMIT
      // ══════════════════════════════════════════════════════════════
      const ageItems = findSectionItems(['age limit', 'age criteria']);
      const minAge = findInItems(ageItems, ['Minimum Age', 'Min Age']);
      const maxAge = findInItems(ageItems, ['Maximum Age', 'Max Age']);

      // ══════════════════════════════════════════════════════════════
      // 4. PARSE VACANCIES
      // ══════════════════════════════════════════════════════════════
      const vacancyItems = findSectionItems(['total post', 'vacancy', 'total vacancy']);
      let vacancies = 'Check Notification';
      if (vacancyItems.length > 0) {
        // Often the vacancy count is in a standalone div like "933 Posts"
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
      // 5. PARSE ELIGIBILITY
      // ══════════════════════════════════════════════════════════════
      const eligItems = findSectionItems(['eligibility', 'qualification', 'education']);
      let eligibility = 'Check Official Notification';
      if (eligItems.length > 0) {
        // Join first few items
        eligibility = eligItems.slice(0, 3).join(', ');
        if (eligibility.length > 300) eligibility = eligibility.slice(0, 297) + '...';
      }

      // ══════════════════════════════════════════════════════════════
      // 6. PARSE IMPORTANT LINKS (Apply Online, Notification, Official)
      // ══════════════════════════════════════════════════════════════
      const links = { apply: '#', notification: '#', official: '#' };
      
      // Links are typically in a table or list near the bottom
      const allAnchors = Array.from(document.querySelectorAll('a'));
      const linkSections = Array.from(document.querySelectorAll('li, tr, p, div'));
      
      for (const el of linkSections) {
        const text = (el.innerText || '').toLowerCase();
        const anchor = el.querySelector('a[href]');
        if (!anchor) continue;
        const href = anchor.href;
        if (!href || href === '#' || href.includes('javascript:')) continue;
        
        if ((text.includes('apply online') || text.includes('mains form')) && links.apply === '#') {
          links.apply = href;
        } else if (text.includes('notification') && !text.includes('official') && links.notification === '#') {
          links.notification = href;
        } else if (text.includes('official website') && links.official === '#') {
          links.official = href;
        }
      }

      return {
        dates: { applyStart, applyEnd, examDate },
        fee: { general: generalFee, scSt: scStFee, women: femaleFee },
        ageLimit: { min: minAge, max: maxAge, relaxation: 'As per rules' },
        vacancies,
        eligibility,
        links
      };
    });

    await page.close();
    return details;
  } catch (error) {
    console.error("Error scraping detailed job info:", error.message);
    return null;
  }
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
