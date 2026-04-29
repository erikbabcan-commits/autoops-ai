import { Mic, SendHorizontal } from 'lucide-react'
import { useActionState, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type State = { error?: string }

export function AgentCommandForm({ onCommand }: { onCommand: (prompt: string) => Promise<void> }) {
  const formRef = useRef<HTMLFormElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [listening, setListening] = useState(false)
  const voiceSupported = useMemo(
    () =>
      typeof window !== 'undefined' &&
      Boolean(window.SpeechRecognition || window.webkitSpeechRecognition),
    [],
  )

  const [state, submitAction, pending] = useActionState<State, FormData>(
    async (_previous, formData) => {
      const prompt = String(formData.get('prompt') ?? '').trim()
      if (prompt.length < 4)
        return { error: 'Napíš aspoň zmysluplný príkaz. Telepatia je zatiaľ v backlogu.' }
      await onCommand(prompt)
      formRef.current?.reset()
      return {}
    },
    {},
  )

  function startVoiceInput() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Recognition || listening) return

    const recognition = new Recognition()
    recognition.lang = 'sk-SK'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? ''
      if (textareaRef.current) textareaRef.current.value = transcript
    }
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    setListening(true)
    recognition.start()
  }

  return (
    <form ref={formRef} action={submitAction} className="space-y-3">
      <Textarea
        ref={textareaRef}
        name="prompt"
        placeholder="Napr. Odpíš zákazníkovi k objednávke SK-10498 a priprav Packeta tracking email…"
        className="min-h-24 resize-none"
        disabled={pending}
      />
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <div className="grid grid-cols-[auto_1fr] gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={!voiceSupported || pending || listening}
          onClick={startVoiceInput}
          aria-label="Voice input"
        >
          <Mic className={listening ? 'h-4 w-4 animate-pulse text-cyber-cyan' : 'h-4 w-4'} />
        </Button>
        <Button type="submit" variant="neon" disabled={pending}>
          <SendHorizontal className="h-4 w-4" />
          {pending ? 'Executing dry-run…' : 'Execute action'}
        </Button>
      </div>
    </form>
  )
}
