/** @type {import('next').NextConfig} */
const nextConfig = {
  // Commented out for dynamic routing to work properly in development
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'link-drive-media.s3.ap-south-1.amazonaws.com',
      },
    ],
  },
};

module.exports = nextConfig;
