import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { AnimatePresence, motion } from 'framer-motion';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { agentApi } from '@/api/agent';
import { ActionResultCard } from '@/components/agent/action-result-card';
import { AgentCommandForm } from '@/components/agent/agent-command-form';
import { OrbAvatar } from '@/components/agent/orb-avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { agentSidebarOpenAtom } from '@/store/atoms';
import { useAuthStore } from '@/store/auth-store';
import type { AgentActionResult } from '@/types/domain';
import { useState } from 'react';

export function AgentSidebar() {
  const [open, setOpen] = useAtom(agentSidebarOpenAtom);
  const [results, setResults] = useState<AgentActionResult[]>([]);
  const session = useAuthStore((state) => state.session);

  const execute = useMutation({
    mutationFn: (prompt: string) =>
      agentApi.execute({
        prompt,
        workspaceId: session?.user.workspaceName ?? 'demo-workspace'
      }),
    onSuccess: (result) => setResults((current) => [result, ...current].slice(0, 8))
  });

  return (
    <>
      <Button
        size="icon"
        variant="neon"
        className="fixed bottom-24 right-4 z-50 lg:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Toggle AI agent"
      >
        {open ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
      </Button>
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 190, damping: 24 }}
            className="fixed inset-y-0 right-0 z-40 hidden w-[390px] border-l border-white/10 bg-cyber-bg/80 p-5 shadow-neumorph backdrop-blur-xl lg:block"
          >
            <AgentPanel results={results} onCommand={async (prompt) => { await execute.mutateAsync(prompt); }} />
          </motion.aside>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed inset-x-0 bottom-0 z-40 max-h-[82vh] rounded-t-[2rem] border border-white/10 bg-cyber-bg/95 p-4 shadow-neumorph backdrop-blur-xl lg:hidden"
          >
            <AgentPanel results={results} onCommand={async (prompt) => { await execute.mutateAsync(prompt); }} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function AgentPanel({ results, onCommand }: { results: AgentActionResult[]; onCommand: (prompt: string) => Promise<void> }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-4">
        <OrbAvatar className="shrink-0" />
        <div>
          <p className="text-lg font-black text-white">Ops Agent</p>
          <p className="text-sm text-cyber-cyan">Fully autonomous · dry-run tools</p>
        </div>
      </div>
      <p className="mt-4 rounded-3xl border border-white/10 bg-white/[0.045] p-4 text-sm leading-6 text-muted-foreground">
        I can draft emails, create invoices, book shipments and escalate risks. Dangerous operations require approval, because “YOLO accounting” is a crime scene with invoices.
      </p>
      <div className="mt-4">
        <AgentCommandForm onCommand={onCommand} />
      </div>
      <ScrollArea className="mt-5 min-h-0 flex-1 pr-2">
        <div className="space-y-3">
          {results.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 p-5 text-sm leading-6 text-muted-foreground">
              No actions yet. Ask the agent to process an order, reply to a customer or create a SuperFaktúra invoice.
            </div>
          ) : (
            results.map((result) => <ActionResultCard key={result.id} result={result} />)
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
