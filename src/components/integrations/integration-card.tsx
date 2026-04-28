import {
  CheckCircle2,
  FileText,
  Instagram,
  Mail,
  Package,
  PlugZap,
  ShoppingBag,
  Store,
  Truck,
  TriangleAlert
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, formatRelativeTime } from '@/lib/utils';
import type { Integration, IntegrationKey } from '@/types/domain';

const iconMap: Record<IntegrationKey, typeof PlugZap> = {
  shopify: ShoppingBag,
  woocommerce: Store,
  gmail: Mail,
  superfaktura: FileText,
  idoklad: FileText,
  packeta: Package,
  gls: Truck,
  instagram: Instagram,
  facebook: PlugZap,
  upgates: Store
};

type Props = {
  integration: Integration;
  connecting: boolean;
  onConnect: (id: IntegrationKey) => void;
};

export function IntegrationCard({ integration, connecting, onConnect }: Props) {
  const Icon = iconMap[integration.id];
  const healthy = integration.health === 'healthy';

  return (
    <Card className="group overflow-hidden transition hover:-translate-y-1 hover:border-cyber-cyan/30 hover:shadow-glow">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-cyber-cyan transition group-hover:scale-110">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg">{integration.name}</CardTitle>
              <CardDescription className="capitalize">{integration.category}</CardDescription>
            </div>
          </div>
          <Badge variant={integration.connected ? (healthy ? 'success' : 'amber') : 'outline'}>
            {integration.connected ? (
              healthy ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <TriangleAlert className="mr-1 h-3 w-3" />
            ) : null}
            {integration.connected ? integration.health : 'not connected'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-6 text-muted-foreground">{integration.description}</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
            <p className="text-xs text-muted-foreground">Monthly actions</p>
            <p className="mt-1 font-bold text-white">{formatNumber(integration.monthlyActions)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
            <p className="text-xs text-muted-foreground">Latency</p>
            <p className="mt-1 font-bold text-white">{integration.latencyMs || '—'}ms</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {integration.scopes.slice(0, 3).map((scope) => (
            <Badge key={scope} variant="outline">{scope}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <p className="text-xs text-muted-foreground">
            Last sync: {integration.connected ? formatRelativeTime(integration.lastSyncAt) : 'never'}
          </p>
          <Button size="sm" variant={integration.connected ? 'outline' : 'neon'} disabled={integration.connected || connecting} onClick={() => onConnect(integration.id)}>
            {integration.connected ? 'Connected' : connecting ? 'Connecting…' : 'Connect'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
