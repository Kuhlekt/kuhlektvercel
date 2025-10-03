/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    '@aws-sdk/client-ses',
    '@aws-sdk/smithy-client',
    '@smithy/hash-node',
    '@smithy/node-http-handler',
    '@smithy/util-stream-node',
    '@smithy/signature-v4',
    '@smithy/protocol-http',
    '@smithy/middleware-retry',
    '@smithy/middleware-stack',
  ],
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Add all AWS SDK and Smithy packages to externals
      config.externals = [
        ...config.externals,
        'bcryptjs',
        '@aws-sdk/client-ses',
        '@aws-sdk/smithy-client',
        '@smithy/hash-node',
        '@smithy/node-http-handler',
        '@smithy/util-stream-node',
        '@smithy/signature-v4',
        '@smithy/protocol-http',
        '@smithy/middleware-retry',
        '@smithy/middleware-stack',
        'crypto',
      ]
    }
    
    // Set fallbacks for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      path: false,
      os: false,
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
