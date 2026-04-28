import { cachedMock, sleep } from '@/api/client';
import { workflowGraph } from '@/api/mock-data';
import type { WorkflowGraph } from '@/types/domain';

let mutableGraph: WorkflowGraph = workflowGraph;

export const workflowsApi = {
  getActive: () => cachedMock('autoops:workflows:active', () => mutableGraph),
  async save(graph: WorkflowGraph) {
    await sleep(520);
    mutableGraph = { ...graph, updatedAt: new Date().toISOString() };
    localStorage.setItem('autoops:workflows:active', JSON.stringify({ value: mutableGraph, savedAt: Date.now() }));
    return mutableGraph;
  }
};
