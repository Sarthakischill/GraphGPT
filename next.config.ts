import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // This helps with the 3d-force-graph library which may rely on older patterns
  reactStrictMode: false,
};

export default nextConfig;
