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
    ];
  },
};

export default nextConfig;
