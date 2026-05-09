# 뉴스스탠드 구현 체크리스트

---

## 1주차 목표 (섹션 0 → 8 + 섹션 16 일부)

| 섹션 | 내용 | 비고 |
|---|---|---|
| 0 | 개발 환경 설정 | 프로젝트 시작 전 필수 |
| 1 | 디자인 토큰 | 이후 모든 컴포넌트의 기반 |
| 2 | 레이아웃 & 캔버스 | 고정 좌표 시스템 |
| 3 | 헤더 | 단순, 빠르게 처리 |
| 4 | 뉴스 티커 | 애니메이션 포함, 독립 컴포넌트 |
| 5 | 탭바 | 상태 연동 첫 번째 컴포넌트 |
| 6 | PressWordmark | 타이포그래픽 로고 렌더링 |
| 7 | GridCell | 단일 셀 hover 인터랙션 |
| 8 | 전체 언론사 그리드 | 실제 데이터 렌더링 목표 |
| 16 (일부) | 언론사 72개 목록 데이터 + 티커 데이터 | 섹션 8 작업 전 필요 |

---

## 2주차 목표 (섹션 9 → 15 + 섹션 16 나머지)

| 섹션 | 내용 |
|---|---|
| 9 | 구독 언론사 그리드 |
| 10 | 체브론 |
| 11 | 구독/해지 Pill |
| 12 | PressOpen 상세 뷰 |
| 13 | FieldTab (프로그레스 + 자동 전환) |
| 14 | 전역 상태 관리 |
| 15 | 접근성 |
| 16 (나머지) | 카테고리별 기사 데이터 |

---

## 컴포넌트 계획

| 파일 | 역할 |
|---|---|
| `App.tsx` | 루트 — 전역 상태(`tab`, `page`, `opened`, `subscribed` 등) 보유, 전체 트리에 props 전달 |
| `Header.tsx` | 상단 헤더 — 신문 아이콘, "뉴스스탠드" 워드마크, 오늘 날짜 표시 |
| `Ticker.tsx` | 자동 롤링 뉴스 티커 — 2레인 병렬 배치, 3.2초 crossfade 회전 |
| `TabBar.tsx` | 탭 전환 + 뷰 토글 — "전체/구독" 탭, 구독 수 뱃지, 리스트/그리드 아이콘 |
| `PressWordmark.tsx` | 언론사 타이포그래픽 워드마크 — color, weight, accent, bg 등 데이터 기반 스타일링 |
| `GridCell.tsx` | 그리드 단일 셀 — 기본(워드마크) / hover(구독·해지 pill) 상태 전환 |
| `PressGrid.tsx` | 6×4 언론사 그리드 — 전체·구독 탭 공용, 페이지 단위 렌더링 |
| `Chevron.tsx` | 좌·우 페이지 이동 버튼 — 첫/마지막 페이지에서 opacity 0 |
| `SubscribePill.tsx` | 구독/해지 pill 버튼 — GridCell hover 및 PressOpen 헤드에서 사용 |
| `PressOpen.tsx` | 언론사 상세 뷰 — FieldTab + 헤드라인 이미지 + 기사 목록, 그리드와 상호 배타적 |
| `FieldTab.tsx` | 카테고리 탭 바 — 6초 프로그레스 바, 자동 탭 전환, 기사 카운터 |

**커스텀 훅**

| 파일 | 역할 |
|---|---|
| `useTickerRotation.ts` | 티커 회전 타이머 — 3.2초 인터벌, hover/focus 일시정지, reduced-motion 처리 |
| `useFieldTabProgress.ts` | FieldTab 프로그레스 — 6초 인터벌, 탭·기사 자동 전진, 순환 로직 |
| `usePrefersReducedMotion.ts` | 사용자의 `prefers-reduced-motion` 설정을 감지, 애니메이션 비활성화에 사용 |

---

## 0. 개발 환경 설정 (Vite + React + Tailwind CSS)

