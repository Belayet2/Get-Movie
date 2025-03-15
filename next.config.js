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
    domains: ['getmoviefast.netlify.app'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
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
  // Optimize JavaScript and CSS
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Enable compression
  compress: true,
  // Add bundle analyzer in development
  ...(process.env.ANALYZE === 'true' && {
    webpack(config) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 8888,
          openAnalyzer: true,
        })
      );
      return config;
    },
  }),
}

module.exports = nextConfig