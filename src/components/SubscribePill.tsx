import type { CSSProperties } from 'react'

interface SubscribePillProps {
  isSubscribed: boolean
  onSubscribe: () => void
  onUnsubscribe: () => void
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
  backgroundColor: 'var(--color-card)',
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
  cursor: 'pointer',
}

export function SubscribePill({ isSubscribed, onSubscribe, onUnsubscribe }: SubscribePillProps) {
  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (isSubscribed) {
      onUnsubscribe()
    } else {
      onSubscribe()
    }
  }

  return (
    <span style={pillStyle} onClick={handleClick}>
      {isSubscribed ? <MinusIcon /> : <PlusIcon />}
      {isSubscribed ? '해지하기' : '구독하기'}
    </span>
  )
}
