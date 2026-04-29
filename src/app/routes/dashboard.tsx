import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { dashboardApi } from '@/api/dashboard'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { AgentStatusCard } from '@/components/dashboard/agent-status-card'
import { HeroSavingsCard } from '@/components/dashboard/hero-savings-card'
import { IntegrationHealth } from '@/components/dashboard/integration-health'
import { QuickStats } from '@/components/dashboard/quick-stats'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardPage() {
  const { t } = useTranslation()
  const statsQuery = useQuery({ queryKey: ['dashboard', 'stats'], queryFn: dashboardApi.stats })
  const activityQuery = useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: dashboardApi.activity,
  })
  const agentQuery = useQuery({
    queryKey: ['dashboard', 'agent-status'],
    queryFn: dashboardApi.agentStatus,
  })
  const integrationsQuery = useQuery({
    queryKey: ['dashboard', 'integration-health'],
    queryFn: dashboardApi.integrationHealth,
  })

  if (
    statsQuery.isPending ||
    activityQuery.isPending ||
    agentQuery.isPending ||
    integrationsQuery.isPending
  ) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-80 rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-3xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!statsQuery.data || !activityQuery.data || !agentQuery.data || !integrationsQuery.data) {
    return <Skeleton className="h-80 rounded-3xl" />
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 2xl:grid-cols-[1fr_460px]">
        <HeroSavingsCard stats={statsQuery.data} />
        <AgentStatusCard status={agentQuery.data} />
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">{t('dashboard.quick_stats')}</h2>
      </div>
      <QuickStats stats={statsQuery.data} />
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <ActivityFeed items={activityQuery.data} />
        <IntegrationHealth integrations={integrationsQuery.data} />
      </div>
    </div>
  )
}
