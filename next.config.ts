import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  async headers() {
    return [
      {
        source: "/kantei/pay",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store"
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer"
          },
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow"
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
