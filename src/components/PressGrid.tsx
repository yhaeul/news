import type { PressWordmarkConfig } from '../types/press'
import type { Tab } from './TabBar'
import { GridCell } from './GridCell'

const PAGE_SIZE = 24

interface PressGridProps {
  presses: PressWordmarkConfig[]
  tab: Tab
  page: number
  onOpen: (index: number) => void
}

export function PressGrid({ presses, tab, page, onOpen }: PressGridProps) {
  const pageItems = presses.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div
      className="absolute top-[256px] left-[175px] w-[930px] h-[388px] bg-line border border-line"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridTemplateRows: 'repeat(4, 1fr)', gap: 1 }}
    >
      {pageItems.map((press, i) => (
        <GridCell
          key={page * PAGE_SIZE + i}
          press={press}
          tab={tab}
          onOpen={() => onOpen(page * PAGE_SIZE + i)}
        />
      ))}
    </div>
  )
}
