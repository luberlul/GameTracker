/**
 * Static export is only used when packaging the Electron desktop app.
 * In `next dev` (and in `next build` without the flag) we keep the full
 * Next.js runtime so /api/* routes are available.
 *
 * Set BUILD_TARGET=electron when running `next build` for the Electron pipeline.
 */
const isElectronBuild = process.env.BUILD_TARGET === "electron";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(isElectronBuild && {
    output: "export",
    trailingSlash: true,
    assetPrefix: "./",
  }),
  images: { unoptimized: true },
};

export default nextConfig;
