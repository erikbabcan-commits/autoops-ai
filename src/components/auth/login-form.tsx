import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginInput } from '@/lib/security';
import { useAuthActions } from '@/hooks/use-auth';

export function LoginForm() {
  const navigate = useNavigate();
  const { signIn } = useAuthActions();
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'operator@autoops.local' }
  });

  async function onSubmit(values: LoginInput) {
    setMessage(null);
    const result = await signIn(values.email);
    if (result.provider === 'mock') {
      navigate('/', { replace: true });
      return;
    }
    setMessage('Magic link odoslaný. Skontroluj email a otvor odkaz. Áno, email. Ten digitálny fax, čo stále nechce zomrieť.');
  }

  return (
    <Card className="w-full max-w-md neon-border">
      <CardHeader>
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan shadow-glow">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <CardTitle className="text-2xl">Sign in to AutoOps AI</CardTitle>
        <CardDescription>Supabase magic link auth with a mock fallback for local development.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" className="pl-10" placeholder="founder@eshop.sk" {...form.register('email')} />
            </div>
            {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
          </div>
          <Button type="submit" variant="neon" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Continue with magic link
          </Button>
          {message && <p className="rounded-2xl border border-cyber-cyan/20 bg-cyber-cyan/10 p-3 text-sm leading-6 text-cyan-50">{message}</p>}
          <p className="text-xs leading-5 text-muted-foreground">
            Production note: OAuth tokens and integration secrets belong on your backend, not in Vite env vars. Putting them in the client is credential composting.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
