import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/TIL",
        destination: "/til/future-dream",
      },
    ];
  },
};

export default nextConfig;
