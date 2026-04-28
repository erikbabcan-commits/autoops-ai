import { useQuery } from '@tanstack/react-query';
import { workflowsApi } from '@/api/workflows';
import { ActionGraphBuilder } from '@/components/workflows/action-graph-builder';
import { Skeleton } from '@/components/ui/skeleton';

export function WorkflowsPage() {
  const query = useQuery({ queryKey: ['workflows', 'active'], queryFn: workflowsApi.getActive });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-cyber-cyan">Live Workflows</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Action Graph builder</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Visual automation for Gmail → Shopify → SuperFaktúra → Packeta/GLS. Drag nodes, save graph, then replace mocks with your real tool router.
        </p>
      </div>
      {query.isPending ? <Skeleton className="h-[720px] rounded-3xl" /> : <ActionGraphBuilder graph={query.data!} />}
    </div>
  );
}
