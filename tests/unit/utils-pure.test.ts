import { describe, it, expect } from 'vitest'
import { cn, clamp, uid, safeJsonParse } from '@/lib/utils'

describe('Elite Utilities: Pure Functions', () => {
  describe('cn (class merge)', () => {
    it('should merge tailwind classes', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', false && 'hidden', 'extra')).toBe('base extra')
    })
  })

  describe('clamp', () => {
    it('should clamp value to minimum', () => {
      expect(clamp(-5, 0, 100)).toBe(0)
    })

    it('should clamp value to maximum', () => {
      expect(clamp(150, 0, 100)).toBe(100)
    })

    it('should return value when within range', () => {
      expect(clamp(50, 0, 100)).toBe(50)
    })

    it('should handle edge case where min equals max', () => {
      expect(clamp(50, 10, 10)).toBe(10)
    })
  })

  describe('uid', () => {
    it('should generate a string with the given prefix', () => {
      const id = uid('node')
      expect(id).toMatch(/^node_/)
    })

    it('should generate unique IDs', () => {
      const ids = new Set(Array.from({ length: 100 }, () => uid()))
      expect(ids.size).toBe(100)
    })
  })

  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      expect(safeJsonParse('{"a":1}', {})).toEqual({ a: 1 })
    })

    it('should return fallback for invalid JSON', () => {
      expect(safeJsonParse('not-json', 'fallback')).toBe('fallback')
    })

    it('should return fallback for null input', () => {
      expect(safeJsonParse(null, [])).toEqual([])
    })
  })
})
