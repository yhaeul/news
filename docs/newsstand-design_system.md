# 뉴스스탠드 · Design Spec

A desktop-first Korean news portal. Users browse a 6×4 grid of press outlets, subscribe/unsubscribe, and drill into a per-press article list with a timed auto-rotate. This document captures every token, rule, and component spec a developer needs to implement the UI in React.

---

## 1. Design principles

| Principle | What it means here |
|---|---|
| Clarity over decoration | No gradients, no glow. Hairline borders ( `#D2DAE0` ) do almost all visual separation work. |
| Type is the brand | Each press outlet is drawn as a styled wordmark — weight, italic, color, underline, tiny flag glyph. Logos are typographic artifacts, not images. |
| One accent color | `#7890E7` (indigo) highlights the exactly two things that earn it: the subscribed-count badge, and the active progress tab. Nothing else. |
| Dense and calm | 16px body, 12px meta, tight line-height (1.15–1.5). The viewport holds a lot of outlets; the whitespace is the breathing room. |

---

## 2. Color tokens

| Token | Value | Where |
|---|---|---|
| ink | `#14212B` | body text, bold labels, grid strokes on dark spots |
| ink-alt | `#14202B` | same role — swap interchangeably |
| sub | `#5F6E76` | secondary text (dates, captions, subscribed line) |
| mute | `#879298` | inactive tab labels, empty chevron |
| line | `#D2DAE0` | 1px dividers, card borders, grid strokes |
| soft | `#F5F7F9` | ticker bg, field-tab bg (opened press) |
| soft-alt | `#F7F7FC` | reserved secondary surface |
| card | `#FFFFFF` | grid cell, opened-press body, subscribe pill |
| page | `#FEFEFE` | page background |
| accent | `#7890E7` | subscribed count badge, active tab fill, hover cursor |
| accent-deep | `#4362D0` | progress fill inside active tab |
| badge-ink | `rgba(255,255,255,0.7)` | numeric on accent surfaces |
| danger | `#FFD1CF` | reserved for destructive states (unused in shipped frames) |

---

## 3. Typography

Primary family: **Pretendard Variable / Pretendard**, fall back to Noto Sans KR → system sans.  
Numeric family: **IBM Plex Mono** (tab counter `1 / 81`).  
Serif accent: **Noto Serif KR** (serif press wordmarks — 朝鮮日報, Korea JoongAng Daily, Insight, Forbes, etc).

Korean letterspacing: body `-0.01em`, display `-0.02em`.  
Latin letterspacing: `0`. Press wordmarks with tracking override (e.g. `0.08em` on 朝鮮日報).

| Token | Size / Weight / Leading | Where |
|---|---|---|
| display | 24 / 700 / 100% | "뉴스스탠드" header wordmark |
| heading | 16 / 700 / 100% | Active tab label (전체 언론사), article headline |
| body | 16 / 500 / 22px | Inactive tab label, todays-date, subscribed label |
| list-item | 14 / 500 / 1.5 | Article list rows |
| caption | 12 / 500 / 1 | Meta (edit time), footnote, subscribe pill |
| badge | 12 / 500 / 1 | Badge count, subscribe pill |
| mono-tab | 12 / 500 / 1 | Tab counter "1 / 81" (IBM Plex Mono) |
| mono-label | 10 / 500 / 1 | Page label / watermark (if used) |

Usage rule: body text is always `ink`. Any text at `sub` or lighter is secondary — never a primary action label.

---

## 4. Spacing

Base unit is **8px**. The layout speaks in multiples.

```
4, 8, 12, 16, 24, 32, 40, 48, 64
```

### Canvas layout (1280 × 720)

| | Value |
|---|---|
| left gutter | 175 |
| right gutter | 175 |
| top: header y | 58 (height 29) |
| top: ticker y | 127 (height 49) |
| top: tab bar y | 208 (height 24) |
| top: content y | 256 (930 × 388) |
| top: chevrons y | 430 (24 × 40, left 103 / right 1153) |
| content width | 930 (1280 − 175 − 175) |

Everything inside **930px** content width. Chevrons live outside the content column.

---

## 5. Radii, strokes, shadows

| Token | Value | Where |
|---|---|---|
| r-0 | 0 | Grid cells, ticker cards, opened-press frame |
| r-sub | 2 | Press logo background (KBS WORLD, BBS NEWS, 비즈한국) |
| r-pill | 14 | Subscribe/unsubscribe pill (height 28) |
| r-badge | 10 | Subscribed-count badge (20 × 20) |

