import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { SubscribePill } from '../SubscribePill'
import { FieldTab } from '../FieldTab'
import { GridCell } from '../GridCell'
import type { PressConfig } from '../../types/press'
import { CATEGORY_KEY } from '../../types/category'

vi.mock('../PressWordmark', () => ({
  PressWordmark: () => <div aria-hidden="true" />,
}))

const press: PressConfig = {
  name: '테스트 언론사',
  color: '#000000',
  primaryCategory: CATEGORY_KEY.GENERAL,
  weight: 400,
  family: 'sans',
}

describe('접근성 — axe 자동 스캔', () => {
  it('SubscribePill(미구독): axe 위반 없음', async () => {
    const { container } = render(
      <SubscribePill isSubscribed={false} onSubscribe={vi.fn()} onUnsubscribe={vi.fn()} />
    )
    const results = await axe(container)
    expect(results.violations).toHaveLength(0)
  })

  it('SubscribePill(구독중): axe 위반 없음', async () => {
    const { container } = render(
      <SubscribePill isSubscribed={true} onSubscribe={vi.fn()} onUnsubscribe={vi.fn()} />
    )
    const results = await axe(container)
    expect(results.violations).toHaveLength(0)
  })

  it('FieldTab: axe 위반 없음', async () => {
    const { container } = render(
      <FieldTab
        tabKey={CATEGORY_KEY.GENERAL}
        progress={0.4}
        currentInTab={5}
        onTabChange={vi.fn()}
      />
    )
    const results = await axe(container)
    expect(results.violations).toHaveLength(0)
  })

  it('GridCell: axe 위반 없음', async () => {
    const { container } = render(
      <GridCell
        press={press}
        isSubscribed={false}
        onOpen={vi.fn()}
        onSubscribe={vi.fn()}
        onUnsubscribe={vi.fn()}
      />
    )
    const results = await axe(container)
    expect(results.violations).toHaveLength(0)
  })
})
