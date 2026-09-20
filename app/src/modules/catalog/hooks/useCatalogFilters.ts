import { defineStore } from 'pinia'
import {
  catalogCacheKey,
  countActiveFilters,
  parseCatalogQuery,
  serializeCatalogQuery,
  type Availability,
  type CatalogQuery,
  type Category,
  type NavigationMode,
  type SortKey,
} from '@atlas/contracts'
import { CLEAR_ALL_FILTERS } from '@/modules/catalog/constants'

export const useCatalogFilters = defineStore('catalogFilters', () => {
  const route = useRoute()
  const router = useRouter()

  const query = computed(() => parseCatalogQuery(route.query as Record<string, string | string[]>))

  const filtersKey = computed(() => catalogCacheKey({ ...query.value, page: 1 }))

  const activeCount = computed(() => countActiveFilters(query.value))

  const hasActiveFilters = computed(() => activeCount.value > 0 || query.value.q.length > 0)

  const apply = (patch: Partial<CatalogQuery>, mode: NavigationMode = 'push') => {
    const next = serializeCatalogQuery({ ...query.value, ...patch, page: 1 })

    if (mode === 'replace') {
      return router.replace({ query: next })
    }

    return router.push({ query: next })
  }

  const toggleIn = <T extends string>(list: T[], value: T) => {
    if (list.includes(value)) {
      return list.filter(item => item !== value)
    }

    return [...list, value]
  }

  const toggleCategory = (value: Category) => {
    apply({ categories: toggleIn(query.value.categories, value) })
  }

  const toggleAvailability = (value: Availability) => {
    apply({ availability: toggleIn(query.value.availability, value) })
  }

  const setSort = (value: string) => {
    apply({ sort: value as SortKey })
  }

  const setDistance = (value: string | number) => {
    const km = Number(value)

    apply({ maxDistanceKm: value === '' || km === 0 ? null : km })
  }

  const setMinPrice = (value: string) => {
    apply({ minPrice: value === '' ? null : Number(value) })
  }

  const setMaxPrice = (value: string) => {
    apply({ maxPrice: value === '' ? null : Number(value) })
  }

  const setVerifiedOnly = (value: boolean) => {
    apply({ verifiedOnly: value })
  }

  const setSearchTerm = (value: string, mode: NavigationMode = 'push') => {
    apply({ q: value.trim() }, mode)
  }

  const clearAll = () => {
    apply({ ...CLEAR_ALL_FILTERS })
  }

  return {
    query,
    filtersKey,
    activeCount,
    hasActiveFilters,
    apply,
    toggleCategory,
    toggleAvailability,
    setSort,
    setDistance,
    setMinPrice,
    setMaxPrice,
    setVerifiedOnly,
    setSearchTerm,
    clearAll,
  }
})
