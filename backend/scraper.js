import puppeteer from 'puppeteer';

let cachedNotices = null;
let lastFetchTime = null;
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

export async function fetchSSCNotices(force = false) {
  // Return cached if valid
  if (!force && cachedNotices && lastFetchTime && (Date.now() - lastFetchTime < CACHE_DURATION_MS)) {
    console.log("Returning cached SSC notices");
    return cachedNotices;
  }

  console.log("Launching Puppeteer to fetch SSC notices...");
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ] 
    });
  
    const page = await browser.newPage();
    
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Use domcontentloaded instead of networkidle2 — SSC site is slow and may never fully idle
    console.log("Navigating to ssc.gov.in...");
    await page.goto('https://ssc.gov.in/', { 
      waitUntil: 'domcontentloaded', 
      timeout: 90000 
    });
    
    // Wait for the Angular app to render — use standard setTimeout
    console.log("Waiting for Angular app to render...");
    await delay(8000); 

    // Extract notices from the rendered page
    const notices = await page.evaluate(() => {
      function stableId(prefix, text) {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
          const char = text.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        return prefix + Math.abs(hash).toString(36);
      }
      const results = [];
      
      const allLinks = Array.from(document.querySelectorAll('a'));
      
      allLinks.forEach(link => {
        const text = link.innerText.trim();
        const href = link.href;
        
        // Filter links that are likely notices
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
          
          // Try to find a date near the link
          let date = 'Recent';
          const parentText = link.parentElement ? link.parentElement.innerText : '';
          const dateMatch = parentText.match(/\d{1,2}[\\/\s-][A-Za-z]+[\\/\s-]\d{4}/);
          if (dateMatch) {
            date = dateMatch[0];
          }

          // Check for duplicates
          if (!results.find(r => r.title === text)) {
            results.push({
              id: stableId('ssc-', text),
              title: text,
              date: date,
              link: href,
              org: 'Staff Selection Commission',
              tag: 'New',
              tagColor: 'purple'
            });
          }
        }
      });
      
      return results.slice(0, 15); // Return top 15 notices
    });

    console.log(`Successfully extracted ${notices.length} notices from ssc.gov.in`);
    
    cachedNotices = notices;
    lastFetchTime = Date.now();
    return notices;

  } catch (error) {
    console.error("Error scraping SSC:", error.message);
    if (cachedNotices) return cachedNotices;
    return [];
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}

let cachedSarkari = null;
let lastSarkariFetch = null;

export async function fetchSarkariResultData(force = false) {
  if (!force && cachedSarkari && lastSarkariFetch && (Date.now() - lastSarkariFetch < CACHE_DURATION_MS)) {
    console.log("Returning cached SarkariResult data");
    return cachedSarkari;
  }

  console.log("Launching Puppeteer to fetch SarkariResult...");
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
    });
  
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.goto('https://sarkariresult.com.cm/', { waitUntil: 'domcontentloaded', timeout: 90000 });
    
    const data = await page.evaluate(() => {
      function stableId(prefix, text) {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
          const char = text.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        return prefix + Math.abs(hash).toString(36);
      }
      const results = { results: [], admitCards: [], latestJobs: [] };
      const links = Array.from(document.querySelectorAll('a'));
      
      let currentSection = '';
      
      for (const a of links) {
        const text = a.innerText.trim();
        const href = a.href;
        
        if (text === "View More") {
          if (href.includes('/result/')) currentSection = 'results';
          else if (href.includes('/admit-card/')) currentSection = 'admitCards';
          else if (href.includes('/latest-jobs/')) currentSection = 'latestJobs';
          else currentSection = '';
          continue;
        }

        // Based on page structure, if we haven't seen a View More yet, the first list of links belongs to Results.
        // Wait, looking at the dump, the links are:
        // menu items...
        // 1. Result Links
        // View More (/result/)
        // 2. Admit Card Links
        // View More (/admit-card/)
        // 3. Latest Jobs Links
        // View More (/latest-jobs/)
        //
        // So we can start by assigning section implicitly based on the order, or by matching the href patterns.
        // Since we don't have explicit sections, we'll collect all valid-looking links and categorize them based on where they appear relative to "View More".
      }
      
      // Better approach: Since we don't know the exact DOM nesting, we can just look for columns if they exist.
      // Or we can just use the order we observed in the JSON dump.
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

        if (text.length < 10) return; // Skip short links
        if (text.includes("Join WhatsApp")) return;
        if (text.includes("SarkariResult Tools")) return;
        if (href.includes("youtube.com")) return;

        if (['results', 'admitCards', 'latestJobs'].includes(currentList)) {
          if (text.length > 15) {
             results[currentList].push({
               id: stableId('sr-', text),
               title: text,
               link: href,
               org: text.split(' ').slice(0, 3).join(' '),
               tag: currentList === 'latestJobs' ? 'New' : (currentList === 'results' ? 'Declared' : 'Available'),
               tagColor: currentList === 'latestJobs' ? 'purple' : (currentList === 'results' ? 'green' : 'orange'),
               date: 'Recent' // We don't have dates easily parseable here
             });
          }
        }
      });
      
      return results;
    });

    console.log(`Extracted: ${data.results.length} Results, ${data.admitCards.length} Admit Cards, ${data.latestJobs.length} Jobs`);
    
    cachedSarkari = data;
    lastSarkariFetch = Date.now();
    return data;

  } catch (error) {
    console.error("Error scraping SarkariResult:", error.message);
    if (cachedSarkari) return cachedSarkari;
    return { results: [], admitCards: [], latestJobs: [] };
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}

export async function fetchSarkariJobDetails(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      defaultViewport: { width: 1280, height: 800 }
    });
    
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const data = await page.evaluate(() => {
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

    return data;
  } catch (error) {
    console.error("Error scraping job details:", error.message);
    return null;
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}
