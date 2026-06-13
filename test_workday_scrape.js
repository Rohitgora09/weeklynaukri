import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function testIndeed() {
  console.log("Launching Stealth Puppeteer for Indeed...");
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log("Navigating to Indeed India...");
    const url = 'https://in.indeed.com/jobs?q=TCS+Wipro+Infosys+Cognizant&l=India';
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const elementsData = await page.evaluate(() => {
      const card = document.querySelector('.job_seen_beacon');
      if (!card) return "No card found";
      
      const links = Array.from(card.querySelectorAll('a'));
      const linksDetails = links.map(a => ({
        text: a.textContent.trim(),
        href: a.href,
        className: a.className,
        parentTag: a.parentElement ? a.parentElement.tagName : 'None',
        parentClass: a.parentElement ? a.parentElement.className : 'None'
      }));
      
      const allTextTags = Array.from(card.querySelectorAll('span, div, td'));
      const textDetails = allTextTags.slice(0, 10).map(el => ({
        tag: el.tagName,
        class: el.className,
        text: el.textContent.trim()
      }));
      
      return {
        cardHtml: card.innerHTML.slice(0, 1500), // Dump first 1500 chars of HTML
        links: linksDetails,
        texts: textDetails
      };
    });
    
    console.log("Card Details:", JSON.stringify(elementsData, null, 2));
    
  } catch (e) {
    console.error("Indeed Error:", e.message);
  } finally {
    await browser.close();
  }
}

testIndeed();
