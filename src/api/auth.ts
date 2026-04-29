import type { Session } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import type { AuthSession } from '@/types/domain'

const MOCK_SESSION_KEY = 'autoops:mock-session'

function mapSupabaseSession(session: Session): AuthSession {
  const email = session.user.email ?? 'operator@autoops.local'
  return {
    accessToken: session.access_token,
    provider: 'supabase',
    expiresAt: new Date((session.expires_at ?? Date.now() / 1000 + 3600) * 1000).toISOString(),
    user: {
      id: session.user.id,
      email,
      name: session.user.user_metadata?.name ?? email.split('@')[0],
      workspaceName: session.user.user_metadata?.workspaceName ?? 'AutoOps Demo Workspace',
    },
  }
}

function createMockSession(email: string): AuthSession {
  return {
    accessToken: `mock_${crypto.randomUUID()}`,
    provider: 'mock',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    user: {
      id: 'usr_demo_larsen',
      email,
      name: email.split('@')[0] || 'Larsen',
      workspaceName: 'AutoOps Demo Store SK/CZ',
    },
  }
}

export const authApi = {
  async getSession(): Promise<AuthSession | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return data.session ? mapSupabaseSession(data.session) : null
    }

    const stored = localStorage.getItem(MOCK_SESSION_KEY)
    return stored ? (JSON.parse(stored) as AuthSession) : null
  },

  async signInWithMagicLink(
    email: string,
  ): Promise<{ provider: 'supabase' | 'mock'; session?: AuthSession }> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      return { provider: 'supabase' }
    }

    const session = createMockSession(email)
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session))
    return { provider: 'mock', session }
  },

  async completeCallback(): Promise<AuthSession | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return data.session ? mapSupabaseSession(data.session) : null
    }

    return this.getSession()
  },

  async signOut() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
    }
    localStorage.removeItem(MOCK_SESSION_KEY)
  },
}
