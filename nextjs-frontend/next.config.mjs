/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  cacheMaxMemorySize: 0,
  env: {
    APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    PUBLIC_URL: `${process.env.NEXT_PUBLIC_APP_URL}/`,
  },
  images: {
    domains: ["localhost"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
