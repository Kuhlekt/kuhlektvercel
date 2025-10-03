/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    '@aws-sdk/client-ses',
    '@aws-sdk/smithy-client',
    '@smithy/hash-node',
    '@smithy/node-http-handler',
    '@smithy/protocol-http',
    '@smithy/middleware-serde',
    '@smithy/types',
    '@smithy/util-utf8',
    '@smithy/util-buffer-from',
  ],
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark AWS SDK and Smithy packages as external
      config.externals = [
        ...config.externals,
        '@aws-sdk/client-ses',
        '@smithy/hash-node',
        '@smithy/node-http-handler',
        '@smithy/protocol-http',
        '@smithy/middleware-serde',
        '@smithy/types',
      ]
    }

    // Provide fallbacks for Node.js built-in modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: false,
      fs: false,
      net: false,
      tls: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
      buffer: false,
    }

    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.blob.vercel-storage.com',
      },
    ],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
