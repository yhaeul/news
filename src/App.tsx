import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { Ticker } from './components/Ticker'
import { TabBar, type Tab, type Viewer } from './components/TabBar'
import { PressGrid } from './components/PressGrid'
import { presses } from './data/presses'

const TOTAL_PAGES = 3

function App() {
  const [scale, setScale] = useState<number>(1)
  const [tab, setTab] = useState<Tab>('all')
  const [viewer, setViewer] = useState<Viewer>('grid')
  const [page, setPage] = useState<number>(0)

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
          subCount={0}
          viewer={viewer}
          onTabChange={handleTabChange}
          onViewerChange={setViewer}
        />
        {/* PressGrid — y:256, 930×388 */}
        <PressGrid
          presses={presses}
          tab={tab}
          page={page}
          onOpen={() => {}}
        />
        {/* Chevron left — x:103, y:430, 24×40 */}
        <button
          aria-label="이전 페이지"
          disabled={!showLeft}
          onClick={() => setPage(p => p - 1)}
          className="absolute top-[430px] left-[103px] w-[24px] h-[40px] bg-line"
          style={{ opacity: showLeft ? 1 : 0 }}
        />
        {/* Chevron right — x:1153, y:430 */}
        <button
          aria-label="다음 페이지"
          disabled={!showRight}
          onClick={() => setPage(p => p + 1)}
          className="absolute top-[430px] left-[1153px] w-[24px] h-[40px] bg-line"
          style={{ opacity: showRight ? 1 : 0 }}
        />
      </div>
    </div>
  )
}

export default App
