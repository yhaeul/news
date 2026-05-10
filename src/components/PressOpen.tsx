import { articles } from '../data/articles'
import type { PressConfig } from '../types/press'
import type { CategoryKey } from '../types/category'
import { PressWordmark } from './PressWordmark'
import { SubscribePill } from './SubscribePill'
import { FieldTab } from './FieldTab'

interface PressOpenProps {
  press: PressConfig
  isSubscribed: boolean
  tabKey: CategoryKey
  progress: number
  currentInTab: number
  onSubscribe: () => void
  onUnsubscribe: () => void
  onTabChange: (key: CategoryKey) => void
}

export function PressOpen({
  press,
  isSubscribed,
  tabKey,
  progress,
  currentInTab,
  onSubscribe,
  onUnsubscribe,
  onTabChange,
}: PressOpenProps) {
  const sets = articles[tabKey]
  const { headline, editTime, items } = sets[(currentInTab - 1) % sets.length]

  return (
    <div className="absolute top-[256px] left-[175px] w-[930px]">
      <FieldTab
        tabKey={tabKey}
        progress={progress}
        currentInTab={currentInTab}
        onTabChange={onTabChange}
      />
      {/* 상단 border 없음 — FieldTab 하단선이 경계 역할 */}
      <div className="bg-card border-l border-b border-r border-line h-[348px] flex flex-col px-8 py-6">
        {/* 헤드 행: 워드마크 + 편집시간 + 구독 pill */}
        <div className="flex items-center gap-4">
          <div className="scale-105 origin-left">
            <PressWordmark {...press} />
          </div>
          <span className="text-caption font-medium text-sub tabular-nums">{editTime}</span>
          <SubscribePill
            isSubscribed={isSubscribed}
            onSubscribe={onSubscribe}
            onUnsubscribe={onUnsubscribe}
          />
        </div>
        {/* 본문: 좌 340px 고정 + 우 flex-1 */}
        <div className="flex gap-6 mt-1 flex-1 min-h-0">
          {/* 좌측 컬럼 */}
          <div className="w-[340px] shrink-0 flex flex-col gap-3">
            <div className="w-full h-[188px] bg-[linear-gradient(135deg,_#EFF1F6,_#DDE3EC)] border border-line flex items-center justify-center">
              <span className="text-caption text-mute">headline image</span>
            </div>
            <p className="text-heading font-bold text-ink leading-[1.45]">{headline}</p>
          </div>
          {/* 우측 컬럼 */}
          <div className="flex-1 flex flex-col">
            <div className="flex flex-col">
              {items.map((item, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <span className="inline-block w-[3px] h-[3px] bg-ink shrink-0 [transform:translateY(-4px)]" />
                  <span className="text-list-item font-medium text-ink leading-[1.5]">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-auto text-caption font-medium text-mute">
              {press.name} 언론사에서 직접 편집한 뉴스입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