Strokes: always **1px**, `#D2DAE0`. No other thickness, no other color.  
Shadows: essentially none in grid frames. Subscribe pill gets `0 1px 2px rgba(20,33,43,0.04)` as the only shadow in the system.

---

## 6. Components

### 6.1 Header

Layout: flex space-between, height 29

- Left: newspaper-icon (24×24, stroke `#14212B`) + "뉴스스탠드" display 24/700
- Right: todays date, "2026. 01. 14. 수요일", body 16/500 color `sub`

### 6.2 Auto-rolling news ticker

Two equal lanes side by side, gap 8.

Behavior: rotate to next item every **3.2s**, crossfade **0.55s** (`cubic-bezier(.4,0,.2,1)`). Two lanes offset so they don't rotate in sync.

### 6.3 Tab bar + viewer toggle

Row, space-between, height 24

Left cluster (gap 24):
- "전체 언론사" 16/700 if active else 16/500 mute
- "내가 구독한 언론사" 16/700 if active else 16/500 mute
- \+ badge (count) 20×20 r-badge accent bg, 12/500 `rgba(255,255,255,0.7)`

Right cluster (gap 8):
- list-view icon 24×24 ink if active, mute if not
- grid-view icon 24×24 ink if active, mute if not

### 6.4 Grid (전체 언론사)

930 × 388, background `#D2DAE0`, border 1px `#D2DAE0`  
CSS grid: **6 columns × 4 rows**, gap 1 (creates divider lines)  
Each cell: background `#FFFFFF`, center content, cell size ~154 × ~96

Cell hover: bg `#F5F7F9`, replace wordmark with:
- Subscribe pill ("+ 구독하기") on 전체 언론사 tab
- Unsubscribe pill ("− 해지하기") on 내가 구독한 언론사 tab
- Optional small cursor glyph (white hand outline) 18×22 under pill

### 6.5 Press wordmark (styled type)

Each outlet is a wordmark built from these props:

```
name       string
color      hex                  // text color
bg         hex | undefined      // filled chip (KBS WORLD, etc)
weight     400 | 500 | 700
family     "sans" | "serif"
italic     bool
underline  bool
tracking   css letter-spacing   // ex "0.08em"
accent     hex                  // per-char accent color
accentChar int                  // index of char that takes `accent`
accentUnder int[]               // indices underlined in accent color
accentBg   bool                 // accent char gets filled chip instead of color
flag       bool                 // append tiny red flag glyph (아시아경제)
latin      bool                 // disables -0.01em korean tracking
small      bool                 // 14px instead of 16px (long latin names)
```

Render rules:
- `display: inline-flex`, `flex-wrap: wrap`, `align/justify: center`
- `max-width: 88%` of cell, `word-break: keep-all`
- `line-height: 1.15`, no nowrap (long names wrap to 2 lines and stay inside cell)

### 6.6 Subscribe / unsubscribe pill

Height 28, padding 0 12, r-pill, bg `#FFFFFF`, border 1px `#D2DAE0`  
Text: 12/500 `sub`  
Leading icon: 10×10 plus (subscribe) or minus (unsubscribe), stroke `sub` 1.3  
Shadow: `0 1px 2px rgba(20,33,43,0.04)`

### 6.7 Chevron (page nav)

24 × 40 outlined, stroke `#879298` 1.4, right-pointing chevron glyph  
Position: left 103 / right 1153, top 430  
disabled: opacity 0 (keeps layout, removes visual)

### 6.8 Pagination dots (legacy — kept in system, not in every shipped frame)

Dot row for page indicators:
- Active: 20 × 8 pill, bg ink
- Inactive: 8 × 8 dot, bg line
- Trailing counter: 12/500 mute "1 / 3", IBM Plex Mono, tabular-nums
- Gap 8, left-to-right

### 6.9 Field tab (opened press — category row)

Horizontal strip of 6 tabs sitting above the article body.

Height 40, background `#F5F7F9`, border 1px `#D2DAE0`  
Each tab: flex 1, padding 0 16, right-border 1px `#D2DAE0` between tabs

Inactive: 14/500 `sub`  
Active:
- fill: `#7890E7` full tab
- progress: `#4362D0` left overlay 0→100% over 6s linear
- label: 14/700 `#FFFFFF`
- counter right: "1/81", 12/500 mono, primary "1" + opacity .7 "/81"

