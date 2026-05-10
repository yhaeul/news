import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { PressGrid, PAGE_SIZE } from '../PressGrid'
import type { PressConfig } from '../../types/press'
import { CATEGORY_KEY } from '../../types/category'

vi.mock('../GridCell', () => ({
  GridCell: ({ onOpen }: { onOpen: () => void }) => (
    <div data-testid="grid-cell" onClick={onOpen} />
  ),
}))

const makePress = (name: string): PressConfig => ({
  name,
  color: '#000000',
  primaryCategory: CATEGORY_KEY.GENERAL,
  weight: 400,
  family: 'sans',
})

const PRESSES = Array.from({ length: 60 }, (_, i) => makePress(`Press ${i}`))

const defaultProps = {
  presses: PRESSES,
  subscribed: new Set<number>(),
  onOpen: vi.fn(),
  onSubscribe: vi.fn(),
  onUnsubscribe: vi.fn(),
}

describe('PressGrid — pagination (all tab)', () => {
  it('page 0: renders exactly PAGE_SIZE cells', () => {
    const { getAllByTestId } = render(
      <PressGrid {...defaultProps} tab="all" page={0} />
    )
    expect(getAllByTestId('grid-cell')).toHaveLength(PAGE_SIZE)
  })

  it('page 1: renders PAGE_SIZE cells with correct globalIndex', () => {
    const onOpen = vi.fn()
    const { getAllByTestId } = render(
      <PressGrid {...defaultProps} onOpen={onOpen} tab="all" page={1} />
    )
    const cells = getAllByTestId('grid-cell')
    expect(cells).toHaveLength(PAGE_SIZE)

    fireEvent.click(cells[0])
    expect(onOpen).toHaveBeenCalledWith(PAGE_SIZE) // first cell on page 1 = index 24
  })

  it('last page: renders only the remaining presses (no null padding)', () => {
    // 60 presses: pages 0-1 have 24 each, page 2 has 12
    const { getAllByTestId } = render(
      <PressGrid {...defaultProps} tab="all" page={2} />
    )
    expect(getAllByTestId('grid-cell')).toHaveLength(60 - PAGE_SIZE * 2)
  })
})

describe('PressGrid — subscription tab', () => {
  it('empty subscriptions: renders no GridCells', () => {
    const { queryAllByTestId } = render(
      <PressGrid {...defaultProps} tab="sub" page={0} subscribed={new Set()} />
    )
    expect(queryAllByTestId('grid-cell')).toHaveLength(0)
  })

  it('3 subscribed presses: renders exactly 3 GridCells', () => {
    const { getAllByTestId } = render(
      <PressGrid {...defaultProps} tab="sub" page={0} subscribed={new Set([2, 7, 15])} />
    )
    expect(getAllByTestId('grid-cell')).toHaveLength(3)
  })

  it('uses globalIndex (original press index), not position in subscription list', () => {
    const onOpen = vi.fn()
    const { getAllByTestId } = render(
      <PressGrid
        {...defaultProps}
        onOpen={onOpen}
        tab="sub"
        page={0}
        subscribed={new Set([2, 7, 15])}
      />
    )
    const cells = getAllByTestId('grid-cell')

    fireEvent.click(cells[1]) // second subscribed press = presses[7]
    expect(onOpen).toHaveBeenCalledWith(7)
  })
})
