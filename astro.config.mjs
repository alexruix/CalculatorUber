// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';
import viteCompression from 'vite-plugin-compression';
import pwa from '@vite-pwa/astro';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  vite: {
    plugins: [
      tailwindcss(),
      viteCompression({ algorithm: 'gzip', ext: '.gz' }),
      viteCompression({ algorithm: 'brotliCompress', ext: '.br' })
    ]
  },

  integrations: [
    react(),
    pwa({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Manejate',
        short_name: 'Manejate',
        description: 'La posta de tus viajes. Dashboard con inteligencia financiera.',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.ico',
            sizes: 'any',
            type: 'image/x-icon',
            purpose: 'any'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images-cache',
            }
          },
          {
            urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
            }
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 1 día
              }
            }
          }
        ]
      }
    })
  ]
});