import type { PressConfig } from '../types/press'
import type { Tab } from './TabBar'
import { GridCell } from './GridCell'

export const PAGE_SIZE = 24

interface Slot {
  globalIndex: number
  press: PressConfig
}

interface PressGridProps {
  presses: PressConfig[]
  tab: Tab
  page: number
  subscribed: Set<number>
  onOpen: (index: number) => void
  onSubscribe: (index: number) => void
  onUnsubscribe: (index: number) => void
}

function buildSlots(presses: PressConfig[], tab: Tab, page: number, subscribed: Set<number>): (Slot | null)[] {
  if (tab === 'sub') {
    const subscribedIndices = Array.from(subscribed)
    const pageIndices = subscribedIndices.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
    return Array.from({ length: PAGE_SIZE }, (_, i) => {
      const globalIndex = pageIndices[i]
      return globalIndex !== undefined ? { globalIndex, press: presses[globalIndex] } : null
    })
  }

  // tab === 'all'
  const start = page * PAGE_SIZE
  return presses.slice(start, start + PAGE_SIZE).map((press, i) => ({
    globalIndex: start + i,
    press,
  }))
}

export function PressGrid({ presses, tab, page, subscribed, onOpen, onSubscribe, onUnsubscribe }: PressGridProps) {
  const slots = buildSlots(presses, tab, page, subscribed)

  return (
    <div
      className="absolute top-[256px] left-[175px] w-[930px] h-[388px] bg-line border border-line grid grid-cols-6 grid-rows-4 gap-px"
    >
      {slots.map((slot, i) =>
        slot === null ? (
          <div key={i} className="bg-card" />
        ) : (
          <GridCell
            key={i}
            press={slot.press}
            isSubscribed={subscribed.has(slot.globalIndex)}
            onOpen={() => onOpen(slot.globalIndex)}
            onSubscribe={() => onSubscribe(slot.globalIndex)}
            onUnsubscribe={() => onUnsubscribe(slot.globalIndex)}
          />
        )
      )}
    </div>
  )
}
