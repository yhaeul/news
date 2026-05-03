export interface TickerItem {
  press: string
  title: string
}

interface TickerData {
  leftLane: TickerItem[]
  rightLane: TickerItem[]
}

export const tickerData: TickerData = {
  leftLane: [
    { press: '연합뉴스', title: '[속보] 도심 공원 ‘조용한 독서존’ 시범 운영… 시민 호응' },
    { press: '헤럴드경제', title: 'MZ가 꽂힌 ‘금융앱’… 토스가 와이즐리 제쳤다' },
    { press: '아이뉴스24', title: '엔비디아, MS·애플 제치고 시총 1위…새 역사 썼다' },
  ],
  rightLane: [
    { press: '한국경제', title: '중소기업 ESG 전담 인력 채용 확대… 지속 가능성 주목' },
    { press: 'SBS Biz', title: '배달앱 시장 ‘춘추전국시대’… 쿠팡이츠, 요기요 제치고 2위' },
    { press: '조선일보', title: '“北, 러에 포탄 500만발 보냈다”… 한미 정보당국 ‘촉각’' },
  ],
}
