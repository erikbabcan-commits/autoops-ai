import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  AlertCircle, 
  Clock, 
  MessageSquare, 
  Send, 
  User, 
  Bot, 
  CheckCircle2,
  Loader2,
  RefreshCcw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

interface ChatMessage {
  role: 'user' | 'ai' | 'operator'
  content: string;
  created_at: string;
}

interface Escalation {
  id: number;
  session_id: string;
  reason: string;
  customer_message: string;
  created_at: string;
  history: ChatMessage[];
}

const API_URL = '/api/admin/escalations'
const RESOLVE_URL = '/api/admin/resolve'

export function EscalationsPage() {
  const { t } = useTranslation()
  const [escalations, setEscalations] = useState<Escalation[]>([])
  const [activeChat, setActiveChat] = useState<Escalation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reply, setReply] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchEscalations = async (isInitial = false) => {
    if (isInitial) setLoading(true)
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Backend error')
      const data = await response.json()
      setEscalations(data)
      setError(null)
      
      if (activeChat) {
        const updated = data.find((e: Escalation) => e.id === activeChat.id)
        if (updated) setActiveChat(updated)
      }
    } catch (err) {
      setError(t('common.error') + ': PHP server is unreachable.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEscalations(true)
    const interval = setInterval(() => fetchEscalations(), 10000)
    return () => clearInterval(interval)
  }, [])

  const handleResolve = async () => {
    if (!activeChat || !reply.trim()) return

    setIsSubmitting(true)
    try {
      const resolvedId = activeChat.id
      setEscalations(prev => prev.filter(e => e.id !== resolvedId))
      setActiveChat(null)
      setReply('')

      await fetch(RESOLVE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          escalation_id: resolvedId,
          operator_reply: reply
        })
      })
    } catch (err) {
      console.error('Resolve failed', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading && escalations.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground animate-pulse">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 overflow-hidden">
      <div className="w-1/3 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <AlertCircle className="text-cyber-cyan h-5 w-5" />
            {t('escalations.title')}
            <Badge variant="secondary" className="ml-2 bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30">
              {escalations.length}
            </Badge>
          </h2>
          <Button variant="ghost" size="icon" onClick={() => fetchEscalations()} className="text-muted-foreground hover:text-white">
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl text-destructive text-sm">
            {error}
          </div>
        )}

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3">
            {escalations.length === 0 ? (
              <Card className="border-dashed bg-white/[0.02] border-white/10">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  {t('escalations.no_requests')}
                </CardContent>
              </Card>
            ) : (
              escalations.map((esc) => (
                <Card 
                  key={esc.id}
                  className={`cursor-pointer transition-all border-white/10 bg-white/[0.03] hover:bg-white/[0.06] ${
                    activeChat?.id === esc.id ? 'border-cyber-cyan bg-cyber-cyan/5 ring-1 ring-cyber-cyan/30' : ''
                  }`}
                  onClick={() => setActiveChat(esc)}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="font-mono text-[10px] border-white/20 text-muted-foreground">
                        {esc.session_id.substring(0, 8)}...
                      </Badge>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(esc.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <CardTitle className="text-sm mt-2 text-white">{esc.reason}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-2 italic">
                      "{esc.customer_message}"
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <Card className="flex-1 flex flex-col overflow-hidden border-white/10 bg-white/[0.02]">
            <CardHeader className="border-b border-white/10 bg-white/[0.02]">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg text-white">Detail</CardTitle>
                  <CardDescription className="text-muted-foreground">Session: {activeChat.session_id}</CardDescription>
                </div>
                <Badge className="bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/30">
                  {t('escalations.status_waiting')}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {activeChat.history.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                      <Avatar className="h-8 w-8 border border-white/10">
                        <AvatarFallback className={msg.role === 'user' ? 'bg-cyber-cyan/20 text-cyber-cyan' : 'bg-cyber-purple/20 text-cyber-purple'}>
                          {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-start' : 'items-end'}`}>
                        <div className={`p-3 rounded-2xl text-sm ${
                          msg.role === 'user' 
                            ? 'bg-white/[0.05] text-white rounded-tl-none border border-white/10' 
                            : 'bg-cyber-cyan/10 text-white rounded-tr-none border border-cyber-cyan/30'
                        }`}>
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <Separator className="my-4 bg-white/10" />
                  <div className="bg-cyber-cyan/5 border border-cyber-cyan/20 p-4 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-cyber-cyan mb-1">{t('escalations.reason')}</p>
                    <p className="text-sm font-semibold text-white">{activeChat.reason}</p>
                    <p className="text-sm mt-2 italic text-muted-foreground">"{activeChat.customer_message}"</p>
                  </div>
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-white/10 bg-white/[0.02]">
                <div className="flex gap-2">
                  <Input 
                    placeholder={t('escalations.reply_placeholder')} 
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleResolve()}
                    className="flex-1 bg-white/[0.03] border-white/10 focus:border-cyber-cyan/50"
                    disabled={isSubmitting}
                  />
                  <Button 
                    onClick={handleResolve} 
                    disabled={!reply.trim() || isSubmitting}
                    className="gap-2 bg-cyber-cyan hover:bg-cyber-cyan/80 text-black font-bold"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {t('escalations.resolve_button')}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2 text-center">
                  {t('escalations.resolve_note')}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center border rounded-3xl border-dashed border-white/10 bg-white/[0.01]">
            <MessageSquare className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
            <p className="text-muted-foreground font-medium">{t('escalations.select_detail')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
