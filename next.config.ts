import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Cette option est cruciale pour @phosphor-icons/react
    // Elle permet d'utiliser les imports nommés sans sacrifier les performances
    optimizePackageImports: ["@phosphor-icons/react"],
  },
  /* config options here */
};

export default nextConfig;
