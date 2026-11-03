/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/public/assets/:path*',
        destination: '/assets/:path*',
      },
    ];
  },
};

export default nextConfig;

