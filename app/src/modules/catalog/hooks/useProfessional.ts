import { defineStore } from 'pinia'
import { usePageMeta, type Professional, type ProfessionalSummary } from '@atlas/contracts'
import {
  getProfessionalService,
  getRelatedProfessionalsService,
} from '@/modules/catalog/services/catalogService'
import { buildProfilePageMeta } from '@/modules/catalog/utils/build-profile-page-meta'
import { isNotFoundError } from '@/shared/utils/is-not-found-error'

export const useProfessional = defineStore('professional', () => {
  const route = useRoute()

  const { set } = usePageMeta()

  const professional = ref<Professional | null>(null)
  const related = ref<ProfessionalSummary[]>([])
  const pending = ref(false)
  const notFound = ref(false)
  const errorMessage = ref<string | null>(null)

  const slug = computed(() => String(route.params.slug ?? ''))

  const load = () => {
    pending.value = true
    notFound.value = false
    errorMessage.value = null

    if (!slug.value) {
      return Promise.resolve()
    }

    return getProfessionalService(slug.value)
      .then((result) => {
        professional.value = result

        return getRelatedProfessionalsService(slug.value).catch(() => [])
      })
      .then((items) => {
        related.value = items
      })
      .catch((error) => {
        professional.value = null
        related.value = []
        notFound.value = isNotFoundError(error)
        errorMessage.value = notFound.value ? null : 'Não foi possível carregar este perfil agora.'
      })
      .finally(() => {
        pending.value = false
        set(buildProfilePageMeta(professional.value))
      })
  }

  const init = () => {
    if (professional.value?.slug === slug.value) {
      set(buildProfilePageMeta(professional.value))

      return Promise.resolve()
    }

    return load()
  }

  const reset = () => {
    professional.value = null
    related.value = []
    notFound.value = false
    errorMessage.value = null
  }

  watch(slug, (value) => {
    if (value) {
      load()
    }
  })

  return { professional, related, pending, notFound, errorMessage, slug, init, load, reset }
})
