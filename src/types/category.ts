export type CategoryKey = '종합/경제' | '방송/통신' | 'IT' | '스포츠/연예' | '매거진/전문지' | '지역'

export const ALL_CATEGORIES: readonly CategoryKey[] = [
  '종합/경제',
  '방송/통신',
  'IT',
  '스포츠/연예',
  '매거진/전문지',
  '지역',
]

export interface ArticleSet {
  headline: string
  editTime: string
  items: [string, string, string, string, string, string]
}

export interface PressMeta {
  primaryCategory: CategoryKey
}
