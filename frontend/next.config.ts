import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Le paquet partagé est livré en TypeScript, Next le compile.
  transpilePackages: ["@terminal-arcade/shared"],
};

export default nextConfig;
