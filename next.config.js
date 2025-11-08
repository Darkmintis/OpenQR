/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  images: {
    domains: ['localhost', 'darkmintis.dev'],
    formats: ['image/webp', 'image/avif'],
    unoptimized: true, // For static export
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Base path for subdirectory deployment on darkmintis.dev
  basePath: '/openqr',
  assetPrefix: '/openqr',
  trailingSlash: true,
}

module.exports = nextConfig
