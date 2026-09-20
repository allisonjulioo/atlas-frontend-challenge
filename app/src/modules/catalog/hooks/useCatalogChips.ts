import { defineStore, storeToRefs } from 'pinia'
import type { FilterChip } from '@/modules/catalog/models/filter-chip'
import { buildFilterChips } from '@/modules/catalog/utils/build-filter-chips'
import { useCatalogFilters } from '@/modules/catalog/hooks/useCatalogFilters'

export const useCatalogChips = defineStore('catalogChips', () => {
  const { query, hasActiveFilters } = storeToRefs(useCatalogFilters())

  const { apply, clearAll } = useCatalogFilters()

  const chips = computed(() => buildFilterChips(query.value))

  const hasChips = computed(() => chips.value.length > 0)

  const remove = (chip: FilterChip) => {
    apply(chip.patch)
  }

  return { chips, hasChips, hasActiveFilters, remove, clearAll }
})
