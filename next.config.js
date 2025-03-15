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
  skipTrailingSlashRedirect: true,
  // For Netlify deployment
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Exclude admin routes from static export
  experimental: {
    appDocumentPreloading: true,
  },
}

module.exports = nextConfig