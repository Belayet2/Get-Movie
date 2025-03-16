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
    optimizeCss: true,
    optimizePackageImports: ['react', 'react-dom', 'firebase', '@hello-pangea/dnd'],
  },
  // Optimize bundle size
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
}

module.exports = nextConfig