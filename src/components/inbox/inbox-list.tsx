import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Bot, Instagram, Mail, MessageSquare, PackageCheck, ShoppingBag } from 'lucide-react'
import { inboxApi } from '@/api/inbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
import type { InboxSource, UnifiedInboxItem } from '@/types/domain'

const sourceIcons: Record<InboxSource, typeof Mail> = {
  gmail: Mail,
  shopify: ShoppingBag,
  woocommerce: PackageCheck,
  instagram: Instagram,
  support: MessageSquare,
}

const priorityVariant = {
  low: 'outline',
  medium: 'cyan',
  high: 'amber',
  critical: 'destructive',
} as const

export function InboxList({ items }: { items: UnifiedInboxItem[] }) {
  const queryClient = useQueryClient()
  const autoReply = useMutation({
    mutationFn: inboxApi.autoReply,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inbox'] }),
  })

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Unified inbox</CardTitle>
          <CardDescription>
            Gmail, Shopify orders, Instagram DMs and support tickets in one triage lane.
          </CardDescription>
        </div>
        <Badge variant="purple">AI auto-categorization</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => {
          const Icon = sourceIcons[item.source]
          return (
            <article
              key={item.id}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-cyber-cyan/30 hover:bg-white/[0.06]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-cyber-cyan">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold text-white">{item.subject}</h3>
                      <Badge variant={priorityVariant[item.priority]}>{item.priority}</Badge>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.sender} · {formatRelativeTime(item.receivedAt)} · {item.source}
                      {item.orderRef ? ` · ${item.orderRef}` : ''}
                      {item.valueEur ? ` · ${formatCurrency(item.valueEur)}` : ''}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.preview}</p>
                    {item.aiDraft && (
                      <div className="mt-3 rounded-2xl border border-cyber-cyan/20 bg-cyber-cyan/10 p-3 text-sm leading-6 text-cyan-50">
                        <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyber-cyan">
                          <Bot className="h-3.5 w-3.5" />
                          AI draft
                        </div>
                        {item.aiDraft}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 flex-row gap-2 lg:flex-col">
                  <Badge
                    variant={
                      item.status === 'needs_human'
                        ? 'amber'
                        : item.status === 'closed'
                          ? 'success'
                          : 'cyan'
                    }
                    className="justify-center"
                  >
                    {item.status.replace('_', ' ')}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={autoReply.isPending || item.status === 'closed'}
                    onClick={() => autoReply.mutate(item.id)}
                  >
                    Approve reply
                  </Button>
                </div>
              </div>
            </article>
          )
        })}
      </CardContent>
    </Card>
  )
}
