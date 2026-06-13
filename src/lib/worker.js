import { fetchSSCNotices, fetchSarkariResultData, fetchPrivateJobs } from './scraper.js';

const WARM_INTERVAL = 15 * 60 * 1000; // 15 minutes

async function runScraperWorker() {
  console.log(`[${new Date().toISOString()}] Scraper Worker: Starting scraping cycle...`);
  try {
    const start = Date.now();
    await fetchSSCNotices(true);
    await fetchSarkariResultData(true);
    await fetchPrivateJobs(true);
    console.log(`[${new Date().toISOString()}] Scraper Worker: Completed scraping cycle in ${Math.round((Date.now() - start) / 1000)}s`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Scraper Worker: Cycle failed:`, err.message);
  }
}

// Initial warm-up on startup
console.log(`[${new Date().toISOString()}] Scraper Worker: Daemon started successfully.`);
runScraperWorker();

// Periodic timer execution
setInterval(runScraperWorker, WARM_INTERVAL);
