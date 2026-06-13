import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';

const dbDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'weeklynaukri.db');
const db = new Database(dbPath);

// Enable foreign keys and WAL mode
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    verified INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS referrals (
    id TEXT PRIMARY KEY,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    description TEXT NOT NULL,
    link TEXT,
    author TEXT DEFAULT 'Anonymous',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    referral_id TEXT NOT NULL,
    text TEXT NOT NULL,
    author TEXT DEFAULT 'Anonymous',
    created_at TEXT NOT NULL,
    FOREIGN KEY(referral_id) REFERENCES referrals(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS analytics_hits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pathname TEXT NOT NULL,
    referrer TEXT,
    screen_width INTEGER,
    user_agent TEXT,
    ip_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS scraper_cache (
    url_slug TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    title TEXT NOT NULL,
    org TEXT,
    category TEXT NOT NULL, -- 'latestJobs', 'results', 'admitCards', 'notices', etc.
    source_url TEXT NOT NULL,
    scraped_at TEXT NOT NULL,
    full_details_json TEXT
  );

  CREATE TABLE IF NOT EXISTS otp_requests (
    email TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    otp TEXT NOT NULL,
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS rate_limits (
    ip TEXT PRIMARY KEY,
    login_attempts INTEGER DEFAULT 0,
    login_reset_time INTEGER DEFAULT 0,
    otp_attempts INTEGER DEFAULT 0,
    otp_reset_time INTEGER DEFAULT 0
  );
`);

// Seed an administrator account ONLY when explicit credentials are provided via env.
// Never seed a hardcoded default password.
const checkUsers = db.prepare('SELECT COUNT(*) as count FROM users');
if (checkUsers.get().count === 0) {
  const seedEmail = process.env.SEED_ADMIN_EMAIL;
  const seedPassword = process.env.SEED_ADMIN_PASSWORD;

  if (seedEmail && seedPassword) {
    console.log("Seeding SQLite database with administrator from environment...");
    const hash = bcrypt.hashSync(seedPassword, 10);
    const now = new Date().toISOString();
    db.prepare(`
      INSERT OR IGNORE INTO users (name, email, password_hash, role, verified, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('Administrator', seedEmail.toLowerCase(), hash, 'admin', 1, now);
  } else {
    console.warn("No SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD set; skipping admin seed.");
  }
}

// Seed initial referrals if empty
const checkReferrals = db.prepare('SELECT COUNT(*) as count FROM referrals');
if (checkReferrals.get().count === 0) {
  console.log("Seeding SQLite database with default referral and comment...");
  const now = new Date().toISOString();
  const refId = 'ref-1';
  
  db.prepare(`
    INSERT OR IGNORE INTO referrals (id, company, role, description, link, author, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    refId, 
    'TechCorp India', 
    'Frontend Developer (React)', 
    'We are hiring for our Bangalore office. 2+ years of experience required. Send me a message or comment here for a referral!', 
    'https://techcorp.in/careers', 
    'Rahul G.', 
    now
  );

  db.prepare(`
    INSERT OR IGNORE INTO comments (id, referral_id, text, author, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    'comment-1',
    refId,
    'Interested! Can I share my resume?',
    'Aman K.',
    now
  );
}

export default db;
