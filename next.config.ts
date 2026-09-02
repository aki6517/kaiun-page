import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  async headers() {
    return [
      {
        source: "/kantei/result/:token",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store"
          }
        ]
      }
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/lp-index.html" }]
    };
  }
};

export default nextConfig;
