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

  const load = async () => {
    pending.value = true
    notFound.value = false
    errorMessage.value = null

    try {
      professional.value = await getProfessionalService(slug.value)
      related.value = await getRelatedProfessionalsService(slug.value).catch(() => [])
    }
    catch (error) {
      professional.value = null
      related.value = []
      notFound.value = isNotFoundError(error)
      errorMessage.value = notFound.value ? null : 'Não foi possível carregar este perfil agora.'
    }
    finally {
      pending.value = false
      set(buildProfilePageMeta(professional.value))
    }
  }

  const init = async () => {
    if (professional.value?.slug === slug.value) {
      set(buildProfilePageMeta(professional.value))

      return
    }

    await load()
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
