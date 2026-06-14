// @ts-check
import { defineConfig } from 'astro/config';

// Static output (default). Ships fast static HTML for hosting on
// Cloudflare Workers (static assets) or Cloudflare Pages. No SSR adapter needed.
export default defineConfig({
  // TODO: set to your real deployed URL (used for canonical / OG tags).
  site: 'https://wedding-guide.example.com',
  output: 'static',
  build: {
    // Emit /about/index.html style pages; fine for static hosting.
    format: 'directory',
  },
});
