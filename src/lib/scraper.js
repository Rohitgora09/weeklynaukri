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
    return {
      id: item.job_id,
      slug: item.url_slug,
      title: item.title,
      link: item.source_url,
      org: item.org,
      tag,
      tagColor: color,
      date: 'Recent'
    };
  };

  if (!force) {
    const cachedJobs = db.prepare("SELECT * FROM scraper_cache WHERE category = 'latestJobs'").all();
    const cachedAdmit = db.prepare("SELECT * FROM scraper_cache WHERE category = 'admitCards'").all();
    const cachedResults = db.prepare("SELECT * FROM scraper_cache WHERE category = 'results'").all();
    const cachedAnswerKeys = db.prepare("SELECT * FROM scraper_cache WHERE category = 'answerKeys'").all();
    const cachedAdmissions = db.prepare("SELECT * FROM scraper_cache WHERE category = 'admissions'").all();
    const cachedDocuments = db.prepare("SELECT * FROM scraper_cache WHERE category = 'documents'").all();

    if (cachedJobs.length > 0 && cachedAdmit.length > 0 && cachedResults.length > 0) {
      const newestTime = new Date(cachedJobs[0].scraped_at).getTime();
      if (Date.now() - newestTime < CACHE_DURATION_MS) {
        console.log("Returning SQLite cached SarkariResult data");
        return {
          latestJobs: cachedJobs.map(mapper),
          admitCards: cachedAdmit.map(mapper),
          results: cachedResults.map(mapper),
          answerKeys: cachedAnswerKeys.map(mapper),
          admissions: cachedAdmissions.map(mapper),
          documents: cachedDocuments.map(mapper)
        };
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

    console.log(`Scraped SarkariResult. Updating SQLite cache tables...`);
    const now = new Date().toISOString();

    db.transaction(() => {
      db.prepare("DELETE FROM scraper_cache WHERE category IN ('latestJobs', 'admitCards', 'results', 'answerKeys', 'admissions', 'documents')").run();
      
      const insert = db.prepare(`
        INSERT OR IGNORE INTO scraper_cache (url_slug, job_id, title, org, category, source_url, scraped_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const saveItems = (items, categoryName) => {
        if (!items) return;
        items.forEach(item => {
          const id = stableId('sr-', item.title);
          const slug = slugify(item.title) + '-' + id;
          insert.run(slug, id, item.title, item.org, categoryName, item.link, now);
        });
      };

      saveItems(rawData.latestJobs, 'latestJobs');
      saveItems(rawData.admitCards, 'admitCards');
      saveItems(rawData.results, 'results');
      saveItems(rawData.answerKeys, 'answerKeys');
      saveItems(rawData.admissions, 'admissions');
      saveItems(rawData.documents, 'documents');
    })();

    return {
      latestJobs: db.prepare("SELECT * FROM scraper_cache WHERE category = 'latestJobs'").all().map(mapper),
      admitCards: db.prepare("SELECT * FROM scraper_cache WHERE category = 'admitCards'").all().map(mapper),
      results: db.prepare("SELECT * FROM scraper_cache WHERE category = 'results'").all().map(mapper),
      answerKeys: db.prepare("SELECT * FROM scraper_cache WHERE category = 'answerKeys'").all().map(mapper),
      admissions: db.prepare("SELECT * FROM scraper_cache WHERE category = 'admissions'").all().map(mapper),
      documents: db.prepare("SELECT * FROM scraper_cache WHERE category = 'documents'").all().map(mapper)
    };

  } catch (error) {
    console.error("Error scraping SarkariResult data:", error.message);
    return {
      latestJobs: db.prepare("SELECT * FROM scraper_cache WHERE category = 'latestJobs'").all().map(mapper),
      admitCards: db.prepare("SELECT * FROM scraper_cache WHERE category = 'admitCards'").all().map(mapper),
      results: db.prepare("SELECT * FROM scraper_cache WHERE category = 'results'").all().map(mapper),
      answerKeys: db.prepare("SELECT * FROM scraper_cache WHERE category = 'answerKeys'").all().map(mapper),
      admissions: db.prepare("SELECT * FROM scraper_cache WHERE category = 'admissions'").all().map(mapper),
      documents: db.prepare("SELECT * FROM scraper_cache WHERE category = 'documents'").all().map(mapper)
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

// 4. Fetch Private Sector IT/Software Jobs from Freshersworld
export async function fetchPrivateJobs(force = false) {
  const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes cache
  
  const mapper = item => {
    let details = {};
    if (item.full_details_json) {
      try { details = JSON.parse(item.full_details_json); } catch (e) {}
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
    const cached = db.prepare(`
      SELECT * FROM scraper_cache 
      WHERE category = 'privateJobs' 
      ORDER BY scraped_at DESC
    `).all();

    if (cached.length > 0) {
      const newestTime = new Date(cached[0].scraped_at).getTime();
      if (Date.now() - newestTime < CACHE_DURATION_MS) {
        console.log("Returning SQLite cached private jobs");
        return cached.map(mapper);
      }
    }
  }

  if (isScrapingLock) {
    console.log("Scraper lock active, skipping private jobs live fetch");
    return db.prepare("SELECT * FROM scraper_cache WHERE category = 'privateJobs' ORDER BY scraped_at DESC").all().map(mapper);
  }

  isScrapingLock = true;
  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log("Navigating to Freshersworld IT jobs...");
    await page.goto('https://www.freshersworld.com/jobs/jobsearch/it-software-jobs', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait slightly to make sure content loads
    await new Promise(resolve => setTimeout(resolve, 4000));

    const rawJobs = await page.evaluate(() => {
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

    await page.close();

    console.log(`Scraped ${rawJobs.length} private jobs. Saving to SQLite...`);
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

    db.transaction(() => {
      db.prepare("DELETE FROM scraper_cache WHERE category = 'privateJobs'").run();
      
      const insert = db.prepare(`
        INSERT OR IGNORE INTO scraper_cache (url_slug, job_id, title, org, category, source_url, full_details_json, scraped_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      rawJobs.forEach(job => {
        const id = stableId('pvt-', job.title + '-' + job.company);
        const slug = slugify(job.title) + '-' + id;
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

        insert.run(slug, id, job.title, job.company, 'privateJobs', job.url, JSON.stringify(details), now);
      });
    })();

    const updated = db.prepare("SELECT * FROM scraper_cache WHERE category = 'privateJobs' ORDER BY scraped_at DESC").all();
    return updated.map(mapper);

  } catch (error) {
    console.error("Error scraping private jobs:", error.message);
    const stale = db.prepare("SELECT * FROM scraper_cache WHERE category = 'privateJobs' ORDER BY scraped_at DESC").all();
    return stale.map(mapper);
  } finally {
    isScrapingLock = false;
  }
}
