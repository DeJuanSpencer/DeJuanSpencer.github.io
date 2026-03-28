import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   async rewrites() {
    return [
      {
        source: '/work-with-me/:path*',
        destination: 'https://your-intake-form.vercel.app/:path*',
      },
    ];
  },
};

export default nextConfig;
