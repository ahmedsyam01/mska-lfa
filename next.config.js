/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  i18n,
  images: {
    domains: ['localhost', 'rimna.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.railway.app',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      }
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
  // Disable standalone output - it causes health check issues on Railway
  // output: process.env.RAILWAY_ENVIRONMENT ? 'standalone' : undefined,
  // Optimize for production
  poweredByHeader: false,
  generateEtags: false,
  // Configure for Railway's single port setup
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig 