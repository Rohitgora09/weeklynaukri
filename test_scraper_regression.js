import './src/lib/load-env.js';
import { fetchSarkariResultData } from './src/lib/scraper.js';
import { supabase } from './src/lib/supabase.js';

async function runRegressionTest() {
  console.log("=== STEP 1: Running initial live scrape to find active homepage items ===");
  const startScrape1 = Date.now();
  const results1 = await fetchSarkariResultData(true);
  console.log(`Initial scrape completed in ${Math.round((Date.now() - startScrape1) / 1000)}s.`);

  // Find an active listing from latestJobs to use as our deterministic target
  if (!results1.latestJobs || results1.latestJobs.length === 0) {
    console.error("FAIL: No latestJobs returned in initial scrape. Cannot test preservation.");
    process.exit(1);
  }

  const target = results1.latestJobs[0];
  console.log(`Deterministic target selected: ${target.slug}`);

  // Seed mock details for target in Supabase
  const mockDetails = { dates: { applyStart: "14 July 2026", applyEnd: "03 August 2026", examDate: "Notify Later" } };
  console.log(`Setting mock details on target item: ${target.slug}`);
  const { data: seedData, error: seedError } = await supabase
    .from('scraper_cache')
    .update({ full_details_json: mockDetails })
    .eq('url_slug', target.slug)
    .select();

  if (seedError || !seedData || seedData.length === 0) {
    console.error("FAIL: Seeding target item failed:", seedError?.message);
    process.exit(1);
  }

  const initialTimestamp = seedData[0].scraped_at;
  console.log(`Initial scraped_at recorded: ${initialTimestamp}`);

  console.log("\n=== STEP 2: Running second live scrape & upsert (preservation & timestamp test) ===");
  const startTestRun = new Date();
  
  // Wait 1.5 seconds to guarantee timestamp advancement if sub-second precision is truncated in DB
  console.log("Waiting 1.5 seconds...");
  await new Promise(resolve => setTimeout(resolve, 1500));

  const results2 = await fetchSarkariResultData(true);

  console.log("\n=== STEP 3: Querying updated database state ===");
  const { data: updatedData, error: queryError } = await supabase
    .from('scraper_cache')
    .select('category, url_slug, scraped_at, full_details_json');

  if (queryError) {
    console.error("FAIL: Database query failed:", queryError.message);
    process.exit(1);
  }

  const trackedUpdated = updatedData.find(d => d.url_slug === target.slug);

  if (!trackedUpdated) {
    // Check if it disappeared from the remote feed during the run
    const reappeared = results2.latestJobs?.some(j => j.slug === target.slug);
    if (!reappeared) {
      console.warn(`\nINCONCLUSIVE: Target item "${target.slug}" is no longer on the source feed. Preservation not exercised.`);
      process.exit(2); // Skip code (for CI/CD pipeline safety)
    }
    console.error(`\nFAIL: Target item "${target.slug}" reappeared on the feed but was missing from the cache (preservation broken).`);
    process.exit(1);
  }

  console.log(`\n--- ASSERTION 1: Details Preservation ---`);
  const expectedVal = mockDetails.dates.applyStart;
  const receivedVal = trackedUpdated.full_details_json?.dates?.applyStart;
  const detailsPreserved = expectedVal === receivedVal;
  console.log(`Details preserved? ${detailsPreserved ? "PASS" : "FAIL"}`);
  console.log(`  Expected dates.applyStart: ${expectedVal}`);
  console.log(`  Received dates.applyStart: ${receivedVal}`);
  if (!detailsPreserved) process.exit(1);

  console.log(`\n--- ASSERTION 2: New Timestamp Advancing ---`);
  const timestampAdvanced = new Date(trackedUpdated.scraped_at) > new Date(initialTimestamp);
  console.log(`scraped_at advanced? ${timestampAdvanced ? "PASS" : "FAIL"}`);
  console.log(`  Initial: ${initialTimestamp}`);
  console.log(`  Updated: ${trackedUpdated.scraped_at}`);
  if (!timestampAdvanced) process.exit(1);

  console.log(`\n--- ASSERTION 3: Prune Scope Verification ---`);
  // Scope prune check only to categories that successfully returned elements in the second scrape run
  const activeCategoriesInRun = ['latestJobs', 'admitCards', 'results', 'answerKeys', 'admissions', 'documents']
    .filter(c => Array.isArray(results2[c]) && results2[c].length > 0);

  const staleActive = updatedData.filter(d => 
    activeCategoriesInRun.includes(d.category) && 
    new Date(d.scraped_at) < startTestRun
  );

  console.log(`Active categories in this run: ${activeCategoriesInRun.join(', ')}`);
  console.log(`Stale active rows remaining: ${staleActive.length} (expect 0)`);
  
  if (staleActive.length === 0) {
    console.log("PASS: Stale items correctly pruned.");
  } else {
    console.log("FAIL: Stale items remain in cache:");
    console.log(staleActive.map(s => `${s.url_slug} (${s.scraped_at})`));
    process.exit(1);
  }

  console.log("\n=== REGRESSION TEST SUCCESSFUL ===");
  process.exit(0);
}

runRegressionTest().catch(err => {
  console.error("Test execution encountered crash error:", err);
  process.exit(1);
});
