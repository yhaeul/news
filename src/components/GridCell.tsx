import type { CSSProperties } from 'react'
import type { PressWordmarkConfig } from '../types/press'
import type { Tab } from './TabBar'
import { PressWordmark } from './PressWordmark'

interface GridCellProps {
  press: PressWordmarkConfig
  tab: Tab
  onOpen: () => void
}

function PlusIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <line x1="5" y1="1" x2="5" y2="9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

const pillStyle: CSSProperties = {
  height: 28,
  padding: '0 12px',
  borderRadius: 'var(--radius-pill)',
  backgroundColor: '#FFFFFF',
  border: '1px solid var(--color-line)',
  boxShadow: 'var(--shadow-pill)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--color-sub)',
  lineHeight: 1,
  flexShrink: 0,
}

export function GridCell({ press, tab, onOpen }: GridCellProps) {
  const isAll = tab === 'all'

  return (
    <button
      onClick={onOpen}
      className="group relative w-full h-full bg-card flex items-center justify-center focus:outline-none"
      style={{ cursor: 'pointer' }}
    >
      {/* 기본 상태: 워드마크 */}
      <div className="group-hover:invisible group-focus-within:invisible">
        <PressWordmark {...press} />
      </div>

      {/* hover/focus-within 상태: pill */}
      <div className="absolute inset-0 bg-soft invisible group-hover:visible group-focus-within:visible flex items-center justify-center">
        <span style={pillStyle}>
          {isAll ? <PlusIcon /> : <MinusIcon />}
          {isAll ? '구독하기' : '해지하기'}
        </span>
      </div>
    </button>
  )
}
