import { cachedMock, sleep } from '@/api/client'
import { requiresHumanApproval, sanitizePrompt } from '@/lib/security'
import { uid } from '@/lib/utils'
import type { AgentActionResult, AgentCommand } from '@/types/domain'

const actionPatterns: Array<{ test: RegExp; kind: AgentActionResult['kind']; title: string }> = [
  {
    test: /invoice|fakt[uú]r|superfaktura|idoklad/i,
    kind: 'create_invoice',
    title: 'Create invoice draft',
  },
  { test: /email|mail|reply|odpoved/i, kind: 'send_email', title: 'Send customer email' },
  {
    test: /packeta|gls|shipment|label|zásiel|bal[ií]k/i,
    kind: 'book_shipping',
    title: 'Book shipment',
  },
  { test: /inbox|summar/i, kind: 'summarize_inbox', title: 'Summarize inbox' },
  { test: /customer|zákaz/i, kind: 'reply_customer', title: 'Reply to customer' },
]

function inferAction(prompt: string) {
  return (
    actionPatterns.find((pattern) => pattern.test.test(prompt)) ?? {
      kind: 'escalate_human' as const,
      title: 'Escalate to human operator',
    }
  )
}

export const agentApi = {
  async execute(command: AgentCommand): Promise<AgentActionResult> {
    await sleep(760)
    const cleanPrompt = sanitizePrompt(command.prompt)
    const inferred = inferAction(cleanPrompt)
    const approval = requiresHumanApproval(cleanPrompt)
    const confidence = approval ? 76 : inferred.kind === 'escalate_human' ? 63 : 92

    return {
      id: uid('agent_action'),
      kind: inferred.kind,
      title: inferred.title,
      summary: approval
        ? 'Action prepared but held for approval because it affects money, accounting or customer risk. Boring? Yes. Lawsuit-preventing? Also yes.'
        : `Executed mock action for: “${cleanPrompt.slice(0, 140)}”. Replace this with the real LLM tool-router when you wire the Action Graph engine.`,
      status: approval
        ? 'requires_approval'
        : inferred.kind === 'escalate_human'
          ? 'blocked'
          : 'executed',
      confidence,
      createdAt: new Date().toISOString(),
      payloadPreview: {
        workspaceId: command.workspaceId,
        sanitizedPrompt: cleanPrompt.slice(0, 180),
        dryRun: true,
        auditRequired: approval,
      },
    }
  },

  history: () => cachedMock<AgentActionResult[]>('autoops:agent:history', () => []),
}
