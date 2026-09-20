import type { Availability, Category, ProfessionalSummary } from './professional'

export const SORT_KEYS = [
  'relevancia',
  'preco-asc',
  'preco-desc',
  'avaliacao',
  'distancia',
] as const

export type SortKey = (typeof SORT_KEYS)[number]

export const SORT_LABEL: Record<SortKey, string> = {
  'relevancia': 'Relevância',
  'preco-asc': 'Menor preço',
  'preco-desc': 'Maior preço',
  'avaliacao': 'Melhor avaliação',
  'distancia': 'Mais perto',
}

export type NavigationMode = 'push' | 'replace'

export const DEFAULT_PER_PAGE = 24
export const MAX_PER_PAGE = 48

export interface CatalogQuery {
  q: string
  categories: Category[]
  availability: Availability[]
  minPrice: number | null
  maxPrice: number | null
  minRating: number | null
  maxDistanceKm: number | null
  verifiedOnly: boolean
  sort: SortKey
  page: number
  perPage: number
}

export interface FacetBucket<T extends string> {
  value: T
  label: string
  count: number
}

export interface CatalogFacets {
  categories: FacetBucket<Category>[]
  availability: FacetBucket<Availability>[]
  priceRange: { min: number, max: number }
  maxDistanceKm: number
}

export interface CatalogResponse {
  items: ProfessionalSummary[]
  page: number
  perPage: number
  total: number
  totalPages: number
  hasMore: boolean
  facets: CatalogFacets
}
