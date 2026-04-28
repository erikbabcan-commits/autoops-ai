import { Bot, Cpu, Gauge, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { AgentStatus } from '@/types/domain';

export function AgentStatusCard({ status }: { status: AgentStatus }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Agent status</CardTitle>
            <CardDescription>Current autonomous runtime health.</CardDescription>
          </div>
          <Badge variant="cyan"><Bot className="mr-1 h-3 w-3" /> Fully Autonomous</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-3xl border border-cyber-cyan/20 bg-cyber-cyan/10 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyber-cyan">Current task</p>
          <p className="mt-2 font-semibold leading-6 text-white">{status.currentTask}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 2xl:grid-cols-3">
          <Metric icon={Gauge} label="Autonomy" value={`${status.autonomyScore}%`} progress={status.autonomyScore} />
          <Metric icon={Cpu} label="Uptime" value={`${status.uptimePercent}%`} progress={status.uptimePercent} />
          <Metric icon={ShieldCheck} label="Queue" value={`${status.queueDepth}`} progress={Math.min(100, status.queueDepth * 4)} />
        </div>
        <div className="space-y-2">
          {status.guardrails.map((guardrail) => (
            <div key={guardrail} className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-cyber-cyan" />
              {guardrail}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({ icon: Icon, label, value, progress }: { icon: typeof Gauge; label: string; value: string; progress: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-center justify-between">
        <Icon className="h-4 w-4 text-cyber-cyan" />
        <span className="font-bold text-white">{value}</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
      <Progress value={progress} className="mt-3" />
    </div>
  );
}
