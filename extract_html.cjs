const puppeteer = require('puppeteer');

async function extract() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  console.log("Navigating to target URL...");
  await page.goto('https://sarkari-job-portal-2.preview.emergentagent.com/?utm_source=share', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });
  
  await new Promise(r => setTimeout(r, 4000));
  
  console.log("Extracting DOM details...");
  const domInfo = await page.evaluate(() => {
    // Helper to get element details
    const getElDetails = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      return {
        tagName: el.tagName,
        className: el.className,
        styleAttr: el.getAttribute('style'),
        bgColor: window.getComputedStyle(el).backgroundColor,
        color: window.getComputedStyle(el).color,
        borderColor: window.getComputedStyle(el).borderColor,
        innerText: el.innerText.slice(0, 150)
      };
    };
    
    // Let's get header
    const headerDetails = getElDetails('nav');
    
    // Let's get notice marquee container
    const marqueeContainer = document.querySelector('[class*="marquee"]') ? document.querySelector('[class*="marquee"]').parentElement : null;
    const marqueeDetails = marqueeContainer ? {
      className: marqueeContainer.className,
      bgColor: window.getComputedStyle(marqueeContainer).backgroundColor,
      color: window.getComputedStyle(marqueeContainer).color,
      innerText: marqueeContainer.innerText.slice(0, 100)
    } : null;
    
    // Hero section
    // Let's find the section that has the search/hero
    const sections = Array.from(document.querySelectorAll('section'));
    const heroDetails = sections.map(s => {
      return {
        className: s.className,
        bgColor: window.getComputedStyle(s).backgroundColor,
        bgImage: window.getComputedStyle(s).backgroundImage,
        innerText: s.innerText.slice(0, 100)
      };
    });
    
    // Tab Index Tracker
    const tabContainer = document.querySelector('[role="tablist"]') || document.querySelector('.flex.border-b') || document.querySelector('[class*="tab"]');
    const tabDetails = tabContainer ? {
      className: tabContainer.className,
      bgColor: window.getComputedStyle(tabContainer).backgroundColor,
      buttons: Array.from(tabContainer.querySelectorAll('button, a')).map(b => ({
        text: b.innerText,
        className: b.className,
        bgColor: window.getComputedStyle(b).backgroundColor,
        color: window.getComputedStyle(b).color,
        borderBottom: window.getComputedStyle(b).borderBottom
      }))
    } : null;
    
    // Grid Columns
    const lists = Array.from(document.querySelectorAll('div')).filter(el => {
      // Find cards representing the lists
      return el.querySelector('h2') && (el.querySelector('ul') || el.querySelector('a') || el.querySelector('li'));
    });
    
    const columns = lists.map((el, index) => {
      const heading = el.querySelector('h2') || el.querySelector('h3');
      // Look for custom styles
      const listItems = Array.from(el.querySelectorAll('li, a')).slice(0, 3).map(li => ({
        text: li.innerText.slice(0, 80),
        className: li.className,
        color: window.getComputedStyle(li).color,
        bgColor: window.getComputedStyle(li).backgroundColor,
      }));
      
      return {
        index,
        headingText: heading ? heading.innerText : '',
        headingClass: heading ? heading.className : '',
        headingBg: heading ? window.getComputedStyle(heading).backgroundColor : '',
        headingColor: heading ? window.getComputedStyle(heading).color : '',
        cardBg: window.getComputedStyle(el).backgroundColor,
        cardBorder: window.getComputedStyle(el).border,
        cardBorderRadius: window.getComputedStyle(el).borderRadius,
        listItems
      };
    });
    
    return {
      headerDetails,
      marqueeDetails,
      heroDetails,
      tabDetails,
      columns: columns.slice(0, 10)
    };
  });
  
  console.log("DOM INFO:");
  console.log(JSON.stringify(domInfo, null, 2));
  
  await browser.close();
}

extract().catch(err => {
  console.error("Error extracting DOM info:", err);
});
