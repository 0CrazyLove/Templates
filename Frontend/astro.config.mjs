/**
 * Astro Configuration File
 * 
 * Configures the Astro build framework with essential integrations for the ServiceHub frontend:
 * - React: Component framework for interactive UI elements
 * - Tailwind CSS: Utility-first CSS framework for styling
 * 
 * Server-side rendering is enabled for dynamic content delivery.
 */

// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from "@astrojs/tailwind";
import node from '@astrojs/node';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    server: {
      https: {
        key: readFileSync(resolve('.certs/key.pem')),
        cert: readFileSync(resolve('.certs/cert.pem')),
      }
    }
  }
});