- [x] Vite + React 프로젝트 생성 — `npm create vite@latest . -- --template react-ts`
- [x] 의존성 설치 — `npm install`
- [x] Tailwind CSS 설치 — `npm install -D tailwindcss @tailwindcss/vite`
- [x] `vite.config.ts` — `@tailwindcss/vite` 플러그인 추가
- [x] `src/index.css` — `@import "tailwindcss"` 추가 (v4 방식)
- [x] Tailwind 테마 확장 — `@theme` 블록에 디자인 토큰 등록 (컬러, 폰트, 스페이싱, 보더 반경)
- [x] 폰트 설치 — `npm install pretendard` 또는 CDN, IBM Plex Mono / Noto Serif KR은 Google Fonts CDN
- [x] `index.html` — 폰트 `<link>` 태그 추가 (Google Fonts: IBM Plex Mono, Noto Serif KR)
- [x] 불필요한 Vite 보일러플레이트 정리 — `App.css`, 기본 카운터 컴포넌트 등 제거
- [x] `src/` 디렉토리 구조 설계 — `components/`, `data/`, `hooks/`, `types/` 폴더 생성
- [x] `clsx` + `tailwind-merge` 설치 — `npm install clsx tailwind-merge`
- [x] `tsconfig.json` 경로 별칭 설정 — `"paths": { "@/*": ["./src/*"] }` + `vite.config.ts` resolve.alias 동기화
- [x] ESLint / Prettier 설정 확인

---

## 1. 프로젝트 설정 & 디자인 토큰

- [x] `src/index.css` `@theme` 블록에 컬러 토큰 등록 — `--color-ink: #14212B`, `--color-sub: #5F6E76`, `--color-mute: #879298`, `--color-line: #D2DAE0`, `--color-soft: #F5F7F9`, `--color-card: #FFFFFF`, `--color-page: #FEFEFE`, `--color-accent: #7890E7`, `--color-accent-deep: #4362D0` (v4에서 CSS 변수 + `text-ink`·`bg-ink` 유틸리티 클래스 자동 생성)
- [x] 폰트 로드 — Pretendard Variable (본문·UI), IBM Plex Mono (탭 카운터 숫자), Noto Serif KR (세리프 워드마크)
- [x] 타이포그래피 토큰 — display(24/700), heading(16/700), body(16/500), list-item(14/500), caption(12/500), badge(12/500), mono-tab(12/500 IBM Plex Mono)
- [x] 한국어 자간 body `-0.01em` / display `-0.02em` / 라틴 `0`
- [x] 스페이싱 기준 8px 단위 CSS 변수 — 4, 8, 12, 16, 24, 32, 40, 48, 64
- [x] 보더 반경 토큰 — `r-pill: 14px`, `r-badge: 10px`, `r-sub: 2px`
- [x] 스트로크 규칙 — 항상 1px `#D2DAE0` 단일 사용
- [x] 그림자 규칙 — subscribe pill 전용 `0 1px 2px rgba(20,33,43,0.04)` 1종만

---

## 2. 레이아웃 & 캔버스

- [x] 전체 캔버스 1280px 고정, 콘텐츠 영역 930px (좌우 여백 각 175px)
- [x] 1280px 미만 뷰포트에서 콘텐츠 스케일 다운 처리
- [x] 수직 위치 고정 — Header y:58 (h:29), Ticker y:127 (h:49), TabBar y:208 (h:24), Content y:256 (930×388)
- [x] 체브론 위치 고정 — 콘텐츠 영역 외부, 좌 x:103 / 우 x:1153, y:430 (24×40)

---

## 3. 헤더 (Header)

- [x] flex space-between 레이아웃, height 29
- [x] 좌측 — 신문 아이콘 24×24 (stroke `#14212B`) + "뉴스스탠드" 텍스트 (display 24/700 `ink`)
- [x] 우측 — 오늘 날짜를 "YYYY. MM. DD. 요일" 형식으로 동적 표시 (body 16/500 `sub`)

---

## 4. 뉴스 티커 (Ticker)

