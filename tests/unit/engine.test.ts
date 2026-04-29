import { describe, it, expect } from 'vitest'
import { validateGraph, createLinearEdges } from '@/lib/action-graph/engine'
import { validWorkflowGraph, invalidWorkflowGraph, mockTriggerNode, mockActionNode } from '../fixtures/workflow-fixtures'

describe('Workflow Engine Precision Diagnostics', () => {
  describe('validateGraph', () => {
    it('should pass a perfectly valid graph with trigger, action and approval', () => {
      const issues = validateGraph(validWorkflowGraph)
      // Only warning should be about missing incoming/outgoing for some nodes if they aren't fully linked
      // but in our valid graph they are.
      const errors = issues.filter(i => i.level === 'error')
      expect(errors).toHaveLength(0)
    })

    it('should catch critical error: Missing Trigger', () => {
      const issues = validateGraph(invalidWorkflowGraph)
      expect(issues.some(i => i.level === 'error' && i.message.includes('trigger'))).toBe(true)
    })

    it('should catch warning: Missing Approval Guardrail', () => {
      const graphWithoutApproval = {
        ...validWorkflowGraph,
        nodes: [mockTriggerNode, mockActionNode],
        edges: [{ id: 'e1', from: mockTriggerNode.id, to: mockActionNode.id }]
      }
      const issues = validateGraph(graphWithoutApproval)
      expect(issues.some(i => i.level === 'warning' && i.message.includes('approval'))).toBe(true)
    })

    it('should identify specific nodes with orphaned edges', () => {
      const orphanedGraph = {
        ...validWorkflowGraph,
        edges: [] // No edges
      }
      const issues = validateGraph(orphanedGraph)
      const actionNodeIssue = issues.find(i => i.nodeId === mockActionNode.id)
      expect(actionNodeIssue).toBeDefined()
      expect(actionNodeIssue?.message).toContain('no incoming edge')
    })
  })

  describe('createLinearEdges', () => {
    it('should correctly link a sequence of nodes', () => {
      const nodes = [mockTriggerNode, mockActionNode]
      const edges = createLinearEdges(nodes)
      expect(edges).toHaveLength(1)
      expect(edges[0].from).toBe(mockTriggerNode.id)
      expect(edges[0].to).toBe(mockActionNode.id)
    })
  })
})
