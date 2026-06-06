import axios from 'axios';
import * as cheerio from 'cheerio';

async function testSSC() {
  try {
    console.log("Fetching SSC.gov.in...");
    const res = await axios.get('https://ssc.gov.in/');
    const html = res.data;
    
    // Look for API endpoints in the html text
    const apiRegex = /\/api\/[a-zA-Z0-Z\/\-]+/g;
    const endpoints = html.match(apiRegex);
    if (endpoints) {
      const unique = [...new Set(endpoints)];
      console.log("Found endpoints:", unique);
    } else {
      console.log("No API endpoints found in initial HTML.");
    }

    // Try fetching notice API
    console.log("Trying https://ssc.gov.in/api/Notice/getNoticeList...");
    try {
      const apiRes = await axios.get('https://ssc.gov.in/api/Notice/getNoticeList', {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      console.log("API Response keys:", Object.keys(apiRes.data));
    } catch (e) {
      console.log("Notice API failed:", e.message);
    }
    
  } catch (err) {
    console.error("Error fetching SSC:", err.message);
  }
}

testSSC();
