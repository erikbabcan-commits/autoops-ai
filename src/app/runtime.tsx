import { createContext, type PropsWithChildren, use } from 'react'

export interface RuntimeConfig {
  appName: string
  region: 'sk-cz'
  buildTarget: 'pwa'
  mockMode: boolean
}

const RuntimeContext = createContext<RuntimeConfig | null>(null)

export function RuntimeProvider({ children }: PropsWithChildren) {
  const runtimeConfig: RuntimeConfig = {
    appName: 'AutoOps AI',
    region: 'sk-cz',
    buildTarget: 'pwa',
    mockMode: !import.meta.env.VITE_API_BASE_URL,
  }

  return <RuntimeContext value={runtimeConfig}>{children}</RuntimeContext>
}

export function useRuntimeConfig() {
  const config = use(RuntimeContext)
  if (!config) throw new Error('RuntimeContext is missing. App shell fell off the truck.')
  return config
}
