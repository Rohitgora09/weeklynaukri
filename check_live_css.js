import puppeteer from 'puppeteer';
async function test() {
  console.log("Launching Puppeteer...");
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  try {
    console.log("Navigating to https://weeklynaukri.com/...");
    await page.goto('https://weeklynaukri.com/', { waitUntil: 'networkidle2', timeout: 15000 });
    
    console.log("Finding stylesheet links...");
    const stylesheetUrls = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      return links.map(link => link.href);
    });

    console.log("Found stylesheets:", stylesheetUrls);

    console.log("Inspecting live marquee elements...");
    const marqueeData = await page.evaluate(() => {
      const el = document.querySelector('.animate-marquee');
      if (!el) return { found: false };
      
      const computed = window.getComputedStyle(el);
      return {
        found: true,
        outerHTML: el.outerHTML,
        computedStyles: {
          display: computed.display,
          animationName: computed.animationName,
          animationDuration: computed.animationDuration,
          animationPlayState: computed.animationPlayState,
          whiteSpace: computed.whiteSpace,
          transform: computed.transform,
          width: computed.width,
        },
        parentStyles: {
          display: window.getComputedStyle(el.parentElement).display,
          overflow: window.getComputedStyle(el.parentElement).overflow,
        }
      };
    });

    console.log("Marquee element inspection results:", JSON.stringify(marqueeData, null, 2));

  } catch (err) {
    console.error("Puppeteer check failed:", err.stack || err.message);
  } finally {
    await browser.close();
    process.exit(0);
  }
}

test();
