import { AlertTriangle, CheckCircle2, Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils'
import type { AgentActionResult } from '@/types/domain'

const iconMap = {
  executed: CheckCircle2,
  requires_approval: AlertTriangle,
  blocked: Lock,
}

const variantMap = {
  executed: 'success',
  requires_approval: 'amber',
  blocked: 'destructive',
} as const

export function ActionResultCard({ result }: { result: AgentActionResult }) {
  const Icon = iconMap[result.status]

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.045] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-cyber-cyan">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold text-white">{result.title}</h4>
            <Badge variant={variantMap[result.status]}>{result.status.replace('_', ' ')}</Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{result.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>{result.confidence}% confidence</span>
            <span>{formatRelativeTime(result.createdAt)}</span>
            <span>{result.kind}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
