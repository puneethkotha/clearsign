import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Ensure API routes can handle longer running NVIDIA model requests
  experimental: {},
}

export default nextConfig
