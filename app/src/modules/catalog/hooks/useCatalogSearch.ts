import { defineStore, storeToRefs } from 'pinia'
import { SEARCH_DEBOUNCE_MS, SEARCH_MAX_LENGTH } from '@/modules/catalog/constants'
import { debounce } from '@/shared/utils/debounce'
import { useCatalogFilters } from '@/modules/catalog/hooks/useCatalogFilters'

export const useCatalogSearch = defineStore('catalogSearch', () => {
  const { query } = storeToRefs(useCatalogFilters())

  const { setSearchTerm } = useCatalogFilters()

  const term = ref(query.value.q)

  const maxLength = SEARCH_MAX_LENGTH

  const pushTerm = debounce((value: string) => setSearchTerm(value, 'replace'), SEARCH_DEBOUNCE_MS)

  const submit = () => {
    pushTerm.cancel()
    setSearchTerm(term.value)
  }

  const reset = () => {
    pushTerm.cancel()
    term.value = query.value.q
  }

  watch(term, (value) => {
    if (value === query.value.q) {
      return
    }

    pushTerm(value)
  })

  watch(() => query.value.q, (value) => {
    if (value !== term.value) {
      term.value = value
    }
  })

  return { term, maxLength, submit, reset }
})
