import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup/vitest.setup.ts',
    css: true,
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    server: {
      deps: {
        inline: ['i18next-browser-languagedetector'],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
