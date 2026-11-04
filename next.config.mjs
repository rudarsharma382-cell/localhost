/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/portfolio-live',
        destination: 'http://127.0.0.1:5000/',
      },
      {
        source: '/portfolio-live/:path*',
        destination: 'http://127.0.0.1:5000/:path*',
      },
      {
        source: '/public/assets/:path*',
        destination: '/assets/:path*',
      },
    ];
  },
};

export default nextConfig;
