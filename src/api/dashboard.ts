import { cachedMock } from '@/api/client'
import { activityFeed, agentStatus, dashboardStats, integrations } from '@/api/mock-data'

export const dashboardApi = {
  stats: () => cachedMock('autoops:dashboard:stats', () => dashboardStats),
  activity: () => cachedMock('autoops:dashboard:activity', () => activityFeed),
  agentStatus: () => cachedMock('autoops:dashboard:agent-status', () => agentStatus),
  integrationHealth: () =>
    cachedMock('autoops:dashboard:integrations', () =>
      integrations.filter((integration) => integration.connected),
    ),
}
