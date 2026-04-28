import { motion } from 'framer-motion';
import { Clock, Euro, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';
import type { DashboardStats } from '@/types/domain';

export function HeroSavingsCard({ stats }: { stats: DashboardStats }) {
  return (
    <Card className="min-h-[300px] overflow-hidden neon-border">
      <CardContent className="relative flex h-full flex-col justify-between p-6 sm:p-8">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyber-cyan/20 blur-3xl" />
        <div className="absolute bottom-0 right-8 h-40 w-40 rounded-full bg-cyber-purple/20 blur-3xl" />

        <div className="relative z-10">
          <Badge variant="cyan"><Sparkles className="mr-1 h-3 w-3" /> Live savings meter</Badge>
          <h2 className="mt-5 text-2xl font-black tracking-tight text-white sm:text-4xl">Dnes ušetrené</h2>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-end gap-3"
          >
            <span className="text-6xl font-black tracking-tighter text-white sm:text-8xl">{stats.savedHoursToday.toFixed(1)}</span>
            <span className="pb-3 text-2xl font-bold text-cyber-cyan">hodín</span>
          </motion.div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Agent spracoval objednávky, odpovedal zákazníkom, poslal faktúry a nevypýtal si pauzu na kávu. HR oddelenie práve potichu plače.
          </p>
        </div>

        <div className="relative z-10 mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4 text-cyber-cyan" /> This week</span>
              <span className="font-bold text-white">{stats.savedHoursWeek.toFixed(1)}h</span>
            </div>
            <Progress value={Math.min(100, (stats.savedHoursWeek / 40) * 100)} className="mt-3" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground"><Euro className="h-4 w-4 text-cyber-purple" /> Cost saved</span>
              <span className="font-bold text-white">{formatCurrency(stats.costSavedToday)}</span>
            </div>
            <Progress value={74} className="mt-3" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
