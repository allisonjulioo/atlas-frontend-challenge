import {
  buildProfileDescription,
  buildProfileStructuredData,
  type PageMeta,
  type Professional,
} from '@atlas/contracts'
import { PROFILE_BASE_PATH } from '@/shared/constants'

export const buildProfilePageMeta = (professional: Professional | null): PageMeta => {
  if (!professional) {
    return {
      title: 'Profissional não encontrado',
      description: '',
      image: null,
      canonicalPath: null,
      structuredData: null,
      notFound: true,
    }
  }

  const canonicalPath = `${PROFILE_BASE_PATH}/${professional.slug}`

  return {
    title: `${professional.name}, ${professional.profession}`,
    description: buildProfileDescription(professional),
    image: professional.avatarUrl,
    canonicalPath,
    structuredData: buildProfileStructuredData(professional, canonicalPath),
    notFound: false,
  }
}
