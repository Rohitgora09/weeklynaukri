# WeeklyNaukri

**Live site: [weeklynaukri.com](https://weeklynaukri.com)** — Latest Sarkari Naukri, government jobs, results, admit cards, and answer keys, updated daily.

A job board for Indian government and private jobs, with authentication, resume parsing, exam test series, live job scraping, and analytics. Free tools include an [SSC GD marks calculator](https://weeklynaukri.com/ssc-gd-marks-calculator) and a [photo/signature resizer](https://weeklynaukri.com/image-resizer) for government exam applications.

## Tech stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (with `better-sqlite3` for local data)
- **Auth:** JWT + bcrypt, OTP via email (`nodemailer`)
- **Scraping:** Puppeteer with the stealth plugin
- **Resume parsing:** `pdf-parse` + `multer`

## Getting started

```bash
npm install
npm run dev
```

The app runs at http://localhost:3000.

## Scripts

| Script          | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the dev server         |
| `npm run build` | Build for production         |
| `npm run start` | Start the production server  |

## Environment variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
JWT_SECRET=your-jwt-secret
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

> Confirm the exact variable names against `src/lib/supabase.js`, `src/lib/auth.js`, and the API routes under `src/app/api`.

## Project structure

```
src/
  app/            # Next.js App Router pages and API routes
    api/          # auth, jobs, analytics, parse-resume, referrals, contact
    about/        # About page
    test-series/  # Exam test series flows
  components/     # jobs, layout, ui, seo components
  lib/            # scraper, worker, auth, db, supabase, analytics
  hooks/          # useAuth, useLiveJobs
  services/       # api client helper
  data/           # static job and mock test data
  utils/          # helpers (slugify)
```

## Job alert emails

Subscribers are stored in the Supabase `alert_subscribers` table
(create it once with `supabase/alert_subscribers.sql` in the Supabase
SQL editor). New-listing digests are sent by POSTing to
`/api/alerts/dispatch` with the admin password. Add a daily cron on
the VPS:

```cron
0 9 * * * curl -s -X POST -H "x-admin-password: $ADMIN_PASSWORD" https://weeklynaukri.com/api/alerts/dispatch
```

Emails go out via the same SMTP settings used for OTP mail
(`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`).

## IndexNow (instant Bing indexing)

New job URLs are pushed to IndexNow so Bing/Yandex index them within
minutes. The verification key file lives in `public/`. Trigger a
submission of the last 36h of scraped URLs via cron (daily, after the
alerts dispatch):

```cron
15 9 * * * curl -s -X POST -H "x-admin-password: $ADMIN_PASSWORD" https://weeklynaukri.com/api/indexnow/submit
```
