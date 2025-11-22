/** @type {import('next').NextConfig} */
const nextConfig = {
  // Commented out for dynamic routing to work properly in development
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
