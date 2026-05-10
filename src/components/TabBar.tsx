import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export type Tab = 'all' | 'sub'
export type Viewer = 'grid' | 'list'

interface TabBarProps {
  activeTab: Tab
  subCount: number
  viewer: Viewer
  onTabChange: (tab: Tab) => void
  onViewerChange: (viewer: Viewer) => void
}

function ListIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="7" r="1.5" fill="currentColor" />
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="5" cy="17" r="1.5" fill="currentColor" />
      <line x1="9" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="4" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
      <rect x="4" y="13" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="13" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function TabBar({ activeTab, subCount, viewer, onTabChange, onViewerChange }: TabBarProps) {
  return (
    <div
      role="tablist"
      className="absolute top-[208px] left-[175px] w-[930px] h-[24px] flex items-center justify-between"
    >
      {/* Left cluster: 두 탭 + 구독 수 뱃지, gap 24px */}
      <div className="flex items-center gap-6">
        <button
          role="tab"
          aria-selected={activeTab === 'all'}
          onClick={() => onTabChange('all')}
          className={cn(
            'text-[16px] leading-none tracking-[var(--tracking-ko)]',
            activeTab === 'all' ? 'font-bold text-ink' : 'font-medium text-mute',
          )}
        >
          전체 언론사
        </button>

        <div className="flex items-center gap-2">
          <button
            role="tab"
            aria-selected={activeTab === 'sub'}
            onClick={() => onTabChange('sub')}
            className={cn(
              'text-[16px] leading-none tracking-[var(--tracking-ko)]',
              activeTab === 'sub' ? 'font-bold text-ink' : 'font-medium text-mute',
            )}
          >
            내가 구독한 언론사
          </button>

          {/* 구독 수 뱃지: 20×20, r-badge, accent bg */}
          <div
            aria-label={`구독 중인 언론사 ${subCount}곳`}
            className="w-5 h-5 rounded-badge bg-accent flex items-center justify-center"
          >
            <span className="text-[12px] font-medium leading-none text-badge-ink">
              {subCount}
            </span>
          </div>
        </div>
      </div>

      {/* Right cluster: 리스트·그리드 뷰 토글, gap 8px */}
      <div className="flex items-center gap-2">
        <button
          aria-label="리스트 뷰"
          onClick={() => onViewerChange('list')}
          className={viewer === 'list' ? 'text-ink' : 'text-mute'}
        >
          <ListIcon />
        </button>
        <button
          aria-label="그리드 뷰"
          onClick={() => onViewerChange('grid')}
          className={viewer === 'grid' ? 'text-ink' : 'text-mute'}
        >
          <GridIcon />
        </button>
      </div>
    </div>
  )
}
