import { Navigate, Outlet, useLocation } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/auth-store';

export function ProtectedRoute() {
  const location = useLocation();
  const session = useAuthStore((state) => state.session);
  const status = useAuthStore((state) => state.status);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="grid min-h-screen place-items-center bg-cyber-bg p-6">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
