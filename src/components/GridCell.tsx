import type { PressWordmarkConfig } from '../types/press'
import { PressWordmark } from './PressWordmark'
import { SubscribePill } from './SubscribePill'

interface GridCellProps {
  press: PressWordmarkConfig
  isSubscribed: boolean
  onOpen: () => void
  onSubscribe: () => void
  onUnsubscribe: () => void
}

export function GridCell({ press, isSubscribed, onOpen, onSubscribe, onUnsubscribe }: GridCellProps) {
  return (
    <button
      onClick={onOpen}
      className="group relative w-full h-full bg-card flex items-center justify-center focus:outline-none"
      style={{ cursor: 'pointer' }}
    >
      {/* 기본 상태: 워드마크 */}
      <div className="group-hover:invisible group-focus-visible:invisible">
        <PressWordmark {...press} />
      </div>

      {/* hover/focus-visible 상태: pill */}
      <div className="absolute inset-0 bg-soft invisible group-hover:visible group-focus-visible:visible flex items-center justify-center">
        <SubscribePill
          isSubscribed={isSubscribed}
          onSubscribe={onSubscribe}
          onUnsubscribe={onUnsubscribe}
        />
      </div>
    </button>
  )
}
