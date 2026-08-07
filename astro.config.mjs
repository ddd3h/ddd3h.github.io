// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.ddd3h.com',
  integrations: [mdx(), sitemap()],
  prefetch: {
    prefetchAll: true,
    // 'hover' rather than 'viewport': the blog index links to every post, and the
    // viewport strategy fired all of them at once against the critical path.
    defaultStrategy: 'hover',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
