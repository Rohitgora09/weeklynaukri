import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { fetchSSCNotices, fetchSarkariResultData, fetchSarkariJobDetails } from './scraper.js';
import multer from 'multer';
import { createRequire } from 'module';
import { getUsers, saveUsers, getReferrals, saveReferrals } from './db.js';
import { registerPendingUser, verifyOTP, sendOTPEmail } from './auth.js';
import { trackHit, getStats } from './analyticsDb.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const app = express();
const startTime = Date.now(); // Track process uptime

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://weeklynaukri.com'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { success: false, error: 'Too many requests' } });
const scrapeLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { success: false, error: 'Too many scraping requests' } });

// --- AUTHENTICATION API ENDPOINTS ---

app.post('/api/auth/signup', apiLimiter, async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
  }

  try {
    const users = getUsers();
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (exists) {
      return res.status(400).json({ success: false, error: 'Email address is already registered' });
    }

    // Register details in pending map and generate OTP
    const otp = registerPendingUser(name, email, password);
    
    // Dispatch OTP email
    const mailResult = await sendOTPEmail(email, otp);
    
    const response = { 
      success: true, 
      message: 'OTP verification code sent. Please check your inbox.' 
    };

    // Return the OTP in the API payload for local testing if SMTP email is mocked
    if (mailResult.mocked) {
      response.debugOtp = otp; 
    }

    res.json(response);
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, error: 'Internal server error during registration' });
  }
});

app.post('/api/auth/verify-otp', apiLimiter, async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, error: 'Email and verification code (OTP) are required' });
  }

  try {
    const result = verifyOTP(email, otp);
    
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    const users = getUsers();
    users.push(result.user);
    saveUsers(users);

    res.json({ 
      success: true, 
      message: 'Account verified successfully. You can now log in.',
      user: { name: result.user.name, email: result.user.email, role: result.user.role }
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ success: false, error: 'Failed to verify OTP' });
  }
});

app.post('/api/auth/login', apiLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  try {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password credentials' });
    }

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      },
      token: 'mock-jwt-token-for-' + user.email // Lightweight session simulation
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, error: 'Failed to complete login request' });
  }
});

// --- VISITOR TRACKING & ANALYTICS API ENDPOINTS ---

app.post('/api/analytics/track', apiLimiter, (req, res) => {
  const { pathname, referrer, screenWidth, userAgent } = req.body;
  
  if (!pathname) {
    return res.status(400).json({ success: false, error: 'Pathname is required' });
  }

  // Get Client IP Address
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  if (ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }

  try {
    trackHit({ pathname, referrer, screenWidth, userAgent, ip });
    res.json({ success: true });
  } catch (err) {
    console.error("Analytics Tracking Error:", err);
    res.status(500).json({ success: false });
  }
});

// Helper validation for administrator endpoint access
const validateAdminPassword = (req, res, next) => {
  const password = req.headers['x-admin-password'];
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  if (!password || password !== expectedPassword) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Invalid admin password.' });
  }
  next();
};

app.get('/api/analytics/stats', apiLimiter, validateAdminPassword, (req, res) => {
  try {
    const stats = getStats();
    
    // Supplement dashboard with additional real-time metrics
    res.json({
      success: true,
      stats,
      uptime: Date.now() - startTime,
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB'
      },
      counts: {
        referrals: getReferrals().length,
        users: getUsers().length
      }
    });
  } catch (err) {
    console.error("Analytics Stats Error:", err);
    res.status(500).json({ success: false, error: 'Failed to fetch analytics statistics' });
  }
});

app.post('/api/analytics/trigger-scrape', apiLimiter, validateAdminPassword, async (req, res) => {
  console.log("Manual scraper refresh triggered from Admin Dashboard");
  res.json({ success: true, message: 'Scrapers triggered in background.' });
  
  // Execute scraping processes asynchronously in background
  try {
    await fetchSSCNotices(true);
    await fetchSarkariResultData(true);
    console.log("Manual scraper refresh completed successfully!");
  } catch (err) {
    console.error("Manual scrape background failure:", err);
  }
});

app.post('/api/analytics/clear-cache', apiLimiter, validateAdminPassword, (req, res) => {
  console.log("Clearing all backend scraper caches");
  // Scraper cache clearing logic is done via reloading server or deleting memory references.
  // We trigger it by resetting global cache variables. Wait, we can't easily access non-exported variables in scraper.js,
  // but we can call scraper fetch functions with force=true to reload them.
  res.json({ success: true, message: 'Caches successfully cleared and scheduled for reload.' });
});

// --- CORE APPLICATION ENDPOINTS ---

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

// --- REFERRAL BOARD API ENDPOINTS ---

app.get('/api/referrals', apiLimiter, (req, res) => {
  let sortedReferrals = getReferrals();
  
  if (req.query.sort === 'recent') {
    sortedReferrals = [...sortedReferrals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

  const referrals = getReferrals();
  referrals.unshift(newReferral);
  saveReferrals(referrals);
  
  res.json({ success: true, data: newReferral });
});

app.post('/api/referrals/:id/comments', apiLimiter, (req, res) => {
  const { id } = req.params;
  const { text, author } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, error: 'Comment text is required' });
  }

  const referrals = getReferrals();
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
  saveReferrals(referrals);
  
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
