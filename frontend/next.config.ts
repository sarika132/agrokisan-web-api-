import type { NextConfig } from "next";

const backendURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";
const isDev = backendURL.startsWith("http://localhost");

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // allow next/image to load images from our own backend on localhost during dev
    dangerouslyAllowLocalIP: isDev,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "agrokisan.onrender.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
