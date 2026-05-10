import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('../usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: vi.fn(() => false),
}))

import { useTickerRotation } from '../useTickerRotation'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'

describe('useTickerRotation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.mocked(usePrefersReducedMotion).mockReturnValue(false)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts at index 0', () => {
    const { result } = renderHook(() =>
      useTickerRotation({ totalItems: 5 })
    )
    expect(result.current).toBe(0)
  })

  it('advances to next index after interval', () => {
    const { result } = renderHook(() =>
      useTickerRotation({ totalItems: 5, intervalMs: 1000, initialDelayMs: 0 })
    )
    act(() => { vi.advanceTimersByTime(1000) })
    expect(result.current).toBe(1)
  })

  it('wraps back to 0 after reaching totalItems', () => {
    const { result } = renderHook(() =>
      useTickerRotation({ totalItems: 3, intervalMs: 1000, initialDelayMs: 0 })
    )
    // 3 advances: 0 → 1 → 2 → 0
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current).toBe(0)
  })

  it('respects initialDelayMs before starting rotation', () => {
    const { result } = renderHook(() =>
      useTickerRotation({ totalItems: 5, intervalMs: 1000, initialDelayMs: 2000 })
    )
    act(() => { vi.advanceTimersByTime(2500) }) // past delay, but only 500ms into first interval
    expect(result.current).toBe(0) // not yet advanced

    act(() => { vi.advanceTimersByTime(500) }) // completes first interval
    expect(result.current).toBe(1)
  })

  it('does not advance when isPaused', () => {
    const { result } = renderHook(() =>
      useTickerRotation({ totalItems: 5, isPaused: true, intervalMs: 1000 })
    )
    act(() => { vi.advanceTimersByTime(10000) })
    expect(result.current).toBe(0)
  })

  it('does not advance when prefersReducedMotion is true', () => {
    vi.mocked(usePrefersReducedMotion).mockReturnValue(true)
    const { result } = renderHook(() =>
      useTickerRotation({ totalItems: 5, intervalMs: 1000 })
    )
    act(() => { vi.advanceTimersByTime(10000) })
    expect(result.current).toBe(0)
  })
})
