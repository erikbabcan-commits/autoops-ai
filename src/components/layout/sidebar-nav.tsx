import { BarChart3, Bot, Inbox, LayoutDashboard, Network, PlugZap } from 'lucide-react';
import { NavLink } from 'react-router';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/workflows', label: 'Workflows', icon: Network },
  { to: '/inbox', label: 'Inbox', icon: Inbox },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/integrations', label: 'Integrations', icon: PlugZap }
];

export function SidebarNav() {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/10 bg-cyber-bg/70 p-5 backdrop-blur-xl lg:block">
      <div className="flex h-full flex-col">
        <NavLink to="/" className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.045] p-4 shadow-neumorph">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyber-cyan/10 text-cyber-cyan shadow-glow">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-white">AutoOps AI</p>
            <p className="text-xs uppercase tracking-[0.22em] text-cyber-cyan">Q2 2026</p>
          </div>
        </NavLink>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-white/[0.06] hover:text-white',
                  isActive && 'border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan shadow-glow'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn('h-5 w-5 transition', isActive ? 'text-cyber-cyan' : 'group-hover:text-cyber-cyan')} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-3xl border border-cyber-purple/30 bg-cyber-purple/10 p-4 text-sm text-purple-100">
          <p className="font-semibold text-white">Autonomy guardrails</p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">Refunds, accounting mutations and low-confidence replies require human approval. Because prison orange is not on-brand.</p>
        </div>
      </div>
    </aside>
  );
}
