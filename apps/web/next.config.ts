import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/auth/:path*",
          destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3010"}/auth/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
