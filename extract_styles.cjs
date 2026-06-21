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
  
  console.log("Extracting styles...");
  const data = await page.evaluate(() => {
    // Helper to get computed styles
    const getStyle = (el, prop) => el ? window.getComputedStyle(el).getPropertyValue(prop) : null;
    
    // Find all main color properties on the root/body
    const root = document.documentElement;
    const body = document.body;
    
    // Let's get some basic colors
    const bodyBg = getStyle(body, 'background-color');
    const bodyColor = getStyle(body, 'color');
    
    // Header
    const header = document.querySelector('header') || document.querySelector('nav');
    const headerBg = getStyle(header, 'background-color');
    
    // Search input
    const searchInput = document.querySelector('input[type="text"]');
    const searchBg = getStyle(searchInput, 'background-color');
    const searchBorder = getStyle(searchInput, 'border-color');
    
    // Marquee / Notice board
    const marquee = document.querySelector('.animate-marquee') || document.querySelector('[class*="marquee"]');
    let marqueeParent = marquee ? marquee.parentElement : null;
    while (marqueeParent && !getStyle(marqueeParent, 'background-color')) {
      marqueeParent = marqueeParent.parentElement;
    }
    const marqueeBg = marqueeParent ? getStyle(marqueeParent, 'background-color') : null;
    const marqueeText = marquee ? getStyle(marquee, 'color') : null;
    
    // Columns
    // Let's look for columns. They might be styled boxes.
    const lists = Array.from(document.querySelectorAll('div') || []).filter(el => {
      // Find elements that have list items or look like cards with lists
      return el.querySelector('h2') && (el.querySelector('ul') || el.querySelector('a'));
    });
    
    const columns = lists.map(el => {
      const heading = el.querySelector('h2') || el.querySelector('h3');
      const headingText = heading ? heading.innerText : '';
      const headingStyle = heading ? {
        color: getStyle(heading, 'color'),
        bgColor: getStyle(heading, 'background-color'),
        fontSize: getStyle(heading, 'font-size'),
        fontWeight: getStyle(heading, 'font-weight'),
      } : null;
      
      const card = el;
      const cardStyle = {
        bgColor: getStyle(card, 'background-color'),
        border: getStyle(card, 'border-width') + ' ' + getStyle(card, 'border-style') + ' ' + getStyle(card, 'border-color'),
        borderRadius: getStyle(card, 'border-radius'),
      };
      
      return {
        headingText,
        headingStyle,
        cardStyle
      };
    });
    
    // Buttons
    const buttons = Array.from(document.querySelectorAll('button') || []).map(btn => {
      return {
        text: btn.innerText,
        bgColor: getStyle(btn, 'background-color'),
        color: getStyle(btn, 'color'),
        border: getStyle(btn, 'border'),
        borderRadius: getStyle(btn, 'border-radius'),
      };
    });
    
    return {
      bodyBg,
      bodyColor,
      headerBg,
      searchBg,
      searchBorder,
      marqueeBg,
      marqueeText,
      columns: columns.slice(0, 15),
      buttons: buttons.slice(0, 10)
    };
  });
  
  console.log("STYLES DUMP:");
  console.log(JSON.stringify(data, null, 2));
  
  await browser.close();
}

extract().catch(err => {
  console.error("Error extracting styles:", err);
});
