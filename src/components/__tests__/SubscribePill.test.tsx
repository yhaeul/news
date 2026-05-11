import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SubscribePill } from '../SubscribePill'

describe('SubscribePill — callback routing', () => {
  it('calls onSubscribe when not subscribed', () => {
    const onSubscribe = vi.fn()
    render(
      <SubscribePill isSubscribed={false} onSubscribe={onSubscribe} onUnsubscribe={vi.fn()} />
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onSubscribe).toHaveBeenCalledOnce()
  })

  it('calls onUnsubscribe when already subscribed', () => {
    const onUnsubscribe = vi.fn()
    render(
      <SubscribePill isSubscribed={true} onSubscribe={vi.fn()} onUnsubscribe={onUnsubscribe} />
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onUnsubscribe).toHaveBeenCalledOnce()
  })

  it('does not bubble click to parent element', () => {
    const parentClick = vi.fn()
    render(
      <div onClick={parentClick}>
        <SubscribePill isSubscribed={false} onSubscribe={vi.fn()} onUnsubscribe={vi.fn()} />
      </div>
    )
    fireEvent.click(screen.getByRole('button'))
    expect(parentClick).not.toHaveBeenCalled()
  })
})

describe('SubscribePill — rendering', () => {
  it('shows 구독하기 when not subscribed', () => {
    render(
      <SubscribePill isSubscribed={false} onSubscribe={vi.fn()} onUnsubscribe={vi.fn()} />
    )
    expect(screen.getByText('구독하기')).toBeTruthy()
  })

  it('shows 해지하기 when subscribed', () => {
    render(
      <SubscribePill isSubscribed={true} onSubscribe={vi.fn()} onUnsubscribe={vi.fn()} />
    )
    expect(screen.getByText('해지하기')).toBeTruthy()
  })
})
