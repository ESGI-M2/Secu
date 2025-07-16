/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/auth/:path*',
        destination: 'http://localhost:3000/auth/:path*',
      },
      {
        source: '/users',
        destination: 'http://localhost:3000/users',
      },
      {
        source: '/movies/:path*',
        destination: 'http://localhost:3000/movies/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 