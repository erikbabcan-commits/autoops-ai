import { describe, it, expect, vi, beforeEach } from 'vitest'
import { integrationsApi } from '@/api/integrations'
import { integrations as mockIntegrations } from '@/api/mock-data'

describe('Elite Integration Testing: API Flow', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should fetch and correctly format integrations from mock source', async () => {
    const data = await integrationsApi.list()
    
    expect(data).toHaveLength(mockIntegrations.length)
    expect(data[0].id).toBe('shopify')
    expect(data[0].health).toBe('healthy')
  })

  it('should verify connected status logic', async () => {
    const data = await integrationsApi.list()
    const connected = data.filter(i => i.connected)
    const healthy = data.filter(i => i.health === 'healthy')
    
    // Elite check: Ensure we don't have healthy status for disconnected integrations
    const disconnectedButHealthy = data.find(i => !i.connected && i.health === 'healthy')
    expect(disconnectedButHealthy).toBeUndefined()
  })
})
