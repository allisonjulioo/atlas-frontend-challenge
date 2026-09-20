import { defineStore, storeToRefs } from 'pinia'
import { useCatalogList } from '@/modules/catalog/hooks/useCatalogList'

export const useCatalogSummary = defineStore('catalogSummary', () => {
  const { items, total, pending } = storeToRefs(useCatalogList())

  const hasMore = computed(() => items.value.length < total.value)

  const remaining = computed(() => Math.max(0, total.value - items.value.length))

  const isEmpty = computed(() => !pending.value && items.value.length === 0)

  const totalLabel = computed(() => {
    if (pending.value) {
      return 'Buscando profissionais…'
    }

    if (total.value === 1) {
      return '1 profissional encontrado'
    }

    return `${total.value.toLocaleString('pt-BR')} profissionais encontrados`
  })

  const drawerActionLabel = computed(() => `Ver ${total.value.toLocaleString('pt-BR')} resultados`)

  return { hasMore, remaining, isEmpty, totalLabel, drawerActionLabel }
})
