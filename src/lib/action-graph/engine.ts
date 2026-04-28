import type { WorkflowEdge, WorkflowGraph, WorkflowNode } from '@/types/domain';

export interface GraphValidationIssue {
  level: 'warning' | 'error';
  message: string;
  nodeId?: string;
}

export function validateGraph(graph: WorkflowGraph): GraphValidationIssue[] {
  const issues: GraphValidationIssue[] = [];
  const triggerNodes = graph.nodes.filter((node) => node.type === 'trigger');
  const approvalNodes = graph.nodes.filter((node) => node.type === 'approval');

  if (triggerNodes.length === 0) {
    issues.push({ level: 'error', message: 'Workflow needs at least one trigger node.' });
  }

  if (approvalNodes.length === 0) {
    issues.push({ level: 'warning', message: 'No approval guardrail found. Brave. Also how incidents are born.' });
  }

  for (const node of graph.nodes) {
    const outgoing = graph.edges.some((edge) => edge.from === node.id);
    const incoming = graph.edges.some((edge) => edge.to === node.id);

    if (node.type !== 'trigger' && !incoming) {
      issues.push({ level: 'warning', message: `${node.label} has no incoming edge.`, nodeId: node.id });
    }

    if (node.type !== 'approval' && !outgoing) {
      issues.push({ level: 'warning', message: `${node.label} has no outgoing edge.`, nodeId: node.id });
    }
  }

  return issues;
}

export function createLinearEdges(nodes: WorkflowNode[]): WorkflowEdge[] {
  return nodes.slice(1).map((node, index) => ({
    id: `edge_${nodes[index].id}_${node.id}`,
    from: nodes[index].id,
    to: node.id
  }));
}
