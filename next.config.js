/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },
  // Skip ESLint during build when SKIP_ENV_VALIDATION is set (useful for Docker)
  eslint: {
    ignoreDuringBuilds: process.env.SKIP_ENV_VALIDATION === "1",
  },
  // Skip TypeScript checking during build when SKIP_ENV_VALIDATION is set
  typescript: {
    ignoreBuildErrors: process.env.SKIP_ENV_VALIDATION === "1",
  },
};

export default config;
