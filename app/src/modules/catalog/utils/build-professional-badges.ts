import { AVAILABILITY_LABEL, formatResponseTime, type Professional } from '@atlas/contracts'
import type { ProfileBadge } from '@/modules/catalog/models/profile-badge'

export const buildProfessionalBadges = (professional: Professional | null): ProfileBadge[] => {
  if (!professional) {
    return []
  }

  const badges: ProfileBadge[] = [
    {
      key: 'availability',
      tone: professional.availability === 'imediata' ? 'accent' : 'neutral',
      label: AVAILABILITY_LABEL[professional.availability],
    },
    {
      key: 'response',
      tone: 'neutral',
      label: formatResponseTime(professional.responseTimeMinutes),
    },
  ]

  if (professional.verified) {
    badges.unshift({ key: 'verified', tone: 'brand', label: 'Perfil verificado' })
  }

  return badges
}
