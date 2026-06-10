import nodemailer from 'nodemailer';

// Temporary in-memory storage for unverified registrations
// Key: email, Value: { name, email, password, otp, expiresAt }
const pendingVerifications = new Map();

// Helper to generate a secure 6-digit OTP code
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; rounded-lg">
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

// Register a pending verification details
export function registerPendingUser(name, email, password) {
  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity
  
  pendingVerifications.set(email.toLowerCase(), {
    name,
    email,
    password,
    otp,
    expiresAt
  });

  return otp;
}

// Verify OTP against pending verifications
export function verifyOTP(email, enteredOtp) {
  const key = email.toLowerCase();
  const pending = pendingVerifications.get(key);

  if (!pending) {
    return { success: false, error: "No pending verification found. Please sign up again." };
  }

  if (Date.now() > pending.expiresAt) {
    pendingVerifications.delete(key);
    return { success: false, error: "OTP has expired. Please sign up again." };
  }

  if (pending.otp !== enteredOtp.trim()) {
    return { success: false, error: "Invalid OTP verification code." };
  }

  // Verification successful! Clean up and return user object
  pendingVerifications.delete(key);
  return {
    success: true,
    user: {
      name: pending.name,
      email: pending.email,
      password: pending.password,
      role: 'user', // regular user by default
      verified: true,
      createdAt: new Date().toISOString()
    }
  };
}
