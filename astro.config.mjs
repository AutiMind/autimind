// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  // adapter: cloudflare({
  //   platformProxy: {
  //     enabled: true
  //   }
  // }),
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [react()],
  // Handle 404 pages properly
  build: {
    format: 'directory'
  },
  // Generate sitemap
  site: 'https://autimind.com'
});