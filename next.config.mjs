/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    '@aws-sdk/client-ses',
    '@aws-sdk/smithy-client',
    '@smithy/node-http-handler',
    '@smithy/hash-node',
    '@smithy/protocol-http',
    '@smithy/signature-v4',
    '@smithy/util-utf8',
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
