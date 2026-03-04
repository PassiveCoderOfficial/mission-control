import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable React Compiler for now - it's experimental and heavy
  reactCompiler: false,
  
  // Enable Turbopack with empty config (Next.js 16 default)
  turbopack: {
    root: __dirname,
  },
  
  // Remove webpack config - Turbopack handles bundling differently
};

export default nextConfig;