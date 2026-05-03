import { tickerData } from '../data/ticker'
import type { TickerItem } from '../data/ticker'
import { useTickerRotation } from '../hooks/useTickerRotation'

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
}: {
  items: TickerItem[]
  initialDelayMs: number
}) {
  const currentIndex = useTickerRotation({
    totalItems: items.length,
    initialDelayMs,
  })
  const currentItem = items[currentIndex]

  // key를 변경하여 React가 컴포넌트를 새로 마운트하도록 함
  // 이를 통해 매번 `animate-crossfade-in` 애니메이션이 다시 실행됨
  return (
    <div key={currentIndex} className="flex-1 animate-crossfade-in">
      <TickerItemView item={currentItem} />
    </div>
  )
}

export function Ticker() {
  return (
    <div className="absolute top-[127px] left-[175px] w-[930px] h-[49px] bg-soft flex items-center gap-8 px-4 rounded-sm overflow-hidden">
      <TickerLane items={tickerData.leftLane} initialDelayMs={0} />
      <TickerLane items={tickerData.rightLane} initialDelayMs={1600} />
    </div>
  )
}
