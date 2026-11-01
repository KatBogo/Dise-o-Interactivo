/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    devIndicators: false, // no floating Next.js badge over the experience
    // Lets a production build run next to `next dev` without sharing .next (NEXT_DIST_DIR=.next-build)
    distDir: process.env.NEXT_DIST_DIR || '.next',
    // The whole experience is a client-side SPA (WebGL, scroll, audio) → a static site.
    // `npm run github` builds it with STATIC_EXPORT=1 and prepares the folder for GitHub Pages.
    ...(process.env.STATIC_EXPORT === '1' ? { output: 'export', images: { unoptimized: true } } : {}),
}

export default nextConfig
