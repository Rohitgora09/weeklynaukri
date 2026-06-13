# weeklynaukri

A job board for Indian government and private jobs, with authentication, resume parsing, exam test series, live job scraping, and analytics.

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
