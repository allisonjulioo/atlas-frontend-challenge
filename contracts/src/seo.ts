import { CATEGORY_LABEL, type Professional } from './professional'
import { formatPrice } from './format'
import type { CatalogQuery } from './catalog'

export const buildCatalogTitle = (query: CatalogQuery) => {
  if (query.q) {
    return `${query.q}: profissionais disponíveis`
  }

  if (query.categories.length === 1) {
    return `${CATEGORY_LABEL[query.categories[0]!]}: profissionais`
  }

  return 'Encontre profissionais autônomos perto de você'
}

export const buildCatalogDescription = (query: CatalogQuery, total: number) => {
  const subject = query.q
    ? `${total} profissionais para "${query.q}"`
    : `${total} profissionais autônomos`

  return `${subject} com avaliação, valor por hora e disponibilidade. Compare e contrate direto.`
}

export const buildProfileDescription = (professional: Professional) => [
  professional.headline,
  `${formatPrice(professional.hourlyRate)}/h em ${professional.city}`,
  `Nota ${professional.rating} em ${professional.reviewsCount} avaliações`,
].join('. ')

export const buildProfileStructuredData = (professional: Professional, url: string) => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  'name': professional.name,
  'description': professional.bio,
  'image': professional.avatarUrl,
  'url': url,
  'areaServed': `${professional.city}, ${professional.state}`,
  'aggregateRating': {
    '@type': 'AggregateRating',
    'ratingValue': professional.rating,
    'reviewCount': professional.reviewsCount,
    'bestRating': 5,
  },
  'offers': {
    '@type': 'Offer',
    'price': professional.hourlyRate,
    'priceCurrency': 'BRL',
  },
})