- [x] 두 레인 나란히 배치 (gap 8), 배경 `#F5F7F9`, height 49
- [x] 각 레인 — 굵은 언론사명 + 기사 제목 텍스트 표시
- [x] 3.2초마다 다음 항목으로 자동 회전
- [x] 전환 애니메이션 — crossfade 0.55s (`cubic-bezier(.4,0,.2,1)`)
- [x] 두 레인 오프셋 적용 — 동시에 전환되지 않도록 위상 차이
- [x] hover / focus 시 회전 일시정지
- [x] `prefers-reduced-motion` 감지 시 애니메이션 완전 비활성화
- [x] 그리드·리스트 뷰 전환과 무관하게 항상 동일 위치 유지

---

## 5. 탭바 (TabBar)

- [x] flex space-between 레이아웃, height 24
- [x] 좌측 — "전체 언론사" 탭, 활성 시 16/700 `ink` / 비활성 시 16/500 `mute`
- [x] 좌측 — "내가 구독한 언론사" 탭, 동일 활성·비활성 스타일 규칙
- [x] 구독 수 뱃지 — 20×20, `r-badge(10px)`, bg `#7890E7`, 숫자 12/500 `rgba(255,255,255,0.7)`, 구독 수 동적 반영
- [x] 좌측 탭 클러스터 gap 24
- [x] 우측 — 리스트 뷰 아이콘 24×24, 활성 시 `ink` / 비활성 시 `mute`
- [x] 우측 — 그리드 뷰 아이콘 24×24, 활성 시 `ink` / 비활성 시 `mute`
- [x] 우측 아이콘 클러스터 gap 8
- [x] 탭 전환 시 페이지 0 초기화, opened 상태 null 초기화

---

## 6. 언론사 워드마크 (PressWordmark)

- [x] 렌더링 기본값 — `display: inline-flex`, `flex-wrap: wrap`, `align-items: center`, `justify-content: center`, `max-width: 88%`, `word-break: keep-all`, `line-height: 1.15`
- [x] 기본 속성 — `name`, `color`, `weight(400|500|700)`, `family("sans"|"serif")`, `italic`, `underline` — `color`는 런타임 동적 값이므로 `style={{ color: press.color }}` 인라인 스타일 사용
- [x] `tracking` — CSS letter-spacing 직접 주입 (예: `"0.08em"`) — Tailwind 클래스 불가, `style` prop 사용
- [x] `latin: true` — 한국어 자간(-0.01em) 비활성화
- [x] `small: true` — 14px 적용 (긴 라틴 이름용)
- [x] `bg` 컬러 지정 시 — `r-sub(2px)` 배경 칩 렌더링 (이데일리 빨간, KBS WORLD 파란 등)
- [x] `accentChar` — 해당 인덱스 문자에 `accent` 컬러 적용
- [x] `accentUnder` — 해당 인덱스 문자들에 accent 색 밑줄 적용
- [x] `accentBg: true` — accent 문자가 색상 대신 filled chip으로 표시
- [x] `flag: true` — 이름 뒤 작은 빨간 깃발 글리프 추가 (아시아경제)
- [x] 긴 이름 2줄 줄바꿈 — 셀 내에서 자연스럽게 처리 (Korea JoongAng Daily 등)

---

## 7. 그리드 셀 (GridCell)

- [x] 기본 상태 — bg `#FFFFFF`, 워드마크 중앙 정렬, 셀 크기 ~154×96
- [x] hover 상태 — bg `#F5F7F9`, 워드마크 숨김, pill 표시
- [x] "전체 언론사" 탭 hover → "+ 구독하기" pill 표시
- [x] "내가 구독한 언론사" 탭 hover → "− 해지하기" pill 표시
- [x] 클릭 시 해당 언론사 PressOpen으로 전환
- [x] 키보드 `:focus-within` 시 hover와 동일한 시각 효과 적용

---

## 8. 전체 언론사 그리드 (전체 언론사 탭)

