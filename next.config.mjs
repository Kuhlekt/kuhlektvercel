/** @type {import('next').NextConfig} */
const nextConfig = {
  generateBuildId: async () => {
    // Force clean rebuild to clear cached chat route error
    return `build-${Date.now()}-clean`
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
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
