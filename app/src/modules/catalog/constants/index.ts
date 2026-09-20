import type { CatalogQuery } from '@atlas/contracts'

export const SEARCH_DEBOUNCE_MS = 300

export const SKELETON_COUNT = 12

export const PRIORITY_CARD_COUNT = 4

export const LOAD_MORE_ROOT_MARGIN = '400px 0px'

export const SEARCH_MAX_LENGTH = 80

export const RATING_OPTIONS = [
  { value: 4.5, label: '4,5 ou mais' },
  { value: 4, label: '4,0 ou mais' },
  { value: 3.5, label: '3,5 ou mais' },
] as const

export const DISTANCE_OPTIONS = [2, 5, 10, 25, 50] as const

export const CLEAR_ALL_FILTERS: Partial<CatalogQuery> = {
  q: '',
  categories: [],
  availability: [],
  minPrice: null,
  maxPrice: null,
  minRating: null,
  maxDistanceKm: null,
  verifiedOnly: false,
}
