import { BarChart3, Inbox, LayoutDashboard, Network, PlugZap } from 'lucide-react'
import { NavLink } from 'react-router'
import { cn } from '@/lib/utils'

const items = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/workflows', label: 'Flows', icon: Network },
  { to: '/inbox', label: 'Inbox', icon: Inbox },
  { to: '/analytics', label: 'Stats', icon: BarChart3 },
  { to: '/integrations', label: 'Apps', icon: PlugZap },
]

export function MobileNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 rounded-3xl border border-white/10 bg-cyber-bg/80 p-2 shadow-neumorph backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold text-muted-foreground',
                isActive && 'bg-cyber-cyan/10 text-cyber-cyan',
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
