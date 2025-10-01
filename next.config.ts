import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Skip ESLint during production builds (Vercel)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Optionally skip type errors during production builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
