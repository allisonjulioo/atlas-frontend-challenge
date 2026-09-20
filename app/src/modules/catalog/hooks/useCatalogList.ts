import { defineStore, storeToRefs } from 'pinia'
import { usePageMeta, type CatalogResponse, type ProfessionalSummary } from '@atlas/contracts'
import { getCatalogService } from '@/modules/catalog/services/catalogService'
import { buildCatalogPageMeta } from '@/modules/catalog/utils/build-catalog-page-meta'
import { useCatalogFilters } from '@/modules/catalog/hooks/useCatalogFilters'

export const useCatalogList = defineStore('catalogList', () => {
  const { query, filtersKey } = storeToRefs(useCatalogFilters())

  const { set } = usePageMeta()

  const response = ref<CatalogResponse | null>(null)
  const extra = ref<ProfessionalSummary[]>([])
  const loadedPage = ref(1)
  const pending = ref(false)
  const loadingMore = ref(false)
  const errorMessage = ref<string | null>(null)

  const items = computed(() => [...(response.value?.items ?? []), ...extra.value])

  const total = computed(() => response.value?.total ?? 0)

  const facets = computed(() => response.value?.facets ?? null)

  const publishMeta = () => {
    set(buildCatalogPageMeta(query.value, total.value))
  }

  const load = () => {
    pending.value = true
    errorMessage.value = null
    extra.value = []
    loadedPage.value = 1

    return getCatalogService({ ...query.value, page: 1 })
      .then((result) => {
        response.value = result
        publishMeta()
      })
      .catch(() => {
        errorMessage.value = 'Não foi possível carregar o catálogo agora.'
      })
      .finally(() => {
        pending.value = false
      })
  }

  const loadMore = () => {
    if (loadingMore.value || items.value.length >= total.value) {
      return Promise.resolve()
    }

    loadingMore.value = true

    return getCatalogService({ ...query.value, page: loadedPage.value + 1 })
      .then((page) => {
        extra.value = [...extra.value, ...page.items]
        loadedPage.value += 1
      })
      .catch(() => {
        errorMessage.value = 'Não foi possível carregar mais resultados.'
      })
      .finally(() => {
        loadingMore.value = false
      })
  }

  const init = () => {
    if (response.value) {
      publishMeta()

      return Promise.resolve()
    }

    return load()
  }

  const reset = () => {
    response.value = null
    extra.value = []
    loadedPage.value = 1
    errorMessage.value = null
  }

  watch(filtersKey, () => load())

  return {
    response,
    extra,
    loadedPage,
    items,
    total,
    facets,
    pending,
    loadingMore,
    errorMessage,
    init,
    load,
    loadMore,
    reset,
  }
})
