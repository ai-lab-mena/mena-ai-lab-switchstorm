import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: [
    "localhost",
    "localhost:3000",
    "localhost:80",
    "127.0.0.1",
    "127.0.0.1:3000",
    "127.0.0.1:80",
    "111.101.35.171",
    "111.101.35.171:3000",
    "111.101.35.171:80",
    "liana-s01",
    "liana-s01:3000",
    "liana-s01:80",
    "mena-ai-lab",
    "mena-ai-lab:3000",
    "mena-ai-lab:80",
  ],
};

export default nextConfig;
