import { defineConfig } from 'astro/config';

// Site URL and base path. Auto-populated by the GitHub Actions workflow
// from the repo owner + name, so this just works once you push.
// Override locally by setting PUBLIC_SITE_URL / PUBLIC_BASE_PATH env vars.
const site = process.env.PUBLIC_SITE_URL || 'https://fiduciaryalliance.org';
const base = process.env.PUBLIC_BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  server: {
    port: 4321,
    host: true,
  },
});