- [x] CSS Grid 6열 × 4행, gap 1px (gap이 구분선 역할)
- [x] 전체 크기 930×388, 그리드 배경 `#D2DAE0` (gap 색), 외곽 border 1px `#D2DAE0`
- [x] 총 72개 언론사, 24개씩 3페이지 페이지네이션
- [x] 페이지 전환 시 해당 페이지 24개 언론사로 그리드 교체
- [x] 1페이지: 우측 체브론만 표시 / 2페이지: 양쪽 / 3페이지: 좌측 체브론만 표시

---

## 9. 내가 구독한 언론사 그리드 (구독 탭)

- [x] 동일 6×4 그리드 구조 유지
- [x] 구독한 언론사 셀만 워드마크 표시, 나머지 셀은 `#FFFFFF` 빈 셀 유지
- [x] 구독 수 ≤ 24: 1페이지, 초과 시 추가 페이지 (페이지당 최대 24개)
- [x] 구독이 0개일 때 — 전체 셀 빈 상태

---

## 10. 페이지네이션 & 체브론 (Chevron)

- [x] 좌우 체브론 버튼 — 24×40, 윤곽선 스타일, stroke `#879298` 1.4px, 화살표 글리프
- [x] 콘텐츠 영역 외부 고정 위치 — 좌 x:103 / 우 x:1153, y:430
- [x] 첫 페이지: 좌측 체브론 `opacity: 0` (레이아웃 공간 유지, 시각만 제거)
- [x] 마지막 페이지: 우측 체브론 `opacity: 0`
- [x] `<button>` 태그, `aria-label="이전 페이지"` / `"다음 페이지"`, 비활성 시 `disabled` 속성

---

## 11. 구독/해지 Pill (SubscribePill)

- [x] height 28, padding 0 12, `r-pill(14px)`, bg `#FFFFFF`, border 1px `#D2DAE0`
- [x] 텍스트 12/500 `sub`
- [x] 앞 아이콘 — 10×10 + (구독) 또는 − (해지), stroke `sub` 1.3
- [x] 그림자 — `0 1px 2px rgba(20,33,43,0.04)`
- [x] 구독하기 클릭 → `subscribed` Set에 추가, 탭바 뱃지 카운트 +1
- [x] 해지하기 클릭 → `subscribed` Set에서 제거, 탭바 뱃지 카운트 -1

---

## 12. 언론사 상세 뷰 (PressOpen)

- [ ] 그리드와 동일한 930×388 영역을 대체 (그리드 뷰와 상호 배타적)
- [ ] bg `#FFFFFF`, 좌·하·우 border 1px `#D2DAE0` (상단 없음 — FieldTab 하단선이 경계)
- [ ] 내부 padding 상하 24 / 좌우 32
- [ ] 헤드 행 — flex gap 16 align center: 워드마크(scale 1.05) + 편집시간(12/500 `sub` tabular-nums, "YYYY.MM.DD. HH:MM 편집") + 구독 pill
- [ ] 좌측 컬럼 340px 고정 — 헤드라인 이미지 박스 (~340×188, bg `linear-gradient(135deg, #EFF1F6, #DDE3EC)`, border 1px `#D2DAE0`, "headline image" 플레이스홀더 중앙) + 헤드라인 텍스트 16/700 `ink` line-height 1.45
- [ ] 우측 컬럼 flex 1 — 기사 목록 6개 (14/500 `ink`, line-height 1.5), 각 항목 앞 3×3 불릿 사각형 (`#14212B`, translateY -4)
- [ ] 각주 — `margin-top: auto`로 하단 고정, "{언론사명} 언론사에서 직접 편집한 뉴스입니다." (12/500 `mute`)
- [ ] 언론사 클릭 진입 시 해당 언론사의 primary 카테고리 탭으로 기본 진입, progress 0 시작
- [ ] PressOpen 내 구독 pill 클릭 시 구독/해지 동작 정상 수행

---

## 13. 카테고리 필드탭 (FieldTab)

