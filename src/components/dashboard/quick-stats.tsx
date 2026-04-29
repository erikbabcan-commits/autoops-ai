import { MailCheck, ReceiptText, ShoppingCart, ShieldAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { formatNumber } from '@/lib/utils'
import type { DashboardStats } from '@/types/domain'

export function QuickStats({ stats }: { stats: DashboardStats }) {
  const { t } = useTranslation()
  
  const cards = [
    {
      key: 'orders_processed',
      value: formatNumber(stats.ordersProcessed),
      icon: ShoppingCart,
      tone: 'text-cyber-cyan',
    },
    {
      key: 'emails_answered',
      value: formatNumber(stats.emailsAnswered),
      icon: MailCheck,
      tone: 'text-cyber-purple',
    },
    {
      key: 'invoices_sent',
      value: formatNumber(stats.invoicesSent),
      icon: ReceiptText,
      tone: 'text-emerald-300',
    },
    {
      key: 'risk_events',
      value: formatNumber(stats.riskEvents),
      icon: ShieldAlert,
      tone: 'text-amber-300',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.key}
          className="transition hover:-translate-y-1 hover:border-cyber-cyan/30"
        >
          <CardContent className="flex items-center gap-4 p-5">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] ${card.tone}`}
            >
              <card.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{card.value}</p>
              <p className="text-sm text-muted-foreground">{t(`dashboard.${card.key}`)}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

