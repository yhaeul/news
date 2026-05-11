import { useState, useEffect, useRef } from 'react'
import { ALL_CATEGORIES } from '../types/category'
import type { CategoryKey } from '../types/category'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const TOTAL_ARTICLES = 81
const TICK_MS = 100
const TICKS_PER_CYCLE = 60 // 100ms × 60 = 6000ms

interface UseFieldTabProgressParams {
  initialTabKey: CategoryKey
  enabled: boolean
  resetKey?: unknown
}

interface UseFieldTabProgressResult {
  tabKey: CategoryKey
  progress: number
  currentInTab: number
  handleTabChange: (key: CategoryKey) => void
}

export function useFieldTabProgress({
  initialTabKey,
  enabled,
  resetKey,
}: UseFieldTabProgressParams): UseFieldTabProgressResult {
  const [tabKey, setTabKey] = useState<CategoryKey>(initialTabKey)
  const [progress, setProgress] = useState<number>(0)
  const [currentInTab, setCurrentInTab] = useState<number>(1)

  const prefersReducedMotion = usePrefersReducedMotion()
  const prefersReducedMotionRef = useRef<boolean>(prefersReducedMotion)

  useEffect(() => {
    prefersReducedMotionRef.current = prefersReducedMotion
  }, [prefersReducedMotion])

  const tabKeyRef = useRef<CategoryKey>(initialTabKey)
  const currentInTabRef = useRef<number>(1)
  const shouldResetRef = useRef<boolean>(false)

  useEffect(() => {
    if (!enabled) return

    tabKeyRef.current = initialTabKey
    currentInTabRef.current = 1
    shouldResetRef.current = false
    setTabKey(initialTabKey)
    setProgress(0)
    setCurrentInTab(1)

    let tick = 0

    const id = setInterval(() => {
      if (shouldResetRef.current) {
        shouldResetRef.current = false
        tick = 0
        return
      }

      tick++
      if (tick >= TICKS_PER_CYCLE) {
        tick = 0
        setProgress(0)
        const next = currentInTabRef.current + 1
        if (next > TOTAL_ARTICLES) {
          const idx = ALL_CATEGORIES.indexOf(tabKeyRef.current)
          const nextTab = ALL_CATEGORIES[(idx + 1) % ALL_CATEGORIES.length]
          tabKeyRef.current = nextTab
          currentInTabRef.current = 1
          setTabKey(nextTab)
          setCurrentInTab(1)
        } else {
          currentInTabRef.current = next
          setCurrentInTab(next)
        }
      } else if (!prefersReducedMotionRef.current) {
        setProgress(tick / TICKS_PER_CYCLE)
      }
    }, TICK_MS)

    return () => clearInterval(id)
  }, [initialTabKey, enabled, resetKey])

  function handleTabChange(key: CategoryKey): void {
    tabKeyRef.current = key
    currentInTabRef.current = 1
    shouldResetRef.current = true
    setTabKey(key)
    setProgress(0)
    setCurrentInTab(1)
  }

  return { tabKey, progress, currentInTab, handleTabChange }
}
