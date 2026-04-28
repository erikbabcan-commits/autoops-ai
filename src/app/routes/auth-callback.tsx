import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authApi } from '@/api/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/auth-store';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    authApi.completeCallback().then((session) => {
      setSession(session);
      navigate('/', { replace: true });
    });
  }, [navigate, setSession]);

  return (
    <div className="grid min-h-screen place-items-center bg-cyber-bg p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Finishing sign-in</CardTitle>
          <CardDescription>Validating magic link and loading your ops cockpit.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    </div>
  );
}
