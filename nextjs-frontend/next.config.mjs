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
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337", // leave empty if using default ports (80 for http, 443 for https)
        pathname: "/**", // allow all paths
      },
      // Add more patterns as needed
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
      allowedOrigins: [process.env.NEXT_PUBLIC_APP_URL],
    },
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
