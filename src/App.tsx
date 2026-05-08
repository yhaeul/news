import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { Ticker } from './components/Ticker'
import { TabBar, type Tab, type Viewer } from './components/TabBar'
import { PressGrid } from './components/PressGrid'
import { Chevron } from './components/Chevron'
import { presses } from './data/presses'

const TOTAL_PAGES = 3

function App() {
  const [scale, setScale] = useState<number>(1)
  const [tab, setTab] = useState<Tab>('all')
  const [viewer, setViewer] = useState<Viewer>('grid')
  const [page, setPage] = useState<number>(0)
  const [opened, setOpened] = useState<number | null>(null)
  const [subscribed, setSubscribed] = useState<Set<number>>(new Set())

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

  const showLeft = page > 0
  const showRight = page < TOTAL_PAGES - 1

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
        {/* PressGrid — y:256, 930×388 / opened 시 PressOpen으로 대체 예정 */}
        {opened === null && (
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
          <Chevron direction="left" visible={showLeft} onClick={() => setPage(p => p - 1)} />
        </div>
        {/* Chevron right — x:1153, y:430 */}
        <div className="absolute top-[430px] left-[1153px]">
          <Chevron direction="right" visible={showRight} onClick={() => setPage(p => p + 1)} />
        </div>
      </div>
    </div>
  )
}

export default App
