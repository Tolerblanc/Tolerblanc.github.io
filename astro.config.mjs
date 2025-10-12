import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://tolerblanc.github.io',
  base: '/experimental',
  integrations: [
    mdx(),
    react(),
    sitemap(),
    tailwind({
      applyBaseStyles: false, // 커스텀 스타일 사용
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'dark-plus',
      wrap: true
    }
  },
  vite: {
    optimizeDeps: {
      exclude: ['sharp']
    }
  }
});
