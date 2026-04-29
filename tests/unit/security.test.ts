import { describe, it, expect } from 'vitest'
import { emailSchema, loginSchema, sanitizePrompt, requiresHumanApproval } from '@/lib/security'

describe('Elite Security Module', () => {
  describe('emailSchema', () => {
    it('should accept a valid email', () => {
      expect(() => emailSchema.parse('test@example.sk')).not.toThrow()
    })

    it('should reject an invalid email', () => {
      expect(() => emailSchema.parse('not-an-email')).toThrow()
    })

    it('should reject an empty string', () => {
      expect(() => emailSchema.parse('')).toThrow()
    })
  })

  describe('loginSchema', () => {
    it('should validate a correct login input', () => {
      const result = loginSchema.safeParse({ email: 'operator@autoops.sk' })
      expect(result.success).toBe(true)
    })

    it('should reject missing email field', () => {
      const result = loginSchema.safeParse({})
      expect(result.success).toBe(false)
    })
  })

  describe('sanitizePrompt', () => {
    it('should strip HTML angle brackets', () => {
      expect(sanitizePrompt('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script')
    })

    it('should redact sensitive keywords', () => {
      expect(sanitizePrompt('my api_key is abc123')).toBe('my [redacted] is abc123')
      expect(sanitizePrompt('the secret is here')).toBe('the [redacted] is here')
      expect(sanitizePrompt('use this token now')).toBe('use this [redacted] now')
      expect(sanitizePrompt('reset password please')).toBe('reset [redacted] please')
    })

    it('should trim and truncate to 2000 chars', () => {
      const longPrompt = '  ' + 'a'.repeat(3000) + '  '
      const result = sanitizePrompt(longPrompt)
      expect(result.length).toBeLessThanOrEqual(2000)
      expect(result).not.toMatch(/^\s/)
    })
  })

  describe('requiresHumanApproval', () => {
    it('should flag refund-related prompts', () => {
      expect(requiresHumanApproval('Process a refund for order SK-123')).toBe(true)
      expect(requiresHumanApproval('Vráť peniaze zákazníkovi')).toBe(true)
      expect(requiresHumanApproval('Vytvor dobropis')).toBe(true)
    })

    it('should flag deletion/cancellation prompts', () => {
      expect(requiresHumanApproval('delete all orders')).toBe(true)
      expect(requiresHumanApproval('storno objednávky')).toBe(true)
      expect(requiresHumanApproval('cancel the shipment')).toBe(true)
    })

    it('should flag angry customer prompts', () => {
      expect(requiresHumanApproval('customer is angry')).toBe(true)
      expect(requiresHumanApproval('zákazník je nahnevaný')).toBe(true)
    })

    it('should NOT flag normal prompts', () => {
      expect(requiresHumanApproval('Create invoice for order SK-100')).toBe(false)
      expect(requiresHumanApproval('Check shipment status')).toBe(false)
      expect(requiresHumanApproval('Send tracking email')).toBe(false)
    })
  })
})
