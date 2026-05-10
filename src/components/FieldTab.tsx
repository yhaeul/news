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
    <div className="w-full h-[40px] bg-soft border border-line flex">
      {ALL_CATEGORIES.map((cat, i) => {
        const isActive = cat === tabKey
        const isLast = i === ALL_CATEGORIES.length - 1
        return (
          <button
            key={cat}
            onClick={() => onTabChange(cat)}
            className={cn(
              'relative flex-1 flex items-center px-4 overflow-hidden focus:outline-none',
              !isLast && 'border-r border-line',
              isActive && 'bg-accent',
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
                'relative z-10 text-list-item',
                isActive ? 'font-bold text-white' : 'font-medium text-sub',
              )}
            >
              {cat}
            </span>
            {isActive && (
              <span className="relative z-10 ml-auto font-mono font-medium text-mono-tab tabular-nums">
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
