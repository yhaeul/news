# CLAUDE.md — 뉴스스탠드 프로젝트

## 프로젝트 개요

네이버 뉴스스탠드를 모방한 데스크톱 웹 포털.
사용자는 6×4 그리드에서 언론사를 탐색하고 구독/해지하며, 언론사를 클릭하면 카테고리별 기사 리스트를 볼 수 있다.

- 디자인 스펙: `docs/newsstand-design_system.md`
- 디자인 시안: `docs/design/`
- 구현 체크리스트: `docs/checklist.md`

---

## 기술 스택

| 항목 | 선택 |
|---|---|
| 프레임워크 | React 18 + TypeScript |
| 번들러 | Vite |
| 스타일 | Tailwind CSS v4 (`@tailwindcss/vite`) |
| 조건부 클래스 | `clsx` + `tailwind-merge` |
| 상태관리 | `useState` + props (루트 집중, 외부 라이브러리 없음) |

---

## 주요 커맨드

```bash
npm run dev      # 개발 서버 시작
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
npm run lint     # ESLint 검사
```

---

## 디렉토리 구조

```
src/
├── components/       # UI 컴포넌트
│   ├── Header.tsx
│   ├── Ticker.tsx
│   ├── TabBar.tsx
│   ├── PressGrid.tsx
│   ├── GridCell.tsx
│   ├── PressWordmark.tsx
│   ├── SubscribePill.tsx
│   ├── Chevron.tsx
│   ├── PressOpen.tsx
│   └── FieldTab.tsx
├── data/             # 언론사 목록, 기사 목업 데이터
├── hooks/            # 커스텀 훅 (useTickerRotation, useFieldTabProgress 등)
├── types/            # TypeScript 타입 정의
├── App.tsx           # 루트 — 전역 상태 보유
└── index.css         # Tailwind @import + @theme 토큰
```

---

## 스타일 가이드

### Tailwind v4 토큰

디자인 토큰은 `src/index.css`의 `@theme` 블록에서 관리한다.
선언 한 번으로 CSS 변수(`var(--color-ink)`)와 유틸리티 클래스(`text-ink`, `bg-ink`)가 동시에 생성된다.

```css
@import "tailwindcss";

@theme {
  --color-ink: #14212B;
  --color-accent: #7890E7;
  --radius-pill: 14px;
  /* ... */
}
```

### 인라인 스타일 사용 규칙

아래 두 경우는 Tailwind 클래스로 처리 불가하므로 인라인 스타일을 사용한다.

1. **PressWordmark 동적 속성** — `color`, `letterSpacing`, `bg` 등은 런타임 데이터에서 오기 때문에 `style` prop 직접 주입
2. **FieldTab 프로그레스 바 width** — JS state(`progress`)를 실시간 반영하므로 `style={{ width: `${progress * 100}%` }}`

그 외 픽셀 정밀 수치는 Tailwind arbitrary value(`top-[58px]`, `h-[29px]`)를 사용한다.

### TypeScript 컨벤션

**`useState` 타입 명시** — 항상 타입 파라미터를 명시한다.

```tsx
const [count, setCount] = useState<number>(0)
const [tab, setTab] = useState<Tab>('all')
```

**커스텀 훅 반환 타입 명시** — 훅 함수에는 반환 타입을 명시한다.

```ts
export function useTickerRotation(...): number { ... }
export function usePrefersReducedMotion(): boolean { ... }
```

**`interface` vs `type` 구분**
- 객체 형태(props, 데이터 구조)는 `interface`
- 유니온·리터럴·별칭은 `type`

```ts
interface PressWordmarkConfig { name: string; color: string }  // 객체 → interface
type Tab = 'all' | 'sub'                                       // 유니온 → type
```

**Props 인터페이스 네이밍** — `ComponentNameProps` 형식으로 명명한다.

```ts
interface TabBarProps { ... }
interface GridCellProps { ... }
```

**`any` 금지** — 타입을 알 수 없을 때는 `unknown`을 사용하고 타입 가드로 좁힌다.

### 값 변수화 기준

값을 CSS 변수(`@theme`)로 관리할지 하드코딩으로 둘지는 아래 기준으로 판단한다.

**변수화한다** — `src/index.css` `@theme`에 등록
- 여러 컴포넌트에서 재사용되는 값 (색상, 반경, 그림자 등)
- 테마/모드 전환 시 바뀔 수 있는 UI 색상

**하드코딩으로 둔다**
- 레이아웃 좌표 (`top-[256px]`, `left-[175px]`) — 1280px 고정 캔버스의 1회성 위치값
- 컴포넌트 전용 수치 (`height: 28`, `padding: '0 12px'`) — 해당 컴포넌트 안에서만 쓰이는 값
- SVG 드로잉 수치 (`width="24"`, `strokeWidth="1.5"`) — 아이콘 형태 정의
- `src/data/` 내 언론사 브랜드 색상 — 언론사 고유 데이터이며 테마 전환 대상이 아님

### 조건부 클래스

`clsx` + `tailwind-merge`를 조합해 사용한다.

```tsx
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

const cn = (...inputs) => twMerge(clsx(inputs));

// 사용 예
<button className={cn('text-body', isActive ? 'font-bold text-ink' : 'font-medium text-mute')} />
```

---

## 아키텍처 결정

- **상태는 `<App>` 루트에서 관리**, 하위 컴포넌트는 props만 받는다. Context나 전역 스토어 없음.
- **캔버스 1280px 고정**. 1280px 미만 뷰포트에서는 스케일 다운 처리.
- **뷰 전환**: `opened !== null`이면 `<PressOpen>`, `null`이면 `<PressGrid>` 렌더링 (상호 배타적).
- **티커**: 항상 마운트 상태 유지. 뷰 전환과 무관하게 회전 지속.

---

## 커밋 컨벤션

모든 커밋은 아래 형식을 따른다.

```
<type>: #<커밋-순번> <제목>

- 확인내용: <구현하면서 직접 확인한 내용, 추가 결정 사항>
- 이해 안 됐던 부분: <헷갈렸거나 새로 이해한 개념, 없으면 "없음">
```

번호는 타입(feat/chore/docs 등)과 무관하게 프로젝트 전체에서 단일 시퀀스로 증가한다.

### 타입

| 타입 | 용도 |
|---|---|
| `feat` | 새 기능 구현 |
| `fix` | 버그 수정 |
| `style` | 로직 변경 없는 스타일 수정 |
| `refactor` | 동작 변경 없는 코드 정리 |
| `chore` | 환경설정, 패키지 변경 |
| `docs` | 문서 수정 |

### 예시

```
feat: #6 PressWordmark 컴포넌트

- 확인내용: accentChar 인덱스 기반 문자 분리 로직 구현 확인, 한글 자간 적용 방식 검토
- 이해 안 됐던 부분: accentBg와 accentChar 조합 시 렌더링 우선순위 확인함
```

```
chore: #0 Vite + React TS + Tailwind v4 환경 설정

- 확인내용: @tailwindcss/vite 플러그인 연동, @theme 블록 토큰 등록 확인
- 이해 안 됐던 부분: 없음
```
