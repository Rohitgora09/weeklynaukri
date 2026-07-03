import nodemailer from 'nodemailer';

// Shared SMTP transport builder (same env vars as the OTP mailer in auth.js)
export function getMailTransporter() {
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

const CATEGORY_TITLES = {
  latestJobs: 'Latest Govt Jobs',
  results: 'Sarkari Results',
  admitCards: 'Admit Cards',
  answerKeys: 'Answer Keys',
};

// Send a digest of new listings to one subscriber.
// jobsByCategory: { latestJobs: [{title, url_slug}, ...], ... }
export async function sendAlertDigestEmail(email, jobsByCategory, unsubscribeToken) {
  const transporter = getMailTransporter();

  const sections = Object.entries(jobsByCategory)
    .filter(([, jobs]) => jobs.length > 0)
    .map(([category, jobs]) => `
      <h3 style="color:#1e3a8a;margin:20px 0 8px;">${CATEGORY_TITLES[category] || category}</h3>
      <ul style="margin:0;padding-left:18px;line-height:1.9;">
        ${jobs.map(j => `<li><a href="https://weeklynaukri.com/job/${j.url_slug}" style="color:#2563eb;text-decoration:none;">${j.title}</a></li>`).join('')}
      </ul>
    `).join('');

  const total = Object.values(jobsByCategory).reduce((n, jobs) => n + jobs.length, 0);
  const unsubscribeUrl = `https://weeklynaukri.com/api/alerts/unsubscribe?token=${unsubscribeToken}`;

  const mailOptions = {
    from: `"WeeklyNaukri Alerts" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `${total} new update${total === 1 ? '' : 's'} for you — WeeklyNaukri Job Alerts`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e5e7eb;border-radius:8px;">
        <h2 style="color:#1e3a8a;text-align:center;margin-top:0;">WeeklyNaukri.com</h2>
        <p>New listings matching your alert categories:</p>
        ${sections}
        <p style="margin-top:24px;">
          <a href="https://weeklynaukri.com/latest-jobs" style="display:inline-block;background:#1e3a8a;color:#fff;padding:10px 22px;border-radius:999px;text-decoration:none;font-weight:bold;">Browse all jobs</a>
        </p>
        <hr style="border:0;border-top:1px solid #e5e7eb;margin:20px 0;" />
        <p style="font-size:12px;color:#6b7280;text-align:center;">
          You get this email because you subscribed to job alerts on WeeklyNaukri.com.<br/>
          <a href="${unsubscribeUrl}" style="color:#6b7280;">Unsubscribe</a> &middot; WeeklyNaukri.com &copy; 2026
        </p>
      </div>
    `
  };

  if (!transporter) {
    console.log(`[MOCK ALERT EMAIL] To: ${email} — ${total} new listings`);
    return { success: true, mocked: true };
  }

  await transporter.sendMail(mailOptions);
  return { success: true, mocked: false };
}
