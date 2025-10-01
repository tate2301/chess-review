/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle WASM files for Stockfish
    config.module.rules.push({
      test: /\.(wasm)$/,
      type: "asset/resource",
      generator: {
        filename: "static/wasm/[hash][ext]",
      },
    });

    // Suppress warnings for dynamic imports in Stockfish
    config.ignoreWarnings = [
      { module: /node_modules\/stockfish/ },
      /Critical dependency: the request of a dependency is an expression/,
    ];

    // Fix for Node.js modules in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        worker_threads: false,
        child_process: false,
        os: false,
        net: false,
        tls: false,
        http: false,
        https: false,
        stream: false,
        zlib: false,
        url: false,
        assert: false,
        util: false,
      };
    }

    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
