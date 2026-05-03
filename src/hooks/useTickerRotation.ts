import { useState, useEffect } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

interface UseTickerRotationParams {
  totalItems: number
  intervalMs?: number
  initialDelayMs?: number
  isPaused?: boolean
}

export function useTickerRotation({
  totalItems,
  intervalMs = 3200,
  initialDelayMs = 0,
  isPaused = false,
}: UseTickerRotationParams): number {
  const [index, setIndex] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (isPaused || prefersReducedMotion) {
      return
    }

    const advance = () => {
      setIndex((prevIndex) => (prevIndex + 1) % totalItems)
    }

    let intervalId: number

    const startInterval = () => {
      intervalId = window.setInterval(advance, intervalMs)
    }

    const timeoutId = window.setTimeout(startInterval, initialDelayMs)

    return () => {
      window.clearTimeout(timeoutId)
      if (intervalId) {
        window.clearInterval(intervalId)
      }
    }
  }, [totalItems, intervalMs, initialDelayMs, isPaused, prefersReducedMotion])

  return index
}
