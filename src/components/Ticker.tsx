import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'
import { tickerData } from '../data/ticker'
import type { TickerItem } from '../data/ticker'
import { useTickerRotation } from '../hooks/useTickerRotation'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

// 단일 뉴스 아이템을 표시하는 순수 UI 컴포넌트
function TickerItemView({ item }: { item: TickerItem }) {
  return (
    <div className="flex-1 flex items-center gap-4 overflow-hidden">
      <span className="font-bold text-ink flex-shrink-0">{item.press}</span>
      <span className="text-sub truncate whitespace-nowrap">{item.title}</span>
    </div>
  )
}

// 한 줄의 티커(레인)를 관리하는 컴포넌트
function TickerLane({
  items,
  initialDelayMs,
  isPaused,
}: {
  items: TickerItem[]
  initialDelayMs: number
  isPaused: boolean
}) {
  const currentIndex = useTickerRotation({
    totalItems: items.length,
    initialDelayMs,
    isPaused,
  })
  const prefersReducedMotion = usePrefersReducedMotion()
  const currentItem = items[currentIndex]

  const animationClass = !prefersReducedMotion && 'animate-crossfade-in'

  return (
    <div key={currentIndex} className={cn('flex-1', animationClass)}>
      <TickerItemView item={currentItem} />
    </div>
  )
}

export function Ticker() {
  const [isPaused, setIsPaused] = useState<boolean>(false)

  return (
    <div
      className="absolute top-[127px] left-[175px] w-[930px] h-[49px] bg-soft flex items-center gap-2 px-4 overflow-hidden outline-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      tabIndex={0}
      aria-label="실시간 뉴스 티커"
    >
      <TickerLane items={tickerData.leftLane} initialDelayMs={0} isPaused={isPaused} />
      <TickerLane items={tickerData.rightLane} initialDelayMs={1600} isPaused={isPaused} />
    </div>
  )
}
