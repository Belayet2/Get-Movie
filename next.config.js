/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Configure static generation
  distDir: '.next',
  trailingSlash: true,
  // For Netlify deployment
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Exclude admin routes from static export
  experimental: {
    appDocumentPreloading: true,
  },
  // Add rewrites for about page
  async rewrites() {
    return [
      {
        source: '/about',
        destination: '/about/',
        permanent: true,
      },
    ];
  },
  // Add redirects for about page
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/about/',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig