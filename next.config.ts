import type { NextConfig } from "next";

/**
 * Clear Route — static export targeting GitHub Pages.
 *
 * There is no server. Every route is prerendered to `out/` at build time and
 * served as flat files, so anything dynamic must run in the browser or hit an
 * external endpoint (see lib/track.ts and scripts/apps-script.gs).
 */
const repo = "clearroute";
const isProd = process.env.NODE_ENV === "production";

// Pages serves the site from https://<user>.github.io/<repo>/, so every asset
// and route needs the repo name in front of it — but only in production, or
// local dev would 404 on everything.
const basePath = isProd ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true }, // no Image Optimization API on Pages
  basePath,
  assetPrefix: isProd ? `/${repo}/` : "",
  trailingSlash: true, // prevents 404s on nested routes

  // Exposed so client code can prefix assets that don't pass through
  // next/link or next/image — <video src>, poster frames, og: URLs.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
