export interface PressWordmarkConfig {
  name: string
  color: string
  weight: 400 | 500 | 700
  family: 'sans' | 'serif'
  italic?: boolean
  underline?: boolean
  tracking?: string
  accent?: string
  accentChar?: number
  accentUnder?: number[]
  accentBg?: boolean
  bg?: string
  flag?: boolean
  latin?: boolean
  small?: boolean
}
