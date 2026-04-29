import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Mail, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginSchema, type LoginInput } from '@/lib/security'
import { useAuthActions } from '@/hooks/use-auth'

export function LoginForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signIn } = useAuthActions()
  const [message, setMessage] = useState<string | null>(null)
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'autoops@larsenevans.com' },
  })

  async function onSubmit(values: LoginInput) {
    setMessage(null)
    const result = await signIn(values.email)
    if (result.provider === 'mock') {
      navigate('/', { replace: true })
      return
    }
    setMessage(t('auth.magic_link_sent'))
  }

  return (
    <Card className="neon-border w-full max-w-md">
      <CardHeader>
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan shadow-glow">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <CardTitle className="text-2xl">{t('auth.title')}</CardTitle>
        <CardDescription>{t('auth.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email_label')}</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                className="pl-10"
                placeholder={t('auth.email_placeholder')}
                {...form.register('email')}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>
          <Button
            type="submit"
            variant="neon"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t('auth.submit')}
          </Button>
          {message && (
            <p className="rounded-2xl border border-cyber-cyan/20 bg-cyber-cyan/10 p-3 text-sm leading-6 text-cyan-50">
              {message}
            </p>
          )}
          <p className="text-xs leading-5 text-muted-foreground">{t('auth.footer_note')}</p>
        </form>
      </CardContent>
    </Card>
  )
}
