import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/platforms/blueyonder",
        destination: "/platforms/blue-yonder",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
