import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages serves a static export from the repository subpath.
  output: "export",
  basePath: process.env.NEXT_BASE_PATH ?? "",
  trailingSlash: true,
  // Keep development-only Next.js chrome out of prototype screenshots.
  devIndicators: false,
};

export default nextConfig;
