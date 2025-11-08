/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    unoptimized: true, // For static export
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  basePath: '',  // Using custom domain darkmintis.dev/openqr
  trailingSlash: true,
}

module.exports = nextConfig
