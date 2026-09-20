import { defineStore, storeToRefs } from 'pinia'
import type { ComponentPublicInstance } from 'vue'
import { LOAD_MORE_ROOT_MARGIN } from '@/modules/catalog/constants'
import { useCatalogList } from '@/modules/catalog/hooks/useCatalogList'
import { useCatalogSummary } from '@/modules/catalog/hooks/useCatalogSummary'

export const useCatalogAutoLoad = defineStore('catalogAutoLoad', () => {
  const { loadingMore } = storeToRefs(useCatalogList())

  const { loadMore } = useCatalogList()

  const { hasMore, remaining } = storeToRefs(useCatalogSummary())

  const sentinel = ref<HTMLElement | null>(null)
  const observer = ref<IntersectionObserver>()

  const buttonLabel = computed(() => {
    if (loadingMore.value) {
      return 'Carregando…'
    }

    return `Carregar mais (${remaining.value} restantes)`
  })

  const showEndMessage = computed(() => !hasMore.value && remaining.value === 0)

  const disconnect = () => {
    observer.value?.disconnect()
    observer.value = undefined
  }

  const observe = () => {
    disconnect()

    if (typeof IntersectionObserver === 'undefined' || !sentinel.value || !hasMore.value) {
      return
    }

    observer.value = new IntersectionObserver((entries) => {
      const entry = entries[0]

      if (entry?.isIntersecting && hasMore.value && !loadingMore.value) {
        loadMore()
      }
    }, { rootMargin: LOAD_MORE_ROOT_MARGIN })

    observer.value.observe(sentinel.value)
  }

  const setSentinel = (element: Element | ComponentPublicInstance | null) => {
    sentinel.value = element as HTMLElement | null
  }

  const reset = () => {
    disconnect()
    sentinel.value = null
  }

  watch([sentinel, hasMore], observe)

  return { buttonLabel, showEndMessage, hasMore, setSentinel, reset }
})
