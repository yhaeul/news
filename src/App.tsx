import { useEffect, useState } from 'react'
import { Header } from './components/Header'

function App() {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () =>
      setScale(Math.min(1, window.innerWidth / 1280))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

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
        <div className="absolute top-[127px] left-[175px] w-[930px] h-[49px] bg-soft" />
        {/* TabBar — y:208, h:24 */}
        <div className="absolute top-[208px] left-[175px] w-[930px] h-[24px] bg-soft" />
        {/* Content — y:256, 930×388 */}
        <div className="absolute top-[256px] left-[175px] w-[930px] h-[388px] bg-soft" />
        {/* Chevron left — x:103, y:430, 24×40 */}
        <div className="absolute top-[430px] left-[103px] w-[24px] h-[40px] bg-line" />
        {/* Chevron right — x:1153, y:430 */}
        <div className="absolute top-[430px] left-[1153px] w-[24px] h-[40px] bg-line" />
      </div>
    </div>
  )
}

export default App
