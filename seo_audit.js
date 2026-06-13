import puppeteer from 'puppeteer';

async function audit() {
  console.log("Launching Puppeteer for SEO audit...");
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  try {
    console.log("Navigating to https://weeklynaukri.com/...");
    await page.goto('https://weeklynaukri.com/', { waitUntil: 'networkidle2', timeout: 30000 });

    const auditData = await page.evaluate(() => {
      const getMeta = (nameOrProperty) => {
        const el = document.querySelector(`meta[name="${nameOrProperty}"], meta[property="${nameOrProperty}"]`);
        return el ? el.getAttribute('content') : 'N/A';
      };

      const getCanonical = () => {
        const el = document.querySelector('link[rel="canonical"]');
        return el ? el.getAttribute('href') : 'N/A';
      };

      const getJsonLd = () => {
        const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
        return scripts.map(s => {
          try {
            return JSON.parse(s.textContent);
          } catch (e) {
            return { error: 'Failed to parse JSON', text: s.textContent };
          }
        });
      };

      return {
        title: document.title,
        description: getMeta('description'),
        keywords: getMeta('keywords'),
        canonical: getCanonical(),
        ogTitle: getMeta('og:title'),
        ogDescription: getMeta('og:description'),
        ogUrl: getMeta('og:url'),
        twitterTitle: getMeta('twitter:title'),
        twitterDescription: getMeta('twitter:description'),
        jsonLd: getJsonLd()
      };
    });

    console.log("\n=== SEO AUDIT RESULTS ===");
    console.log(JSON.stringify(auditData, null, 2));
    console.log("=========================");

  } catch (err) {
    console.error("Audit navigation failed:", err.message);
  } finally {
    await browser.close();
    process.exit(0);
  }
}

audit();
