/** @type {import('next').NextConfig} */
// Derive the backend origin from NEXT_PUBLIC_API_URL (strip /api suffix).
// Falls back to localhost for local dev only — always set NEXT_PUBLIC_API_URL
// in production (Vercel env vars).
const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
  'http://localhost:5000';

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Proxy /api/auth/* to the backend so session cookies are same-origin.
  // This avoids cross-origin cookie issues between localhost:3000 ↔ localhost:5000.
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: `${API_URL}/api/auth/:path*`,
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
  },
};

export default nextConfig;
