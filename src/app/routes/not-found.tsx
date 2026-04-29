import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <Card className="neon-border mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>404 · {t('common.error')}</CardTitle>
        <CardDescription>
          Táto stránka neexistuje. Pravdepodobne ju zjedol service worker alebo junior developer s
          právom mergeovať do mainu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="neon">
          <Link to="/">{t('nav.dashboard')}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

