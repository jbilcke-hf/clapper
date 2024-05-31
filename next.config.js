/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // a clap file can be quite large - but that's OK
      bodySizeLimit: '32mb'
    }
  }
}

module.exports = nextConfig
