import { formatDistance, formatMonthYear, type Professional } from '@atlas/contracts'
import type { ProfileFact } from '@/modules/catalog/models/profile-fact'

export const buildProfessionalFacts = (professional: Professional | null): ProfileFact[] => {
  if (!professional) {
    return []
  }

  return [
    { key: 'area', label: 'Atende em', value: `${professional.city}, ${formatDistance(professional.distanceKm)}` },
    { key: 'experience', label: 'Experiência', value: `${professional.yearsOfExperience} anos` },
    { key: 'jobs', label: 'Serviços concluídos', value: String(professional.completedJobs) },
    { key: 'since', label: 'Na Atlas desde', value: formatMonthYear(professional.memberSince) },
  ]
}
