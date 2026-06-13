import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required and must not use a default value.');
}

// Helper to check and update rate limits (IP-based)
export function checkRateLimit(ip, type) {
  if (!ip) return { allowed: true }; // Fallback if IP cannot be determined
  
  const now = Date.now();
  // 5 attempts per 5 minutes
  const MAX_ATTEMPTS = 5;
  const WINDOW_MS = 5 * 60 * 1000; 
  
  const row = db.prepare('SELECT * FROM rate_limits WHERE ip = ?').get(ip) || {
    ip, login_attempts: 0, login_reset_time: 0, otp_attempts: 0, otp_reset_time: 0
  };

  const isLogin = type === 'login';
  let attempts = isLogin ? row.login_attempts : row.otp_attempts;
  let resetTime = isLogin ? row.login_reset_time : row.otp_reset_time;

  if (now > resetTime) {
    attempts = 1;
    resetTime = now + WINDOW_MS;
  } else {
    attempts += 1;
  }

  if (attempts > MAX_ATTEMPTS) {
    return { allowed: false, retryAfter: Math.ceil((resetTime - now) / 1000) };
  }

  // Update db
  db.prepare(`
    INSERT INTO rate_limits (ip, login_attempts, login_reset_time, otp_attempts, otp_reset_time)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(ip) DO UPDATE SET
      login_attempts = excluded.login_attempts,
      login_reset_time = excluded.login_reset_time,
      otp_attempts = excluded.otp_attempts,
      otp_reset_time = excluded.otp_reset_time
  `).run(
    ip, 
    isLogin ? attempts : row.login_attempts,
    isLogin ? resetTime : row.login_reset_time,
    !isLogin ? attempts : row.otp_attempts,
    !isLogin ? resetTime : row.otp_reset_time
  );

  return { allowed: true };
}

// Helper to generate a cryptographically secure 6-digit OTP code
export function generateOTP() {
  return crypto.randomInt(100000, 1000000).toString();
}

// Helper to hash password
export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

// Helper to compare password
export function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

// Helper to generate JWT Token
export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Helper to verify JWT Token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Nodemailer transport builder reading from environment variables
function getMailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null; // Not configured
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(port),
    secure: port == 465,
    auth: { user, pass }
  });
}

// Send OTP to user's email
export async function sendOTPEmail(email, otp) {
  const transporter = getMailTransporter();
  
  if (!transporter) {
    console.log("========================================");
    console.log(`[MOCK EMAIL] To: ${email}`);
    console.log(`[MOCK EMAIL] Subject: OTP Verification for WeeklyNaukri.com`);
    console.log(`[MOCK EMAIL] Message: Your verification code is: ${otp}`);
    console.log("========================================");
    return { success: true, mocked: true };
  }

  const mailOptions = {
    from: `"WeeklyNaukri Alerts" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "OTP Verification Code - WeeklyNaukri.com",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #1e3a8a; text-align: center;">WeeklyNaukri.com</h2>
        <p>Hello,</p>
        <p>Thank you for registering on WeeklyNaukri.com. Please use the following 6-digit One-Time Password (OTP) to verify your account registration. This code is valid for 5 minutes.</p>
        <div style="background-color: #f3f4f6; text-align: center; padding: 15px; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #111827; border-radius: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p>If you did not request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;">WeeklyNaukri.com &copy; 2026</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Real OTP email sent successfully to ${email}`);
    return { success: true, mocked: false };
  } catch (err) {
    console.error("Failed to send real OTP email, falling back to mock:", err.message);
    return { success: true, mocked: true };
  }
}

import db from './db';

// Register a pending verification details
export function registerPendingUser(name, email, password) {
  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity
  const password_hash = hashPassword(password);
  
  db.prepare(`
    INSERT INTO otp_requests (email, name, password_hash, otp, expires_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET
      name = excluded.name,
      password_hash = excluded.password_hash,
      otp = excluded.otp,
      expires_at = excluded.expires_at
  `).run(email.toLowerCase(), name, password_hash, otp, expiresAt);

  return otp;
}

// Verify OTP against pending verifications
export function verifyOTP(email, enteredOtp) {
  const key = email.toLowerCase();
  
  const pending = db.prepare('SELECT * FROM otp_requests WHERE email = ?').get(key);

  if (!pending) {
    return { success: false, error: "No pending verification found. Please sign up again." };
  }

  if (Date.now() > pending.expires_at) {
    db.prepare('DELETE FROM otp_requests WHERE email = ?').run(key);
    return { success: false, error: "OTP has expired. Please sign up again." };
  }

  const expected = Buffer.from(pending.otp);
  const provided = Buffer.from(String(enteredOtp).trim());
  if (expected.length !== provided.length || !crypto.timingSafeEqual(expected, provided)) {
    return { success: false, error: "Invalid OTP verification code." };
  }

  // Verification successful! Clean up and return user object details
  db.prepare('DELETE FROM otp_requests WHERE email = ?').run(key);
  return {
    success: true,
    user: {
      name: pending.name,
      email: pending.email,
      password_hash: pending.password_hash,
      role: 'user', // regular user by default
      verified: 1,
      createdAt: new Date().toISOString()
    }
  };
}
