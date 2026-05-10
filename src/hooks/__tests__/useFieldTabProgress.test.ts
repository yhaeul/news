import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('../usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: vi.fn(() => false),
}))

import { useFieldTabProgress } from '../useFieldTabProgress'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'
import { CATEGORY_KEY, ALL_CATEGORIES } from '../../types/category'

// Each article cycle = TICKS_PER_CYCLE(60) × TICK_MS(100ms) = 6000ms
const ONE_CYCLE = 6000

describe('useFieldTabProgress', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.mocked(usePrefersReducedMotion).mockReturnValue(false)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial state and does not start timer when disabled', () => {
    const { result } = renderHook(() =>
      useFieldTabProgress({ initialTabKey: CATEGORY_KEY.GENERAL, enabled: false })
    )
    act(() => { vi.advanceTimersByTime(ONE_CYCLE * 5) })

    expect(result.current.tabKey).toBe(CATEGORY_KEY.GENERAL)
    expect(result.current.progress).toBe(0)
    expect(result.current.currentInTab).toBe(1)
  })

  it('progress advances toward 1 over one cycle', () => {
    const { result } = renderHook(() =>
      useFieldTabProgress({ initialTabKey: CATEGORY_KEY.GENERAL, enabled: true })
    )
    act(() => { vi.advanceTimersByTime(3000) }) // half cycle (30 ticks)
    expect(result.current.progress).toBeGreaterThan(0)
    expect(result.current.progress).toBeLessThan(1)
  })

  it('increments currentInTab and resets progress after one full cycle', () => {
    const { result } = renderHook(() =>
      useFieldTabProgress({ initialTabKey: CATEGORY_KEY.GENERAL, enabled: true })
    )
    act(() => { vi.advanceTimersByTime(ONE_CYCLE) })

    expect(result.current.currentInTab).toBe(2)
    expect(result.current.progress).toBe(0)
  })

  it('advances to next category tab when articles are exhausted (currentInTab > 81)', () => {
    const { result } = renderHook(() =>
      useFieldTabProgress({ initialTabKey: CATEGORY_KEY.GENERAL, enabled: true })
    )
    // 81 cycles: articles 1→81 on cycle 80, then cycle 81 triggers tab switch
    act(() => { vi.advanceTimersByTime(81 * ONE_CYCLE) })

    expect(result.current.tabKey).toBe(CATEGORY_KEY.BROADCAST)
    expect(result.current.currentInTab).toBe(1)
  })

  it('loops back to first category when last category (지역) is exhausted', () => {
    const lastCat = ALL_CATEGORIES[ALL_CATEGORIES.length - 1]
    const { result } = renderHook(() =>
      useFieldTabProgress({ initialTabKey: lastCat, enabled: true })
    )
    act(() => { vi.advanceTimersByTime(81 * ONE_CYCLE) })

    expect(result.current.tabKey).toBe(ALL_CATEGORIES[0]) // 종합/경제
    expect(result.current.currentInTab).toBe(1)
  })

  it('handleTabChange immediately resets progress and switches tab', () => {
    const { result } = renderHook(() =>
      useFieldTabProgress({ initialTabKey: CATEGORY_KEY.GENERAL, enabled: true })
    )
    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current.progress).toBeGreaterThan(0)

    act(() => { result.current.handleTabChange(CATEGORY_KEY.IT) })

    expect(result.current.tabKey).toBe(CATEGORY_KEY.IT)
    expect(result.current.progress).toBe(0)
    expect(result.current.currentInTab).toBe(1)
  })

  it('resetKey forces re-initialization even with the same initialTabKey', () => {
    let resetKey = 0
    const { result, rerender } = renderHook(
      ({ key }: { key: number }) =>
        useFieldTabProgress({ initialTabKey: CATEGORY_KEY.GENERAL, enabled: true, resetKey: key }),
      { initialProps: { key: 0 } }
    )
    act(() => { vi.advanceTimersByTime(ONE_CYCLE * 2) }) // currentInTab → 3
    expect(result.current.currentInTab).toBe(3)

    resetKey = 1
    rerender({ key: resetKey })

    expect(result.current.currentInTab).toBe(1)
    expect(result.current.tabKey).toBe(CATEGORY_KEY.GENERAL)
  })

  it('prefersReducedMotion: progress stays 0, but articles still cycle', () => {
    vi.mocked(usePrefersReducedMotion).mockReturnValue(true)
    const { result } = renderHook(() =>
      useFieldTabProgress({ initialTabKey: CATEGORY_KEY.GENERAL, enabled: true })
    )
    act(() => { vi.advanceTimersByTime(3000) }) // partial cycle
    expect(result.current.progress).toBe(0)

    act(() => { vi.advanceTimersByTime(3000) }) // complete first cycle
    expect(result.current.currentInTab).toBe(2) // article still advanced
    expect(result.current.progress).toBe(0)    // still no progress bar
  })
})
