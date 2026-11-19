
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.thesocialout.in",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
