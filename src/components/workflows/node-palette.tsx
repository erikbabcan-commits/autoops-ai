import { connectorTemplates } from '@/lib/action-graph/connectors';
import { Badge } from '@/components/ui/badge';

export function NodePalette() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
      {connectorTemplates.map((template) => (
        <div
          key={`${template.connector}-${template.label}`}
          draggable
          onDragStart={(event) => {
            event.dataTransfer.setData('application/autoops-node', JSON.stringify(template));
            event.dataTransfer.effectAllowed = 'copy';
          }}
          className="cursor-grab rounded-3xl border border-white/10 bg-white/[0.045] p-4 transition hover:border-cyber-cyan/30 hover:bg-white/[0.07] active:cursor-grabbing"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-cyber-cyan">
              <template.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <Badge variant={template.type === 'approval' ? 'amber' : template.type === 'trigger' ? 'cyan' : 'purple'}>{template.type}</Badge>
              <p className="mt-2 font-semibold text-white">{template.label}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{template.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
