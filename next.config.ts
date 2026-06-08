import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is the Next.js 16 caching model. Enabling it makes
  // caching explicit and visible: data is dynamic by default and we opt
  // into caching per function/component via the `'use cache'` directive
  // (paired with cacheLife / cacheTag from `next/cache`). PPR is the
  // default rendering behavior once this is on.
  cacheComponents: true,

  // Verbose visibility into fetch caching decisions during development,
  // per the project's "make caching explicit and visible" rule.
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },

  images: {
    // Remote imagery for product photography (Unsplash editorial stock).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
