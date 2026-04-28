import { useCallback, useEffect } from 'react';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/auth-store';

export function useSessionBootstrap() {
  const setSession = useAuthStore((state) => state.setSession);
  const setStatus = useAuthStore((state) => state.setStatus);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    authApi
      .getSession()
      .then((session) => {
        if (!cancelled) setSession(session);
      })
      .catch(() => {
        if (!cancelled) setSession(null);
      });

    return () => {
      cancelled = true;
    };
  }, [setSession, setStatus]);
}

export function useAuthActions() {
  const setSession = useAuthStore((state) => state.setSession);

  const signIn = useCallback(
    async (email: string) => {
      const result = await authApi.signInWithMagicLink(email);
      if (result.session) setSession(result.session);
      return result;
    },
    [setSession]
  );

  const signOut = useCallback(async () => {
    await authApi.signOut();
    setSession(null);
  }, [setSession]);

  return { signIn, signOut };
}
