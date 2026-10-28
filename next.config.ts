import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep development-only Next.js chrome out of prototype screenshots.
  devIndicators: false,
};

export default nextConfig;
