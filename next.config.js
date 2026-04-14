/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // React Compiler
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tournalink.com",
      },
      {
        protocol: "https",
        hostname: "api.esportsawardsbd.com",
      },
    ],
  },
  async redirects() {
    if (!process.env.REDIRECT_TO_RENDER) return [];
    return [
      {
        source: "/:path*",
        destination: "https://pubg-wdiget-test.onrender.com/:path*",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://tournalink.com/widgets/9/angle/:path*",
      },
    ];
  },
};

export default nextConfig;
