import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbDir = path.join(__dirname, 'data');
const usersFile = path.join(dbDir, 'users.json');
const referralsFile = path.join(dbDir, 'referrals.json');

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initial seed data for admin
const initialUsers = [
  {
    name: 'Administrator',
    email: 'admin@weeklynaukri.com',
    password: 'admin123',
    role: 'admin',
    verified: true,
    createdAt: new Date().toISOString()
  }
];

const initialReferrals = [
  {
    id: '1',
    company: 'TechCorp India',
    role: 'Frontend Developer (React)',
    description: 'We are hiring for our Bangalore office. 2+ years of experience required. Send me a message or comment here for a referral!',
    link: 'https://techcorp.in/careers',
    author: 'Rahul G.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    comments: [
      { id: 'c1', text: 'Interested! Can I share my resume?', author: 'Aman K.', createdAt: new Date(Date.now() - 80000000).toISOString() }
    ]
  }
];

// Load and Initialize Databases
export function getUsers() {
  if (!fs.existsSync(usersFile)) {
    saveUsers(initialUsers);
    return initialUsers;
  }
  try {
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading users file, using seeded admin:", err);
    return initialUsers;
  }
}

export function saveUsers(users) {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error("Error writing users file:", err);
    return false;
  }
}

export function getReferrals() {
  if (!fs.existsSync(referralsFile)) {
    saveReferrals(initialReferrals);
    return initialReferrals;
  }
  try {
    const data = fs.readFileSync(referralsFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading referrals file, returning default:", err);
    return initialReferrals;
  }
}

export function saveReferrals(referrals) {
  try {
    fs.writeFileSync(referralsFile, JSON.stringify(referrals, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error("Error writing referrals file:", err);
    return false;
  }
}
