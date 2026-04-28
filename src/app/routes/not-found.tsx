import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function NotFoundPage() {
  return (
    <Card className="mx-auto max-w-lg neon-border">
      <CardHeader>
        <CardTitle>404 · Route not found</CardTitle>
        <CardDescription>
          Táto stránka neexistuje. Pravdepodobne ju zjedol service worker alebo junior developer s právom mergeovať do mainu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="neon">
          <Link to="/">Back to dashboard</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
