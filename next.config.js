/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp']
  },
  experimental: {
    serverActions: {
      // a clap file can be quite large - but that's OK
      bodySizeLimit: '32mb'
    }
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      },
      {
        // matching ALL routes
        source: "/:path*",
        headers: [
          // for security reasons, performance.now() not performant unless we disable some CORS stuff
          //  more context about why, please check the Security paragraph here:
          // https://developer.mozilla.org/en-US/docs/Web/API/Performance/now#security_requirements
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" }
        ]
      }
    ]
}
}

module.exports = nextConfig
