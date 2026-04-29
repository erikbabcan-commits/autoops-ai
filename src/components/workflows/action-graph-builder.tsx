import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { type DragEvent, type PointerEvent, useMemo, useRef, useState } from 'react'
import { Save, TriangleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { workflowsApi } from '@/api/workflows'
import { NodePalette } from '@/components/workflows/node-palette'
import { WorkflowNodeCard } from '@/components/workflows/workflow-node'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { validateGraph } from '@/lib/action-graph/engine'
import { uid } from '@/lib/utils'
import { selectedWorkflowNodeAtom } from '@/store/atoms'
import type { WorkflowGraph, WorkflowNode } from '@/types/domain'

export function ActionGraphBuilder({ graph }: { graph: WorkflowGraph }) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState(graph)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const setSelectedNode = useSetAtom(selectedWorkflowNodeAtom)
  const canvasRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const validation = useMemo(() => validateGraph(draft), [draft])
  const save = useMutation({
    mutationFn: workflowsApi.save,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workflows', 'active'] }),
  })

  function addNode(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    const raw = event.dataTransfer.getData('application/autoops-node')
    if (!raw || !canvasRef.current) return
    const template = JSON.parse(raw) as Pick<
      WorkflowNode,
      'type' | 'connector' | 'label' | 'description'
    >
    const rect = canvasRef.current.getBoundingClientRect()
    const node: WorkflowNode = {
      ...template,
      id: uid('node'),
      x: Math.max(20, event.clientX - rect.left - 120),
      y: Math.max(20, event.clientY - rect.top - 60),
      status: 'idle',
    }
    setDraft((current) => ({ ...current, nodes: [...current.nodes, node] }))
  }

  function startMove(node: WorkflowNode, event: PointerEvent<HTMLDivElement>) {
    const target = event.currentTarget
    target.setPointerCapture(event.pointerId)
    setDraggingId(node.id)
    setSelectedNode(node)
  }

  function moveNode(event: PointerEvent<HTMLDivElement>) {
    if (!draggingId || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    setDraft((current) => ({
      ...current,
      nodes: current.nodes.map((node) =>
        node.id === draggingId
          ? {
              ...node,
              x: Math.max(20, Math.min(event.clientX - rect.left - 128, rect.width - 280)),
              y: Math.max(20, Math.min(event.clientY - rect.top - 64, rect.height - 170)),
            }
          : node,
      ),
    }))
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <Card className="xl:sticky xl:top-24 xl:h-[calc(100vh-7rem)]">
        <CardHeader>
          <CardTitle>{t('workflows.palette')}</CardTitle>
          <CardDescription>{t('workflows.guardrails_desc')}</CardDescription>
        </CardHeader>
        <CardContent className="mobile-scrollbar max-h-[680px] overflow-auto">
          <NodePalette />
        </CardContent>
      </Card>

      <Card className="min-h-[720px]">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle>{draft.name}</CardTitle>
            <CardDescription>{draft.description}</CardDescription>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="cyan">
                {draft.nodes.length} {t('common.actions').toLowerCase()}
              </Badge>
              <Badge variant="purple">
                {draft.edges.length} {t('common.status').toLowerCase()}
              </Badge>
              {validation.length > 0 && (
                <Badge variant="amber">
                  <TriangleAlert className="mr-1 h-3 w-3" /> {validation.length}{' '}
                  {t('common.error').toLowerCase()}
                </Badge>
              )}
            </div>
          </div>
          <Button variant="neon" onClick={() => save.mutate(draft)} disabled={save.isPending}>
            <Save className="h-4 w-4" />
            {t('common.save')}
          </Button>
        </CardHeader>
        <CardContent>
          <div
            ref={canvasRef}
            onDrop={addNode}
            onDragOver={(event) => event.preventDefault()}
            onPointerMove={moveNode}
            onPointerUp={() => setDraggingId(null)}
            className="relative h-[610px] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,.14)_1px,transparent_0)] [background-size:28px_28px]"
          >
            <svg className="pointer-events-none absolute inset-0 h-full w-full">
              {draft.edges.map((edge) => {
                const from = draft.nodes.find((node) => node.id === edge.from)
                const to = draft.nodes.find((node) => node.id === edge.to)
                if (!from || !to) return null
                const x1 = from.x + 256
                const y1 = from.y + 80
                const x2 = to.x
                const y2 = to.y + 80
                return (
                  <path
                    key={edge.id}
                    d={`M ${x1} ${y1} C ${x1 + 90} ${y1}, ${x2 - 90} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke="rgba(0,245,255,.42)"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                  />
                )
              })}
            </svg>
            {draft.nodes.map((node) => (
              <WorkflowNodeCard
                key={node.id}
                node={node}
                selected={node.id === draggingId}
                onPointerDown={(event) => startMove(node, event)}
              />
            ))}
          </div>
          {validation.length > 0 && (
            <div className="mt-4 space-y-2">
              {validation.map((issue) => (
                <div
                  key={`${issue.message}-${issue.nodeId ?? 'graph'}`}
                  className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-100"
                >
                  {issue.level.toUpperCase()}: {issue.message}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

