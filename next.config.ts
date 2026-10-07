import type { NextConfig } from "next";

// GitHub Pages serves project sites from /<repo-name>. The deploy workflow sets NEXT_PUBLIC_BASE_PATH;
// locally it is empty so the site runs at http://localhost:3000.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export", // fully static site in ./out (required for GitHub Pages)
  trailingSlash: true, // /about/index.html, which works on any static host
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true }, // next/image optimization needs a server
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
