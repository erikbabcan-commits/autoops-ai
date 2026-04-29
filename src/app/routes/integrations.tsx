import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { integrationsApi } from '@/api/integrations'
import { IntegrationsGrid } from '@/components/integrations/integrations-grid'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export function IntegrationsPage() {
  const { t } = useTranslation()
  const query = useQuery({ queryKey: ['integrations'], queryFn: integrationsApi.list })
  const connected = query.data?.filter((integration) => integration.connected).length ?? 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyber-cyan">
            {t('nav.integrations')}
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
            {t('integrations.title')}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {t('integrations.description')}
          </p>
        </div>
        <Badge variant="cyan" className="w-fit">
          {connected} {t('integrations.connected')}
        </Badge>
      </div>

      {query.isPending ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-80 rounded-3xl" />
          ))}
        </div>
      ) : (
        <IntegrationsGrid integrations={query.data ?? []} />
      )}
    </div>
  )
}

