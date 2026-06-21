const puppeteer = require('puppeteer');
const path = require('path');

async function capture() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 1080 });
  
  console.log("Navigating to target URL...");
  await page.goto('https://sarkari-job-portal-2.preview.emergentagent.com/?utm_source=share', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });
  
  await new Promise(r => setTimeout(r, 4000));
  
  const destPath = 'C:\\Users\\rgora\\.gemini\\antigravity\\brain\\18ce5adb-7a91-4817-9153-4fccc7124558\\preview_screenshot.png';
  console.log("Taking screenshot and saving to " + destPath);
  await page.screenshot({ path: destPath, fullPage: true });
  
  await browser.close();
  console.log("Done!");
}

capture().catch(err => {
  console.error("Error capturing screenshot:", err);
  process.exit(1);
});
