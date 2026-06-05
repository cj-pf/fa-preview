import { defineConfig } from 'astro/config';

// Vercel serves at the root of its assigned subdomain (e.g. fa-preview.vercel.app),
// so no base path needed. The url() helper in src/utils/url.ts stays as-is —
// it's a no-op when BASE_URL is "/" and gives us flexibility later (custom domain, etc.).
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://fiduciaryalliance.org',
  server: {
    port: 4321,
    host: true,
  },
});
