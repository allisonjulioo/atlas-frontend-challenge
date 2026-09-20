import { defineStore, storeToRefs } from 'pinia'
import { CATEGORY_LABEL } from '@atlas/contracts'
import { buildProfessionalBadges } from '@/modules/catalog/utils/build-professional-badges'
import { buildProfessionalFacts } from '@/modules/catalog/utils/build-professional-facts'
import { useFavorites } from '@/modules/catalog/hooks/useFavorites'
import { useProfessional } from '@/modules/catalog/hooks/useProfessional'

export const useProfessionalDetails = defineStore('professionalDetails', () => {
  const { professional, related } = storeToRefs(useProfessional())

  const { ids } = storeToRefs(useFavorites())

  const { toggle } = useFavorites()

  const categoryLabel = computed(() => (professional.value ? CATEGORY_LABEL[professional.value.category] : ''))

  const services = computed(() => professional.value?.services ?? [])

  const gallery = computed(() => professional.value?.gallery ?? [])

  const reviews = computed(() => [...(professional.value?.reviews ?? [])].sort((a, b) => b.date.localeCompare(a.date)))

  const badges = computed(() => buildProfessionalBadges(professional.value))

  const facts = computed(() => buildProfessionalFacts(professional.value))

  const hasRelated = computed(() => related.value.length > 0)

  const isFavorite = computed(() => Boolean(professional.value && ids.value.includes(professional.value.id)))

  const favoriteLabel = computed(() => (isFavorite.value ? 'Salvo nos favoritos' : 'Salvar'))

  const toggleFavorite = () => {
    if (professional.value) {
      toggle(professional.value.id)
    }
  }

  return {
    categoryLabel,
    services,
    gallery,
    reviews,
    badges,
    facts,
    hasRelated,
    isFavorite,
    favoriteLabel,
    toggleFavorite,
  }
})
