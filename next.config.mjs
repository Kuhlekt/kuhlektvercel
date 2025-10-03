/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    "@aws-sdk/client-ses",
    "@aws-sdk/credential-providers",
    "@smithy/hash-node",
    "@smithy/signature-v4",
    "@aws-sdk/smithy-client",
    "@aws-sdk/middleware-stack",
    "@smithy/smithy-client",
    "@smithy/util-buffer-from",
    "@smithy/util-utf8",
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize AWS SDK and its dependencies
      config.externals = [
        ...(config.externals || []),
        'bcryptjs',
        '@aws-sdk/client-ses',
        '@smithy/hash-node',
        '@smithy/signature-v4',
        '@smithy/util-buffer-from',
        '@smithy/util-utf8',
      ];
    }
    
    // Add fallbacks for Node.js modules
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
      util: false,
      buffer: false,
      process: false,
      url: false,
    };
    
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
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
}

export default nextConfig
