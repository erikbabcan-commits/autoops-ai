import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { WorkflowNodeCard } from '@/components/workflows/workflow-node'
import { mockActionNode } from '../fixtures/workflow-fixtures'
import { Provider as JotaiProvider } from 'jotai'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: any) => opts?.defaultValue ?? key,
    i18n: { language: 'sk', changeLanguage: vi.fn() },
  }),
}))

describe('Elite Component Testing: WorkflowNodeCard', () => {
  it('should render node label and description', () => {
    render(
      <JotaiProvider>
        <WorkflowNodeCard node={mockActionNode} />
      </JotaiProvider>
    )
    
    // The component renders defaultValue from t() which falls back to node.label
    expect(screen.getByText(mockActionNode.label)).toBeInTheDocument()
    expect(screen.getByText(mockActionNode.description)).toBeInTheDocument()
  })

  it('should render status and type badges', () => {
    render(
      <JotaiProvider>
        <WorkflowNodeCard node={mockActionNode} />
      </JotaiProvider>
    )
    
    // Badges render translation keys: common.status and workflows.action
    expect(screen.getByText('common.status')).toBeInTheDocument()
    expect(screen.getByText('workflows.action')).toBeInTheDocument()
  })

  it('should apply selected styling when selected prop is true', () => {
    const { container } = render(
      <JotaiProvider>
        <WorkflowNodeCard node={mockActionNode} selected />
      </JotaiProvider>
    )
    
    const card = container.firstChild as HTMLElement
    expect(card.className).toContain('border-cyber-cyan')
  })
})
