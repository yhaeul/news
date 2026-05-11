import { useEffect, useState } from 'react'

function getDateString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const date = String(now.getDate()).padStart(2, '0')
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  return `${year}. ${month}. ${date}. ${dayNames[now.getDay()]}`
}

export function Header() {
  const [dateString, setDateString] = useState<string>(getDateString)

  useEffect(() => {
    const now = new Date()
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()
    const id = setTimeout(() => setDateString(getDateString()), msUntilMidnight)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="absolute top-[58px] left-[175px] w-[930px] h-[29px] flex items-center justify-between">
      {/* Left: Newspaper icon + "뉴스스탠드" */}
      <div className="flex items-center gap-2">
        {/* Newspaper icon 24×24 with stroke */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 5h16v14H4z" />
          <path d="M6 7h12M6 11h12M6 15h8" />
        </svg>

        {/* "뉴스스탠드" text — display 24/700 ink */}
        <span className="text-display font-bold leading-none tracking-ko-display text-ink">
          뉴스스탠드
        </span>
      </div>

      {/* Right: Today's date — body 16/500 sub */}
      <span className="text-body font-medium tracking-ko text-sub">
        {dateString}
      </span>
    </div>
  )
}
