import { createBrowserRouter } from 'react-router';
import { AppShell } from '@/components/layout/app-shell';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { RouteErrorBoundary } from '@/components/layout/route-error-boundary';

export const router = createBrowserRouter([
  {
    path: '/login',
    lazy: async () => ({ Component: (await import('@/app/routes/login')).LoginPage }),
    ErrorBoundary: RouteErrorBoundary
  },
  {
    path: '/auth/callback',
    lazy: async () => ({ Component: (await import('@/app/routes/auth-callback')).AuthCallbackPage }),
    ErrorBoundary: RouteErrorBoundary
  },
  {
    element: <ProtectedRoute />,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, lazy: async () => ({ Component: (await import('@/app/routes/dashboard')).DashboardPage }) },
          { path: 'workflows', lazy: async () => ({ Component: (await import('@/app/routes/workflows')).WorkflowsPage }) },
          { path: 'inbox', lazy: async () => ({ Component: (await import('@/app/routes/inbox')).InboxPage }) },
          { path: 'analytics', lazy: async () => ({ Component: (await import('@/app/routes/analytics')).AnalyticsPage }) },
          { path: 'integrations', lazy: async () => ({ Component: (await import('@/app/routes/integrations')).IntegrationsPage }) },
          { path: '*', lazy: async () => ({ Component: (await import('@/app/routes/not-found')).NotFoundPage }) }
        ]
      }
    ]
  }
]);