Behavior: progress bar fills over **6 seconds**. At 100%, advance the `currentInTab` by 1; when it passes `count`, move to next tab and reset to 1.

### 6.10 Opened press layout (리스트 뷰)

930 × 388, card bg, 1px line border (no top border — field tab owns it)  
Inner padding: 24 32

Head row (flex gap 16 align center):
- press wordmark (scale 1.05)
- edit time 12/500 `sub`, tabular-nums
- subscribe pill

Body (flex gap 24 marginTop 4):

**LEFT 340px column**
- headline image box ~340×188, bg `linear-gradient(135deg,#EFF1F6→#DDE3EC)`, 1px line border, centered "headline image" placeholder
- headline 16/700 ink, line-height 1.45

**RIGHT flex 1 (list)**
- 6× list items 14/500 ink, line-height 1.5
- leading bullet 3×3 square `#14212B` translateY -4
- footnote (auto mt) 12/500 mute "{press} 언론사에서 직접 편집한 뉴스입니다."

---

## 7. States and flows

### Grid tab states

| Tab | Behavior |
|---|---|
| 전체 언론사 default | → 6×4 grid of all outlets, paged (3 pages × 24 = 72 outlets) |
| 내가 구독한 언론사 | → sparse grid, only subscribed cells filled; empty cells white |

### Cell hover states

| On tab | Cell hover reveals |
|---|---|
| 전체 언론사 | + 구독하기 pill |
| 내가 구독한 언론사 | − 해지하기 pill |

### Click press → opened state

Switch content region from grid to opened-press layout. Entry tab defaults to the outlet's primary category (e.g. SBS Biz → 방송/통신). Progress begins at 0.

### Pagination

Chevrons scope to the current tab. On 전체 언론사, 3 pages. On 내가 구독한 언론사, pages grow with subscription count (≤24 per page).

### Ticker

Always present (grid + opened-press). Top of content column. Never dismissable.

---

## 8. Accessibility notes

- Tab bar is semantically `role="tablist"` / tabs `role="tab"`. Active tab `aria-selected="true"`.
- Chevrons are `<button>` with `aria-label="이전 페이지"` / `"다음 페이지"`, disabled when no more pages.
- Subscribed-count badge needs an `aria-label` like `"구독 중인 언론사 9곳"`.
- Hover-only controls (subscribe pill) must also appear on keyboard focus (`:focus-within` on the cell).
- Ticker: pause rotation on hover/focus. Respect `prefers-reduced-motion` — disable entirely.
- Color contrast: all text meets WCAG AA on its surface. `mute` (`#879298`) on white passes for 14px+.

---

## 9. Suggested React structure

State lives at `<Newsstand>`:

```jsx
<Newsstand>
  <Header date={today} />
  <Ticker items={tickerItems} />
  <TabBar
    activeTab={"all" | "sub"}
    subCount={n}
    viewer={"grid" | "list"}
    onTabChange={...}
    onViewerChange={...}
  />
  {opened
    ? <PressOpen press={activePress} tabKey={cat} />
    : <PressGrid
        items={pageItems}
        subscribedIds={set}
        onSubscribe={...}
        onUnsubscribe={...}
        onOpen={...}
      />
  }
  <Chevron dir="left" disabled={page===0} onClick={...} />
  <Chevron dir="right" disabled={page===lastPage} onClick={...} />
</Newsstand>
```

```json
{
  "tab": "all" | "sub",
  "page": "number",
  "opened": "pressId | null",
  "tabKey": "categoryKey",
  "progress": "0..1",
  "currentInTab": "number",
  "subscribed": "Set<pressId>"
}
```

`progress` drives the field-tab fill. Advance via `setInterval(tick, 100)` over `6000ms`. On completion, `currentInTab++`; if overflow, advance `tabKey`; if tabs exhausted, loop to first.

---

## 10. Implementation checklist

- [ ] Pull color + type tokens into CSS variables (`:root`)
- [ ] `<PressWordmark press={p} />` component driven by press object (see 6.5)
- [ ] `<GridCell>` that hot-swaps wordmark ↔ subscribe pill on hover
- [ ] `<Ticker>` with two-lane rotation + reduced-motion guard
- [ ] `<FieldTab>` with progress animation driving parent state
- [ ] Focus/keyboard parity with mouse hover
- [ ] Honor `prefers-reduced-motion`
- [ ] Layout at fixed 1280 content width; page scales below that

---

*Generated from the design canvas. Reference frames live in Newsstand-Design.pdf.*
