import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import type { AnalyticsPoint } from '@/types/domain';

const axisProps = {
  stroke: 'rgba(255,255,255,.35)',
  fontSize: 12,
  tickLine: false,
  axisLine: false
};

export function PerformanceCharts({ points }: { points: AnalyticsPoint[] }) {
  const totalCost = points.reduce((sum, point) => sum + point.costSaved, 0);
  const totalHours = points.reduce((sum, point) => sum + point.savedHours, 0);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="xl:col-span-2">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Time saved trend</CardTitle>
            <CardDescription>Last 14 days of autonomous operations impact.</CardDescription>
          </div>
          <div className="rounded-2xl border border-cyber-cyan/20 bg-cyber-cyan/10 px-4 py-3 text-sm text-cyan-50">
            <span className="text-muted-foreground">Total:</span> {totalHours.toFixed(1)}h saved
          </div>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="savedHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.42} />
                  <stop offset="95%" stopColor="#00f5ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
              <XAxis dataKey="date" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip contentStyle={{ background: '#0b0d19', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16 }} labelStyle={{ color: '#fff' }} />
              <Area type="monotone" dataKey="savedHours" stroke="#00f5ff" strokeWidth={2} fill="url(#savedHours)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost saved</CardTitle>
          <CardDescription>{formatCurrency(totalCost)} avoided ops cost in period.</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={points} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
              <XAxis dataKey="date" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ background: '#0b0d19', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16 }} labelStyle={{ color: '#fff' }} />
              <Bar dataKey="costSaved" fill="#a855f7" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agent accuracy</CardTitle>
          <CardDescription>Confidence-weighted task success rate.</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
              <XAxis dataKey="date" {...axisProps} />
              <YAxis domain={[80, 100]} {...axisProps} />
              <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} contentStyle={{ background: '#0b0d19', border: '1px solid rgba(255,255,255,.1)', borderRadius: 16 }} labelStyle={{ color: '#fff' }} />
              <Line type="monotone" dataKey="accuracy" stroke="#00f5ff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
