/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
