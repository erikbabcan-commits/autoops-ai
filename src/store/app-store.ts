import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AgentMode } from '@/types/domain'

interface AppState {
  agentMode: AgentMode
  sidebarCollapsed: boolean
  installPromptDismissedAt?: string
  setAgentMode: (mode: AgentMode) => void
  toggleSidebar: () => void
  dismissInstallPrompt: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      agentMode: 'fully_autonomous',
      sidebarCollapsed: false,
      setAgentMode: (agentMode) => set({ agentMode }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      dismissInstallPrompt: () => set({ installPromptDismissedAt: new Date().toISOString() }),
    }),
    { name: 'autoops-app-store-v1' },
  ),
)
