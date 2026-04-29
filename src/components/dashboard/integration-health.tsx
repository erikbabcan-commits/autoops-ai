import { CircleCheck, CircleDashed, CircleOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRelativeTime } from '@/lib/utils'
import type { Integration } from '@/types/domain'

const healthIcon = {
  healthy: CircleCheck,
  degraded: CircleDashed,
  offline: CircleOff,
}

const healthVariant = {
  healthy: 'success',
  degraded: 'amber',
  offline: 'destructive',
} as const

export function IntegrationHealth({ integrations }: { integrations: Integration[] }) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.integration_health')}</CardTitle>
        <CardDescription>{t('dashboard.integration_health')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {integrations.map((integration) => {
          const Icon = healthIcon[integration.health]
          return (
            <div
              key={integration.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">{integration.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {t('common.status')}: {formatRelativeTime(integration.lastSyncAt)}
                </p>
              </div>
              <Badge variant={healthVariant[integration.health]} className="shrink-0">
                <Icon className="mr-1 h-3 w-3" /> {integration.health}
              </Badge>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

