import { tickerData } from '../data/ticker'
import type { TickerItem } from '../data/ticker'

function TickerLaneItem({ item }: { item: TickerItem }) {
  return (
    <div className="flex-1 flex items-center gap-4 overflow-hidden">
      <span className="font-bold text-ink flex-shrink-0">{item.press}</span>
      <span className="text-sub truncate whitespace-nowrap">{item.title}</span>
    </div>
  )
}

export function Ticker() {
  // 각 레인의 첫 번째 아이템을 정적으로 표시
  const leftItem = tickerData.leftLane[0]
  const rightItem = tickerData.rightLane[0]

  return (
    <div className="absolute top-[127px] left-[175px] w-[930px] h-[49px] bg-soft flex items-center gap-8 px-4 rounded-sm">
      <TickerLaneItem item={leftItem} />
      <TickerLaneItem item={rightItem} />
    </div>
  )
}
