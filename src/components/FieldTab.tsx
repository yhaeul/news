import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'
import { ALL_CATEGORIES } from '../types/category'
import type { CategoryKey } from '../types/category'

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

const TOTAL_ARTICLES = 81

interface FieldTabProps {
  tabKey: CategoryKey
  progress: number
  currentInTab: number
  onTabChange: (key: CategoryKey) => void
}

export function FieldTab({ tabKey, progress, currentInTab, onTabChange }: FieldTabProps) {
  return (
    <div role="tablist" className="w-full h-[40px] bg-soft border border-line flex">
      {ALL_CATEGORIES.map((cat, i) => {
        const isActive = cat === tabKey
        const isLast = i === ALL_CATEGORIES.length - 1
        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(cat)}
            className={cn(
              'relative flex-1 flex items-center px-3 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-inset',
              !isLast && 'border-r border-line',
              isActive ? 'bg-accent focus-visible:ring-white' : 'focus-visible:ring-accent',
            )}
          >
            {isActive && (
              <div
                className="absolute inset-y-0 left-0 bg-accent-deep"
                style={{ width: `${progress * 100}%` }}
              />
            )}
            <span
              className={cn(
                'relative z-10 text-list-item whitespace-nowrap shrink-0',
                isActive ? 'font-bold text-white' : 'font-medium text-sub',
              )}
            >
              {cat}
            </span>
            {isActive && (
              <span className="relative z-10 ml-auto pl-2 shrink-0 font-mono font-medium text-mono-tab tabular-nums">
                <span className="text-white">{currentInTab}</span>
                <span className="text-white/70"> / {TOTAL_ARTICLES}</span>
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
