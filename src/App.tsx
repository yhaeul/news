import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { Ticker } from './components/Ticker'
import { TabBar, type Tab, type Viewer } from './components/TabBar'
import { PressGrid, PAGE_SIZE } from './components/PressGrid'
import { PressOpen } from './components/PressOpen'
import { Chevron } from './components/Chevron'
import { presses } from './data/presses'
import { useFieldTabProgress } from './hooks/useFieldTabProgress'
import { CATEGORY_KEY } from './types/category'

const ALL_PRESS_PAGES = 3

function App() {
  const [scale, setScale] = useState<number>(1)
  const [tab, setTab] = useState<Tab>('all')
  const [viewer, setViewer] = useState<Viewer>('grid')
  const [page, setPage] = useState<number>(0)
  const [opened, setOpened] = useState<number | null>(null)
  const [subscribed, setSubscribed] = useState<Set<number>>(new Set())

  const openedPressKey = opened !== null ? presses[opened].primaryCategory : CATEGORY_KEY.GENERAL
  const { tabKey, progress, currentInTab, handleTabChange: handleFieldTabChange } = useFieldTabProgress({
    initialTabKey: openedPressKey,
    enabled: opened !== null,
    resetKey: opened,
  })

  useEffect(() => {
    const update = () =>
      setScale(Math.min(1, window.innerWidth / 1280))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  function handleTabChange(next: Tab) {
    setTab(next)
    setPage(0)
    setOpened(null)
  }

  function handleOpen(index: number) {
    setOpened(index)
  }

  function handleSubscribe(index: number) {
    setSubscribed(prev => new Set(prev).add(index))
  }

  function handleUnsubscribe(index: number) {
    setSubscribed(prev => {
      const next = new Set(prev)
      next.delete(index)
      return next
    })
  }

  const totalPages = tab === 'all'
    ? ALL_PRESS_PAGES
    : Math.max(1, Math.ceil(subscribed.size / PAGE_SIZE))

  const pressIndices = tab === 'all'
    ? presses.map((_, i) => i)
    : presses.map((_, i) => i).filter(i => subscribed.has(i))
  const openedPosition = opened !== null ? pressIndices.indexOf(opened) : -1

  const showLeft = opened !== null ? openedPosition > 0 : page > 0
  const showRight = opened !== null ? openedPosition < pressIndices.length - 1 : page < totalPages - 1

  function handleChevronLeft() {
    if (opened !== null) {
      setOpened(pressIndices[openedPosition - 1])
    } else {
      setPage(p => p - 1)
    }
  }

  function handleChevronRight() {
    if (opened !== null) {
      setOpened(pressIndices[openedPosition + 1])
    } else {
      setPage(p => p + 1)
    }
  }

  return (
    <div
      className="relative bg-page overflow-hidden"
      style={{ height: `${720 * scale}px` }}
    >
      <div
        style={{
          position: 'absolute',
          width: 1280,
          height: 720,
          left: '50%',
          transformOrigin: 'top center',
          transform: `translateX(-50%) scale(${scale})`,
        }}
      >
        {/* Header — y:58, h:29 */}
        <Header />
        {/* Ticker — y:127, h:49 */}
        <Ticker />
        {/* TabBar — y:208, h:24 */}
        <TabBar
          activeTab={tab}
          subCount={subscribed.size}
          viewer={viewer}
          onTabChange={handleTabChange}
          onViewerChange={setViewer}
        />
        {/* y:256, 930×388 — opened 시 PressOpen, 아니면 PressGrid */}
        {opened !== null ? (
          <PressOpen
            press={presses[opened]}
            isSubscribed={subscribed.has(opened)}
            tabKey={tabKey}
            progress={progress}
            currentInTab={currentInTab}
            onSubscribe={() => handleSubscribe(opened)}
            onUnsubscribe={() => handleUnsubscribe(opened)}
            onTabChange={handleFieldTabChange}
          />
        ) : (
          <PressGrid
            presses={presses}
            tab={tab}
            page={page}
            subscribed={subscribed}
            onOpen={handleOpen}
            onSubscribe={handleSubscribe}
            onUnsubscribe={handleUnsubscribe}
          />
        )}
        {/* Chevron left — x:103, y:430 */}
        <div className="absolute top-[430px] left-[103px]">
          <Chevron
            direction="left"
            visible={showLeft}
            onClick={handleChevronLeft}
            ariaLabel={opened !== null ? '이전 언론사' : '이전 페이지'}
          />
        </div>
        {/* Chevron right — x:1153, y:430 */}
        <div className="absolute top-[430px] left-[1153px]">
          <Chevron
            direction="right"
            visible={showRight}
            onClick={handleChevronRight}
            ariaLabel={opened !== null ? '다음 언론사' : '다음 페이지'}
          />
        </div>
      </div>
    </div>
  )
}

export default App
