/** @type {import('next').NextConfig} */
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = dirname(__filename); // get the name of the directory

process.on('unhandledRejection', error => {
	console.log('unhandledRejection', error);
});

const nextConfig = {
  output: 'standalone',

  // this includes files from the monorepo base two directories up
  // see: https://nextjs.org/docs/pages/api-reference/config/next-config-js/output#caveats
  outputFileTracingRoot: join(__dirname, '../../'),

  experimental: {
    serverActions: {
      // a clap file can be quite large - but that's OK
      bodySizeLimit: '32mb'
    },


    // https://nextjs.org/docs/app/guides/memory-usage#try-experimentalwebpackmemoryoptimizations
    // I suspect this might sometimes crash the build of the app
    webpackMemoryOptimizations: false // let's set it to false
  },
  images: {
    // temporary fix for:
    //
    //   Error: Image import
    //   "next-metadata-image-loader?type=icon&segment=&basePath=&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js!/home/runner/work/clapper/clapper/src/app/icon.png?__next_metadata__"
    //   is not a valid image file.
    //   The image may be corrupted or an unsupported format.
    unoptimized: true,
  },
  // workaround for transformers.js issues
  webpack: (config) => {
    config.resolve.alias = {
        ...config.resolve.alias,
        // "sharp$": false,
        "onnxruntime-node$": false,
    }

    // see https://github.com/replicate/replicate-javascript/issues/273#issuecomment-2248635353
    config.ignoreWarnings = [
      {
        module: /replicate/,
         message: /require function is used in a way in which dependencies cannot be statically extracted/,
      },
    ]

    return config;
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
          // for security reasons, performance.now() is not performant unless we disable some CORS stuff
          //  more context about why, please check the Security paragraph here:
          // https://developer.mozilla.org/en-US/docs/Web/API/Performance/now#security_requirements
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" }
        ]
      }
    ]
}
}

export default nextConfig;