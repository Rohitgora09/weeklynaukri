import puppeteer from 'puppeteer';
import db from './db.js';
import { slugify } from '../utils/slugify.js';

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
      '--no-zygote',
      '--single-process' // Optimize RAM usage on low-spec VPS
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
    const cached = db.prepare(`
      SELECT * FROM scraper_cache 
      WHERE category = 'notices' 
      ORDER BY scraped_at DESC
    `).all();

    if (cached.length > 0) {
      const newestTime = new Date(cached[0].scraped_at).getTime();
      if (Date.now() - newestTime < CACHE_DURATION_MS) {
        console.log("Returning SQLite cached SSC notices");
        return cached.map(item => ({
          id: item.job_id,
          slug: item.url_slug,
          title: item.title,
          org: item.org,
          date: new Date(item.scraped_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          link: item.source_url,
          tag: 'New',
          tagColor: 'purple'
        }));
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
    
    console.log(`Scraped ${notices.length} notices from ssc.gov.in. Updating SQLite cache...`);

    const now = new Date().toISOString();
    
    db.transaction(() => {
      // Clear old cached notices
      db.prepare("DELETE FROM scraper_cache WHERE category = 'notices'").run();
      
      const insert = db.prepare(`
        INSERT INTO scraper_cache (url_slug, job_id, title, org, category, source_url, scraped_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      notices.forEach(notice => {
        const id = stableId('ssc-', notice.title);
        const slug = slugify(notice.title) + '-' + id;
        insert.run(slug, id, notice.title, 'Staff Selection Commission', 'notices', notice.link, now);
      });
    })();

    // Read back clean structures
    const updatedCached = db.prepare("SELECT * FROM scraper_cache WHERE category = 'notices' ORDER BY scraped_at DESC").all();
    return updatedCached.map(item => ({
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
    const stale = db.prepare("SELECT * FROM scraper_cache WHERE category = 'notices' ORDER BY scraped_at DESC").all();
    return stale.map(item => ({
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

  if (!force) {
    const cachedJobs = db.prepare("SELECT * FROM scraper_cache WHERE category = 'latestJobs'").all();
    const cachedAdmit = db.prepare("SELECT * FROM scraper_cache WHERE category = 'admitCards'").all();
    const cachedResults = db.prepare("SELECT * FROM scraper_cache WHERE category = 'results'").all();

    if (cachedJobs.length > 0 && cachedAdmit.length > 0 && cachedResults.length > 0) {
      const newestTime = new Date(cachedJobs[0].scraped_at).getTime();
      if (Date.now() - newestTime < CACHE_DURATION_MS) {
        console.log("Returning SQLite cached SarkariResult data");
        const mapper = item => ({
          id: item.job_id,
          slug: item.url_slug,
          title: item.title,
          link: item.source_url,
          org: item.org,
          tag: item.category === 'latestJobs' ? 'New' : (item.category === 'results' ? 'Declared' : 'Available'),
          tagColor: item.category === 'latestJobs' ? 'purple' : (item.category === 'results' ? 'green' : 'orange'),
          date: 'Recent'
        });
        return {
          latestJobs: cachedJobs.map(mapper),
          admitCards: cachedAdmit.map(mapper),
          results: cachedResults.map(mapper)
        };
      }
    }
  }

  if (isScrapingLock) {
    console.log("Scraper lock active, skipping live SarkariResult fetch");
    return { latestJobs: [], admitCards: [], results: [] };
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
      const results = { results: [], admitCards: [], latestJobs: [] };
      const links = Array.from(document.querySelectorAll('a'));
      
      let currentList = 'results'; 
      links.forEach(a => {
        const text = a.innerText.trim();
        const href = a.href;
        
        if (text === "View More") {
          if (href.includes('/result/')) currentList = 'admitCards';
          else if (href.includes('/admit-card/')) currentList = 'latestJobs';
          else if (href.includes('/latest-jobs/')) currentList = 'answerKeys';
          else currentList = 'other';
          return;
        }

        if (text.length < 10) return;
        if (text.includes("Join WhatsApp") || text.includes("SarkariResult Tools") || href.includes("youtube.com")) return;

        if (['results', 'admitCards', 'latestJobs'].includes(currentList)) {
          if (text.length > 15) {
            results[currentList].push({
              title: text,
              link: href,
              org: text.split(' ').slice(0, 3).join(' ')
            });
          }
        }
      });
      return results;
    });

    await page.close();

    console.log(`Scraped SarkariResult. Updating SQLite cache tables...`);
    const now = new Date().toISOString();

    db.transaction(() => {
      db.prepare("DELETE FROM scraper_cache WHERE category IN ('latestJobs', 'admitCards', 'results')").run();
      
      const insert = db.prepare(`
        INSERT INTO scraper_cache (url_slug, job_id, title, org, category, source_url, scraped_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const saveItems = (items, categoryName) => {
        items.forEach(item => {
          const id = stableId('sr-', item.title);
          const slug = slugify(item.title) + '-' + id;
          insert.run(slug, id, item.title, item.org, categoryName, item.link, now);
        });
      };

      saveItems(rawData.latestJobs, 'latestJobs');
      saveItems(rawData.admitCards, 'admitCards');
      saveItems(rawData.results, 'results');
    })();

    // Read back clean structures
    const mapper = item => ({
      id: item.job_id,
      slug: item.url_slug,
      title: item.title,
      link: item.source_url,
      org: item.org,
      tag: item.category === 'latestJobs' ? 'New' : (item.category === 'results' ? 'Declared' : 'Available'),
      tagColor: item.category === 'latestJobs' ? 'purple' : (item.category === 'results' ? 'green' : 'orange'),
      date: 'Recent'
    });

    return {
      latestJobs: db.prepare("SELECT * FROM scraper_cache WHERE category = 'latestJobs'").all().map(mapper),
      admitCards: db.prepare("SELECT * FROM scraper_cache WHERE category = 'admitCards'").all().map(mapper),
      results: db.prepare("SELECT * FROM scraper_cache WHERE category = 'results'").all().map(mapper)
    };

  } catch (error) {
    console.error("Error scraping SarkariResult data:", error.message);
    const mapper = item => ({
      id: item.job_id,
      slug: item.url_slug,
      title: item.title,
      link: item.source_url,
      org: item.org,
      tag: item.category === 'latestJobs' ? 'New' : (item.category === 'results' ? 'Declared' : 'Available'),
      tagColor: item.category === 'latestJobs' ? 'purple' : (item.category === 'results' ? 'green' : 'orange'),
      date: 'Recent'
    });
    return {
      latestJobs: db.prepare("SELECT * FROM scraper_cache WHERE category = 'latestJobs'").all().map(mapper),
      admitCards: db.prepare("SELECT * FROM scraper_cache WHERE category = 'admitCards'").all().map(mapper),
      results: db.prepare("SELECT * FROM scraper_cache WHERE category = 'results'").all().map(mapper)
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
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });

    const details = await page.evaluate(() => {
      const findText = (keywords) => {
        const els = Array.from(document.querySelectorAll('li, p, div, span'));
        for (const el of els) {
          const text = el.innerText || '';
          for (const kw of keywords) {
            if (text.toLowerCase().includes(kw.toLowerCase()) && text.length < 120) {
              return text.replace(kw, '').replace(/[:\-]/g, '').trim() || text.trim();
            }
          }
        }
        return 'N/A';
      };

      const applyStart = findText(['Online Apply Start Date', 'Application Begin']);
      const applyEnd = findText(['Online Apply Last Date', 'Last Date for Apply Online', 'Last Date']);
      const examDate = findText(['Exam Date']);

      const generalFee = findText(['General / OBC', 'General / OBC / EWS', 'All Category Candidates']);
      const scStFee = findText(['SC / ST', 'SC/ST', 'SC / ST / PH']);
      const femaleFee = findText(['All Category Female', 'Women']);

      const minAge = findText(['Minimum Age']);
      const maxAge = findText(['Maximum Age']);

      const vacancies = findText(['Total Post', 'Vacancy Details', 'Total Vacancy']) || 'Check Notification';
      const eligibility = findText(['Bachelor Degree', '10+2', 'Class 10', 'Diploma', 'Eligibility']) || 'Check Official Notification';

      const links = { apply: '#', notification: '#', official: '#' };
      const rows = Array.from(document.querySelectorAll('tr'));
      rows.forEach(row => {
        const text = (row.innerText || '').toLowerCase();
        const a = row.querySelector('a');
        if (a) {
          if (text.includes('apply online') || text.includes('apply')) links.apply = a.href;
          else if (text.includes('notification')) links.notification = a.href;
          else if (text.includes('official website')) links.official = a.href;
        }
      });

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
