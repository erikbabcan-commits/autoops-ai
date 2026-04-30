import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const sevenDays = 60 * 60 * 24 * 7

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      injectRegister: false,
      devOptions: {
        enabled: false,
        type: 'module',
        navigateFallback: 'index.html',
      },
      includeAssets: ['favicon.png', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        id: '/?source=pwa',
        name: 'AutoOps AI',
        short_name: 'AutoOps',
        description: 'Autonomous Operations Agent for small e-shops and SMBs.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#070712',
        theme_color: '#070712',
        categories: ['business', 'productivity', 'utilities'],
        lang: 'sk-SK',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: '/maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,json}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'autoops-html',
              expiration: { maxAgeSeconds: sevenDays, maxEntries: 20 },
              networkTimeoutSeconds: 3,
            },
          },
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith('/api/') || url.pathname.includes('/mock/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'autoops-api-7d',
              expiration: { maxAgeSeconds: sevenDays, maxEntries: 250 },
              networkTimeoutSeconds: 3,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ request }) =>
              ['style', 'script', 'worker'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'autoops-static',
              expiration: { maxAgeSeconds: sevenDays, maxEntries: 100 },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'autoops-images',
              expiration: { maxAgeSeconds: sevenDays, maxEntries: 120 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5001,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\//, '?action='),
      },
    },
  },
  preview: {
    port: 4180,
    strictPort: true,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-icons': ['lucide-react'],
          'vendor-sentry': ['@sentry/react', '@sentry/browser'],
          'vendor-charts': ['recharts'],
          'vendor-ui': ['framer-motion', '@radix-ui/react-avatar', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-progress'],
          'vendor-utils': ['zod', '@tanstack/react-query', 'date-fns', 'i18next'],
        },
      },
    },
  },
})
