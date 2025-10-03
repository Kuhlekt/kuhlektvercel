/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    '@aws-sdk/client-ses',
    '@smithy/hash-node',
    '@smithy/node-http-handler',
    '@smithy/util-stream-node',
  ],
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs', '@aws-sdk/client-ses'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...config.externals,
        'bcryptjs',
        '@aws-sdk/client-ses',
        '@smithy/hash-node',
        '@smithy/node-http-handler',
        '@smithy/util-stream-node',
      ]
    }
    
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    }
    
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
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
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
