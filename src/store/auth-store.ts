import { create } from 'zustand';
import type { AuthSession } from '@/types/domain';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'anonymous';

interface AuthState {
  session: AuthSession | null;
  status: AuthStatus;
  setSession: (session: AuthSession | null) => void;
  setStatus: (status: AuthStatus) => void;
  logoutLocal: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  status: 'idle',
  setSession: (session) => set({ session, status: session ? 'authenticated' : 'anonymous' }),
  setStatus: (status) => set({ status }),
  logoutLocal: () => set({ session: null, status: 'anonymous' })
}));
