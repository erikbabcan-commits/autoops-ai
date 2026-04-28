import { useMutation, useQueryClient } from '@tanstack/react-query';
import { integrationsApi } from '@/api/integrations';
import { IntegrationCard } from '@/components/integrations/integration-card';
import type { Integration } from '@/types/domain';

export function IntegrationsGrid({ integrations }: { integrations: Integration[] }) {
  const queryClient = useQueryClient();
  const connect = useMutation({
    mutationFn: integrationsApi.connect,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['integrations'] })
  });

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {integrations.map((integration) => (
        <IntegrationCard
          key={integration.id}
          integration={integration}
          connecting={connect.isPending && connect.variables === integration.id}
          onConnect={(id) => connect.mutate(id)}
        />
      ))}
    </div>
  );
}
