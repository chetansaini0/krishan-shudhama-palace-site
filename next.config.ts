import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  allowedDevOrigins: ["192.168.137.1", "10.158.13.239", "10.94.220.239"],
  images: {
    /* Dev: skip optimizer to avoid flaky _next/image 500s (slow DNS / timeouts to Unsplash). */
    unoptimized: isDev,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "plus.unsplash.com", pathname: "/**" },
    ],
  },
  async headers() {
    const csp = isDev
      ? "default-src 'self'; img-src 'self' https: data: blob:; media-src 'self' https: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline'; font-src 'self' https: data:; connect-src 'self' https: http: ws: wss:; frame-src https://checkout.razorpay.com https://www.google.com https://maps.google.com;"
      : "default-src 'self'; img-src 'self' https: data: blob:; media-src 'self' https: blob:; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; font-src 'self' https: data:; connect-src 'self' https: https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com; frame-src https://checkout.razorpay.com https://www.google.com https://maps.google.com;";

    return [
      {
        source: "/maintenance",
        headers: [
          { key: "Retry-After", value: "86400" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          ...(isDev
            ? []
            : [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=31536000; includeSubDomains; preload",
                },
              ]),
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
    ];
  },
  async redirects() {
    if (isDev) return [];
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "krishanshudhamapalace.com" }],
        destination: "https://www.krishanshudhamapalace.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
