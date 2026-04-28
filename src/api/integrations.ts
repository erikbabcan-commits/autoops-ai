import { cachedMock, sleep } from '@/api/client';
import { integrations as seedIntegrations } from '@/api/mock-data';
import type { Integration, IntegrationKey } from '@/types/domain';

let integrations: Integration[] = seedIntegrations;

export const integrationsApi = {
  list: () => cachedMock('autoops:integrations:list', () => integrations),
  async connect(id: IntegrationKey) {
    await sleep(840);
    integrations = integrations.map((integration) =>
      integration.id === id
        ? {
            ...integration,
            connected: true,
            health: 'healthy',
            lastSyncAt: new Date().toISOString(),
            monthlyActions: Math.max(integration.monthlyActions, 1),
            latencyMs: integration.latencyMs || 180
          }
        : integration
    );
    localStorage.setItem('autoops:integrations:list', JSON.stringify({ value: integrations, savedAt: Date.now() }));
    return integrations.find((integration) => integration.id === id);
  }
};
