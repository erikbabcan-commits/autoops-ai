import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function RouteErrorBoundary() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unknown route error'

  return (
    <div className="grid min-h-screen place-items-center bg-cyber-bg p-6">
      <Card className="neon-border max-w-xl">
        <CardHeader>
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <CardTitle>Route crashed</CardTitle>
          <CardDescription>{message}. Nie je to koniec sveta, len malá SPA sepsa.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="neon">
            <Link to="/">Back to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
