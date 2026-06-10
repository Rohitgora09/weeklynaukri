import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { fetchSSCNotices, fetchSarkariResultData, fetchSarkariJobDetails } from './scraper.js';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://weeklynaukri.com'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { success: false, error: 'Too many requests' } });
const scrapeLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { success: false, error: 'Too many scraping requests' } });


app.get('/api/ssc-notices', apiLimiter, async (req, res) => {
  try {
    const force = req.query.force === 'true';
    const notices = await fetchSSCNotices(force);
    res.json({ success: true, data: notices });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ success: false, error: 'Failed to fetch SSC notices' });
  }
});

app.get('/api/live-jobs', apiLimiter, async (req, res) => {
  try {
    const force = req.query.force === 'true';
    const data = await fetchSarkariResultData(force);
    res.json({ success: true, data });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ success: false, error: 'Failed to fetch SarkariResult data' });
  }
});

app.get('/api/job-details', scrapeLimiter, async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL parameter is required' });
    }
    const allowedDomains = ['sarkariresult.com.cm', 'ssc.gov.in', 'upsc.gov.in'];
    const parsedUrl = new URL(url);
    if (!allowedDomains.some(d => parsedUrl.hostname.endsWith(d))) {
      return res.status(403).json({ success: false, error: 'Domain not allowed' });
    }
    const data = await fetchSarkariJobDetails(url);
    if (!data) {
      return res.status(404).json({ success: false, error: 'Failed to extract job details' });
    }
    res.json({ success: true, data });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ success: false, error: 'Failed to fetch job details' });
  }
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

app.post('/api/contact', apiLimiter, (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
  }
  console.log(`Contact form: ${name} (${email}) - ${subject}: ${message}`);
  res.json({ success: true, message: 'Your message has been received. We will get back to you soon!' });
});

app.post('/api/parse-resume', apiLimiter, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    const pdfData = await pdfParse(req.file.buffer);
    res.json({ success: true, text: pdfData.text });
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    res.status(500).json({ success: false, error: 'Failed to parse PDF' });
  }
});

// --- REFERRAL BOARD IN-MEMORY STORAGE ---
let referrals = [
  {
    id: '1',
    company: 'TechCorp India',
    role: 'Frontend Developer (React)',
    description: 'We are hiring for our Bangalore office. 2+ years of experience required. Send me a message or comment here for a referral!',
    link: 'https://techcorp.in/careers',
    author: 'Rahul G.',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    comments: [
      { id: 'c1', text: 'Interested! Can I share my resume?', author: 'Aman K.', createdAt: new Date(Date.now() - 80000000).toISOString() }
    ]
  }
];

app.get('/api/referrals', apiLimiter, (req, res) => {
  let sortedReferrals = [...referrals];
  
  if (req.query.sort === 'recent') {
    sortedReferrals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  
  res.json({ success: true, data: sortedReferrals });
});

app.post('/api/referrals', apiLimiter, (req, res) => {
  const { company, role, description, link, author } = req.body;
  
  if (!company || !role || !description) {
    return res.status(400).json({ success: false, error: 'Company, role, and description are required' });
  }
  
  if (link && !link.startsWith('https://')) {
    return res.status(400).json({ success: false, error: 'Link must start with https://' });
  }

  const newReferral = {
    id: Date.now().toString(),
    company,
    role,
    description,
    link: link || '',
    author: author || 'Anonymous',
    createdAt: new Date().toISOString(),
    comments: []
  };

  referrals.unshift(newReferral);
  res.json({ success: true, data: newReferral });
});

app.post('/api/referrals/:id/comments', apiLimiter, (req, res) => {
  const { id } = req.params;
  const { text, author } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, error: 'Comment text is required' });
  }

  const referral = referrals.find(r => r.id === id);
  if (!referral) {
    return res.status(404).json({ success: false, error: 'Referral not found' });
  }

  const newComment = {
    id: 'c' + Date.now().toString(),
    text,
    author: author || 'Anonymous',
    createdAt: new Date().toISOString()
  };

  referral.comments.push(newComment);
  res.json({ success: true, data: newComment });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`API Endpoint: http://localhost:${PORT}/api/ssc-notices`);
});

// --- AUTO CACHE WARMER & BACKGROUND REFRESH (Every 15 minutes) ---
const CACHE_WARM_INTERVAL = 15 * 60 * 1000; // 15 minutes
setInterval(async () => {
  console.log("Auto-warming scraper cache...");
  try {
    await fetchSSCNotices(true);
    await fetchSarkariResultData(true);
    console.log("Cache successfully auto-warmed and refreshed!");
  } catch (err) {
    console.error("Auto-warm failed:", err);
  }
}, CACHE_WARM_INTERVAL);

// Warm cache once on startup after 5 seconds
setTimeout(async () => {
  console.log("Initial scraper cache warm on startup...");
  try {
    await fetchSSCNotices(true);
    await fetchSarkariResultData(true);
    console.log("Initial cache successfully warmed!");
  } catch (err) {
    console.error("Initial cache warm failed:", err);
  }
}, 5000);
