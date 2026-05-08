import { useState, useEffect } from 'react'

const query = '(prefers-reduced-motion: reduce)'

// window.matchMedia가 서버 사이드 렌더링 환경 등에서 존재하지 않을 경우를 대비
const getInitialState = () => (typeof window === 'undefined' ? false : window.matchMedia(query).matches)

export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(getInitialState)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    
    const mediaQueryList = window.matchMedia(query)
    
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Safari < 14 에서는 addEventListener를 지원하지 않으므로 addListener 사용
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener)
    } else {
      mediaQueryList.addListener(listener)
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', listener)
      } else {
        mediaQueryList.removeListener(listener)
      }
    }
  }, [])

  return prefersReducedMotion
}
