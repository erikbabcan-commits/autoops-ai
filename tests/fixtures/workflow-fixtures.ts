import type { WorkflowGraph, WorkflowNode } from '@/types/domain'

export const mockTriggerNode: WorkflowNode = {
  id: 'node_1',
  type: 'trigger',
  connector: 'gmail',
  label: 'Trigger Node',
  description: 'Test trigger',
  x: 0,
  y: 0,
  status: 'idle',
}

export const mockActionNode: WorkflowNode = {
  id: 'node_2',
  type: 'action',
  connector: 'shopify',
  label: 'Action Node',
  description: 'Test action',
  x: 100,
  y: 0,
  status: 'idle',
}

export const mockApprovalNode: WorkflowNode = {
  id: 'node_3',
  type: 'approval',
  connector: 'agent',
  label: 'Approval Node',
  description: 'Test approval',
  x: 200,
  y: 0,
  status: 'idle',
}

export const validWorkflowGraph: WorkflowGraph = {
  id: 'wf_1',
  name: 'Valid Workflow',
  description: 'A valid test workflow',
  nodes: [mockTriggerNode, mockActionNode, mockApprovalNode],
  edges: [
    { id: 'e1', from: 'node_1', to: 'node_2' },
    { id: 'e2', from: 'node_2', to: 'node_3' },
  ],
  updatedAt: new Date().toISOString(),
}

export const invalidWorkflowGraph: WorkflowGraph = {
  id: 'wf_2',
  name: 'Invalid Workflow',
  description: 'No trigger, no approval',
  nodes: [mockActionNode],
  edges: [],
  updatedAt: new Date().toISOString(),
}
