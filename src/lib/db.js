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
`);

// Seed initial administrator and default data if users table is empty
const checkUsers = db.prepare('SELECT COUNT(*) as count FROM users');
if (checkUsers.get().count === 0) {
  console.log("Seeding SQLite database with default administrator...");
  const saltRounds = 10;
  const hash = bcrypt.hashSync('admin123', saltRounds);
  const now = new Date().toISOString();
  
  db.prepare(`
    INSERT OR IGNORE INTO users (name, email, password_hash, role, verified, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('Administrator', 'admin@weeklynaukri.com', hash, 'admin', 1, now);
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
