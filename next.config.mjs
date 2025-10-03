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
  ],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        '@aws-sdk/client-ses': 'commonjs @aws-sdk/client-ses',
        '@smithy/hash-node': 'commonjs @smithy/hash-node',
      })
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
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
