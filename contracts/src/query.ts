import {
  AVAILABILITIES,
  CATEGORIES,
  type Availability,
  type Category,
} from './professional'
import {
  DEFAULT_PER_PAGE,
  MAX_PER_PAGE,
  SORT_KEYS,
  type CatalogQuery,
  type SortKey,
} from './catalog'

type RawQuery = Record<string, string | string[] | number | undefined | null>

const MAX_TERM_LENGTH = 80
const MAX_DISTANCE_KM = 200

export const EMPTY_QUERY: CatalogQuery = {
  q: '',
  categories: [],
  availability: [],
  minPrice: null,
  maxPrice: null,
  minRating: null,
  maxDistanceKm: null,
  verifiedOnly: false,
  sort: 'relevancia',
  page: 1,
  perPage: DEFAULT_PER_PAGE,
}

const first = (value: RawQuery[string]) => {
  if (Array.isArray(value)) {
    return value[0]
  }

  if (value === undefined || value === null) {
    return undefined
  }

  return String(value)
}

const list = <T extends string>(value: RawQuery[string], allowed: readonly T[]) => {
  const raw = Array.isArray(value) ? value : first(value)?.split(',') ?? []

  const selected = new Set<T>()

  raw.forEach((entry) => {
    const candidate = String(entry).trim() as T

    if (allowed.includes(candidate)) {
      selected.add(candidate)
    }
  })

  return [...selected]
}

const num = (value: RawQuery[string], min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const raw = first(value)

  if (raw === undefined || raw === '') {
    return null
  }

  const parsed = Number(raw)

  if (!Number.isFinite(parsed)) {
    return null
  }

  return Math.min(Math.max(parsed, min), max)
}

const bool = (value: RawQuery[string]) => {
  const raw = first(value)

  return raw === '1' || raw === 'true'
}

export const parseCatalogQuery = (raw: RawQuery = {}) => {
  const minPrice = num(raw.minPrice)
  const maxPrice = num(raw.maxPrice)
  const sort = first(raw.sort) as SortKey | undefined
  const hasRange = minPrice !== null && maxPrice !== null

  return {
    q: (first(raw.q) ?? '').trim().slice(0, MAX_TERM_LENGTH),
    categories: list<Category>(raw.categories, CATEGORIES),
    availability: list<Availability>(raw.availability, AVAILABILITIES),
    minPrice: hasRange ? Math.min(minPrice, maxPrice) : minPrice,
    maxPrice: hasRange ? Math.max(minPrice, maxPrice) : maxPrice,
    minRating: num(raw.minRating, 0, 5),
    maxDistanceKm: num(raw.maxDistanceKm, 0, MAX_DISTANCE_KM),
    verifiedOnly: bool(raw.verifiedOnly),
    sort: sort && SORT_KEYS.includes(sort) ? sort : EMPTY_QUERY.sort,
    page: Math.max(1, Math.trunc(num(raw.page) ?? 1)),
    perPage: Math.min(Math.max(1, Math.trunc(num(raw.perPage) ?? DEFAULT_PER_PAGE)), MAX_PER_PAGE),
  } satisfies CatalogQuery
}

export const serializeCatalogQuery = (query: CatalogQuery) => {
  const params: Record<string, string> = {}

  if (query.q) {
    params.q = query.q
  }

  if (query.categories.length) {
    params.categories = [...query.categories].sort().join(',')
  }

  if (query.availability.length) {
    params.availability = [...query.availability].sort().join(',')
  }

  if (query.minPrice !== null) {
    params.minPrice = String(query.minPrice)
  }

  if (query.maxPrice !== null) {
    params.maxPrice = String(query.maxPrice)
  }

  if (query.minRating !== null) {
    params.minRating = String(query.minRating)
  }

  if (query.maxDistanceKm !== null) {
    params.maxDistanceKm = String(query.maxDistanceKm)
  }

  if (query.verifiedOnly) {
    params.verifiedOnly = '1'
  }

  if (query.sort !== EMPTY_QUERY.sort) {
    params.sort = query.sort
  }

  if (query.page > 1) {
    params.page = String(query.page)
  }

  if (query.perPage !== EMPTY_QUERY.perPage) {
    params.perPage = String(query.perPage)
  }

  return params
}

export const catalogCacheKey = (query: CatalogQuery) => {
  const params = serializeCatalogQuery(query)

  const pairs = Object.keys(params).sort().map(key => `${key}=${params[key]}`)

  return `catalog:${pairs.join('&') || 'default'}`
}

export const countActiveFilters = (query: CatalogQuery) => {
  const hasPriceRange = query.minPrice !== null || query.maxPrice !== null

  return query.categories.length
    + query.availability.length
    + (hasPriceRange ? 1 : 0)
    + (query.minRating !== null ? 1 : 0)
    + (query.maxDistanceKm !== null ? 1 : 0)
    + (query.verifiedOnly ? 1 : 0)
}
