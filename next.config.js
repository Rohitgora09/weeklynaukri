/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: [
    'better-sqlite3', 
    'bcrypt', 
    'puppeteer', 
    'puppeteer-extra', 
    'puppeteer-extra-plugin-stealth'
  ],
  async redirects() {
    return [
      {
        source: '/job-details/:id',
        destination: '/job/:id',
        permanent: true,
      },
      {
        source: '/private-jobs',
        destination: '/referrals',
        permanent: true,
      },
      {
        source: '/admissions',
        destination: '/',
        permanent: true,
      },
      {
        source: '/documents',
        destination: '/',
        permanent: true,
      },
      {
        source: '/it-govt-jobs',
        destination: '/it-government-jobs-2026',
        permanent: true,
      },
      {
        source: '/it-govt-jobs-2026',
        destination: '/it-government-jobs-2026',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
