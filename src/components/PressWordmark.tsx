import type { CSSProperties } from 'react'
import type { PressWordmarkConfig } from '../types/press'

function FlagGlyph() {
  return (
    <svg
      width="8"
      height="10"
      viewBox="0 0 8 10"
      style={{ display: 'inline', marginLeft: '2px', verticalAlign: 'middle' }}
    >
      <line x1="1" y1="0" x2="1" y2="10" stroke="var(--color-flag)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M1 1L8 3.5L1 6Z" fill="var(--color-flag)" />
    </svg>
  )
}

export function PressWordmark({
  name,
  color,
  weight,
  family,
  italic = false,
  underline = false,
  tracking,
  bg,
  accent,
  accentChar,
  accentUnder,
  accentBg = false,
  flag = false, // 아시아경제 전용
  latin = false,
  small = false,
}: PressWordmarkConfig) {
  const fontFamily = family === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)'
  const letterSpacing = tracking ?? (latin ? '0em' : '-0.01em')
  const fontSize = small ? '14px' : '16px'

  const baseStyle: CSSProperties = {
    color,
    fontWeight: weight,
    fontFamily,
    fontSize,
    fontStyle: italic ? 'italic' : undefined,
    textDecoration: underline ? 'underline' : undefined,
    letterSpacing,
    lineHeight: 1.15,
    wordBreak: 'keep-all',
    ...(flag && { whiteSpace: 'nowrap' }),
    ...(bg && {
      backgroundColor: bg,
      borderRadius: 'var(--radius-sub)',
      padding: '2px 6px',
    }),
  }

  const hasAccent = accentChar !== undefined || (accentUnder && accentUnder.length > 0)

  const textContent = hasAccent
    ? [...name].map((char, i) => {
        const isAccentChar = accentChar !== undefined && i === accentChar
        const isAccentUnder = accentUnder?.includes(i) ?? false
        const charStyle: CSSProperties = {}

        if (isAccentChar && accent) {
          if (accentBg) {
            charStyle.backgroundColor = accent
            charStyle.borderRadius = 'var(--radius-sub)'
            charStyle.padding = '1px 3px'
            charStyle.color = 'var(--color-card)'
          } else {
            charStyle.color = accent
          }
        }

        if (isAccentUnder && accent) {
          charStyle.textDecoration = 'underline'
          charStyle.textDecorationColor = accent
          charStyle.color = accent
        }

        return <span key={i} style={charStyle}>{char}</span>
      })
    : name

  return (
    <div
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '88%',
      }}
    >
      <span style={baseStyle}>{textContent}{flag && <FlagGlyph />}</span>
    </div>
  )
}
