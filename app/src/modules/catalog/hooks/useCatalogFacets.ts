import { defineStore, storeToRefs } from 'pinia'
import type { Category } from '@atlas/contracts'
import { DISTANCE_MAX_KM, DISTANCE_STEP_KM } from '@/modules/catalog/constants'
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
    isCategoryChecked,
    isAvailabilityChecked,
    isBucketDisabled,
  }
})
