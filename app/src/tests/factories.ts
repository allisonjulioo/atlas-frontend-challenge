import type {
  CatalogFacets,
  CatalogResponse,
  Professional,
  ProfessionalSummary,
} from '@atlas/contracts'

export const makeSummary = (overrides: Partial<ProfessionalSummary> = {}): ProfessionalSummary => ({
  id: 'pro-1',
  slug: 'ana-souza',
  name: 'Ana Souza',
  profession: 'Eletricista',
  category: 'casa',
  avatarUrl: 'https://cdn.test/ana.jpg',
  coverUrl: 'https://cdn.test/ana-cover.jpg',
  headline: 'Instalações elétricas residenciais',
  hourlyRate: 120,
  rating: 4.8,
  reviewsCount: 42,
  distanceKm: 3.4,
  city: 'São Paulo',
  state: 'SP',
  availability: 'imediata',
  verified: true,
  ...overrides,
})

export const makeProfessional = (overrides: Partial<Professional> = {}): Professional => ({
  ...makeSummary(),
  bio: 'Atendo residências e pequenos comércios.',
  yearsOfExperience: 8,
  services: [
    { name: 'Instalação de tomada', price: 90, unit: 'serviço' },
    { name: 'Projeto elétrico', price: null, unit: 'serviço' },
  ],
  gallery: [
    { url: 'https://cdn.test/1.jpg', alt: 'Quadro novo', width: 800, height: 600 },
    { url: 'https://cdn.test/2.jpg', alt: 'Painel', width: 800, height: 600 },
  ],
  reviews: [
    { id: 'rev-1', author: 'Carlos', rating: 5, comment: 'Excelente.', date: '2025-01-10' },
    { id: 'rev-2', author: 'Bia', rating: 4, comment: 'Pontual.', date: '2025-06-02' },
  ],
  responseTimeMinutes: 30,
  completedJobs: 210,
  memberSince: '2019-03-01',
  ...overrides,
})

export const makeFacets = (overrides: Partial<CatalogFacets> = {}): CatalogFacets => ({
  categories: [
    { value: 'casa', label: 'Casa e reformas', count: 12 },
    { value: 'beleza', label: 'Beleza', count: 0 },
  ],
  availability: [
    { value: 'imediata', label: 'Disponível agora', count: 5 },
    { value: 'agendada', label: 'Sob agendamento', count: 0 },
  ],
  priceRange: { min: 50, max: 400 },
  maxDistanceKm: 20,
  ...overrides,
})

export const makeCatalogResponse = (overrides: Partial<CatalogResponse> = {}): CatalogResponse => ({
  items: [makeSummary()],
  page: 1,
  perPage: 24,
  total: 1,
  totalPages: 1,
  hasMore: false,
  facets: makeFacets(),
  ...overrides,
})
