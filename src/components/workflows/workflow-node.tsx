import type { PointerEvent } from 'react';
import { Bot, FileText, Instagram, Mail, PackageCheck, ShoppingBag, Truck, Workflow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { WorkflowConnector, WorkflowNode } from '@/types/domain';

const icons: Record<WorkflowConnector, typeof Mail> = {
  gmail: Mail,
  shopify: ShoppingBag,
  woocommerce: ShoppingBag,
  superfaktura: FileText,
  idoklad: FileText,
  packeta: PackageCheck,
  gls: Truck,
  instagram: Instagram,
  agent: Bot
};

const statusVariant = {
  idle: 'outline',
  running: 'cyan',
  success: 'success',
  warning: 'amber'
} as const;

export function WorkflowNodeCard({ node, selected, onPointerDown }: { node: WorkflowNode; selected?: boolean; onPointerDown?: (event: PointerEvent<HTMLDivElement>) => void }) {
  const Icon = icons[node.connector] ?? Workflow;

  return (
    <div
      onPointerDown={onPointerDown}
      className={cn(
        'absolute w-64 cursor-grab rounded-3xl border border-white/10 bg-cyber-panel/90 p-4 shadow-neumorph backdrop-blur-xl transition active:cursor-grabbing',
        selected && 'border-cyber-cyan/60 shadow-glow'
      )}
      style={{ left: node.x, top: node.y }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-cyber-cyan">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusVariant[node.status]}>{node.status}</Badge>
            <Badge variant="outline">{node.type}</Badge>
          </div>
          <h3 className="mt-2 line-clamp-2 font-semibold text-white">{node.label}</h3>
        </div>
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{node.description}</p>
    </div>
  );
}
