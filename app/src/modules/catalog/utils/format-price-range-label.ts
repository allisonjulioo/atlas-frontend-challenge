import { formatPrice, type CatalogQuery } from '@atlas/contracts'

export const formatPriceRangeLabel = (query: CatalogQuery) => {
  const from = query.minPrice === null ? null : formatPrice(query.minPrice)
  const to = query.maxPrice === null ? null : formatPrice(query.maxPrice)

  if (from && to) {
    return `${from} a ${to}`
  }

  if (from) {
    return `A partir de ${from}`
  }

  return `Até ${to}`
}
