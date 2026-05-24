import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  serverActions: {
    bodySizeLimit: '100mb',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
