import { useState, useEffect } from 'react'

interface UseTickerRotationParams {
  totalItems: number
  intervalMs?: number
  initialDelayMs?: number
}

export function useTickerRotation({
  totalItems,
  intervalMs = 3200,
  initialDelayMs = 0,
}: UseTickerRotationParams): number {
  const [index, setIndex] = useState(0)

  useEffect(() => {
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
  }, [totalItems, intervalMs, initialDelayMs])

  return index
}
