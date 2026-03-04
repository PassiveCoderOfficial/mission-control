import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable React Compiler for now - it's experimental and heavy
  reactCompiler: false,
  
  // Enable Turbopack for better build performance
  turbopack: {
    // Set the root directory to avoid workspace lockfile conflicts
    root: __dirname,
  },
  
  // Optimize bundle splitting
  webpack: (config, { defaultLoaders }) => {
    // Tree-shake Prisma better
    config.externals = ['prisma', ...config.externals];
    return config;
  },
};

export default nextConfig;