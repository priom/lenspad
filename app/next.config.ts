import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" }, // existing
      { protocol: "https", hostname: "api.grove.storage", pathname: "/**" }, // <-- add this
    ],
  },
};

export default nextConfig;