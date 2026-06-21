import './load-env.js';
import { fetchSSCNotices, fetchSarkariResultData, fetchPrivateJobs, deepScrapeAllListings } from './scraper.js';

const WARM_INTERVAL = 15 * 60 * 1000; // 15 minutes
const DEEP_SCRAPE_INTERVAL = 30 * 60 * 1000; // 30 minutes

async function runScraperWorker() {
  console.log(`[${new Date().toISOString()}] Scraper Worker: Starting scraping cycle...`);
  try {
    const start = Date.now();
    await fetchSSCNotices(true);
    await fetchSarkariResultData(true);
    await fetchPrivateJobs(true);
    console.log(`[${new Date().toISOString()}] Scraper Worker: Listing scrape completed in ${Math.round((Date.now() - start) / 1000)}s`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Scraper Worker: Listing cycle failed:`, err.message);
  }
}

async function runDeepScraper() {
  console.log(`[${new Date().toISOString()}] Deep Scraper: Starting deep detail scrape...`);
  try {
    const start = Date.now();
    await deepScrapeAllListings();
    console.log(`[${new Date().toISOString()}] Deep Scraper: Completed in ${Math.round((Date.now() - start) / 1000)}s`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Deep Scraper: Failed:`, err.message);
  }
}

// Initial warm-up on startup
console.log(`[${new Date().toISOString()}] Scraper Worker: Daemon started successfully.`);
runScraperWorker();

// Run deep scraper 2 minutes after startup (give listings time to populate)
setTimeout(() => {
  runDeepScraper();
}, 2 * 60 * 1000);

// Periodic listing scrape every 15 minutes
setInterval(runScraperWorker, WARM_INTERVAL);

// Periodic deep scrape every 30 minutes
setInterval(runDeepScraper, DEEP_SCRAPE_INTERVAL);
