import { defineStore, storeToRefs } from 'pinia'
import { useCatalogFacets } from '@/modules/catalog/hooks/useCatalogFacets'
import { useCatalogFilters } from '@/modules/catalog/hooks/useCatalogFilters'
import { onlyDigits } from '@/shared/utils/only-digits'

export const useCatalogPrice = defineStore('catalogPrice', () => {
  const { query } = storeToRefs(useCatalogFilters())

  const { priceRange } = storeToRefs(useCatalogFacets())

  const { setMinPrice, setMaxPrice } = useCatalogFilters()

  const toField = (value: number | null) => (value === null ? '' : String(value))

  const min = ref(toField(query.value.minPrice))

  const max = ref(toField(query.value.maxPrice))

  const maxLength = computed(() => String(priceRange.value.max).length)

  const clamp = (value: string) => {
    if (value === '') {
      return ''
    }

    const limited = Math.min(Math.max(Number(value), priceRange.value.min), priceRange.value.max)

    return String(limited)
  }

  const mask = (event: Event, field: Ref<string>) => {
    const input = event.target as HTMLInputElement
    const masked = onlyDigits(input.value).slice(0, maxLength.value)

    input.value = masked
    field.value = masked
  }

  const maskMin = (event: Event) => mask(event, min)

  const maskMax = (event: Event) => mask(event, max)

  const commitMin = () => {
    min.value = clamp(min.value)
    setMinPrice(min.value)
  }

  const commitMax = () => {
    max.value = clamp(max.value)
    setMaxPrice(max.value)
  }

  watch(() => query.value.minPrice, (value) => {
    min.value = toField(value)
  })

  watch(() => query.value.maxPrice, (value) => {
    max.value = toField(value)
  })

  return { min, max, maxLength, maskMin, maskMax, commitMin, commitMax }
})
