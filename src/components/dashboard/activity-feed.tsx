import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Mail,
  PackageCheck,
  ReceiptText,
  ShoppingCart,
  Workflow,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
import type { ActivityItem, ActivityStatus, ActivityType } from '@/types/domain'

const icons: Record<ActivityType, typeof Mail> = {
  email: Mail,
  invoice: ReceiptText,
  shipping: PackageCheck,
  order: ShoppingCart,
  workflow: Workflow,
  risk: AlertTriangle,
}

const statusVariant: Record<ActivityStatus, 'success' | 'amber' | 'destructive' | 'cyan'> = {
  done: 'success',
  pending: 'amber',
  needs_review: 'amber',
  failed: 'destructive',
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live activity feed</CardTitle>
        <CardDescription>Autonomous work log with confidence and audit hints.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => {
          const Icon = icons[item.type]
          return (
            <div
              key={item.id}
              className="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-4 transition hover:bg-white/[0.06]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-cyber-cyan">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <Badge variant={statusVariant[item.status]}>
                    {item.status.replace('_', ' ')}
                  </Badge>
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" /> {formatRelativeTime(item.createdAt)}
                  </span>
                  <span>{item.source}</span>
                  <span>{item.confidence}% confidence</span>
                  {item.moneyImpactEur ? (
                    <span className="text-cyber-cyan">
                      {formatCurrency(item.moneyImpactEur)} impact
                    </span>
                  ) : null}
                </div>
              </div>
              {item.status === 'done' && (
                <CheckCircle2 className="mt-1 hidden h-5 w-5 text-emerald-300 sm:block" />
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
