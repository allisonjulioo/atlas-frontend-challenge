import { defineStore } from 'pinia'
import type { ProfessionalSummary } from '@atlas/contracts'
import { PROFILE_BASE_PATH, ROUTE_NAME } from '@/shared/constants'

export const useCatalogNavigation = defineStore('catalogNavigation', () => {
  const router = useRouter()

  const basePath = computed(() => PROFILE_BASE_PATH)

  const hrefFor = (slug: string) => `${basePath.value}/${slug}`

  const openProfile = (professional: ProfessionalSummary, event: MouseEvent) => {
    event.preventDefault()

    router.push({ name: ROUTE_NAME.professionalProfile, params: { slug: professional.slug } })
  }

  return { basePath, hrefFor, openProfile }
})
