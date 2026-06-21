import { fetchSarkariJobDetails } from './src/lib/scraper.js';

async function test() {
  console.log("Scraping details for UP Police Constable...");
  const details = await fetchSarkariJobDetails('https://sarkariresult.com.cm/up-police-constable-2026/');
  console.log("Details returned:", JSON.stringify(details, null, 2));
  process.exit(0);
}

test().catch(err => {
  console.error("Error running test:", err);
  process.exit(1);
});
