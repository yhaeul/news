export const CATEGORY_KEY = {
  GENERAL:   '종합/경제',
  BROADCAST: '방송/통신',
  IT:        'IT',
  SPORTS:    '스포츠/연예',
  MAGAZINE:  '매거진/전문지',
  REGIONAL:  '지역',
} as const

export type CategoryKey = typeof CATEGORY_KEY[keyof typeof CATEGORY_KEY]

export const ALL_CATEGORIES = Object.values(CATEGORY_KEY) as CategoryKey[]

export interface ArticleSet {
  headline: string
  editTime: string
  items: [string, string, string, string, string, string]
}

export interface PressMeta {
  primaryCategory: CategoryKey
}
