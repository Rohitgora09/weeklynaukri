import puppeteer from 'puppeteer';

let cachedNotices = null;
let lastFetchTime = null;
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
              id: 'ssc-' + Math.random().toString(36).substr(2, 9),
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
    // If it fails but we have a cache, return old cache
    if (cachedNotices) {
      console.log("Returning stale cache due to error");
      return cachedNotices;
    }
    // Return empty array instead of throwing — keeps the frontend working
    return [];
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
