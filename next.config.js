const withPWA = require("next-pwa")

module.exports = {
  reactStrictMode: true,
  webpack(config, { dev, isServer }) {
    // Replace React with Preact only in client production build
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        "react": "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      })
    }
    /*if (isServer) {
        require('./lib/utils/generate-sitemap');
      }*/
    return config
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["upload.wikimedia.org", "www.openstreetmap.org", "source.unsplash.com"],
  },
  withPWA: {
    pwa: {
      dest: "public",
    },
  },
}
