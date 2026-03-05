import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "X-Frame-Options",
    value: "DENY"
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin"
  }
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Allow next/image to optimise images from these external domains.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // NewsAPI article thumbnails come from a wide variety of CDNs,
      // so we permit any https hostname for those.  The <img> tag in
      // news-content.tsx already uses unoptimised markup; this config
      // is in place for when those are upgraded to <Image>.
      { protocol: "https", hostname: "**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders
      }
    ];
  }
};

export default nextConfig;
