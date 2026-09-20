import { AVAILABILITY_LABEL, CATEGORY_LABEL, type CatalogQuery } from '@atlas/contracts'
import type { FilterChip } from '@/modules/catalog/models/filter-chip'
import { formatPriceRangeLabel } from '@/modules/catalog/utils/format-price-range-label'

export const buildFilterChips = (query: CatalogQuery): FilterChip[] => {
  const chips: FilterChip[] = []

  query.categories.forEach((category) => {
    chips.push({
      key: `category:${category}`,
      label: CATEGORY_LABEL[category],
      patch: { categories: query.categories.filter(item => item !== category) },
    })
  })

  query.availability.forEach((availability) => {
    chips.push({
      key: `availability:${availability}`,
      label: AVAILABILITY_LABEL[availability],
      patch: { availability: query.availability.filter(item => item !== availability) },
    })
  })

  if (query.minPrice !== null || query.maxPrice !== null) {
    chips.push({
      key: 'price',
      label: formatPriceRangeLabel(query),
      patch: { minPrice: null, maxPrice: null },
    })
  }

  if (query.minRating !== null) {
    chips.push({
      key: 'rating',
      label: `${String(query.minRating).replace('.', ',')} ou mais`,
      patch: { minRating: null },
    })
  }

  if (query.maxDistanceKm !== null) {
    chips.push({
      key: 'distance',
      label: `Até ${query.maxDistanceKm} km`,
      patch: { maxDistanceKm: null },
    })
  }

  if (query.verifiedOnly) {
    chips.push({
      key: 'verified',
      label: 'Verificados',
      patch: { verifiedOnly: false },
    })
  }

  return chips
}
