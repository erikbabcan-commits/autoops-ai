import { describe, it, expect } from 'vitest'
import { connectorTemplates } from '@/lib/action-graph/connectors'

describe('Elite Connector Templates', () => {
  it('should have 7 connector templates', () => {
    expect(connectorTemplates).toHaveLength(7)
  })

  it('should have at least one trigger', () => {
    const triggers = connectorTemplates.filter(c => c.type === 'trigger')
    expect(triggers.length).toBeGreaterThanOrEqual(1)
  })

  it('should have at least one approval guardrail', () => {
    const approvals = connectorTemplates.filter(c => c.type === 'approval')
    expect(approvals.length).toBeGreaterThanOrEqual(1)
  })

  it('should have unique connector IDs', () => {
    const ids = connectorTemplates.map(c => c.connector)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('every template should have required fields', () => {
    for (const tmpl of connectorTemplates) {
      expect(tmpl.connector).toBeTruthy()
      expect(tmpl.type).toBeTruthy()
      expect(tmpl.label).toBeTruthy()
      expect(tmpl.description).toBeTruthy()
      expect(tmpl.accent).toBeTruthy()
      expect(tmpl.icon).toBeDefined()
    }
  })

  it('agent connector should be an approval type', () => {
    const agent = connectorTemplates.find(c => c.connector === 'agent')
    expect(agent).toBeDefined()
    expect(agent!.type).toBe('approval')
  })
})
