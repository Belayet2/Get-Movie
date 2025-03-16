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
  // For better performance
  experimental: {
    appDocumentPreloading: true,
  },
}

module.exports = nextConfig