import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/lp-index.html" }]
    };
  }
};

export default nextConfig;
