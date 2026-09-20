import { defineStore, storeToRefs } from 'pinia'
import { SORT_KEYS, SORT_LABEL, type Category } from '@atlas/contracts'
import type { SelectOption } from '@atlas/design-system'
import { DISTANCE_MAX_KM, DISTANCE_OPTIONS, DISTANCE_STEP_KM } from '@/modules/catalog/constants'
import { useCatalogFilters } from '@/modules/catalog/hooks/useCatalogFilters'
import { useCatalogList } from '@/modules/catalog/hooks/useCatalogList'

const DEFAULT_PRICE_RANGE = { min: 0, max: 1000 }

export const useCatalogFacets = defineStore('catalogFacets', () => {
  const { query } = storeToRefs(useCatalogFilters())

  const { facets } = storeToRefs(useCatalogList())

  const categoryBuckets = computed(() => facets.value?.categories ?? [])

  const availabilityBuckets = computed(() => facets.value?.availability ?? [])

  const priceRange = computed(() => facets.value?.priceRange ?? DEFAULT_PRICE_RANGE)

  const hasFacets = computed(() => facets.value !== null)

  const distanceMax = computed(() => DISTANCE_MAX_KM)

  const distanceStep = computed(() => DISTANCE_STEP_KM)

  const distanceValue = computed(() => query.value.maxDistanceKm ?? 0)

  const distanceOptions = computed<SelectOption[]>(() => {
    const steps = new Set<number>(DISTANCE_OPTIONS)

    if (query.value.maxDistanceKm !== null) {
      steps.add(query.value.maxDistanceKm)
    }

    return [...steps]
      .sort((first, second) => first - second)
      .map(km => ({ value: String(km), label: `Até ${km} km` }))
  })

  const distanceKey = computed(() => (query.value.maxDistanceKm === null ? '' : String(query.value.maxDistanceKm)))

  const sortOptions = computed<SelectOption[]>(() => SORT_KEYS.map(key => ({ value: key, label: SORT_LABEL[key] })))

  const sortKey = computed(() => query.value.sort)

  const distanceLabel = computed(() => {
    if (query.value.maxDistanceKm === null) {
      return 'Qualquer distância'
    }

    return `Até ${query.value.maxDistanceKm} km`
  })

  const isCategoryChecked = (value: Category) => query.value.categories.includes(value)

  const isAvailabilityChecked = (value: string) => query.value.availability.includes(value as never)

  const isBucketDisabled = (count: number, checked: boolean) => count === 0 && !checked

  return {
    categoryBuckets,
    availabilityBuckets,
    priceRange,
    hasFacets,
    distanceMax,
    distanceStep,
    distanceValue,
    distanceLabel,
    distanceOptions,
    distanceKey,
    sortOptions,
    sortKey,
    isCategoryChecked,
    isAvailabilityChecked,
    isBucketDisabled,
  }
})
