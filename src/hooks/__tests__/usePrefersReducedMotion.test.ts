import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'

type ChangeListener = (e: { matches: boolean }) => void

function setupMatchMedia(matches: boolean) {
  const listeners: ChangeListener[] = []

  const mql = {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: vi.fn((event: string, listener: ChangeListener) => {
      if (event === 'change') listeners.push(listener)
    }),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn(() => mql),
  })

  return {
    mql,
    triggerChange: (newMatches: boolean) => {
      listeners.forEach(l => l({ matches: newMatches }))
    },
  }
}

describe('usePrefersReducedMotion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns false when matchMedia reports no motion preference', () => {
    setupMatchMedia(false)
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)
  })

  it('returns true when matchMedia reports reduce-motion preference', () => {
    setupMatchMedia(true)
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(true)
  })

  it('updates when the media query fires a change event', () => {
    const { triggerChange } = setupMatchMedia(false)
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)

    act(() => { triggerChange(true) })
    expect(result.current).toBe(true)

    act(() => { triggerChange(false) })
    expect(result.current).toBe(false)
  })

  it('removes the event listener on unmount', () => {
    const { mql } = setupMatchMedia(false)
    const { unmount } = renderHook(() => usePrefersReducedMotion())
    unmount()
    expect(mql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })
})
