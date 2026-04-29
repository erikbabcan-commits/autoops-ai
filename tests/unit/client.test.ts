import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sleep, isOffline, saveSnapshot, readSnapshot, cachedMock } from '@/api/client'

describe('Elite API Client', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('sleep', () => {
    it('should resolve after a delay', async () => {
      vi.useFakeTimers()
      const promise = sleep(100)
      vi.advanceTimersByTime(100)
      await expect(promise).resolves.toBeUndefined()
      vi.useRealTimers()
    })
  })

  describe('isOffline', () => {
    it('should return false when navigator.onLine is true', () => {
      Object.defineProperty(navigator, 'onLine', { value: true, writable: true })
      expect(isOffline()).toBe(false)
    })
  })

  describe('saveSnapshot / readSnapshot', () => {
    it('should save and read a snapshot correctly', () => {
      saveSnapshot('test-key', { name: 'AutoOps' })
      const result = readSnapshot<{ name: string }>('test-key', { name: 'fallback' })
      expect(result.name).toBe('AutoOps')
    })

    it('should return fallback when key does not exist', () => {
      const result = readSnapshot('missing-key', 'default')
      expect(result).toBe('default')
    })

    it('should return fallback when snapshot is expired', () => {
      // Manually write an old snapshot
      const old = JSON.stringify({ value: 'stale', savedAt: Date.now() - 1000 * 60 * 60 * 24 * 8 })
      localStorage.setItem('expired-key', old)
      const result = readSnapshot('expired-key', 'fresh')
      expect(result).toBe('fresh')
    })
  })

  describe('cachedMock', () => {
    it('should call producer and cache result', async () => {
      const producer = vi.fn().mockReturnValue([1, 2, 3])
      const result = await cachedMock('cache-test', producer, 0)
      expect(result).toEqual([1, 2, 3])
      expect(producer).toHaveBeenCalledOnce()

      // Second call should still call producer (not offline)
      const result2 = await cachedMock('cache-test', producer, 0)
      expect(result2).toEqual([1, 2, 3])
    })
  })
})
