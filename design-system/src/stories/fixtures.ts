import type { ProfessionalSummary } from '@atlas/contracts'
import type { BottomNavItem, TabOption } from '@/shared/models/components'

export const professional: ProfessionalSummary = {
  id: 'pro-0001',
  slug: 'mariana-ferreira-0001',
  name: 'Mariana Ferreira',
  profession: 'Eletricista',
  category: 'casa',
  avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
  coverUrl: 'https://picsum.photos/seed/atlas-cover-1/600/800',
  headline: 'Instalações e emergências 24h, com laudo e adequação de norma',
  hourlyRate: 145,
  rating: 4.8,
  reviewsCount: 213,
  distanceKm: 3.4,
  city: 'São Paulo',
  state: 'SP',
  availability: 'imediata',
  verified: true,
}

export const categoryTabs: TabOption[] = [
  { value: 'todas', label: 'Todas', count: 520 },
  { value: 'casa', label: 'Casa e reformas', count: 143 },
  { value: 'beleza', label: 'Beleza', count: 82 },
  { value: 'bem-estar', label: 'Bem-estar', count: 90 },
  { value: 'tecnologia', label: 'Tecnologia', count: 60 },
]

export const navItems: BottomNavItem[] = [
  {
    href: '#',
    label: 'Catálogo',
    icon: 'M4 5h6v6H4zM14 5h6v6h-6zM4 14h6v5H4zM14 14h6v5h-6z',
    active: true,
  },
  {
    href: '#',
    label: 'Melhores',
    icon: 'M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.8l6.5-.9z',
  },
  {
    href: '#',
    label: 'Verificados',
    icon: 'M12 3l7 3v5.5c0 4.3-2.9 8.2-7 9.5-4.1-1.3-7-5.2-7-9.5V6zM9 12l2.2 2.2L15.5 10',
  },
  {
    href: '#',
    label: 'Salvos',
    icon: 'M12 20.5l-1.4-1.27C5.6 14.7 2.7 12.06 2.7 8.8 2.7 6.2 4.74 4.2 7.3 4.2c1.47 0 2.9.7 3.8 1.8.9-1.1 2.33-1.8 3.8-1.8 2.56 0 4.6 2 4.6 4.6 0 3.26-2.9 5.9-7.9 10.43z',
    badge: '3',
  },
]
