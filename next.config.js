/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  // Ensure proper static generation
  trailingSlash: false,
}

module.exports = nextConfig
