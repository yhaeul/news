import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

interface ChevronProps {
  direction: 'left' | 'right'
  visible: boolean
  onClick: () => void
}

function ChevronGlyph() {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
      <polyline
        points="1,1 7,7 1,13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Chevron({ direction, visible, onClick }: ChevronProps) {
  return (
    <button
      aria-label={direction === 'left' ? '이전 페이지' : '다음 페이지'}
      disabled={!visible}
      onClick={onClick}
      className={cn(
        'w-[24px] h-[40px] border border-line flex items-center justify-center text-mute focus:outline-none',
        visible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <span className={cn('inline-flex', direction === 'left' && '[transform:scaleX(-1)]')}>
        <ChevronGlyph />
      </span>
    </button>
  )
}
