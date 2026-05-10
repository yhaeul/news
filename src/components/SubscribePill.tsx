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
    <button
      type="button"
      className="h-[28px] px-3 rounded-pill bg-card border border-line shadow-pill inline-flex items-center gap-1.5 text-caption font-medium text-sub leading-none shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
      onClick={handleClick}
    >
      {isSubscribed ? <MinusIcon /> : <PlusIcon />}
      {isSubscribed ? '해지하기' : '구독하기'}
    </button>
  )
}
