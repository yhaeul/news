import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/react'
import { GridCell } from '../GridCell'
import type { PressConfig } from '../../types/press'
import { CATEGORY_KEY } from '../../types/category'

vi.mock('../PressWordmark', () => ({
  PressWordmark: () => <div data-testid="press-wordmark" />,
}))

const press: PressConfig = {
  name: '테스트 언론사',
  color: '#000000',
  primaryCategory: CATEGORY_KEY.GENERAL,
  weight: 400,
  family: 'sans',
}

const defaultProps = {
  press,
  isSubscribed: false,
  onOpen: vi.fn(),
  onSubscribe: vi.fn(),
  onUnsubscribe: vi.fn(),
}

describe('GridCell — keyboard delegation', () => {
  it('Enter key on the cell triggers onOpen', () => {
    const onOpen = vi.fn()
    const { container } = render(<GridCell {...defaultProps} onOpen={onOpen} />)
    const cell = container.firstChild as HTMLElement

    fireEvent.keyDown(cell, { key: 'Enter' })
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it('Space key on the cell triggers onOpen', () => {
    const onOpen = vi.fn()
    const { container } = render(<GridCell {...defaultProps} onOpen={onOpen} />)
    const cell = container.firstChild as HTMLElement

    fireEvent.keyDown(cell, { key: ' ' })
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it('Enter key on child SubscribePill does NOT trigger onOpen', () => {
    const onOpen = vi.fn()
    render(<GridCell {...defaultProps} onOpen={onOpen} />)
    const pill = screen.getByRole('button')

    fireEvent.keyDown(pill, { key: 'Enter' })
    expect(onOpen).not.toHaveBeenCalled()
  })

  it('click on the cell triggers onOpen', () => {
    const onOpen = vi.fn()
    const { container } = render(<GridCell {...defaultProps} onOpen={onOpen} />)
    const cell = container.firstChild as HTMLElement

    fireEvent.click(cell)
    expect(onOpen).toHaveBeenCalledOnce()
  })
})

describe('GridCell — accessibility', () => {
  it('has focus-visible ring class for keyboard navigation', () => {
    const { container } = render(<GridCell {...defaultProps} />)
    const cell = container.firstChild as HTMLElement
    expect(cell.className).toContain('focus-visible:ring-2')
    expect(cell.className).toContain('focus-visible:ring-accent')
  })

  it('is in the tab order (tabIndex 0)', () => {
    const { container } = render(<GridCell {...defaultProps} />)
    const cell = container.firstChild as HTMLElement
    expect(cell.tabIndex).toBe(0)
  })
})
