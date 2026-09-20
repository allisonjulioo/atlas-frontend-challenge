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

  const load = async () => {
    pending.value = true
    errorMessage.value = null
    extra.value = []
    loadedPage.value = 1

    try {
      response.value = await getCatalogService({ ...query.value, page: 1 })
      publishMeta()
    }
    catch {
      errorMessage.value = 'Não foi possível carregar o catálogo agora.'
    }
    finally {
      pending.value = false
    }
  }

  const loadMore = async () => {
    if (loadingMore.value || items.value.length >= total.value) {
      return
    }

    loadingMore.value = true

    try {
      const page = await getCatalogService({ ...query.value, page: loadedPage.value + 1 })

      extra.value = [...extra.value, ...page.items]
      loadedPage.value += 1
    }
    catch {
      errorMessage.value = 'Não foi possível carregar mais resultados.'
    }
    finally {
      loadingMore.value = false
    }
  }

  const init = async () => {
    if (response.value) {
      publishMeta()

      return
    }

    await load()
  }

  const reset = () => {
    response.value = null
    extra.value = []
    loadedPage.value = 1
    errorMessage.value = null
  }

  watch(filtersKey, () => load())

  return { items, total, facets, pending, loadingMore, errorMessage, init, load, loadMore, reset }
})
