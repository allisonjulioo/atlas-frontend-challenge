import { defineStore, storeToRefs } from 'pinia'
import type { Category } from '@atlas/contracts'
import type { TabOption } from '@atlas/design-system'
import { ALL_CATEGORIES, DISTANCE_OPTIONS, RATING_OPTIONS } from '@/modules/catalog/constants'
import { useCatalogFilters } from '@/modules/catalog/hooks/useCatalogFilters'
import { useCatalogList } from '@/modules/catalog/hooks/useCatalogList'

const DEFAULT_PRICE_RANGE = { min: 0, max: 1000 }

export const useCatalogFacets = defineStore('catalogFacets', () => {
  const { query } = storeToRefs(useCatalogFilters())

  const { apply } = useCatalogFilters()

  const { facets } = storeToRefs(useCatalogList())

  const categoryBuckets = computed(() => facets.value?.categories ?? [])

  const availabilityBuckets = computed(() => facets.value?.availability ?? [])

  const priceRange = computed(() => facets.value?.priceRange ?? DEFAULT_PRICE_RANGE)

  const hasFacets = computed(() => facets.value !== null)

  const ratingOptions = RATING_OPTIONS

  const distanceOptions = DISTANCE_OPTIONS

  const categoryTotal = computed(() => categoryBuckets.value.reduce((sum, bucket) => sum + bucket.count, 0))

  const categoryTabs = computed<TabOption[]>(() => [
    { value: ALL_CATEGORIES, label: 'Todas', count: categoryTotal.value },
    ...categoryBuckets.value.map(bucket => ({
      value: bucket.value,
      label: bucket.label,
      count: bucket.count,
    })),
  ])

  const selectedCategory = computed(() => {
    if (query.value.categories.length === 1) {
      return query.value.categories[0]!
    }

    return ALL_CATEGORIES
  })

  const selectCategory = (value: string) => {
    apply({ categories: value === ALL_CATEGORIES ? [] : [value as Category] })
  }

  const isCategoryChecked = (value: Category) => query.value.categories.includes(value)

  const isAvailabilityChecked = (value: string) => query.value.availability.includes(value as never)

  const isBucketDisabled = (count: number, checked: boolean) => count === 0 && !checked

  return {
    categoryBuckets,
    availabilityBuckets,
    priceRange,
    hasFacets,
    ratingOptions,
    distanceOptions,
    categoryTabs,
    selectedCategory,
    selectCategory,
    isCategoryChecked,
    isAvailabilityChecked,
    isBucketDisabled,
  }
})
