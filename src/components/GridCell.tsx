import type { PressConfig } from '../types/press'
import type { KeyboardEvent } from 'react'
import { PressWordmark } from './PressWordmark'
import { SubscribePill } from './SubscribePill'

interface GridCellProps {
  press: PressConfig
  isSubscribed: boolean
  onOpen: () => void
  onSubscribe: () => void
  onUnsubscribe: () => void
}

export function GridCell({ press, isSubscribed, onOpen, onSubscribe, onUnsubscribe }: GridCellProps) {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpen()
    }
  }

  return (
    <div
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      className="group relative w-full h-full bg-card flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset cursor-pointer"
    >
      {/* 기본 상태: 워드마크 */}
      <div className="group-hover:invisible group-focus-within:invisible">
        <PressWordmark {...press} />
      </div>

      {/* hover/focus 상태: pill */}
      <div className="absolute inset-0 bg-soft invisible group-hover:visible group-focus-within:visible flex items-center justify-center">
        <SubscribePill
          isSubscribed={isSubscribed}
          onSubscribe={onSubscribe}
          onUnsubscribe={onUnsubscribe}
        />
      </div>
    </div>
  )
}
