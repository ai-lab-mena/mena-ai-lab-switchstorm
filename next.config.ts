import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "localhost:3000",
    "127.0.0.1",
    "127.0.0.1:3000",
    "111.101.35.171",
    "111.101.35.171:3000",
  ],
};

export default nextConfig;
