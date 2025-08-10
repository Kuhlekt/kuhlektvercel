/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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
  // Ensure AWS SDK works properly in serverless environment
  experimental: {
    serverComponentsExternalPackages: ['@aws-sdk/client-ses'],
  },
}

export default nextConfig
