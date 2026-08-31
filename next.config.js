// The backend serves team logos from its own host, so pointing
// NEXT_PUBLIC_API_BASE_URL at a local backend yields localhost image URLs that
// next/image rejects. Allow that exact host:port — and only when the API base
// really is local, so production keeps its original allowlist untouched.
function localApiImagePatterns() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return [];
  try {
    const { protocol, hostname, port } = new URL(base);
    if (hostname !== "localhost" && hostname !== "127.0.0.1") return [];
    return [{ protocol: protocol.replace(":", ""), hostname, port }];
  } catch {
    return [];
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  turbopack: {
    root: process.cwd(),
  },
  // React Compiler
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "tournalink.com" },
      { protocol: "https", hostname: "api.ecube.gg" },
      { protocol: "https", hostname: "images.unsplash.com" },
      ...localApiImagePatterns(),
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
