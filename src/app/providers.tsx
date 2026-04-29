import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import { type PropsWithChildren, useMemo } from 'react'
import { RuntimeProvider } from '@/app/runtime'
import { useSessionBootstrap } from '@/hooks/use-auth'

function AuthBootstrap({ children }: PropsWithChildren) {
  useSessionBootstrap()
  return children
}

export function AppProviders({ children }: PropsWithChildren) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 1000 * 60 * 60 * 24 * 7,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
    [],
  )

  return (
    <RuntimeProvider>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <AuthBootstrap>{children}</AuthBootstrap>
        </QueryClientProvider>
      </JotaiProvider>
    </RuntimeProvider>
  )
}
