import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { agentThinkingAtom, agentLastActionAtom } from '@/store/atoms'
import { useTranslation } from 'react-i18next'

export function useRealTimeSimulation() {
  const setThinking = useSetAtom(agentThinkingAtom)
  const setLastAction = useSetAtom(agentLastActionAtom)
  const { t } = useTranslation()

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // Trigger background "thinking"
        setThinking(true)
        
        const actions = [
          t('connectors.gmail.label'),
          t('connectors.shopify.label'),
          t('connectors.superfaktura.label'),
          t('connectors.packeta.label')
        ]
        
        const randomAction = actions[Math.floor(Math.random() * actions.length)]
        
        setTimeout(() => {
          setThinking(false)
          setLastAction(`${randomAction}: ${t('agent.status_active')}`)
        }, 2000)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [setThinking, setLastAction, t])
}
