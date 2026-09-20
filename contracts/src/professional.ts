export const CATEGORIES = [
  'casa',
  'beleza',
  'bem-estar',
  'tecnologia',
  'educacao',
  'eventos',
] as const

export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_LABEL: Record<Category, string> = {
  'casa': 'Casa e reformas',
  'beleza': 'Beleza',
  'bem-estar': 'Bem-estar',
  'tecnologia': 'Tecnologia',
  'educacao': 'Educação',
  'eventos': 'Eventos',
}

export const AVAILABILITIES = ['imediata', 'esta-semana', 'agendada'] as const

export type Availability = (typeof AVAILABILITIES)[number]

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  'imediata': 'Disponível agora',
  'esta-semana': 'Esta semana',
  'agendada': 'Sob agendamento',
}

export interface ProfessionalSummary {
  id: string
  slug: string
  name: string
  profession: string
  category: Category
  avatarUrl: string
  coverUrl: string
  headline: string
  hourlyRate: number
  rating: number
  reviewsCount: number
  distanceKm: number
  city: string
  state: string
  availability: Availability
  verified: boolean
}

export interface Review {
  id: string
  author: string
  rating: number
  comment: string
  date: string
}

export interface ProfessionalService {
  name: string
  price: number | null
  unit: 'hora' | 'serviço' | 'diária' | 'm²'
}

export interface GalleryImage {
  url: string
  alt: string
  width: number
  height: number
}

export interface Professional extends ProfessionalSummary {
  bio: string
  yearsOfExperience: number
  services: ProfessionalService[]
  gallery: GalleryImage[]
  reviews: Review[]
  responseTimeMinutes: number
  completedJobs: number
  memberSince: string
}
