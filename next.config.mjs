

export default {
  async rewrites() {
    return [
      // Rewrite API requests to localhost development server
      {
        source: '/api/:path*',
        destination: `http://localhost:3000/api/:path*`,
      },
      // Rewrite socket.io requests to /api/socket
      {
        source: '/socket.io/:path*',
        destination: '/api/socket/:path*',
      },
      
    ];
  },
};
