import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OrbAvatar({ className }: { className?: string }) {
  return (
    <div className={cn('relative grid h-20 w-20 place-items-center', className)}>
      <div className="absolute inset-0 rounded-full bg-cyber-cyan/25 blur-2xl" />
      <div className="absolute inset-1 animate-orbit rounded-full border border-dashed border-cyber-purple/50" />
      <div className="absolute inset-3 rounded-full border border-cyber-cyan/40 bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 shadow-glow" />
      <div className="relative grid h-12 w-12 place-items-center rounded-full bg-cyber-bg text-cyber-cyan">
        <Bot className="h-6 w-6" />
      </div>
    </div>
  );
}
