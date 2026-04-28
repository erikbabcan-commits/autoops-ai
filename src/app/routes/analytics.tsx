import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics';
import { PerformanceCharts } from '@/components/analytics/performance-charts';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';

export function AnalyticsPage() {
  const query = useQuery({ queryKey: ['analytics', 'points'], queryFn: analyticsApi.points });

  const points = query.data ?? [];
  const totalTasks = points.reduce((sum, point) => sum + point.handledTasks, 0);
  const totalCost = points.reduce((sum, point) => sum + point.costSaved, 0);
  const avgAccuracy = points.length ? points.reduce((sum, point) => sum + point.accuracy, 0) / points.length : 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-cyber-cyan">Analytics</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Operational intelligence</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          KPI view for saved time, cost and agent performance. Numbers are mocked, unlike most startup pitch decks which merely pretend not to be.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Handled tasks" value={totalTasks.toLocaleString('sk-SK')} />
        <Metric label="Cost saved" value={formatCurrency(totalCost)} />
        <Metric label="Avg accuracy" value={`${avgAccuracy.toFixed(1)}%`} />
      </div>

      {query.isPending ? <Skeleton className="h-[620px] rounded-3xl" /> : <PerformanceCharts points={points} />}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-3 text-3xl font-black text-white">{value}</p>
      </CardContent>
    </Card>
  );
}
