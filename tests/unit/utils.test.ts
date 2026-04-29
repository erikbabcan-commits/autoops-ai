import { describe, it, expect, vi } from 'vitest'
import { formatCurrency, formatNumber, formatRelativeTime } from '@/lib/utils'


describe('Elite Utilities: Localization Precision', () => {
  it('should format EUR in Slovak locale correctly', () => {
    const result = formatCurrency(1250)
    expect(result.replace(/\u00a0/g, ' ')).toMatch(/1 250 €/)
  })

  it('should format numbers correctly for Slovak locale', () => {
    const result = formatNumber(1250.5)
    expect(result.replace(/\u00a0/g, ' ')).toMatch(/1 250,5/)
  })

  it('should handle relative time via date-fns', () => {
    const pastDate = new Date(Date.now() - 60000) // 1 minute ago
    const result = formatRelativeTime(pastDate)
    expect(result).toMatch(/pred|minútou/i)
  })
})
