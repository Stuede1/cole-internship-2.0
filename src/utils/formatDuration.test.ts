/**
 * UNIT TESTS — formatDuration.ts
 *
 * Category: Pure function / formatting logic
 * Strategy: Test the formatDuration utility in isolation with deterministic inputs
 *           covering null, zero, typical durations, and edge cases.
 *
 * Covers:
 *  - Null input (unknown duration) → '--:--'
 *  - Zero/falsy input (pending) → 'Loading...'
 *  - Standard durations → formatted mm:ss
 *  - Single-digit seconds → zero-padded
 *  - Large durations (hour+) → correct minutes overflow
 *  - Fractional seconds → floored correctly
 */
import { formatDuration } from './formatDuration'

describe('formatDuration', () => {
  describe('null/unknown duration', () => {
    it('returns --:-- for null', () => {
      expect(formatDuration(null)).toBe('--:--')
    })
  })

  describe('zero/pending duration', () => {
    it('returns Loading... for 0', () => {
      expect(formatDuration(0)).toBe('Loading...')
    })
  })

  describe('standard formatting', () => {
    it('formats 60 seconds as 1:00', () => {
      expect(formatDuration(60)).toBe('1:00')
    })

    it('formats 90 seconds as 1:30', () => {
      expect(formatDuration(90)).toBe('1:30')
    })

    it('formats 125 seconds as 2:05', () => {
      expect(formatDuration(125)).toBe('2:05')
    })

    it('formats 3661 seconds as 61:01 (hour+)', () => {
      expect(formatDuration(3661)).toBe('61:01')
    })

    it('formats 5 seconds as 0:05', () => {
      expect(formatDuration(5)).toBe('0:05')
    })

    it('formats 59 seconds as 0:59', () => {
      expect(formatDuration(59)).toBe('0:59')
    })
  })

  describe('fractional seconds', () => {
    it('floors 65.7 to 1:05', () => {
      expect(formatDuration(65.7)).toBe('1:05')
    })

    it('floors 119.99 to 1:59', () => {
      expect(formatDuration(119.99)).toBe('1:59')
    })

    it('floors 0.5 to 0:00 which returns Loading...', () => {
      // 0.5 → Math.floor(0.5/60)=0, Math.floor(0.5%60)=0
      // But wait: !0.5 is false, so it should proceed to formatting
      expect(formatDuration(0.5)).toBe('0:00')
    })
  })

  describe('edge cases', () => {
    it('formats 1 second as 0:01', () => {
      expect(formatDuration(1)).toBe('0:01')
    })

    it('formats very large number correctly', () => {
      expect(formatDuration(7200)).toBe('120:00')
    })
  })
})
