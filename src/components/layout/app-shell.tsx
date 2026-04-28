import { Outlet } from 'react-router';
import { AgentSidebar } from '@/components/agent/agent-sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { OfflineBanner } from '@/components/layout/offline-banner';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { TopBar } from '@/components/layout/top-bar';

export function AppShell() {
  return (
    <div className="min-h-screen bg-cyber-bg text-foreground">
      <OfflineBanner />
      <div className="flex min-h-screen">
        <SidebarNav />
        <div className="min-w-0 flex-1 pb-24 lg:pb-0">
          <TopBar />
          <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
        <AgentSidebar />
      </div>
      <MobileNav />
    </div>
  );
}
