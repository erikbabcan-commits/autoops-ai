import { Bot } from 'lucide-react'
import { Navigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { LoginForm } from '@/components/auth/login-form'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/auth-store'
import { LanguageSwitcher } from '@/components/layout/language-switcher'

export function LoginPage() {
  const { t } = useTranslation()
  const session = useAuthStore((state) => state.session)
  if (session) return <Navigate to="/" replace />

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-cyber-bg px-4 py-10 text-foreground sm:px-6 lg:grid-cols-[1fr_520px] lg:px-10">
      <div className="absolute right-6 top-6 z-50">
        <LanguageSwitcher />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-cyber-radial" />
      <section className="relative z-10 flex flex-col justify-center py-10 lg:pr-12">
        <Badge variant="cyan" className="w-fit">
          {t('auth_hero.badge')}
        </Badge>
        <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight text-white sm:text-7xl">
          {t('auth_hero.title')}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          {t('auth_hero.description')}
        </p>
        <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            ['6.8h', t('auth_hero.stats.saved_today')],
            ['184', t('auth_hero.stats.orders_processed')],
            ['94%', t('auth_hero.stats.avg_confidence')],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 shadow-neumorph backdrop-blur-xl"
            >
              <p className="text-3xl font-black text-white">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="relative z-10 flex items-center justify-center">
        <div className="absolute -top-10 right-10 hidden h-32 w-32 rounded-full border border-cyber-cyan/20 bg-cyber-cyan/10 blur-2xl lg:block" />
        <div className="mb-6 flex items-center justify-center lg:hidden">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-cyber-cyan/10 text-cyber-cyan shadow-glow">
            <Bot className="h-8 w-8" />
          </div>
        </div>
        <LoginForm />
      </section>
    </main>
  )
}
