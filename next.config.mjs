/** @type {import('next').NextConfig} */
const nextConfig = {
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
  serverExternalPackages: [
    '@aws-sdk/client-ses',
    '@aws-sdk/credential-providers',
    '@smithy/node-http-handler',
    '@smithy/protocol-http',
    '@smithy/middleware-stack',
    '@smithy/smithy-client',
    '@smithy/types',
    '@smithy/util-stream',
    '@smithy/hash-node',
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
