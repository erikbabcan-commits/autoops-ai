import { Bot, Download, LogOut, Moon, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAtom } from 'jotai'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuthActions } from '@/hooks/use-auth'
import { useInstallPrompt } from '@/hooks/use-install-prompt'
import { useAuthStore } from '@/store/auth-store'
import { agentThinkingAtom } from '@/store/atoms'
import { LanguageSwitcher } from './language-switcher'

export function TopBar() {
  const { t } = useTranslation()
  const [isThinking] = useAtom(agentThinkingAtom)
  const session = useAuthStore((state) => state.session)
  const { signOut } = useAuthActions()
  const { canInstall, promptInstall } = useInstallPrompt()

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-cyber-bg/65 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" className="hidden sm:inline-flex">
              <ShieldCheck className="mr-1 h-3 w-3" /> {t('dashboard.autonomous_ops')}
            </Badge>
            <Badge variant="purple" className="hidden sm:inline-flex">
              {t('dashboard.eshop_ops')}
            </Badge>
            {isThinking && (
              <Badge variant="amber" className="animate-pulse">
                <Bot className="mr-1 h-3 w-3" /> {t('agent.status_thinking')}...
              </Badge>
            )}
          </div>
          <h1 className="mt-1 truncate text-xl font-black tracking-tight text-white sm:text-2xl">
            {t('dashboard.cockpit')}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {canInstall && (
            <Button variant="neon" size="sm" onClick={promptInstall}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Install</span>
            </Button>
          )}
          <Button variant="outline" size="icon" aria-label="Dark mode locked">
            <Moon className="h-4 w-4" />
          </Button>
          <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2 sm:flex">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {session?.user.name.slice(0, 2).toUpperCase() ?? 'AI'}
              </AvatarFallback>
            </Avatar>
            <div className="max-w-40 truncate text-sm">
              <p className="truncate font-semibold text-white">
                {session?.user.workspaceName ?? 'Workspace'}
              </p>
              <p className="truncate text-xs text-muted-foreground">{session?.user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => void signOut()}
            aria-label={t('nav.logout')}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
