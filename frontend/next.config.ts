import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone", // For Docker deployment
  turbopack: {
    root: path.resolve(__dirname),
  },
  reactCompiler: true,
  images: {
    unoptimized: true, // Fix: Disable server-side optimization to avoid upstream 400 errors
    qualities: [100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
