/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    'bcryptjs',
    '@aws-sdk/client-ses',
    '@aws-sdk/smithy-client',
    '@smithy/hash-node',
    '@smithy/node-http-handler',
    '@smithy/util-stream-node',
    '@smithy/credential-provider-node',
  ],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle AWS SDK and related packages on server
      config.externals.push({
        '@aws-sdk/client-ses': 'commonjs @aws-sdk/client-ses',
        '@smithy/hash-node': 'commonjs @smithy/hash-node',
        '@smithy/node-http-handler': 'commonjs @smithy/node-http-handler',
        '@smithy/util-stream-node': 'commonjs @smithy/util-stream-node',
        '@smithy/credential-provider-node': 'commonjs @smithy/credential-provider-node',
      })
    }

    // Ensure Node.js built-ins are available
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: false,
      stream: false,
      buffer: false,
      util: false,
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
