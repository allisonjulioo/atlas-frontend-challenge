import { describe, expect, it } from 'vitest'
import { formatPrice, parseCatalogQuery } from '@atlas/contracts'
import { buildFilterChips } from '@/modules/catalog/utils/build-filter-chips'

describe('buildFilterChips', () => {
  it('builds no chip for a clean query', () => {
    expect(buildFilterChips(parseCatalogQuery())).toEqual([])
  })

  it('builds one chip per category and availability removing only its own value', () => {
    const chips = buildFilterChips(parseCatalogQuery({
      categories: 'casa,beleza',
      availability: 'imediata,agendada',
    }))

    expect(chips.map(chip => chip.key)).toEqual([
      'category:casa',
      'category:beleza',
      'availability:imediata',
      'availability:agendada',
    ])
    expect(chips[0]!.patch).toEqual({ categories: ['beleza'] })
    expect(chips[2]!.patch).toEqual({ availability: ['agendada'] })
  })

  it('gives price, rating, distance and verified their own chips', () => {
    const chips = buildFilterChips(parseCatalogQuery({
      minPrice: '100',
      minRating: '4.5',
      maxDistanceKm: '10',
      verifiedOnly: '1',
    }))

    expect(chips).toEqual([
      { key: 'price', label: `A partir de ${formatPrice(100)}`, patch: { minPrice: null, maxPrice: null } },
      { key: 'rating', label: '4,5 ou mais', patch: { minRating: null } },
      { key: 'distance', label: 'Até 10 km', patch: { maxDistanceKm: null } },
      { key: 'verified', label: 'Verificados', patch: { verifiedOnly: false } },
    ])
  })

  it('builds the price chip when only the ceiling is set', () => {
    const chips = buildFilterChips(parseCatalogQuery({ maxPrice: '300' }))

    expect(chips[0]!.label).toBe(`Até ${formatPrice(300)}`)
  })
})
