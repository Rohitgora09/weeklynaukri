import puppeteer from 'puppeteer';

async function test() {
  console.log("Launching Puppeteer...");
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[LIVE CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[LIVE RUNTIME ERROR] ${err.stack || err.message}`);
  });

  try {
    console.log("Navigating to https://weeklynaukri.com/...");
    await page.goto('https://weeklynaukri.com/', { waitUntil: 'networkidle2', timeout: 15000 });
    console.log("Page loaded. Checking for errors...");
    await new Promise(resolve => setTimeout(resolve, 3000));
  } catch (err) {
    console.error("Navigation failed:", err.message);
  } finally {
    await browser.close();
    process.exit(0);
  }
}

test();
