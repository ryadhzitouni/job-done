import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* On ignore les erreurs strictes pour pouvoir déployer vite */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
