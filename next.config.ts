import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      { source: '/about', destination: '/', permanent: true },
      { source: '/components', destination: '/work', permanent: true },
    ]
  },
}

export default nextConfig
