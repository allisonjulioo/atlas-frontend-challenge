import { describe, expect, it } from 'vitest'
import { formatPrice, parseCatalogQuery } from '@atlas/contracts'
import { formatPriceRangeLabel } from '@/modules/catalog/utils/format-price-range-label'

describe('formatPriceRangeLabel', () => {
  it('shows the closed range', () => {
    const label = formatPriceRangeLabel(parseCatalogQuery({ minPrice: '100', maxPrice: '300' }))

    expect(label).toBe(`${formatPrice(100)} a ${formatPrice(300)}`)
  })

  it('shows the floor alone', () => {
    expect(formatPriceRangeLabel(parseCatalogQuery({ minPrice: '100' }))).toBe(`A partir de ${formatPrice(100)}`)
  })

  it('shows the ceiling alone', () => {
    expect(formatPriceRangeLabel(parseCatalogQuery({ maxPrice: '300' }))).toBe(`Até ${formatPrice(300)}`)
  })
})
