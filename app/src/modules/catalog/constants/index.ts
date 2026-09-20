import type { CatalogQuery } from '@atlas/contracts'

export const SEARCH_DEBOUNCE_MS = 300

export const SKELETON_COUNT = 12

export const PRIORITY_CARD_COUNT = 4

export const LOAD_MORE_ROOT_MARGIN = '400px 0px'

export const SEARCH_MAX_LENGTH = 80

export const DESKTOP_MEDIA_QUERY = '(min-width: 1024px)'

export const DISTANCE_MAX_KM = 20

export const DISTANCE_STEP_KM = 1

export const DISTANCE_OPTIONS = [5, 10, 15, 20] as const

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
