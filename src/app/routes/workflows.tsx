import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { workflowsApi } from '@/api/workflows'
import { ActionGraphBuilder } from '@/components/workflows/action-graph-builder'
import { Skeleton } from '@/components/ui/skeleton'

export function WorkflowsPage() {
  const { t } = useTranslation()
  const query = useQuery({ queryKey: ['workflows', 'active'], queryFn: workflowsApi.getActive })

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-cyber-cyan">{t('nav.workflows')}</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-white">{t('workflows.builder')}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {t('workflows.guardrails_desc')}
        </p>
      </div>
      {query.isPending ? (
        <Skeleton className="h-[720px] rounded-3xl" />
      ) : (
        <ActionGraphBuilder graph={query.data!} />
      )}
    </div>
  )
}

