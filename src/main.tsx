import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import * as Sentry from '@sentry/react'
import { onLCP, onFCP, onCLS } from 'web-vitals'
import '@/app/globals.css'
import '@/app/pwa'
import '@/lib/i18n'
import { AppProviders } from '@/app/providers'
import { router } from '@/app/router'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || "",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

// Performance monitoring
if (import.meta.env.PROD) {
  onLCP(console.log)
  onFCP(console.log)
  onCLS(console.log)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
)