- [ ] PressOpen 상단에 위치, height 40, bg `#F5F7F9`, border 1px `#D2DAE0`
- [ ] 6개 탭 — 종합/경제, 방송/통신, IT, 스포츠/연예, 매거진/전문지, 지역
- [ ] 각 탭 `flex: 1`, 탭 사이 우측 border 1px `#D2DAE0`, padding 0 16
- [ ] 비활성 탭 — 14/500 `sub`
- [ ] 활성 탭 — bg `#7890E7` (전체 탭 채움), 라벨 14/700 `#FFFFFF`
- [ ] 활성 탭 프로그레스 바 — 좌측에서 우측으로 6초 linear fill, 색상 `#4362D0` (accent-deep), 탭 위에 오버레이 — width는 `style={{ width: `${progress * 100}%` }}` 인라인 스타일 사용 (Tailwind 클래스 불가)
- [ ] 활성 탭 우측 카운터 — "N / 81" (N: 현재 기사 번호 14/500 `#FFFFFF`, "/ 81": 동일 opacity 0.7, IBM Plex Mono tabular-nums)
- [ ] `setInterval(tick, 100)`으로 6000ms에 걸쳐 progress 0→1 증가
- [ ] progress 1.0 도달 시 → `currentInTab + 1`
- [ ] `currentInTab`이 탭 기사 수(81) 초과 시 → 다음 탭으로 이동, `currentInTab = 1` 리셋
- [ ] 마지막 탭(지역) 완료 시 → 첫 번째 탭(종합/경제)으로 순환
- [ ] 탭 수동 클릭 시 → 해당 탭으로 이동, progress 0 리셋, `currentInTab = 1` 리셋

---

## 14. 전역 상태 관리

- [x] `tab: "all" | "sub"` — 현재 활성 탭 (전체/구독)
- [x] `page: number` — 현재 그리드 페이지 (0-based)
- [x] `viewer: "grid" | "list"` — 뷰어 모드 (탭바 우측 토글)
- [x] `opened: pressId | null` — 열린 언론사 ID (null이면 그리드 표시)
- [ ] `tabKey: categoryKey` — PressOpen 내 활성 카테고리 탭 키
- [ ] `progress: 0..1` — FieldTab 프로그레스 바 현재 값
- [ ] `currentInTab: number` — 현재 탭 내 표시 중인 기사 번호 (1-based)
- [x] `subscribed: Set<pressId>` — 구독한 언론사 ID 집합
- [x] 모든 상태는 `<App>` 루트에서 관리, 하위 컴포넌트는 props로 수신

---

## 15. 접근성 (Accessibility)

- [ ] 탭바 `role="tablist"`, 각 탭 `role="tab"`, 활성 탭 `aria-selected="true"`
- [ ] 체브론 `<button>` + `aria-label="이전 페이지"` / `"다음 페이지"`, 비활성 시 `disabled`
- [ ] 구독 수 뱃지 `aria-label="구독 중인 언론사 N곳"` (N 동적 반영)
- [ ] 셀 키보드 `:focus-within` 시 hover pill과 동일하게 표시
- [ ] 티커 hover / focus 시 회전 일시정지
- [ ] `prefers-reduced-motion` — 티커 전환 비활성화, FieldTab 프로그레스 즉시 완료 처리
- [ ] 모든 텍스트 WCAG AA 색상 대비 충족 (`mute #879298`은 14px+ 에서 통과)

---

## 16. 언론사 데이터

- [x] 전체 언론사 72개 목록 정의 — 각 언론사별 워드마크 속성 포함 (name, color, weight, family, italic, underline, tracking, accent, accentChar, accentUnder, accentBg, bg, flag, latin, small)
- [ ] 언론사별 primary 카테고리 탭 정의 (첫 진입 시 기본 탭)
- [ ] 티커 데이터 정의 — 2개 레인 별도, 각 레인별 언론사명 + 기사 제목 목록
- [ ] 각 언론사별 보유 카테고리 탭 목록 정의
- [ ] 각 카테고리별 기사 데이터 정의 — 헤드라인 이미지, 헤드라인 제목, 기사 6개 목록, 편집시간
