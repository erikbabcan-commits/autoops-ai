import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuthActions } from '@/hooks/use-auth'
import { useAuthStore } from '@/store/auth-store'

// Mock Supabase to prevent actual network calls
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOtp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    },
  },
  isSupabaseConfigured: false,
}))

describe('Elite Hook Testing: useAuthActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.getState().setSession(null)
  })

  it('should handle sign-in flow correctly', async () => {
    const { result } = renderHook(() => useAuthActions())
    
    await act(async () => {
      await result.current.signIn('test@example.sk')
    })

    const state = useAuthStore.getState()
    expect(state.session).not.toBeNull()
    expect(state.session?.user.email).toBe('test@example.sk')
  })

  it('should handle sign-out and clear session', async () => {
    // Set initial session
    useAuthStore.getState().setSession({
      accessToken: 'test',
      provider: 'mock',
      expiresAt: '2025-01-01',
      user: { id: '1', email: 'test@example.sk', name: 'Test', workspaceName: 'Test' }
    })

    const { result } = renderHook(() => useAuthActions())
    
    await act(async () => {
      await result.current.signOut()
    })

    const state = useAuthStore.getState()
    expect(state.session).toBeNull()
  })
})
