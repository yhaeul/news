import type { PressWordmarkConfig } from '../types/press'
import type { Tab } from './TabBar'
import { GridCell } from './GridCell'

const PAGE_SIZE = 24

interface PressGridProps {
  presses: PressWordmarkConfig[]
  tab: Tab
  page: number
  subscribed: Set<number>
  onOpen: (index: number) => void
  onSubscribe: (index: number) => void
  onUnsubscribe: (index: number) => void
}

export function PressGrid({ presses, page, subscribed, onOpen, onSubscribe, onUnsubscribe }: PressGridProps) {
  const pageItems = presses.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div
      className="absolute top-[256px] left-[175px] w-[930px] h-[388px] bg-line border border-line"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: 1 }}
    >
      {pageItems.map((press, i) => {
        const globalIndex = page * PAGE_SIZE + i
        const isSubscribed = subscribed.has(globalIndex)
        return (
          <GridCell
            key={globalIndex}
            press={press}
            isSubscribed={isSubscribed}
            onOpen={() => onOpen(globalIndex)}
            onSubscribe={() => onSubscribe(globalIndex)}
            onUnsubscribe={() => onUnsubscribe(globalIndex)}
          />
        )
      })}
    </div>
  )
}
