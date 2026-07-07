import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://13.51.47.214/:path*",
      },
    ];
  },
};

export default nextConfig;
